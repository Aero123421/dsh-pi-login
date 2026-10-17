import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AccountUsageManager, createPiUsageProviders, normalizeUsageSnapshot } from '../src/account-usage.mjs'
import { parseClaudeUsage, parseCodexUsage, parseMuseUsage, parseOpenCodeUsage, parseCopilotUsage, readProviderJson } from '../src/account-usage-providers.mjs'
import { ProviderReadError } from '../src/provider-cache.mjs'

const at = Date.parse('2026-10-13T12:00:00Z')
const jwt = id => `h.${Buffer.from(JSON.stringify({ 'https://api.openai.com/auth': { chatgpt_account_id: id } })).toString('base64url')}.s`
const connection = (id = 'a', serviceId = 'openai-codex') => ({ connectionId: id, integrationId: 'pi', serviceId, authMethod: 'oauth', credentialGeneration: 0, profile: {} })
const snapshot = (usedPercent = 12) => ({ source: 'internal-http', sourceObservedAt: new Date(at).toISOString(), windows: [{ id: 'weekly', scope: 'account', usedPercent, resetsAt: '2026-10-12T12:00:00Z', windowSeconds: 604800 }] })

test('provider parsers preserve used percentages, unknown resets, source duration and date-only precision', () => {
  assert.equal(parseClaudeUsage({ five_hour: { utilization: 120, resets_at: null } })[0].usedPercent, 120)
  const codex = parseCodexUsage({ rate_limit: { primary_window: { used_percent: 24, limit_window_seconds: 7200, reset_after_seconds: 60 } } }, at)[0]
  assert.equal(codex.windowSeconds, 7200)
  assert.equal(codex.resetsAt, '2026-10-13T12:01:00.000Z')
  assert.deepEqual(parseMuseUsage({ is_subs_active: true }), [])
  assert.equal(parseMuseUsage({ is_subs_active: true, subs_usage: { window: { used_percent: 5, window_duration_mins: 120, resets_at: -1 }, weekly: { used_percent: 140 } } })[1].usedPercent, 140)
  const copilot = parseCopilotUsage({ quota_reset_date: '2026-11-01', token_based_billing: true, quota_snapshots: { premium_interactions: { unlimited: false, entitlement: 1500, quota_remaining: 1080, percent_remaining: 72 }, chat: { unlimited: false, entitlement: 100, percent_remaining: 90 } } })
  assert.equal(copilot.length, 1)
  assert.deepEqual(copilot[0].quota, { used: 420, total: 1500, remaining: 1080, unit: 'credits', estimated: false })
  assert.equal(copilot[0].usedPercent, 28)
  assert.equal(copilot[0].resetsAt, null)
  assert.equal(copilot[0].resetsOn, '2026-11-01')
  const pooled = parseCopilotUsage({ token_based_billing: true, quota_snapshots: { premium_interactions: { unlimited: true, entitlement: -1, credits_used: 42, has_quota: false, overage_permitted: false } } })[0]
  assert.equal(pooled.quotaState, 'unavailable')
  assert.equal(pooled.usedPercent, null)
  assert.equal(pooled.quota.total, null)
})

test('missing/changed/partial payloads fail without guessing zeros or fixed plan allowances', () => {
  for (const parse of [parseClaudeUsage, parseCodexUsage, parseMuseUsage, parseOpenCodeUsage, parseCopilotUsage]) assert.throws(() => parse({}), ProviderReadError)
  assert.throws(() => parseClaudeUsage({ five_hour: { utilization: '0' } }), ProviderReadError)
  assert.throws(() => parseClaudeUsage({ five_hour: { utilization: 5, resets_at: '2026-02-30T12:00:00Z' } }), ProviderReadError)
  assert.throws(() => parseMuseUsage({ is_subs_active: true, subs_usage: { window: { used_percent: 5, window_duration_mins: 300 } } }), ProviderReadError)
  assert.throws(() => parseOpenCodeUsage({ usage: { rolling: { status: 'ok', percent: 0, resetsAt: '2026-10-13T13:00:00Z' } } }), ProviderReadError)
  assert.throws(() => parseCopilotUsage({ quota_reset_date: '2026-02-30', quota_snapshots: { chat: { unlimited: false, entitlement: 100, percent_remaining: 50 } } }), ProviderReadError)
})

