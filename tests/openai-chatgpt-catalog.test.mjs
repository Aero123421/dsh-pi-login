import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { compileOfficial } from '../scripts/upstream.mjs'
import { chatGPTModelRows } from '../src/openai-chatgpt-models.mjs'

await mkdir('.cache', { recursive: true })
await writeFile('.cache/chatgpt-entry.ts', "export * from '../src/openai-chatgpt-catalog.mjs'; export { catalogModels, resolveRouteModels } from '../src/runtime/catalog.ts'; export { DISCOVERED_MODEL } from '../src/catalog-metadata.mjs'; export { discoverModels } from '../src/runtime/discovery.ts'; export { resolveConnectionProfiles } from '../src/runtime/connections.ts';\n")
await compileOfficial('.cache/chatgpt-entry.ts', '.cache/chatgpt-test.mjs')
const { OpenAIChatGPTCatalogSession, catalogModels, resolveRouteModels, resolveConnectionProfiles, discoverModels, DISCOVERED_MODEL: marker } = await import('../.cache/chatgpt-test.mjs')
const at = Date.parse('2026-10-17T12:00:00Z')
const grant = id => ({ type: 'oauth', refresh: `fixture-refresh-${id}`, access: `fixture-access-${id}`, expires: at + 3600000 })
function fixture(t, fetch, extra = {}) {
  let credential = grant('a'), profile = {}
  const session = new OpenAIChatGPTCatalogSession({ credentials: { read: async () => credential },
    profile: () => profile, baseline: catalogModels, fetch, now: () => at, ...extra })
  t.after(() => session.dispose())
  return { session, setCredential: value => { credential = value }, setProfile: value => { profile = value } }
}
const listing = (...ids) => ({ models: ids.map(slug => ({ slug, display_name: `Name ${slug}`, visibility: 'list' })) })

test('SIWC picker uses list visibility, slug, display name and server order', () => {
  assert.deepEqual(chatGPTModelRows({ models: [
    { slug: 'b', display_name: 'B', visibility: 'list' }, { slug: 'hidden', visibility: 'hidden' },
    { slug: 'a', display_name: 'A', visibility: 'list' }, { slug: 'missing' },
    { slug: 'future', visibility: 'unknown' }, { slug: 'b', visibility: 'list' }, null,
  ] }), [{ id: 'b', name: 'B' }, { id: 'a', name: 'A' }])
  assert.throws(() => chatGPTModelRows({ data: [] }))
})

test('account catalog is authoritative and preserves exact SDK limits without inventing SIWC 500K', async t => {
  let calls = 0
  const f = fixture(t, async (url, init) => {
    calls++; assert.equal(url, 'https://api.openai.com/v1/models'); assert.equal(init.redirect, 'error')
    assert.equal(init.headers.authorization, 'Bearer fixture-access-a')
    return Response.json(listing('gpt-6.1-sol', 'new-model'))
  })
  assert.equal(f.session.catalog('openai').size, 0)
  await f.session.refresh()
  const models = f.session.catalog('openai')
  assert.deepEqual([...models.keys()], ['gpt-6.1-sol', 'new-model'])
  assert.equal(models.get('gpt-6.1-sol').contextWindow, 272000)
  assert.equal(catalogModels('openai-codex').get('gpt-6.1-sol').contextWindow, 500000)
  assert.equal(models.get('new-model')[marker].verified, false)
  assert.equal(models.get('new-model').reasoning, false)
  assert.deepEqual(models.get('new-model').input, ['text'])
  await f.session.refresh(); assert.equal(calls, 1)
  await f.session.refresh({ force: true }); assert.equal(calls, 2)
  const request = { provider: 'openai', defaultContextWindow: 1000, defaultMaxTokens: 100, modelOverrides: { 'gpt-6.1-sol': { contextWindow: 123456 } } }
  assert.equal(resolveRouteModels(request, 'strict', models).models[0].contextWindow, 123456)
  assert.deepEqual(resolveRouteModels({ provider: 'openai', defaultContextWindow: 1, defaultMaxTokens: 1 }, 'strict', new Map()).models, [])
  assert.ok(!JSON.stringify([...models.values()]).includes('fixture-access'))
})

