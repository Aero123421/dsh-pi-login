import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LiveCatalogSession, canUseLiveCatalog, liveCatalogProvider } from '../src/live-catalog.mjs'
import { parsePiCatalog, parseCommandCatalog, parseOllamaModel } from '../src/catalog-parsers.mjs'
import { thinkingControls, modelForCatalogRequest } from '../src/catalog-controls.mjs'
import { CATALOG_CONTROL, DISCOVERED_MODEL } from '../src/catalog-metadata.mjs'
import { serviceGroup } from '../src/service-groups.mjs'
import { parseOllamaBalance, parseCommandCredits, gatewayUsageProviders } from '../src/gateway-usage.mjs'
import { normalizeUsageSnapshot } from '../src/account-usage.mjs'
import { getSupportedThinkingLevels } from '@earendil-works/pi-ai'

const connection = serviceId => ({ integrationId: 'pi', serviceId, credentialRecordId: 'c-test', credentialGeneration: 0, profile: {} })
const base = { id: 'old', name: 'Old', provider: 'opencode-go', api: 'openai-completions', baseUrl: 'https://opencode.ai/inference/go/v1',
  reasoning: true, thinkingLevelMap: { off: 'none', low: 'low', high: 'high', minimal: null, medium: null, xhigh: null, max: 'max' },
  contextWindow: 100000, maxTokens: 8192, input: ['text'], cost: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0 } }
const baseline = new Map([[base.id, base]])
function fixture(t, overrides = {}) {
  let saved, now = 10000, current = true
  const calls = [], writes = []
  const session = new LiveCatalogSession({ connection: connection('opencode-go'), baseline,
    snapshot: () => saved, persist: async value => { saved = value; writes.push(JSON.parse(value)) },
    isCurrent: () => current, now: () => now, ttl: 1000, poll: false,
    fetch: async (url, init) => { calls.push({ url, init }); return Response.json([{ ...base, id: 'new:1017', name: 'New' }], { headers: { etag: 'v1' } }) },
    ...overrides,
  })
  t.after(() => session.dispose())
  return { session, calls, writes, get saved() { return saved }, advance: value => { now += value }, revoke: () => { current = false } }
}

test('Pi/Go/Zen catalogs add versioned models with exact effort metadata and preserve installed choices', async t => {
  const f = fixture(t)
  await f.session.refresh()
  const models = f.session.catalog('opencode-go')
  assert.ok(models.has('old')); assert.ok(models.has('new:1017'))
  assert.equal(models.get('new:1017')[DISCOVERED_MODEL].verified, true)
  assert.equal(models.get('new:1017').thinkingLevelMap.medium, null)
  assert.equal(models.get('new:1017').thinkingLevelMap.max, 'max')
  assert.equal(f.calls[0].url, 'https://pi.dev/api/models/providers/opencode-go?types=chat')
  assert.equal(f.calls[0].init.headers.authorization, undefined)
  assert.equal(f.writes.length, 1)
  await f.session.refresh()
  assert.equal(f.calls.length, 1)
})

test('ETag revalidation persists freshness, failed updates keep the last catalog across restarts', async t => {
  const f = fixture(t)
  await f.session.refresh()
  f.advance(2000)
  f.session.fetch = async (_url, init) => { assert.equal(init.headers['if-none-match'], 'v1'); return new Response(null, { status: 304 }) }
  await f.session.refresh()
  assert.equal(f.writes[1].checkedAt, 12000)
  f.session.fetch = async () => new Response('offline', { status: 503 })
  await assert.rejects(f.session.refresh({ force: true }))
  assert.ok(f.session.catalog('opencode-go').has('new:1017'))
  assert.equal(liveCatalogProvider(f.session).presentation().status.message, 'catalogCachedAfterFailure')
  f.session.fetch = async () => new Response('denied public read', { status: 403 })
  await assert.rejects(f.session.refresh({ force: true }))
  assert.ok(f.session.catalog('opencode-go').has('new:1017'))
  f.session.fetch = async () => Response.json({ error: 'unexpected response shape' })
  await assert.rejects(f.session.refresh({ force: true }))
  assert.ok(f.session.catalog('opencode-go').has('new:1017'))
  const restarted = fixture(t, { snapshot: () => f.saved })
  assert.ok(restarted.session.catalog('opencode-go').has('new:1017'))
  const otherAccount = fixture(t, { connection: { ...connection('opencode-go'), credentialGeneration: 1 }, snapshot: () => f.saved })
  assert.equal(otherAccount.session.catalog('opencode-go').has('new:1017'), false)
})

