import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { zstdDecompressSync } from 'node:zlib'
import { Context, MemoryCredentials, PiPlugin, connectionAuthFrom } from '../.cache/official-host.mjs'

// Real Pi SDK + official Cordis/Credentials; every remote response is a local
// fixture. This never logs in to an account or sends a paid generation request.
const model = 'gpt-6.1-sol', fast = `${model}::fast`
const jwt = account => `fixture.${Buffer.from(JSON.stringify({ 'https://api.openai.com/auth': { chatgpt_account_id: account } })).toString('base64url')}.fixture`
const requests = [], refreshes = []
let rejectPath, deferredRefresh
const server = createServer(async (request, response) => {
  const chunks = []; for await (const chunk of request) chunks.push(chunk)
  const raw = Buffer.concat(chunks)
  const body = JSON.parse(request.headers['content-encoding'] === 'zstd' ? zstdDecompressSync(raw) : raw)
  requests.push({ path: request.url, headers: request.headers, body })
  if (rejectPath && request.url.startsWith(rejectPath)) {
    response.writeHead(429, { 'content-type': 'application/json' })
    response.end(JSON.stringify({ error: { message: 'Fixture quota exceeded', type: 'rate_limit_error', code: 'insufficient_quota' } }))
    return
  }
  const reasoning = { id: 'rs_fixture', type: 'reasoning', summary: [{ type: 'summary_text', text: 'thinking' }], encrypted_content: 'opaque-connection-fixture' }
  const text = { id: 'msg_fixture', type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: 'hello', annotations: [] }] }
  response.writeHead(200, { 'content-type': 'text/event-stream' })
  for (const event of [
    { type: 'response.created', response: { id: 'resp_fixture', model } },
    { type: 'response.output_item.added', output_index: 0, item: { ...reasoning, summary: [] } },
    { type: 'response.reasoning_summary_part.added', output_index: 0, summary_index: 0, part: { type: 'summary_text', text: '' } },
    { type: 'response.reasoning_summary_text.delta', output_index: 0, summary_index: 0, delta: 'thinking' },
    { type: 'response.output_item.done', output_index: 0, item: reasoning },
    { type: 'response.output_item.added', output_index: 1, item: { ...text, content: [] } },
    { type: 'response.content_part.added', output_index: 1, content_index: 0, part: { type: 'output_text', text: '', annotations: [] } },
    { type: 'response.output_text.delta', output_index: 1, content_index: 0, delta: 'hello' },
    { type: 'response.output_item.done', output_index: 1, item: text },
    { type: 'response.completed', response: { id: 'resp_fixture', model, status: 'completed', output: [reasoning, text], usage: { input_tokens: 3, output_tokens: 1, total_tokens: 4 } } },
  ]) response.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`)
  response.end()
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`
const ctx = new Context()
await ctx.plugin(MemoryCredentials)
let connections = {}
let profiles
function connection(id, serviceId, authMethod, path) {
  return { integrationId: 'pi', serviceId, routeId: `pi-${id}`, displayName: id,
    credentialRecordId: id, credentialGeneration: 0, authMethod, enabled: true,
    profile: { baseURL: `${origin}/${path}`, transport: 'sse', models: [{ id: model }], enabledFastModels: [fast] },
  }
}
const adapter = new PiPlugin.PiAiAdapter({
  profiles: () => profiles,
  resolveApiKey: async () => undefined,
  authForProfile: profile => connectionAuthFrom(ctx, {
    connectionId: profile.connectionId, serviceId: profile.serviceId, credentialRecordId: profile.credentialRecordId,
    isCurrent: () => {
      const current = connections[profile.connectionId]
      return !!current && current.credentialRecordId === profile.credentialRecordId && current.credentialGeneration === profile.credentialGeneration
    },
  }),
  resolveHeaders: async profile => ({ 'X-Fixture-Connection': profile.connectionId }),
})
function resolve() { profiles = PiPlugin.resolveConnectionProfiles(connections) }
async function collect(id, options = {}, prepared) {
  const input = { provider: connections[id]?.routeId ?? `pi-${id}`, model, reasoningEffort: 'high', messages: [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }], ...options }
  const chunks = []
  for await (const chunk of (prepared ? prepared.stream(input) : adapter.stream(input))) chunks.push(chunk)
  return chunks
}
async function generate(id, options = {}) {
  const result = await collect(id, options)
  assert.equal(result.filter(chunk => chunk.type === 'text-delta').map(chunk => chunk.text).join(''), 'hello')
  const replay = result.find(chunk => chunk.type === 'finish')?.replayState
  assert.ok(replay)
  assert.equal(replay.response.provider, connections[id].serviceId)
  assert.equal(replay.response.routeId, connections[id].routeId)
  assert.equal(replay.response.scope.connectionId, id)
  return replay
}
const originalFetch = globalThis.fetch
const originalAmbientKey = process.env.OPENAI_API_KEY
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input)
  if (url.origin === origin) return originalFetch(input, init)
  assert.equal(url.href, 'https://auth.openai.com/oauth/token', 'All generation requests must stay on the local fixture')
  const body = Object.fromEntries(new URLSearchParams(init.body))
  refreshes.push(body.refresh_token)
  if (deferredRefresh) return deferredRefresh(body)
  assert.equal(body.refresh_token, 'fixture-refresh-a')
  return Response.json({ access_token: jwt('account-a'), refresh_token: 'fixture-refresh-a-rotated', expires_in: 3600 })
}
process.env.OPENAI_API_KEY = 'fixture-unrelated-ambient'
try {
  for (const [id, path] of [['c-api-a', 'api-a'], ['c-api-b', 'api-b'], ['c-gateway', 'gateway']]) {
    connections[id] = connection(id, 'openai', 'api-key', path)
    await ctx.credentials.modifyRecord(`llm-pi-ai/${id}`, () => ({ kind: 'api-key', key: `fixture-key-${id}` }))
  }
  for (const [id, account, expired] of [['c-oauth-a', 'account-a', true], ['c-oauth-b', 'account-b', false]]) {
    connections[id] = connection(id, 'openai-codex', 'oauth', id)
    await ctx.credentials.modifyRecord(`llm-pi-ai/${id}`, () => ({ kind: 'grant', payload: { type: 'oauth', access: jwt(account), refresh: `fixture-refresh-${id.at(-1)}`, expires: expired ? 0 : Date.now() + 3600000 } }))
  }
  resolve()
  assert.equal(profiles.size, 5)
  for (const id of Object.keys(connections)) assert.ok(!(await adapter.listModels(connections[id].routeId)).some(choice => choice.id === fast), 'Custom endpoints must not claim native Fast tier support')
  for (const id of Object.keys(connections)) {
    const replay = await generate(id)
    const sent = requests.at(-1)
    assert.ok(sent.path.startsWith(new URL(connections[id].profile.baseURL).pathname))
    assert.equal(sent.headers['x-fixture-connection'], id)
    assert.equal(sent.body.model, model)
    assert.notEqual(sent.body.service_tier, 'priority')
    assert.equal(sent.body.reasoning.effort, 'high')
    assert.equal(replay.response.model, model)
    if (connections[id].authMethod === 'api-key') assert.equal(sent.headers.authorization, `Bearer fixture-key-${id}`)
    else assert.equal(sent.headers['chatgpt-account-id'], id === 'c-oauth-a' ? 'account-a' : 'account-b')
  }
  assert.deepEqual(refreshes, ['fixture-refresh-a'])
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/c-oauth-a')).payload.refresh, 'fixture-refresh-a-rotated')
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/c-oauth-b')).payload.refresh, 'fixture-refresh-b')

  const replay = await generate('c-api-a')
  const history = JSON.parse(JSON.stringify({ role: 'assistant', content: [{ type: 'reasoning', text: 'thinking' }, { type: 'text', text: 'hello' }], source: { provider: connections['c-api-a'].routeId, model, replayState: replay } }))
  const messages = [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }, history, { role: 'user', content: [{ type: 'text', text: 'continue' }] }]
  await generate('c-api-a', { messages })
  assert.ok(requests.at(-1).body.input.some(item => item.encrypted_content === 'opaque-connection-fixture'))
  await generate('c-api-b', { messages })
  assert.ok(!requests.at(-1).body.input.some(item => item.encrypted_content))
  const oldPrepared = await adapter.prepareCall(connections['c-api-a'].routeId, model)
  connections['c-api-a'] = { ...connections['c-api-a'], credentialGeneration: 1 }
  await ctx.credentials.modifyRecord('llm-pi-ai/c-api-a', () => ({ kind: 'api-key', key: 'fixture-new-account-key' }))
  resolve()
  await generate('c-api-a', { messages })
  assert.equal(requests.at(-1).headers.authorization, 'Bearer fixture-new-account-key')
  assert.ok(!requests.at(-1).body.input.some(item => item.encrypted_content))
  const beforePrepared = requests.length
  await collect('c-api-a', {}, oldPrepared).catch(() => {})
  assert.equal(requests.length, beforePrepared, 'A prepared old-generation call must never authenticate as the new account')

  connections['c-api-a'] = { ...connections['c-api-a'], credentialGeneration: 2, profile: { ...connections['c-api-a'].profile, baseURL: `${origin}/moved-gateway` } }
  resolve()
  await generate('c-api-a', { messages })
  assert.ok(requests.at(-1).path.startsWith('/moved-gateway'))
  assert.ok(!requests.at(-1).body.input.some(item => item.encrypted_content))

  rejectPath = '/api-b'
  const beforeQuota = requests.length
  await collect('c-api-b').catch(() => {})
  assert.equal(requests.length, beforeQuota + 1, 'Quota failure must not retry another account or gateway')
  rejectPath = undefined
  await generate('c-gateway')
  assert.equal(requests.at(-1).headers.authorization, 'Bearer fixture-key-c-gateway')

  // Expired token refresh completes after relogin invalidated the binding.
  let entered, release
  const reached = new Promise(resolve => { entered = resolve })
  const gate = new Promise(resolve => { release = resolve })
  deferredRefresh = async () => { entered(); await gate; return Response.json({ access_token: jwt('stale-account'), refresh_token: 'fixture-stale-rotation', expires_in: 3600 }) }
  await ctx.credentials.modifyRecord('llm-pi-ai/c-oauth-a', record => ({ ...record, payload: { ...record.payload, expires: 0 } }))
  const beforeRefresh = requests.length
  const inflight = collect('c-oauth-a').catch(() => [])
  await reached
  connections['c-oauth-a'] = { ...connections['c-oauth-a'], credentialGeneration: 1 }
  resolve(); release(); await inflight
  assert.equal(requests.length, beforeRefresh)
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/c-oauth-a')).payload.refresh, 'fixture-refresh-a-rotated')
  deferredRefresh = undefined
  await generate('c-oauth-b')

  delete connections['c-api-a']; resolve()
  const beforeDelete = requests.length
  await assert.rejects(async () => collect('c-api-a'), error => error.code === 'NO_ADAPTER')
  assert.equal(requests.length, beforeDelete)
  await ctx.credentials.deleteRecord('llm-pi-ai/c-api-b')
  const beforeMissing = requests.length
  await collect('c-api-b').catch(() => {})
  assert.equal(requests.length, beforeMissing, 'Missing owned credential must not use OPENAI_API_KEY')
  await generate('c-gateway')
  console.log('Connection isolation: real SDK/API A+B/gateway, OAuth A+B and guarded refresh, Thinking, persisted replay scope, quota/deletion/missing-credential no fallback passed (local fixtures only)')
} finally {
  globalThis.fetch = originalFetch
  if (originalAmbientKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalAmbientKey
  await ctx.fiber.dispose()
  await new Promise(resolve => server.close(resolve))
}
