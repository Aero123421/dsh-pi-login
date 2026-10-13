import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MuseCodeCatalogSession, parseMuseCatalog, museModels, MUSE_CODE_MODELS_URL, MUSE_CODE_KEY_URL } from '../src/muse-code-catalog.mjs'
import { MUSE_CONTRIBUTOR } from '../src/catalog-metadata.mjs'

const row = (id, extra = {}) => ({ id, provider_id: 'meta', display_label: id.replace(/-/g, ' '), context_limit: 1048576, output_limit: 65536,
  reasoning_effort_variants: [{ effort: 'low' }, { effort: 'high' }, { effort: 'max' }], ...extra })

function setup({ standard, contributor, credential = { type: 'oauth', refresh: 'identity-a', access: 'key-a', expires: Date.now() + 100000 } } = {}) {
  let stored = structuredClone(credential), snapshot
  const requests = [], persisted = []
  const credentials = {
    async read(provider) { return provider === 'meta' ? structuredClone(stored) : undefined },
    async modify(provider, mutate) { stored = await mutate(structuredClone(stored)); return stored },
  }
  const session = new MuseCodeCatalogSession({
    credentials, snapshot: () => snapshot, persist: async rows => { persisted.push(rows); snapshot = rows },
    fetch: async (url, init) => {
      const headers = new Headers(init.headers)
      requests.push({ url, mode: headers.get('x-tbh-contributor-mode'), authorization: headers.get('authorization') })
      if (url === MUSE_CODE_KEY_URL) return Response.json({ is_subs_active: true, subs_tier_name: 'Power Usage', api_key: 'key-minted',
        subs_usage: { window: { used_percent: 12, window_duration_mins: 300, resets_at: 1_900_000_000 }, weekly: { used_percent: 40, resets_at: 1_900_500_000 } } })
      const body = headers.get('x-tbh-contributor-mode') === '1' ? contributor : standard
      return body instanceof Response ? body : Response.json(body)
    },
  })
  return { session, requests, persisted, get stored() { return stored }, set stored(value) { stored = value } }
}

test('the Muse Code catalog accepts documented row shapes and skips non-chat and hidden models', () => {
  const rows = parseMuseCatalog({ data: [row('muse-wonder-1.0'), { model_id: 'muse-wonder-full-1.0', name: 'Muse Wonder Full' },
    row('muse-image-1.0'), row('internal-x', { visibility: 'hidden' }), { id: 'bad id' }, row('muse-wonder-1.0')] })
  assert.deepEqual(rows.map(entry => entry.id), ['muse-wonder-1.0', 'muse-wonder-full-1.0'])
  assert.deepEqual(rows[0].efforts, ['low', 'high', 'max'])
  assert.equal(rows[0].maxTokens, 65536)
  assert.equal(rows[1].name, 'Muse Wonder Full')
  assert.deepEqual(rows[1].efforts, ['minimal', 'low', 'medium', 'high', 'xhigh', 'max'])
  assert.deepEqual(parseMuseCatalog([row('muse-spark-1.3')]).map(entry => entry.id), ['muse-spark-1.3'])
  assert.deepEqual(parseMuseCatalog({ models: [row('muse-spark-1.3')] }).map(entry => entry.id), ['muse-spark-1.3'])
  const model = museModels(rows).get('muse-wonder-1.0')
  assert.equal(model.api, 'openai-responses')
  assert.equal(model.baseUrl, 'https://api.meta.ai/v1')
  assert.deepEqual(model.thinkingLevelMap, { off: null, minimal: null, low: 'low', medium: null, high: 'high', xhigh: null, max: 'max' })
  assert.equal(model[MUSE_CONTRIBUTOR], false)
})

test('refresh lists both modes, offers Contributor only where the account lists it, and persists the result', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0'), row('muse-wonder-full-1.0'), row('muse-spark-1.1')] },
    contributor: { data: [row('muse-wonder-1.0'), row('muse-wonder-full-1.0')] } })
  await f.session.refresh()
  assert.deepEqual(f.requests.map(request => [request.url, request.mode, request.authorization]), [
    [MUSE_CODE_MODELS_URL, '0', 'Bearer key-a'], [MUSE_CODE_MODELS_URL, '1', 'Bearer key-a']])
  assert.deepEqual(f.persisted.at(-1).map(entry => [entry.id, entry.contributor]),
    [['muse-wonder-1.0', true], ['muse-wonder-full-1.0', true], ['muse-spark-1.1', false]])
  const catalog = f.session.catalog()
  assert.equal(catalog.get('muse-wonder-full-1.0')[MUSE_CONTRIBUTOR], true)
  assert.doesNotMatch(JSON.stringify(f.persisted), /key-a|identity-a/)
})

test('a failed Contributor listing still loads Standard models without Contributor choices', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: new Response('no', { status: 403 }) })
  await f.session.refresh()
  assert.deepEqual(f.persisted.at(-1).map(entry => entry.contributor), [false])
})

test('an empty or unauthorized catalog is an error and keeps the previous models', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [] } })
  await f.session.refresh()
  const before = f.session.catalog()
  const empty = setup({ standard: { data: [] }, contributor: { data: [] } })
  await assert.rejects(empty.session.refresh(), error => error.code === 'error')
  const denied = setup({ standard: new Response('no', { status: 401 }) })
  await assert.rejects(denied.session.refresh(), error => error.code === 'auth-required')
  assert.deepEqual([...f.session.catalog().keys()], [...before.keys()])
})

test('an expired key is renewed by the SDK before listing, and a missing login is reported', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [] },
    credential: { type: 'oauth', refresh: 'identity-a', access: 'old', expires: Date.now() - 1 } })
  let renewed = 0
  f.session.refreshAuth = async () => { renewed++; f.stored = { ...f.stored, access: 'renewed', expires: Date.now() + 100000 } }
  await f.session.refresh()
  assert.equal(renewed, 1)
  assert.equal(f.requests[0].authorization, 'Bearer renewed')
  const signedOut = setup({ standard: { data: [] }, credential: null })
  await assert.rejects(signedOut.session.refresh(), error => error.code === 'auth-required')
})

test('an account switched during refresh never persists the other account catalog', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [] } })
  const original = f.session.fetch
  f.session.fetch = async (url, init) => { f.stored = { ...f.stored, refresh: 'identity-b' }; return original(url, init) }
  await assert.rejects(f.session.refresh(), error => error.code === 'account-changed')
  assert.equal(f.persisted.length, 0)
})

test('usage reads the subscription quota and keeps the freshly minted key for the same account', async () => {
  const f = setup()
  const usage = await f.session.usage()
  assert.equal(usage.windows.length, 2)
  assert.equal(usage.windows[0].usedPercent, 12)
  assert.equal(f.stored.access, 'key-minted')
  assert.equal(f.requests[0].authorization, 'Bearer identity-a')
  assert.equal(f.session.state().account.tierName, 'Power Usage')
})
