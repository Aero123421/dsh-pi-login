import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { mock } from 'node:test'
import { parse } from 'yaml'
import { getBuiltinModels, getBuiltinProviders } from '@earendil-works/pi-ai/providers/all'
import { PiLoginBroker } from '../src/broker.mjs'
const { Context, AuthorizationService, MemoryCredentials, HostConnectionService, PiPlugin, applyEntryPatches } = await import('../.cache/official-host.mjs')

// Exercise the real composition patch: one active Pi implementation and an
// unchanged built-in profile to restore when the bundle is removed.
const original = [{ id: 'llm-pi-ai', name: '@deepseek-ai/dsh-llm-pi-ai', config: { providers: { deepseek: {} } } }]
const patches = parse(await readFile('cordis.patch.yml', 'utf8'))
const warnings = []
const composed = applyEntryPatches(original, patches, (...args) => warnings.push(args))
assert.deepEqual(warnings, [])
assert.equal(composed.find(entry => entry.id === 'llm-pi-ai').disabled, true)
assert.equal(composed.filter(entry => !entry.disabled).length, 1)
assert.equal(composed.find(entry => !entry.disabled).name, '@local/dsh-pi-login')
assert.equal(original[0].disabled, undefined)

const requests = []
const server = createServer(async (request, response) => {
  const chunks = []; for await (const chunk of request) chunks.push(chunk)
  requests.push({ body: JSON.parse(Buffer.concat(chunks)), headers: request.headers })
  response.writeHead(200, { 'content-type': 'text/event-stream' })
  for (const event of [
    { choices: [{ delta: { role: 'assistant', content: '' }, index: 0, finish_reason: null }] },
    { choices: [{ delta: { content: 'hello' }, index: 0, finish_reason: null }] },
    { choices: [{ delta: {}, index: 0, finish_reason: 'stop' }], usage: { prompt_tokens: 3, completion_tokens: 1 } },
  ]) response.write(`data: ${JSON.stringify(event)}\n\n`)
  response.end('data: [DONE]\n\n')
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const baseURL = `http://127.0.0.1:${server.address().port}`
const ctx = new Context()
await ctx.plugin(MemoryCredentials); await ctx.plugin(AuthorizationService)
await ctx.plugin(pluginCtx => { new HostConnectionService(pluginCtx, [], { isAuthenticated: () => true }) })
const sdkModels = getBuiltinModels('deepseek')
const legacy = { deepseek: { baseURL, headers: { 'X-Deployment': 'preserved' }, modelOverrides: {} } }
let config = PiPlugin.Config({})
let revision = 0, active = [], adapter, directory = [], replacements = 0
const volatileWrite = Symbol.for('cosmokit.volatile.write')
ctx.provide('configEditor', { entries: () => [{ options: { id: 'llm-pi-ai', config: { providers: legacy } } }] })
// These two doubles are the Host registration and persistence seats. Cordis,
// schema, authorization, credentials, adapter conversion, and Pi are real.
ctx.provide('settings', {
  configure: (_options, fiber) => { config = fiber.config; return () => {} },
  describe: () => [{ ns: 'dsh-pi-login', revision, value: { providers: config.providers.get(), legacyImported: config.legacyImported.get() } }],
  update: async (ns, patch, expected) => {
    assert.equal(ns, 'dsh-pi-login'); assert.equal(expected, revision)
    const providers = structuredClone(config.providers.get())
    for (const [id, changes] of Object.entries(patch.providers ?? {})) providers[id] = { ...providers[id], ...changes }
    const next = PiPlugin.Config({ providers, legacyImported: patch.legacyImported ?? config.legacyImported.get() })
    config.providers[volatileWrite](next.providers.get()); config.legacyImported[volatileWrite](next.legacyImported.get()); revision++
    ctx.emit('settings/document-updated', ns, revision)
  },
})
ctx.provide('llm', {
  registerConfigurableProviders: entries => { directory = entries; return { replace: entries => { directory = entries } } },
  registerModelDiscovery: () => () => {},
  registerAdapter: (providers, instance) => { active = providers; adapter = instance; return { replace: providers => { active = providers; replacements++ } } },
})
const plugin = ctx.plugin(PiPlugin, {}); await plugin.await(); config = plugin.config
const pause = () => new Promise(resolve => setImmediate(resolve))
await pause(); await pause()
try {
  assert.equal(config.legacyImported.get(), true)
  assert.equal(config.providers.get().deepseek.headers['X-Deployment'], 'preserved')
  assert.ok(directory.length >= getBuiltinProviders().length - 3)
  assert.ok(directory.every(entry => entry.settingsNs === 'dsh-pi-login'))
  for (const id of getBuiltinProviders()) {
    if (!getBuiltinModels(id).length) continue
    const profile=PiPlugin.resolveProfiles({[id]:{}},'strict').get(id)
    const expected = getBuiltinModels(id).map(model => model.id)
    if (id === 'meta' && !expected.includes('muse-wonder-1.0')) expected.push('muse-wonder-1.0')
    assert.deepEqual(profile.piProvider.getModels().map(model => model.id),expected,id)
  }
  assert.deepEqual(active, ['deepseek'])
  assert.deepEqual((await adapter.listModels('deepseek')).map(model => model.id), sdkModels.map(model => model.id))
  assert.ok(ctx.authorization.describe('llm-pi-ai/openai').methods.some(method => method.id === 'oauth'))

  // Discovery and opt-in are shared runtime concepts, including on non-Meta routes.
  const learned = { ...getBuiltinModels('anthropic')[0], id: 'fixture-new-model', [PiPlugin.DISCOVERED_MODEL]: { verified: true } }
  const live = provider => provider === 'anthropic' ? new Map([...getBuiltinModels(provider).map(model => [model.id, model]), [learned.id, learned]]) : undefined
  for (const enabled of [false, true]) {
    const profile = PiPlugin.resolveProfiles({ anthropic: { enabledDiscoveredModels: enabled ? [learned.id] : [] } }, 'strict', live).get('anthropic')
    assert.equal(profile.modelChoices.find(model => model.id === learned.id).enabled, enabled)
  }

  // The shipped plugin exposes the supplemented catalog through both the
  // authenticated model picker and the Harness adapter registration.
  await ctx.settings.update('dsh-pi-login', { providers: { meta: { enabled: true } } }, revision)
  const metaBroker = new PiLoginBroker(ctx.authorization, ctx.credentials, ctx.settings, {
    catalog: (provider, profile) => PiPlugin.resolveProfiles({ [provider]: profile }, 'strict').get(provider).modelChoices,
  })
  try {
    const choice = metaBroker.models('llm-pi-ai/meta').models.find(model => model.id === 'muse-wonder-1.0')
    assert.equal(choice.name, 'Muse Wonder')
    assert.equal(choice.enabled, true)
    assert.ok((await adapter.listModels('meta')).some(model => model.id === choice.id))
    const info = await adapter.resolveModel('meta', choice.id)
    assert.equal(info.context.contextWindow, 1048576)
    assert.deepEqual(info.reasoning.efforts.map(effort => effort.id), ['minimal', 'low', 'medium', 'high', 'xhigh', 'max'])
    const listing = metaBroker.models('llm-pi-ai/meta')
    await metaBroker.setModel('llm-pi-ai/meta', choice.id, false, listing.revision)
    assert.ok(!(await adapter.listModels('meta')).some(model => model.id === choice.id))
  } finally { await metaBroker.dispose() }
  await ctx.settings.update('dsh-pi-login', { providers: { meta: { enabled: false } } }, revision)
  assert.deepEqual(active, ['deepseek'])

  // Exercise the shipped live-catalog RPC and real SDK end to end. Only Meta's
  // HTTPS responses are fixtures; no account login or paid request occurs.
  await ctx.credentials.modifyRecord('llm-pi-ai/meta', () => ({ kind: 'grant', payload: {
    type: 'oauth', refresh: 'runtime-meta-identity', access: 'runtime-meta-old', expires: Date.now() + 100000,
  } }))
  await ctx.settings.update('dsh-pi-login', { providers: { meta: { enabled: true } } }, revision)
  const full = 'muse-wonder-full-1.0'
  const metaRequests = []
  const originalFetch = globalThis.fetch
  const metaFetch = mock.method(globalThis, 'fetch', async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input)
    if (url.hostname !== 'api.meta.ai') return originalFetch(input, init)
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
    metaRequests.push({ path: url.pathname, authorization: headers.get('authorization'), version: headers.get('x-api-version') })
    if (url.pathname === '/muse-code/key') return Response.json({ is_subs_active: true, subs_tier_name: 'Maximum Usage', api_key: 'runtime-meta-minted' })
    if (url.pathname === '/v1/models') return Response.json({ data: [{ id: full, name: 'Muse Wonder Full', context_window: 1048576, max_output_tokens: 65536, input: ['text'], reasoning: true, thinkingLevelMap: { high: 'high', max: 'max' } }] })
    assert.equal(url.pathname, '/v1/responses')
    const body = JSON.parse(init?.body ?? await input.clone().text())
    assert.equal(body.model, full)
    assert.equal(body.reasoning.effort, 'high')
    const item = { type: 'message', id: 'msg_full', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: 'full-fixture', annotations: [] }] }
    const events = [
      { type: 'response.created', response: { id: 'resp_full', model: full } },
      { type: 'response.output_item.added', output_index: 0, item: { ...item, content: [] } },
      { type: 'response.content_part.added', output_index: 0, content_index: 0, part: { type: 'output_text', text: '', annotations: [] } },
      { type: 'response.output_text.delta', output_index: 0, content_index: 0, delta: 'full-fixture' },
      { type: 'response.output_item.done', output_index: 0, item },
      { type: 'response.completed', response: { id: 'resp_full', model: full, status: 'completed', output: [item], usage: { input_tokens: 3, output_tokens: 1, total_tokens: 4 } } },
    ].map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join('')
    return new Response(events, { headers: { 'content-type': 'text/event-stream' } })
  })
  const metaHandler = ctx.connection.createSharedFetchHandler('/api')
  async function metaCall(method, payload = {}) {
    const endpoint = `dsh-pi-login/${method}`
    const response = await metaHandler.fetch(new Request(`http://localhost/api/${endpoint}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'client-request', rpcId: 'meta-fixture', method: endpoint, payload }) }))
    const value = await response.json()
    assert.equal(value.result.ok, true, JSON.stringify(value))
    return value.result.value
  }
  try {
    const refreshed = await metaCall('refresh-models', { key: 'llm-pi-ai/meta' })
    assert.equal(refreshed.refresh.status.detail, 'Maximum Usage')
    assert.equal(refreshed.models.find(model => model.id === full).enabled, false)
    assert.doesNotMatch(JSON.stringify(refreshed), /runtime-meta-identity|runtime-meta-minted/)
    await metaCall('set-model', { key: 'llm-pi-ai/meta', model: full, enabled: true, revision: refreshed.revision })
    assert.ok((await adapter.listModels('meta')).some(model => model.id === full))
    assert.deepEqual((await adapter.resolveModel('meta', full)).reasoning.efforts.map(effort => effort.id), ['high', 'max'])
    const prepared = await adapter.prepareCall('meta', full)
    const chunks = []
    for await (const chunk of prepared.stream({ provider: 'meta', model: full, reasoningEffort: 'high', messages: [{ role: 'user', content: [{ type: 'text', text: 'fixture' }] }] })) chunks.push(chunk)
    assert.equal(chunks.filter(chunk => chunk.type === 'text-delta').map(chunk => chunk.text).join(''), 'full-fixture')
    assert.deepEqual(metaRequests.map(request => request.authorization), ['Bearer runtime-meta-identity', 'Bearer runtime-meta-minted', 'Bearer runtime-meta-minted'])
    assert.ok(metaRequests.every(request => request.version === '1.0.0'))
    await ctx.credentials.modifyRecord('llm-pi-ai/meta', () => ({ kind: 'grant', payload: { type: 'oauth', refresh: 'other-account', access: 'other-key', expires: Date.now() + 100000 } }))
    const count = metaRequests.length
    await assert.rejects(async () => { for await (const _ of prepared.stream({ provider: 'meta', model: full, messages: [] })) {} }, error => error.code === 'meta-refresh-required')
    assert.equal(metaRequests.length, count)
    const changed = await metaCall('models', { key: 'llm-pi-ai/meta' })
    assert.ok(!changed.models.some(model => model.id === full))
    assert.ok(!(await adapter.listModels('meta')).some(model => model.id === full))
    console.log('Muse account catalog: authenticated RPC, explicit Full opt-in, actual SDK request and streamed fixture, account-key pinning, and account change invalidation passed')
  } finally { metaFetch.mock.restore() }
  await ctx.settings.update('dsh-pi-login', { providers: { meta: { enabled: false } } }, revision)
  assert.deepEqual(active, ['deepseek'])

  // The SDK itself asks for and stores an API key through the official seam.
  await ctx.authorization.begin({ key: 'llm-pi-ai/deepseek', method: 'api-key', interaction: { notify: () => {}, prompt: async () => 'runtime-fixture-key' } })
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/deepseek')).kind, 'api-key')
  const result = []
  for await (const chunk of adapter.stream({ provider: 'deepseek', model: sdkModels[0].id, messages: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }] })) result.push(chunk)
  assert.equal(result.filter(chunk => chunk.type === 'text-delta').map(chunk => chunk.text).join(''), 'hello')
  assert.equal(requests[0].headers.authorization, 'Bearer runtime-fixture-key')
  assert.equal(requests[0].headers['x-deployment'], 'preserved')

  await ctx.settings.update('dsh-pi-login', { providers: { deepseek: { disabledModels: [sdkModels[0].id] } } }, revision)
  assert.ok(!(await adapter.listModels('deepseek')).some(model => model.id === sdkModels[0].id))
  await assert.rejects(adapter.resolveModel('deepseek', sdkModels[0].id))
  await ctx.settings.update('dsh-pi-login', { providers: { deepseek: { enabled: false } } }, revision)
  assert.deepEqual(active, [])
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/deepseek')).kind, 'api-key')
  await ctx.settings.update('dsh-pi-login', { providers: { deepseek: { enabled: true, disabledModels: [] } } }, revision)
  assert.deepEqual(active, ['deepseek'])
  assert.equal((await adapter.listModels('deepseek')).length, sdkModels.length)
  assert.ok(replacements >= 3)
  assert.deepEqual(legacy.deepseek, { baseURL, headers: { 'X-Deployment': 'preserved' }, modelOverrides: {} })

  // Both choices share one SDK model, but changes to the selectable catalog
  // must still notify Host consumers through adapter registration.
  const model = 'gpt-6.1-sol', fast = `${model}::fast`
  for (const provider of ['openai', 'openai-codex']) {
    await ctx.settings.update('dsh-pi-login', { providers: { [provider]: { enabled: true, models: [{ id: model }] } } }, revision)
    assert.deepEqual((await adapter.listModels(provider)).map(choice => choice.id), [model])
    for (const [changes, expected] of [
      [{ enabledFastModels: [fast] }, [model, fast]],
      [{ disabledModels: [model] }, [fast]],
      [{ disabledModels: [] }, [model, fast]],
      [{ enabledFastModels: [] }, [model]],
    ]) {
      const before = replacements
      await ctx.settings.update('dsh-pi-login', { providers: { [provider]: changes } }, revision)
      assert.equal(replacements, before + 1, `${provider}: model choice changes must update registration`)
      assert.deepEqual((await adapter.listModels(provider)).map(choice => choice.id), expected)
      assert.deepEqual(active, ['deepseek', provider])
      const profile = PiPlugin.resolveProfiles({ [provider]: config.providers.get()[provider] }, 'strict').get(provider)
      assert.deepEqual(profile.piProvider.getModels().map(entry => entry.id), [model])
    }
    await ctx.settings.update('dsh-pi-login', { providers: { [provider]: { enabled: false } } }, revision)
    assert.deepEqual(active, ['deepseek'])
  }

  // Use the SDK's Models.login and the registered adapter flow. Only the
  // provider's network operation is replaced; expiry must cross Authorization.
  const oauth = PiPlugin.resolveProfiles({openai:{}}, 'strict').get('openai').piProvider.auth.oauth
  const originalLogin = oauth.login
  const broker = new PiLoginBroker(ctx.authorization, ctx.credentials, ctx.settings)
  mock.timers.enable({apis:['setTimeout']})
  try {
    oauth.login = async interaction => {
      interaction.notify({type:'device_code', verificationUri:'https://accounts.example/device', userCode:'RUNTIME-CODE', intervalSeconds:5, expiresInSeconds:900})
      await interaction.prompt({type:'text', message:'Approve device'})
      return {type:'oauth', access:'runtime-device-access', refresh:'runtime-device-refresh', expires:Date.now()+3600000}
    }
    const {ticket} = broker.start('llm-pi-ai/openai', 'oauth')
    await pause(); await pause()
    assert.equal(broker.snapshot(ticket).notice.code, 'RUNTIME-CODE')
    assert.equal('expiresInSeconds' in broker.snapshot(ticket).notice, false)
    mock.timers.tick(10*60*1000); await pause()
    assert.equal(broker.snapshot(ticket).status, 'running')
    mock.timers.tick(4*60*1000+59*1000)
    broker.answer(ticket, broker.snapshot(ticket).prompt.id, 'approved')
    await broker.attempt(ticket).done
    assert.deepEqual(broker.snapshot(ticket), {status:'authorized'})
    assert.equal((await ctx.credentials.readRecord('llm-pi-ai/openai')).kind, 'grant')
  } finally {
    oauth.login = originalLogin
    await broker.dispose()
    mock.timers.reset()
  }
  console.log(`Independent Pi SDK: ${directory.length} providers, SDK catalog, API-key login, device-code expiry relay, streamed response, model/provider toggles, Fast catalog notifications, preserved credentials and legacy settings passed`)
} finally { await plugin.dispose(); await ctx.fiber.dispose(); await new Promise(resolve => server.close(resolve)) }

await import('./fast-runtime-check.mjs')