test('account replacement, explicit invalidation, transport changes and disposal revoke cached choices', async t => {
  const f = fixture(t, async () => Response.json(listing('gpt-6.1-sol')))
  await f.session.refresh(); f.setCredential(grant('b')); await f.session.validate()
  assert.equal(f.session.catalog('openai').size, 0)
  await f.session.refresh(); f.session.invalidate(); assert.equal(f.session.catalog('openai').size, 0)
  await f.session.refresh(); f.setProfile({ baseURL: 'https://untrusted.example/v1' }); await f.session.validate()
  assert.equal(f.session.catalog('openai').size, 0)
  await assert.rejects(f.session.refresh(), error => error.code === 'unsupported')
  f.session.dispose(); await assert.rejects(f.session.refresh(), error => error.code === 'aborted')
})

test('late account reply cannot repopulate the catalog after replacement or invalidation', async t => {
  let release, began
  const started = new Promise(resolve => { began = resolve })
  const f = fixture(t, async () => { began(); await new Promise(resolve => { release = resolve }); return Response.json(listing('private-model')) })
  const pending = f.session.refresh(); await started
  f.setCredential(grant('b')); release()
  await assert.rejects(pending, error => error.code === 'account-changed')
  assert.equal(f.session.catalog('openai').size, 0)
})

test('unknown/hidden account models cannot be authorized, expired tokens renew through SDK', async t => {
  let refreshed = 0
  const f = fixture(t, async () => Response.json(listing('gpt-6.1-sol')), {
    refreshAuth: async () => { refreshed++; const next = grant('a'); f.setCredential(next); return next },
  })
  f.setCredential({ ...grant('a'), expires: at - 1 })
  await f.session.authorizeModel({ id: 'gpt-6.1-sol' }); assert.equal(refreshed, 1)
  await assert.rejects(f.session.authorizeModel({ id: 'hidden' }), error => error.code === 'CHATGPT_MODEL_UNAVAILABLE')
})

test('generic discovery follows the saved OAuth method instead of returning the installed OpenAI catalog', async t => {
  const original = globalThis.fetch; let calls = 0
  globalThis.fetch = async (_url, init) => { calls++; assert.equal(init.headers.get('authorization'), 'Bearer fixture-oauth'); return Response.json(listing('account-only')) }
  t.after(() => { globalThis.fetch = original })
  const stored = () => ({ serviceId: 'openai', authMethod: 'oauth', baseURL: 'https://api.openai.com/v1', api: 'openai-responses', resolveApiKey: async () => 'fixture-oauth' })
  assert.deepEqual(await discoverModels({ provider: 'openai' }, stored), [{ id: 'account-only', name: 'Name account-only' }])
  const apiModels = await discoverModels({ provider: 'openai' }, () => ({ ...stored(), authMethod: 'api-key' }))
  assert.ok(apiModels.some(model => model.id === 'gpt-6.1-sol')); assert.equal(calls, 1)
})

test('real SDK SIWC OAuth sends the saved access token only to public streaming Responses with store disabled', async () => {
  const { builtinModels } = await import('@earendil-works/pi-ai/providers/all')
  const { openaiProvider } = await import('@earendil-works/pi-ai/providers/openai')
  const credential = { ...grant('siwc'), expires: Date.now() + 3600000 }
  const models = builtinModels({ credentials: {
    read: async () => credential,
    modify: async (_provider, update) => await update(credential) ?? credential,
    list: async () => [{ providerId: 'openai', type: 'oauth' }], delete: async () => {},
  }, authContext: { env: async () => undefined, fileExists: async () => false } })
  models.clearProviders(); models.setProvider(openaiProvider())
  const model = catalogModels('openai').get('gpt-6.1-sol')
  let captured
  const sse = [
    { type: 'response.created', response: { id: 'response_fixture' } },
    { type: 'response.completed', response: { id: 'response_fixture', status: 'completed', output: [], usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 } } },
  ].map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join('')
  const reply = await models.streamSimple(model, { messages: [{ role: 'user', content: 'fixture', timestamp: at }] }, {
    maxRetries: 0, fetch: async (input, options) => {
      const request = new Request(input, options)
      captured = { url: request.url, authorization: request.headers.get('authorization'), body: await request.json() }
      return new Response(sse, { headers: { 'content-type': 'text/event-stream' } })
    },
  }).result()
  assert.equal(reply.stopReason, 'stop', reply.errorMessage)
  assert.equal(captured.url, 'https://api.openai.com/v1/responses')
  assert.equal(captured.authorization, 'Bearer fixture-access-siwc')
  assert.equal(captured.body.store, false); assert.equal(captured.body.stream, true)
  assert.equal(captured.body.model, 'gpt-6.1-sol')
})