test('an initial catalog failure does not claim a previous successful catalog exists', async t => {
  const f = fixture(t, { connection: connection('commandcode'), baseline: new Map(), now: () => 5000, fetch: async () => new Response(null, { status: 503 }) })
  await assert.rejects(f.session.refresh())
  assert.equal(f.session.catalog('commandcode').size, 0)
  assert.equal(f.session.retryAt, 65000)
  assert.equal(liveCatalogProvider(f.session).presentation().status.message, 'catalogInitialLoadFailed')
})

test('a catalog save failure does not use the fetch error or the 60 second block', async t => {
  const f = fixture(t, { now: () => 5000, persist: async () => { throw new Error('disk full') } })
  await assert.rejects(f.session.refresh())
  assert.equal(f.session.retryAt, 0)
  assert.equal(f.session.cache.error, undefined)
  assert.equal(f.session.cache.peek().fresh, true)
  assert.ok(f.session.catalog('opencode-go').has('new:1017'))
  assert.equal(f.writes.length, 0)
  assert.equal(liveCatalogProvider(f.session).presentation().status.message, 'catalogSaveFailed')
  f.session.persist = async () => {}
  await f.session.refresh({ force: true })
  assert.equal(f.session.persistFailed, false)
  assert.equal(liveCatalogProvider(f.session).presentation().status.message, 'catalogUpdated')
})

test('a failed catalog save keeps the fetched list and does not fetch it again', async t => {
  let fetches = 0
  const f = fixture(t, {
    now: () => 5000,
    persist: async () => { throw new Error('disk full') },
    fetch: async () => {
      fetches++
      return Response.json([{ ...base, id: 'new:1017', name: 'New' }], { headers: { etag: 'v1' } })
    },
  })
  await assert.rejects(f.session.refresh())
  assert.equal(fetches, 1)
  assert.equal(f.session.cache.value.models[0].id, 'new:1017')
  assert.equal(f.session.cache.peek().fresh, true)
  assert.equal(liveCatalogProvider(f.session).presentation().status.message, 'catalogSaveFailed')
  f.session.schedule()
  await f.session.catalog('opencode-go')
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(fetches, 1)
})

test('late responses cannot persist after disconnect or disposal, and rate limits prevent repeated fetches', async t => {
  let release
  const f = fixture(t, { fetch: () => new Promise(resolve => { release = resolve }) })
  const pending = f.session.refresh()
  await new Promise(resolve => setImmediate(resolve))
  f.revoke(); release(Response.json([base]))
  await assert.rejects(pending)
  assert.equal(f.writes.length, 0)
  let requests = 0
  const limited = fixture(t, { fetch: async () => { requests++; return new Response(null, { status: 429, headers: { 'retry-after': '120' } }) } })
  await assert.rejects(limited.session.refresh())
  await assert.rejects(limited.session.refresh({ force: true }))
  assert.equal(requests, 1)
})

test('remote catalogs reject unknown protocols/destinations and never invent unsupported effort levels', () => {
  const result = parsePiCatalog('opencode-go', [
    { ...base, id: 'future', api: 'new-sdk-api' },
    { ...base, id: 'redirect', baseUrl: 'https://evil.example/v1' },
    { ...base, id: 'unknown', thinkingLevelMap: undefined },
    { ...base, id: 'known', headers: { authorization: 'secret' } },
  ], baseline)
  assert.equal(result.skipped, 2)
  assert.equal(result.models.find(model => model.id === 'unknown').reasoning, false)
  assert.equal(result.models.find(model => model.id === 'known').headers, undefined)
  const sparse = parsePiCatalog('opencode-go', [{ ...base, id: 'sparse', thinkingLevelMap: { off: null, minimal: null, max: 'max' } }], baseline).models[0]
  assert.deepEqual(getSupportedThinkingLevels(sparse), ['low', 'medium', 'high', 'max'])
  assert.equal(canUseLiveCatalog({ ...connection('opencode-go'), profile: { baseURL: 'https://proxy.example/v1' } }, baseline), false)
})

test('CommandCode live roster owns routing; capabilities come only from the exact service model', () => {
  const models = parseCommandCatalog({ data: [
    { id: 'claude-example', supported_endpoints: ['/messages'], context_length: 200000 },
    { id: 'gpt-example', supported_endpoints: ['/responses', '/chat/completions'] },
    { id: 'new-example', supported_endpoints: ['/chat/completions'] },
  ] }, { 'claude-example': { reasoning_options: [{ type: 'effort', values: ['high', 'max'] }], modalities: { input: ['text', 'image'] } } }).models
  assert.deepEqual(models.map(model => model.api), ['anthropic-messages', 'openai-responses', 'openai-completions'])
  assert.equal(models[0].baseUrl, 'https://api.commandcode.ai/provider')
  assert.equal(models[0].thinkingLevelMap.high, 'high'); assert.equal(models[0].thinkingLevelMap.low, null)
  assert.equal(models[2].reasoning, false)
})

