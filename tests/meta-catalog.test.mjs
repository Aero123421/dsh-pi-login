import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MetaCatalogSession, META_CATALOG_GRANT } from '../src/meta-catalog.mjs'
import { catalogModels, resolveRouteModels } from '../src/runtime/catalog.ts'
import { modelChoices } from '../src/runtime/fast.ts'

const full = 'muse-wonder-full-1.0'
const json = value => Response.json(value)
function setup(t, fetch, baseline = catalogModels, options = {}) {
  let record = { type: 'oauth', refresh: 'identity-A', access: 'old-key', expires: Date.now() + 100000 }
  let profile = {}
  const requests = []
  const session = new MetaCatalogSession({
    credentials: { read: async () => record, modify: async (_id, mutate) => { record = await mutate(record); return record } },
    profile: () => profile, baseline, ...options,
    fetch: async (url, init) => {
      requests.push({ url, init })
      if (fetch) return fetch(url, init)
      return url.endsWith('/key') ? json({ is_subs_active: true, subs_tier_name: 'Maximum Usage', api_key: 'subscription-key', user_email: 'private@example.test' }) : json({ data: [{ id: full }] })
    },
  })
  t.after(() => session.dispose())
  return { session, requests, get record() { return record }, set record(v) { record = v }, set profile(v) { profile = v } }
}

test('Meta refresh uses the identity for minting and the subscription key for listing; public state has no credentials', async t => {
  const f = setup(t)
  const state = await f.session.refresh()
  assert.equal(state.account.active, true)
  assert.equal(state.account.tierName, 'Maximum Usage')
  assert.equal(state.discoveredCount, 1)
  assert.equal(f.requests.length, 2)
  assert.equal(f.requests[0].init.headers.authorization, 'Bearer identity-A')
  assert.equal(f.requests[1].init.headers.authorization, 'Bearer subscription-key')
  assert.ok(f.requests.every(request => request.init.redirect === 'error'))
  assert.equal(f.record.access, 'subscription-key')
  assert.equal(f.record.refresh, 'identity-A')
  assert.doesNotMatch(JSON.stringify(state), /identity-A|subscription-key|private@example/)
  assert.ok(f.session.catalog('meta').has(full))
  assert.equal(f.session.catalog('openai'), undefined)
})

test('ID-only Full uses configured limits, no invented image or reasoning capability, and requires opt-in', async t => {
  const f = setup(t)
  f.profile = { defaultContextWindow: 100000, defaultMaxTokens: 5000 }
  await f.session.refresh()
  const map = f.session.catalog('meta'), model = map.get(full)
  assert.equal(model.contextWindow, 100000)
  assert.equal(model.maxTokens, 5000)
  assert.equal(model.reasoning, false)
  assert.deepEqual(model.input, ['text'])
  assert.equal(model[META_CATALOG_GRANT].verified, false)
  assert.equal(modelChoices('meta', [model], {}, new Set([full]))[0].enabled, false)
  assert.equal(modelChoices('meta', [model], { enabledDiscoveredModels: [full] }, new Set([full]))[0].enabled, true)
  assert.equal(modelChoices('meta', [model], { models: [{ id: full }] }, new Set([full]))[0].enabled, true)
  assert.equal(modelChoices('meta', [model], { models: [{ id: full }], disabledModels: [full] }, new Set([full]))[0].enabled, false)
  const resolved = resolveRouteModels({ provider: 'meta', defaultInput: ['text'], defaultContextWindow: 100000, defaultMaxTokens: 5000 }, 'strict', map)
  assert.equal(resolved.models.find(entry => entry.id === full)[META_CATALOG_GRANT].principal, model[META_CATALOG_GRANT].principal)
})