test('OAuth discovery refuses custom or legacy transports before credential resolution', async () => {
  let reads = 0
  for (const patch of [{ baseURL: 'https://chatgpt.com/backend-api' }, { api: 'openai-completions' }]) {
    await assert.rejects(discoverModels({ provider: 'pi-fixture', ...patch }, () => ({ serviceId: 'openai', authMethod: 'oauth', baseURL: 'https://api.openai.com/v1', api: 'openai-responses', resolveApiKey: async () => { reads++; return 'fixture-oauth' } })), error => error.code === 'DISCOVERY_UNSUPPORTED')
  }
  assert.equal(reads, 0)
})

test('saved OAuth accounts refresh automatically after startup and TTL expiry without polling', async t => {
  let now = at, calls = 0, changed = 0
  const f = fixture(t, async () => { calls++; return Response.json(listing(calls === 1 ? 'first-model' : 'next-model')) }, {
    now: () => now, ttl: 100, onChange: () => { changed++ },
  })
  assert.equal(f.session.catalog('openai').size, 0)
  await f.session.autoPending
  assert.deepEqual([...f.session.catalog('openai').keys()], ['first-model'])
  assert.equal(calls, 1); assert.equal(changed, 1)
  now += 101
  assert.equal(f.session.catalog('openai').size, 0)
  await f.session.autoPending
  assert.deepEqual([...f.session.catalog('openai').keys()], ['next-model'])
  assert.equal(calls, 2)
  for (let i = 0; i < 10; i++) f.session.catalog('openai')
  assert.equal(f.session.autoPending, undefined); assert.equal(calls, 2)
})

test('automatic failure is bounded and disposal cannot publish late startup models', async t => {
  let calls = 0
  const failed = fixture(t, async () => { calls++; return new Response('', { status: 401 }) })
  failed.session.catalog('openai'); await failed.session.autoPending
  for (let i = 0; i < 10; i++) failed.session.catalog('openai')
  assert.equal(calls, 1); assert.equal(failed.session.autoPending, undefined)
  let release, began, changed = 0
  const started = new Promise(resolve => { began = resolve })
  const pending = fixture(t, async () => { began(); await new Promise(resolve => { release = resolve }); return Response.json(listing('late-model')) }, { onChange: () => { changed++ } })
  pending.session.catalog('openai'); const work = pending.session.autoPending
  await started; pending.session.dispose(); release(); await work
  assert.equal(pending.session.catalog('openai').size, 0); assert.equal(changed, 0)
})


test('cold and empty ChatGPT catalogs retain existing model overrides while the route remains dormant', () => {
  const profile = { modelOverrides: { 'gpt-6.1-sol': { contextWindow: 272000 } } }
  for (const validation of ['strict', 'deferred']) {
    const resolved = resolveRouteModels({ provider: 'openai', defaultContextWindow: 1000, defaultMaxTokens: 100, ...profile }, validation, new Map())
    assert.deepEqual(resolved.models, [])
    const connections = resolveConnectionProfiles({ saved: { integrationId: 'pi', serviceId: 'openai', routeId: 'pi-saved',
      displayName: 'Saved OAuth', authMethod: 'oauth', credentialRecordId: 'saved', credentialGeneration: 0, profile } }, () => new Map(), validation)
    assert.deepEqual(connections.get('pi-saved').modelChoices, [])
    assert.equal(profile.modelOverrides['gpt-6.1-sol'].contextWindow, 272000)
    const restored = resolveRouteModels({ provider: 'openai', defaultContextWindow: 1000, defaultMaxTokens: 100, ...profile }, validation, catalogModels('openai'))
    assert.equal(restored.models.find(model => model.id === 'gpt-6.1-sol').contextWindow, 272000)
  }
})