test('Ollama 1017 preserves exact ID, low/high/max, image input, and service default separately from off', () => {
  const model = parseOllamaModel({ name: 'deepseek-v4.1-flash:1017' }, {
    capabilities: ['completion', 'vision', 'tools', 'thinking'], model_info: { 'deepseek.context_length': 1048576 },
    thinking: { values: [false, 'low', 'high', 'max'], default: 'high' },
  })
  assert.equal(model.id, 'deepseek-v4.1-flash:1017')
  assert.deepEqual(model.input, ['text', 'image'])
  assert.equal(model.thinkingLevelMap.medium, null); assert.equal(model.thinkingLevelMap.xhigh, null)
  assert.equal(model.thinkingLevelMap.max, 'max'); assert.equal(model.thinkingLevelMap.off, 'none')
  model[CATALOG_CONTROL] = model.control
  assert.equal(modelForCatalogRequest(model, undefined).thinkingLevelMap.off, null)
  assert.equal(modelForCatalogRequest(model, 'off').thinkingLevelMap.off, 'none')
  const toggle = thinkingControls([false, true], true)
  assert.equal(toggle.control.toggle, true); assert.equal(toggle.control.defaultEffort, 'on')
  const unknown = thinkingControls(['new-level'], 'new-level')
  assert.equal(unknown.reasoning, false); assert.deepEqual(unknown.control.values, ['new-level'])
  assert.equal(parseOllamaModel(null), undefined)
  assert.equal(parseOllamaModel({ name: 'embed-model' }, { capabilities: ['embedding'] }), undefined)
  assert.deepEqual(parseOllamaModel({ name: model.id }, { capabilities: ['completion'] }, model).input, ['text'])
})

test('Ollama fetches tags and show with the connection key and preserves tagged names', async t => {
  const calls = []
  const f = fixture(t, { connection: connection('ollama-cloud'), baseline: new Map(),
    credentials: { read: async () => ({ type: 'api_key', key: 'fixture-key' }) },
    fetch: async (url, init) => {
      calls.push({ url, init })
      return Response.json(url.endsWith('/tags') ? { models: [{ name: 'deepseek-v4.1-flash:1017' }] }
        : { capabilities: ['completion', 'thinking'], thinking: { values: ['low', 'high', 'max'], default: 'high' }, model_info: { 'deepseek.context_length': 1048576 } })
    },
  })
  await f.session.refresh()
  assert.ok(f.session.catalog('ollama-cloud').has('deepseek-v4.1-flash:1017'))
  assert.equal(JSON.parse(calls[1].init.body).model, 'deepseek-v4.1-flash:1017')
  assert.ok(calls.every(call => call.init.headers.authorization === 'Bearer fixture-key'))
  assert.equal(f.saved.includes('fixture-key'), false)
})

test('service navigation changes presentation without changing connection owners', () => {
  for (const [serviceId, group] of [['openai', 'pi'], ['meta', 'meta'], ['commandcode', 'commandcode'], ['ollama-cloud', 'ollama-cloud'], ['opencode-go', 'opencode'], ['opencode', 'opencode']]) {
    assert.equal(serviceGroup(connection(serviceId)), group)
  }
})

test('cloud balance and legacy quotas retain their units and distinguish remaining from used', () => {
  const current = parseOllamaBalance({ included: { balance_usd: 75, allowance_usd: 100, period: { until: '2026-11-01T00:00:00Z' } }, purchased: { balance_usd: 10 } })
  assert.equal(current[0].usedPercent, 25); assert.equal(current[1].quota.remaining, 10)
  const legacy = parseOllamaBalance({ included: { weekly: { remaining_percent: 40, resets_at: '2026-11-01T00:00:00Z' } } })
  assert.equal(legacy[0].usedPercent, 60)
  const command = parseCommandCredits({ credits: { monthlyCredits: 10, purchasedCredits: 2 }, windowLimits: { fiveHour: { used: 5, cap: 20 } } })
  assert.equal(command[0].quota.remaining, 12); assert.equal(command[1].usedPercent, 25)
  assert.equal(normalizeUsageSnapshot({ windows: command, sourceObservedAt: '2026-10-19T00:00:00Z' }).windows.length, 2)
  assert.throws(() => parseOllamaBalance({}), /error/)
  const providers = gatewayUsageProviders()
  assert.throws(() => providers['ollama-cloud'].validate({ authMethod: 'api-key', profile: { baseURL: 'https://proxy.example/v1' } }), /unsupported/)
})