test('enriched account metadata is adopted without changing an explicitly configured model list', async t => {
  const f = setup(t, async url => url.endsWith('/key') ? json({ is_subs_active: true, api_key: 'key' }) : json({ data: [
    { id: full, name: 'Full from account', context_window: 1048576, max_output_tokens: 65536, input: ['text', 'image', 'audio'], reasoning: true, thinkingLevelMap: { high: 'high', max: 'max' } },
    { id: 'muse-wonder-full-1.0-contributor' },
  ] }))
  await f.session.refresh()
  const map = f.session.catalog('meta')
  assert.equal(map.get(full).name, 'Full from account')
  assert.deepEqual(map.get(full).input, ['text', 'image'])
  assert.equal(map.get(full)[META_CATALOG_GRANT].verified, true)
  assert.equal(map.get(full).thinkingLevelMap.low, null)
  const resolved = resolveRouteModels({ provider: 'meta', models: [{ id: 'muse-spark-1.3' }], defaultInput: ['text'], defaultContextWindow: 1000, defaultMaxTokens: 100 }, 'strict', map)
  assert.deepEqual(resolved.models.map(model => model.id), ['muse-spark-1.3'])
})

test('unknown or inactive Muse subscriptions never expose subscription-only candidates', async t => {
  for (const active of [false, undefined]) {
    const f = setup(t, async () => json({ is_subs_active: active }))
    const state = await f.session.refresh()
    assert.equal(state.account.active, active ?? null)
    assert.equal(state.discoveredCount, 0)
    assert.equal(f.requests.length, 1)
    assert.ok(!f.session.catalog('meta').has(full))
  }
})

test('a future SDK Full entry retains SDK capabilities and still gets an account-bound grant', async t => {
  const future = { ...catalogModels('meta').get('muse-spark-1.3'), id: full, name: 'SDK Full', maxTokens: 99000 }
  const sdkCatalog = new Map([...catalogModels('meta'), [full, future]])
  const baseline = provider => provider === 'meta' ? sdkCatalog : catalogModels(provider)
  const f = setup(t, undefined, baseline)
  await f.session.refresh()
  const model = f.session.catalog('meta').get(full)
  assert.equal(model.name, 'SDK Full')
  assert.equal(model.maxTokens, 99000)
  assert.equal(model[META_CATALOG_GRANT].verified, true)
  assert.equal(await f.session.keyForModel('meta', model, {}), 'subscription-key')
  assert.equal(sdkCatalog.get(full)[META_CATALOG_GRANT], undefined)
})

test('PAYG login, credential references and endpoint/header overrides cannot refresh a Muse subscription', async t => {
  const f = setup(t)
  f.record = { type: 'api_key', key: 'payg-key' }
  await assert.rejects(f.session.refresh(), /meta-login-required/)
  f.record = { type: 'oauth', refresh: 'identity-A', access: 'key' }
  for (const profile of [{ apiKeyEnv: 'META_KEY' }, { baseURL: 'https://elsewhere.example/v1' }, { headers: { aUtHoRiZaTiOn: 'Bearer override' } }, { api: 'openai-completions' }]) {
    f.profile = profile
    await assert.rejects(f.session.refresh(), /meta-key-override|meta-settings-incompatible/)
  }
  assert.equal(f.requests.length, 0)
})

test('an account swap during listing cannot publish the old account catalog', async t => {
  let release, started
  const gate = new Promise(resolve => { release = resolve }), began = new Promise(resolve => { started = resolve })
  const f = setup(t, async url => {
    if (url.endsWith('/key')) return json({ is_subs_active: true, api_key: 'key-A' })
    started(); await gate; return json({ data: [{ id: full }] })
  })
  const pending = f.session.refresh()
  await began; f.record = { type: 'oauth', refresh: 'identity-B', access: 'key-B' }; release()
  await assert.rejects(pending, /meta-account-changed/)
  assert.equal(f.session.catalog('meta'), undefined)
})

test('bad, failed, oversized and partial responses retain the last complete catalog and redact error bodies', async t => {
  let reply = json({ data: [{ id: full }] })
  const f = setup(t, async url => url.endsWith('/key') ? json({ is_subs_active: true, api_key: 'key' }) : reply)
  await f.session.refresh()
  for (const response of [new Response('SECRET-FROM-REMOTE', { status: 500 }), json({ data: [], has_more: true }), json({ models: [] }), new Response('x', { headers: { 'content-length': String(4 * 1024 * 1024 + 1) } }), new Response('not-json')]) {
    reply = response
    await assert.rejects(f.session.refresh({ force: true }), error => error.message === 'meta-refresh-failed')
    assert.ok(f.session.catalog('meta').has(full))
  }
})