test('Codex two-account reads use independent routing, caches and safe normalized RPC data', async t => {
  const calls = [], records = { a: { type: 'oauth', refresh: 'refresh-secret-a', access: jwt('account-a'), expires: at + 1000 }, b: { type: 'oauth', refresh: 'refresh-secret-b', access: jwt('account-b'), expires: at + 1000 } }
  const manager = new AccountUsageManager({ now: () => at, credentials: { read: async c => records[c.connectionId] }, providers: createPiUsageProviders({ now: () => at, fetch: async (url, init) => {
    calls.push({ url, init }); return Response.json({ account: 'private-email', token: 'private-token', rate_limit: { primary_window: { used_percent: init.headers['chatgpt-account-id'] === 'account-a' ? 15 : 75, limit_window_seconds: 18000 } } })
  } }) })
  t.after(() => manager.dispose())
  const [a, b] = await Promise.all([manager.get(connection('a')), manager.get(connection('b'))])
  assert.equal(a.windows[0].usedPercent, 15); assert.equal(b.windows[0].usedPercent, 75)
  assert.equal(a.connectionId, 'a'); assert.equal(b.connectionId, 'b')
  assert.equal(calls.length, 2)
  assert.ok(calls.every(({ init }) => init.redirect === 'error'))
  assert.doesNotMatch(JSON.stringify([a, b]), /secret|private|account-a|account-b|Bearer|rate_limit/)
  a.windows[0].usedPercent = 999
  assert.equal((await manager.get(connection('a'))).windows[0].usedPercent, 15)
  assert.equal(calls.length, 2)
})

test('API keys are unsupported for OAuth quota services and first-party Go keys never aggregate', async t => {
  let calls = 0
  const records = { a: { type: 'api_key', key: 'same-key' }, b: { type: 'api_key', key: 'same-key' } }
  const manager = new AccountUsageManager({ now: () => at, credentials: { read: async c => records[c.connectionId] }, providers: createPiUsageProviders({ fetch: async () => {
    calls++; return Response.json({ usage: Object.fromEntries(['rolling', 'weekly', 'monthly'].map(id => [id, { status: 'ok', percent: 10, resetsAt: '2026-11-01T12:00:00Z' }])) })
  }, now: () => at }) })
  t.after(() => manager.dispose())
  assert.equal((await manager.get({ ...connection(), authMethod: 'api-key' })).status, 'unsupported')
  assert.equal(calls, 0)
  const first = { ...connection('a', 'opencode-go'), authMethod: 'api-key' }, second = { ...first, connectionId: 'b' }
  const a = await manager.get(first), b = await manager.get(second)
  assert.equal(a.windows[0].usedPercent, 10); assert.equal(b.windows[0].usedPercent, 10)
  assert.equal(calls, 2)
  assert.ok(!('quotaScope' in a))
  assert.equal((await manager.get({ ...first, profile: { baseURL: 'https://proxy.test' } })).status, 'unsupported')
  assert.equal(calls, 2)
})

test('OpenCode Go usage reads the inference URL for current and legacy bases', async t => {
  const calls = []
  const manager = new AccountUsageManager({ now: () => at, credentials: { read: async () => ({ type: 'api_key', key: 'fixture-go-key' }) }, providers: createPiUsageProviders({ fetch: async (url, init) => {
    calls.push({ url: String(url), authorization: init.headers.authorization, redirect: init.redirect })
    return Response.json({ usage: Object.fromEntries(['rolling', 'weekly', 'monthly'].map(id => [id, { status: 'ok', percent: 12, resetsAt: '2026-11-01T12:00:00Z' }])) })
  }, now: () => at }) })
  t.after(() => manager.dispose())
  const go = baseURL => ({ ...connection(baseURL ?? 'default', 'opencode-go'), authMethod: 'api-key', profile: baseURL === undefined ? {} : { baseURL } })
  for (const baseURL of [undefined, 'https://opencode.ai/inference/go/v1/', 'https://opencode.ai/inference/go', 'https://opencode.ai/zen/go/v1', 'https://opencode.ai/zen/go']) {
    const result = await manager.get(go(baseURL))
    assert.equal(result.status, 'available', String(baseURL))
    assert.equal(result.windows.find(window => window.id === 'rolling').usedPercent, 12)
    assert.doesNotMatch(JSON.stringify(result), /fixture-go-key/)
  }
  assert.deepEqual(calls.map(call => call.url), Array(5).fill('https://opencode.ai/inference/go/v1/usage'))
  assert.ok(calls.every(call => call.authorization === 'Bearer fixture-go-key' && call.redirect === 'error'))
  assert.equal((await manager.get({ ...go('https://proxy.test'), connectionId: 'proxy' })).status, 'unsupported')
  assert.equal(calls.length, 5)
})