test('rate-limited key checks are actionable and never retried automatically', async t => {
  const f = setup(t, async () => new Response('private-rate-limit-detail', { status: 429 }))
  await assert.rejects(f.session.refresh(), error => error.code === 'meta-rate-limited' && error.message === 'meta-rate-limited')
  assert.equal(f.requests.length, 1)
})

test('confirmed inactive status revokes a prior learned catalog and unsupported model types are not guessed', async t => {
  let active = true
  const f = setup(t, async url => url.endsWith('/key') ? json({ is_subs_active: active, api_key: 'key' }) : json({ data: [{ id: full }, { id: 'muse-audio', input: ['audio'] }, { id: 'muse-image', type: 'image' }] }))
  await f.session.refresh()
  const model = f.session.catalog('meta').get(full)
  assert.equal(f.session.state().discoveredCount, 1)
  active = false
  await f.session.usage({ force: true })
  await f.session.refresh({ force: true })
  assert.equal(f.session.state().account.active, false)
  assert.ok(!f.session.catalog('meta').has(full))
  await assert.rejects(f.session.keyForModel('meta', model, {}), /meta-refresh-required/)
})

test('learned calls pin OAuth keys and refuse expired, changed, unrefreshed or overridden accounts', async t => {
  const f = setup(t)
  await f.session.refresh()
  const model = f.session.catalog('meta').get(full)
  assert.equal(await f.session.keyForModel('meta', model, {}), 'subscription-key')
  await assert.rejects(f.session.keyForModel('meta', model, { apiKeyEnv: 'PAYG' }), /meta-key-override/)
  await assert.rejects(f.session.keyForModel('meta', { id: full }, {}), /meta-refresh-required/)
  f.record.expires = 0
  await assert.rejects(f.session.keyForModel('meta', model, {}), /meta-refresh-required/)
  f.record = { type: 'oauth', refresh: 'identity-B', access: 'other' }
  await assert.rejects(f.session.keyForModel('meta', model, {}), /meta-refresh-required/)
  await f.session.validate()
  assert.equal(f.session.catalog('meta'), undefined)
})

test('refresh deduplicates concurrent reads and disposal cannot publish an outstanding catalog', async t => {
  let release, started
  const gate = new Promise(resolve => { release = resolve }), began = new Promise(resolve => { started = resolve })
  const f = setup(t, async url => {
    if (url.endsWith('/key')) return json({ is_subs_active: true, api_key: 'key' })
    started(); await gate; return json({ data: [{ id: full }] })
  })
  const pending = f.session.refresh()
  assert.equal(f.session.refresh(), pending)
  await began; f.session.dispose(); release()
  await assert.rejects(pending, /meta-account-changed|meta-refresh-failed/)
  assert.equal(f.session.catalog('meta'), undefined)
})


test('Usage and ten catalog requests share mint work, with independent completed TTLs and source observations', async t => {
  let now = Date.now(), mints = 0, lists = 0, changes = 0
  const f = setup(t, async url => {
    if (url.endsWith('/key')) {
      mints++; await new Promise(resolve => setImmediate(resolve))
      return json({ is_subs_active: true, api_key: 'key', subs_usage: { window: { used_percent: 80, window_duration_mins: 300 }, weekly: { used_percent: 30 } } })
    }
    lists++; return json({ data: [{ id: full }] })
  }, catalogModels, { now: () => now, onChange: () => { changes++ } })
  const requests = Array.from({ length: 10 }, () => f.session.refresh())
  const [usage] = await Promise.all([f.session.usage(), ...requests])
  assert.equal(mints, 1); assert.equal(lists, 1); assert.equal(changes, 1)
  assert.equal(usage.windows[0].usedPercent, 80)
  now += 60000
  const cached = await f.session.usage()
  assert.equal(cached.sourceObservedAt, usage.sourceObservedAt)
  await f.session.refresh()
  assert.equal(mints, 1); assert.equal(lists, 1)
  await f.session.refresh({ force: true })
  assert.equal(mints, 1); assert.equal(lists, 2); assert.equal(changes, 1)
  now += 300000
  await f.session.usage()
  assert.equal(mints, 2); assert.equal(lists, 2); assert.equal(changes, 1)
})