test('failures keep a bounded stale observation and never reset it after the reset date', async t => {
  let now = at, failure, calls = 0
  const manager = new AccountUsageManager({ now: () => now, ttl: 50, maxStale: 200, credentials: { read: async () => ({ type: 'oauth', refresh: 'secret' }) }, providers: { 'openai-codex': { read: async () => { calls++; if (failure) throw failure; return snapshot(84) } } } })
  t.after(() => manager.dispose())
  assert.equal((await manager.get(connection())).status, 'available')
  now += 60; failure = new ProviderReadError('rate-limited', 100)
  const stale = await manager.get(connection())
  assert.equal(stale.status, 'stale'); assert.equal(stale.windows[0].usedPercent, 84)
  assert.equal(stale.sourceObservedAt, new Date(at).toISOString())
  assert.equal(stale.checkedAt, new Date(now).toISOString())
  await manager.get(connection(), { force: true })
  assert.equal(calls, 2)
  now += 150
  const expired = manager.state(connection())
  assert.equal(expired.status, 'rate-limited'); assert.deepEqual(expired.windows, [])
  failure = new ProviderReadError('auth-required')
  const revoked = await manager.get(connection(), { force: true })
  assert.equal(revoked.status, 'auth-required'); assert.deepEqual(revoked.windows, [])
})

test('known OAuth rotation keeps scope but account replacement, generation and late replies cannot mix', async t => {
  let record = { type: 'oauth', refresh: 'old', access: jwt('same-account'), expires: 0 }, calls = 0
  const manager = new AccountUsageManager({ now: () => at, credentials: {
    read: async () => record,
    refresh: async () => (record = { type: 'oauth', refresh: 'new', access: jwt('same-account'), expires: at + 1000 }),
  }, providers: { 'openai-codex': { refreshAccess: true, read: async () => { calls++; return snapshot() } } } })
  t.after(() => manager.dispose())
  await manager.get(connection()); await manager.get(connection())
  assert.equal(calls, 1)
  record = { ...record, refresh: 'other', access: jwt('other-account') }
  await manager.get(connection())
  assert.equal(calls, 2)
  await manager.get({ ...connection(), credentialGeneration: 1 })
  assert.equal(calls, 3)
  let release, began
  manager.providers.get('openai-codex').read = async () => { began(); await new Promise(resolve => { release = resolve }); return snapshot(99) }
  const started = new Promise(resolve => { began = resolve })
  const pending = manager.get(connection(), { force: true })
  await started; record = { ...record, access: jwt('third-account') }; release()
  const result = await pending
  assert.equal(result.status, 'auth-required'); assert.deepEqual(result.windows, [])
})

test('no credentials/raw response fields reach the normalization boundary; request errors stay fixed', async () => {
  const value = normalizeUsageSnapshot({ ...snapshot(), token: 'SECRET', raw: { email: 'private' } })
  assert.doesNotMatch(JSON.stringify(value), /SECRET|private|raw/)
  for (const status of [401, 403, 429, 500]) {
    await assert.rejects(readProviderJson(new Response('SECRET-body', { status, headers: { 'retry-after': '120' } }), { now: at }), error => !error.message.includes('SECRET') && (status !== 429 || error.retryAfterMs === 120000))
  }
  await assert.rejects(readProviderJson(Response.json({ x: 'x' }), { maxBytes: 1 }), ProviderReadError)
})


test('Usage total deadline bounds credential lookup and native unobserved values never invent observation time', async t => {
  const keepAlive = setTimeout(() => {}, 100)
  t.after(() => clearTimeout(keepAlive))
  const manager = new AccountUsageManager({ now: () => at, timeout: 10, credentials: { read: () => new Promise(() => {}) }, providers: { 'openai-codex': { read: async () => snapshot() }, 'native/muse': { requiresCredentials: false, source: 'last-observed', read: async () => ({ source: 'last-observed', windows: [] }) } } })
  t.after(() => manager.dispose())
  assert.equal((await manager.get(connection())).status, 'error')
  const native = await manager.get({ ...connection(), integrationId: 'native', serviceId: 'muse' })
  assert.equal(native.status, 'unobserved')
  assert.equal(native.source, 'last-observed')
  assert.equal(native.sourceObservedAt, undefined)
  assert.equal(native.checkedAt, new Date(at).toISOString())
  assert.throws(() => normalizeUsageSnapshot({ ...snapshot(), sourceObservedAt: '2026-10-13T12:00:00' }), ProviderReadError)
})

test('new OpenAI SIWC and API-key usage explicitly report unsupported without reading tokens or calling legacy wham', async t => {
  let reads = 0, calls = 0
  const manager = new AccountUsageManager({ credentials: { read: async () => { reads++; return { type: 'oauth', access: 'fixture-siwc-token', refresh: 'fixture-refresh' } } },
    providers: createPiUsageProviders({ fetch: async () => { calls++; throw Error('unexpected request') } }) })
  t.after(() => manager.dispose())
  for (const authMethod of ['oauth', 'api-key']) {
    const result = await manager.get({ ...connection('siwc', 'openai'), authMethod })
    assert.equal(result.status, 'unsupported'); assert.deepEqual(result.windows, [])
  }
  assert.equal(reads, 0); assert.equal(calls, 0)
})