test('SDK standard OAuth token rotation does not remove entitlement or depend on stored custom flags', async t => {
  const f = setup(t)
  f.record.dshPiSubscription = { active: false }
  await f.session.refresh()
  assert.ok(!Object.hasOwn(f.record, 'dshPiSubscription'))
  const model = f.session.catalog('meta').get(full)
  f.record = { type: 'oauth', refresh: 'identity-A', access: 'sdk-rotated-key', expires: Date.now() + 100000 }
  assert.equal(await f.session.keyForModel('meta', model, {}), 'sdk-rotated-key')
  assert.equal(f.session.state().account.active, true)
  assert.equal(f.requests.length, 2)
})

test('Meta Retry-After is shared across Usage and catalog mint, including manual requests', async t => {
  let now = Date.now(), calls = 0
  const f = setup(t, async () => { calls++; return new Response('SECRET', { status: 429, headers: { 'retry-after': '120' } }) }, catalogModels, { now: () => now })
  await assert.rejects(f.session.usage(), error => error.code === 'rate-limited')
  await assert.rejects(f.session.refresh({ force: true }), error => error.code === 'meta-rate-limited')
  await assert.rejects(f.session.usage({ force: true }), error => error.code === 'rate-limited')
  assert.equal(calls, 1)
  assert.equal(f.session.state().retryAt, now + 120000)
  now += 120000
  await assert.rejects(f.session.usage({ force: true }), error => error.code === 'rate-limited')
  assert.equal(calls, 2)
})

test('Meta expired key renewal shares Usage mint and keeps no credentials in cached snapshots', async t => {
  let mints = 0
  const f = setup(t, async url => {
    if (url.endsWith('/key')) { mints++; await new Promise(resolve => setImmediate(resolve)); return json({ is_subs_active: true, api_key: 'renewed-key', private_email: 'private@test' }) }
    return json({ data: [{ id: full }] })
  })
  await f.session.refresh()
  f.record.expires = 0
  const [credential, usage] = await Promise.all([f.session.ensureCredentials(), f.session.usage({ force: true })])
  assert.equal(mints, 2)
  assert.equal(credential.access, 'renewed-key')
  assert.doesNotMatch(JSON.stringify([f.session.state(), f.session.entitlementCache.value, usage]), /renewed-key|identity-A|private@test/)
})


test('Meta authentication failures revoke learned access and preserve actionable safe errors', async t => {
  let authStatus = 200, changes = 0
  const f = setup(t, async url => {
    if (authStatus !== 200) return new Response('SECRET remote authorization detail', { status: authStatus })
    return url.endsWith('/key') ? json({ is_subs_active: true, api_key: 'key' }) : json({ data: [{ id: full }] })
  }, catalogModels, { onChange: () => { changes++ } })
  await f.session.refresh()
  const granted = f.session.catalog('meta').get(full)
  authStatus = 401
  await assert.rejects(f.session.refresh({ force: true }), error => error.code === 'meta-login-required' && error.message === 'meta-login-required')
  assert.equal(f.session.catalog('meta'), undefined)
  assert.equal(changes, 2)
  await assert.rejects(f.session.keyForModel('meta', granted, {}), /meta-refresh-required/)
  f.session.invalidate()
  await assert.rejects(f.session.refresh(), error => error.code === 'meta-login-required')
})


test('model opt-in and effort changes retain the same account entitlement and Full grant', async t => {
  const f = setup(t)
  await f.session.refresh()
  const model = f.session.catalog('meta').get(full), version = f.session.version
  f.profile = { enabledDiscoveredModels: [full], reasoning: 'high', disabledModels: [] }
  await f.session.validate()
  assert.equal(f.session.version, version)
  assert.equal(await f.session.keyForModel('meta', model, { enabledDiscoveredModels: [full] }), 'subscription-key')
  assert.equal(f.session.catalog('meta').get(full), model)
  assert.equal(f.requests.length, 2)
  f.profile = { enabledDiscoveredModels: [full], headerRefs: { Authorization: 'OTHER_ACCOUNT_KEY' } }
  await f.session.validate()
  assert.equal(f.session.catalog('meta'), undefined)
  await assert.rejects(f.session.keyForModel('meta', model, { headerRefs: { Authorization: 'OTHER_ACCOUNT_KEY' } }), /meta-settings-incompatible|meta-refresh-required/)
})
