import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MuseCodeCatalogSession, parseMuseCatalog, museModels, mergeMuseModes, offeredMuseEfforts, museCatalogProvider, MUSE_CODE_MODELS_URL, MUSE_CODE_KEY_URL } from '../src/muse-code-catalog.mjs'
import { MUSE_CONTRIBUTOR, MUSE_CONTRIBUTOR_CAPS, MUSE_DEFAULT_EFFORT, MUSE_EFFORTS_UNVERIFIED } from '../src/catalog-metadata.mjs'
import { modelChoices } from '../src/runtime/fast.ts'
import { getSupportedThinkingLevels } from '../src/runtime/models.ts'

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
  assert.deepEqual(rows[1].efforts, [])
  assert.equal(rows[1].effortsUnverified, true)
  assert.equal(rows[1].efforts.includes('max'), false)
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

const levels = model => getSupportedThinkingLevels(model)

test('the same model ID keeps Standard and Contributor effort limits apart', async () => {
  const efforts = values => ({ reasoning_effort_variants: values.map(effort => ({ effort })) })
  const f = setup({
    standard: { data: [
      { ...row('muse-wonder-1.0', efforts(['high', 'xhigh', 'max'])), defaultReasoningEffort: 'max', output_limit: 131072 },
      { ...row('muse-wonder-full-1.0', efforts(['high', 'xhigh', 'max'])), default_reasoning_effort: 'max', output_limit: 65536, context_limit: 1048576 },
    ] },
    contributor: { data: [
      { ...row('muse-wonder-1.0', efforts(['high', 'xhigh'])), defaultReasoningEffort: 'high', output_limit: 65536 },
      { ...row('muse-wonder-full-1.0', efforts(['high', 'xhigh'])), defaultReasoningEffort: 'xhigh', output_limit: 32768, context_limit: 524288 },
    ] },
  })
  await f.session.refresh()
  const saved = f.persisted.at(-1)
  const wonder = saved.find(entry => entry.id === 'muse-wonder-1.0')
  const full = saved.find(entry => entry.id === 'muse-wonder-full-1.0')
  assert.deepEqual(wonder.efforts, ['high', 'xhigh', 'max'])
  assert.equal(wonder.defaultEffort, 'max')
  assert.deepEqual(wonder.contributorMode.efforts, ['high', 'xhigh'])
  assert.equal(wonder.contributorMode.defaultEffort, 'high')
  assert.equal(wonder.contributorMode.maxTokens, 65536)
  assert.deepEqual(full.efforts, ['high', 'xhigh', 'max'])
  assert.equal(full.maxTokens, 65536)
  assert.deepEqual(full.contributorMode.efforts, ['high', 'xhigh'])
  assert.equal(full.contributorMode.maxTokens, 32768)
  assert.equal(full.contributorMode.contextWindow, 524288)
  assert.equal(full.contributorMode.defaultEffort, 'xhigh')
  assert.doesNotMatch(JSON.stringify(saved), /key-a|identity-a|catalogDefault/)
  const choices = modelChoices('meta', [...f.session.catalog().values()], { enabledContributorModels: ['muse-wonder-1.0::contributor', 'muse-wonder-full-1.0::contributor'] })
  for (const id of ['muse-wonder-1.0', 'muse-wonder-full-1.0']) {
    const standard = choices.find(choice => choice.id === id)
    const contributor = choices.find(choice => choice.id === `${id}::contributor`)
    assert.equal(standard.model.id, id)
    assert.equal(contributor.model.id, id)
    assert.equal(contributor.model.maxTokens, id.endsWith('full-1.0') ? 32768 : 65536)
    assert.ok(levels(standard.model).includes('max'))
    assert.equal(levels(contributor.model).includes('max'), false)
    assert.equal(contributor.effortsUnverified, undefined)
    assert.equal(contributor.model[MUSE_DEFAULT_EFFORT], id.endsWith('full-1.0') ? 'xhigh' : 'high')
  }
  assert.equal(choices.filter(choice => choice.id.endsWith('::contributor')).length, 2)
  f.session.dispose()
  const restarted = new MuseCodeCatalogSession({ credentials: { read: async () => f.stored }, snapshot: () => saved })
  const restored = modelChoices('meta', [...restarted.catalog().values()], {})
  assert.equal(levels(restored.find(choice => choice.id === 'muse-wonder-full-1.0').model).includes('max'), true)
  assert.equal(levels(restored.find(choice => choice.id === 'muse-wonder-full-1.0::contributor').model).includes('max'), false)
  assert.equal(restored.find(choice => choice.id === 'muse-wonder-full-1.0::contributor').model.contextWindow, 524288)
  restarted.dispose()
})

test('a native contributor id keeps its efforts and does not add the same-id row as a second choice', async () => {
  const f = setup({
    standard: { data: [row('muse-wonder-1.0', { reasoning_effort_variants: ['high', 'max'], output_limit: 65536 })] },
    contributor: { data: [
      row('muse-wonder-1.0', { reasoning_effort_variants: ['low'], output_limit: 1024 }),
      row('muse-wonder-1.0-contributor', { reasoning_effort_variants: ['high'], output_limit: 32768 }),
    ] },
  })
  await f.session.refresh()
  assert.equal(f.persisted.at(-1).find(entry => entry.id === 'muse-wonder-1.0').contributorMode, undefined)
  const choices = modelChoices('meta', [...f.session.catalog().values()], { enabledContributorModels: ['muse-wonder-1.0::contributor'] })
  const contributor = choices.filter(choice => choice.contributor)
  assert.deepEqual(contributor.map(choice => choice.id), ['muse-wonder-1.0::contributor'])
  assert.equal(contributor[0].model.id, 'muse-wonder-1.0-contributor')
  assert.equal(contributor[0].model.maxTokens, 32768)
  assert.deepEqual(levels(contributor[0].model), ['high'])
  assert.ok(levels(choices.find(choice => choice.id === 'muse-wonder-1.0').model).includes('max'))
  assert.ok(!choices.some(choice => choice.id === 'muse-wonder-1.0-contributor'))
})

test('a missing or unknown effort list does not count as Max, except documented Wonder Standard', async () => {
  const omitted = parseMuseCatalog([{ id: 'muse-wonder-full-1.0' }, { id: 'muse-wonder-1.0', reasoning_effort_variants: ['ultra'] }, { id: 'muse-spark-1.3', reasoning_effort_variants: [] }])
  assert.ok(omitted.every(entry => entry.effortsUnverified === true && !entry.efforts.includes('max')))
  assert.equal(offeredMuseEfforts(omitted[0]).includes('max'), false)
  assert.equal(museModels(omitted).get('muse-wonder-full-1.0')[MUSE_EFFORTS_UNVERIFIED], true)
  const f = setup({
    standard: { data: [{ id: 'muse-wonder-1.0', display_label: 'Muse Wonder' }, { id: 'muse-wonder-full-1.0', display_label: 'Muse Wonder Full', defaultReasoningEffort: 'max' }] },
    contributor: { data: [{ id: 'muse-wonder-1.0', display_label: 'Muse Wonder' }, { id: 'muse-wonder-full-1.0', display_label: 'Muse Wonder Full', defaultReasoningEffort: 'max' }] },
  })
  await f.session.refresh()
  const saved = f.persisted.at(-1)
  const wonder = saved.find(entry => entry.id === 'muse-wonder-1.0')
  const full = saved.find(entry => entry.id === 'muse-wonder-full-1.0')
  assert.deepEqual(wonder.efforts, ['minimal', 'low', 'medium', 'high', 'xhigh', 'max'])
  assert.equal(wonder.effortsUnverified, undefined)
  assert.equal(wonder.contributorMode.effortsUnverified, true)
  assert.equal(wonder.contributorMode.efforts.includes('max'), false)
  assert.equal(wonder.contributorMode.defaultEffort, undefined)
  assert.equal(full.effortsUnverified, true)
  assert.equal(full.contributorMode, undefined)
  assert.equal(full.defaultEffort, undefined)
  const choices = modelChoices('meta', [...f.session.catalog().values()], { enabledContributorModels: ['muse-wonder-1.0::contributor', 'muse-wonder-full-1.0::contributor'] })
  assert.ok(levels(choices.find(choice => choice.id === 'muse-wonder-1.0').model).includes('max'))
  assert.equal(choices.find(choice => choice.id === 'muse-wonder-1.0').effortsUnverified, undefined)
  assert.equal(levels(choices.find(choice => choice.id === 'muse-wonder-1.0::contributor').model).includes('max'), false)
  assert.equal(choices.find(choice => choice.id === 'muse-wonder-1.0::contributor').effortsUnverified, true)
  assert.equal(levels(choices.find(choice => choice.id === 'muse-wonder-full-1.0').model).includes('max'), false)
  assert.equal(choices.find(choice => choice.id === 'muse-wonder-full-1.0').effortsUnverified, true)
  assert.equal(choices.find(choice => choice.id === 'muse-wonder-full-1.0::contributor').model, choices.find(choice => choice.id === 'muse-wonder-full-1.0').model)
})

test('an explicit Wonder Standard effort list is not widened to the documented range', async () => {
  const listed = parseMuseCatalog([{ id: 'muse-wonder-1.0', reasoning_effort_variants: ['high'] }])
  assert.deepEqual(listed[0].efforts, ['high'])
  assert.equal(listed[0].effortsUnverified, undefined)
  const f = setup({ standard: { data: [{ id: 'muse-wonder-1.0', reasoning_effort_variants: ['high'] }] }, contributor: { data: [] } })
  await f.session.refresh()
  assert.deepEqual(f.persisted.at(-1)[0].efforts, ['high'])
  assert.equal(levels(f.session.catalog().get('muse-wonder-1.0')).includes('max'), false)
})

test('an explicit Contributor max in the account list is kept', () => {
  const [standard, contributor] = [
    parseMuseCatalog([{ id: 'muse-wonder-full-1.0', reasoning_effort_variants: ['high', 'max'] }]),
    parseMuseCatalog([{ id: 'muse-wonder-full-1.0', reasoning_effort_variants: ['high', 'max'] }]),
  ].map(rows => rows.map(row => { const next = { ...row }; delete next.catalogDefault; return next }))
  const merged = mergeMuseModes(standard, contributor)
  assert.equal(merged[0].contributorMode, undefined)
  assert.equal(museModels(merged).get('muse-wonder-full-1.0')[MUSE_CONTRIBUTOR_CAPS], undefined)
  assert.ok(levels(museModels(merged).get('muse-wonder-full-1.0')).includes('max'))
})

test('a failed Contributor listing rejects instead of publishing an incomplete catalog', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: new Response('no', { status: 403 }) })
  await assert.rejects(f.session.refresh(), error => error.code === 'auth-required')
  assert.equal(f.persisted.length, 0)
})

test('native Contributor IDs returned only in mode 1 keep their distinct provider capabilities and persist', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-full-1.0')] },
    contributor: { data: [row('muse-wonder-full-1.0-contributor', { output_limit: 32768 })] } })
  await f.session.refresh()
  const rows = f.persisted.at(-1)
  assert.deepEqual(rows.map(row => row.id), ['muse-wonder-full-1.0', 'muse-wonder-full-1.0-contributor'])
  assert.equal(rows[1].maxTokens, 32768)
  assert.equal(f.session.catalog().get(rows[1].id).id, rows[1].id)
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

test('a new sign-in hides the saved account catalog when its refresh fails', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [] } })
  await f.session.refresh()
  f.stored = { ...f.stored, refresh: 'identity-b', access: 'key-b' }
  f.session.invalidate()
  f.session.fetch = async () => { throw new Error('offline') }
  await assert.rejects(f.session.refresh(), error => error.code === 'error')
  assert.deepEqual([...f.session.catalog().keys()], [])
  assert.equal(f.persisted.length, 1)
})

test('a same-account offline restart retains its saved catalog', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [] } })
  await f.session.refresh()
  const saved = structuredClone(f.persisted.at(-1))
  f.session.dispose()
  const restarted = new MuseCodeCatalogSession({ credentials: { read: async () => f.stored }, snapshot: () => saved,
    fetch: async () => { throw new Error('offline') } })
  await restarted.validate()
  assert.deepEqual([...restarted.catalog().keys()], ['muse-wonder-1.0'])
  await assert.rejects(restarted.refresh(), error => error.code === 'error')
  assert.deepEqual([...restarted.catalog().keys()], ['muse-wonder-1.0'])
  restarted.dispose()
})

test('a failed catalog save rejects and retains the previous durable and published catalog', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [row('muse-wonder-1.0')] } })
  await f.session.refresh()
  const before = [...f.session.catalog().keys()]
  f.session.fetch = async () => Response.json({ data: [row('muse-spark-1.3')] })
  f.session.persist = async () => { throw new Error('disk failure SECRET') }
  await assert.rejects(f.session.refresh(), error => error.code === 'error' && error.message === 'error')
  assert.deepEqual([...f.session.catalog().keys()], before)
  assert.deepEqual(f.persisted.at(-1).map(entry => entry.id), before)
  assert.equal(f.session.state().error, 'error')
})

test('a transient Contributor-mode failure preserves the complete previous choices', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [row('muse-wonder-1.0')] } })
  await f.session.refresh()
  f.session.fetch = async (_url, init) => new Headers(init.headers).get('x-tbh-contributor-mode') === '1'
    ? new Response('', { status: 429, headers: { 'retry-after': '60' } }) : Response.json({ data: [row('muse-spark-1.3')] })
  await assert.rejects(f.session.refresh(), error => error.code === 'rate-limited')
  assert.equal(f.session.catalog().get('muse-wonder-1.0')[MUSE_CONTRIBUTOR], true)
  assert.equal(f.persisted.length, 1)
})

test('an account switched during a delayed save is never published or reused as a saved fallback', async () => {
  const f = setup({ standard: { data: [row('muse-wonder-1.0')] }, contributor: { data: [] } })
  let started, release
  const saving = new Promise(resolve => { started = resolve })
  const saved = new Promise(resolve => { release = resolve })
  const persist = f.session.persist
  f.session.persist = async rows => { started(); await saved; await persist(rows) }
  const pending = f.session.refresh()
  await saving
  f.stored = { ...f.stored, refresh: 'identity-b' }
  release()
  await assert.rejects(pending, error => error.code === 'account-changed')
  assert.deepEqual([...f.session.catalog().keys()], [])
})

test('a late old-account quota response never publishes its tier or minted key', async () => {
  const f = setup()
  let started, release
  const fetching = new Promise(resolve => { started = resolve })
  const response = new Promise(resolve => { release = resolve })
  f.session.fetch = async () => { started(); return response }
  const pending = f.session.usage()
  await fetching
  f.stored = { ...f.stored, refresh: 'identity-b', access: 'key-b' }
  release(Response.json({ is_subs_active: true, subs_tier_name: 'Other account tier', api_key: 'key-a-minted' }))
  await assert.rejects(pending, error => error.code === 'account-changed')
  assert.equal(f.session.state().account, undefined)
  assert.equal(f.stored.access, 'key-b')
})

test('disposal while a quota request ignores cancellation cannot publish a subscription or key', async () => {
  const f = setup()
  let started, release
  const fetching = new Promise(resolve => { started = resolve })
  const response = new Promise(resolve => { release = resolve })
  f.session.fetch = async () => { started(); return response }
  const pending = f.session.usage()
  await fetching
  f.session.dispose()
  release(Response.json({ is_subs_active: true, subs_tier_name: 'Power Usage', api_key: 'key-minted' }))
  await assert.rejects(pending, error => error.code === 'aborted')
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(f.session.state().account, undefined)
  assert.equal(f.stored.access, 'key-a')
})

test('a fresh quota cache is not reused after an external grant replacement', async () => {
  const f = setup()
  await f.session.usage()
  f.stored = { ...f.stored, refresh: 'identity-b', access: 'key-b' }
  f.session.fetch = async () => Response.json({ is_subs_active: false, subs_tier_name: 'New account tier' })
  await f.session.usage()
  assert.deepEqual(f.session.state().account, { active: false, tierName: 'New account tier' })
  assert.equal(f.stored.access, 'key-b')
})

test('identity checks cannot hang quota reads beyond the provider timeout', async t => {
  const session = new MuseCodeCatalogSession({ credentials: { read: () => new Promise(() => {}) }, timeout: 15 })
  const keepAlive = setTimeout(() => {}, 50)
  t.after(() => { clearTimeout(keepAlive); session.dispose() })
  await assert.rejects(session.usage(), error => error.code === 'error')
})

test('disposal cancels an identity read even when the credential store ignores cancellation', async () => {
  const session = new MuseCodeCatalogSession({ credentials: { read: () => new Promise(() => {}) } })
  const pending = session.usage()
  session.dispose()
  await assert.rejects(pending, error => error.code === 'aborted')
})

test('a credential-store failure has a fixed public error without raw diagnostics', async () => {
  const session = new MuseCodeCatalogSession({ credentials: { read: () => { throw Error('SECRET credential diagnostic') } } })
  await assert.rejects(session.usage(), error => error.code === 'error' && error.message === 'error')
  session.dispose()
})


test('tier-shaped efforts preserve mode-specific ranges, defaults and limits', async () => {
  const f = setup({
    standard: { data: [row('muse-spark-1.3', { reasoning_effort_variants: [{ tier: 'high', description: 'Deep' }, { tier: 'max', description: 'Most' }], default_reasoning_effort: 'max', context_limit: 1048576, output_limit: 65536 })] },
    contributor: { data: [row('muse-spark-1.3', { reasoning_effort_variants: [{ tier: 'high', description: 'Deep' }], default_reasoning_effort: 'high', context_limit: 524288, output_limit: 32768 })] },
  })
  await f.session.refresh()
  const [saved] = f.persisted.at(-1)
  assert.deepEqual(saved.efforts, ['high', 'max'])
  assert.equal(saved.defaultEffort, 'max')
  assert.deepEqual(saved.contributorMode.efforts, ['high'])
  assert.equal(saved.contributorMode.defaultEffort, 'high')
  assert.equal(saved.contributorMode.contextWindow, 524288)
  assert.equal(saved.contributorMode.maxTokens, 32768)
  const unknown = parseMuseCatalog([{ id: 'muse-spark-1.3', reasoning_effort_variants: [{ tier: 'ultra' }, { description: 'high' }, { tier: 123 }] }])
  assert.equal(unknown[0].effortsUnverified, true)
  assert.deepEqual(unknown[0].efforts, [])
  f.session.dispose()
})

test('subscription presentation distinguishes active, inactive and unknown even without a tier name', () => {
  for (const [active, expected] of [[true, 'metaSubscriptionActive'], [false, 'metaSubscriptionInactive'], [null, 'metaSubscriptionUnknown'], [undefined, 'metaSubscriptionUnknown']]) {
    for (const tierName of ['Power Usage', undefined]) {
      const provider = museCatalogProvider({ state: () => ({ count: 0, account: { active, tierName } }) })
      assert.equal(provider.presentation().status.message, expected)
      assert.equal(provider.presentation().status.detail, tierName)
    }
  }
  assert.equal(museCatalogProvider({ state: () => ({ count: 0 }) }).presentation().status, undefined)
})

test('a refreshed native Contributor ID replaces the same-ID descriptor under the saved choice', async () => {
  const id = 'muse-spark-1.3', choiceId = `${id}::contributor`
  const f = setup({ standard: { data: [row(id)] }, contributor: { data: [row(id, { reasoning_effort_variants: ['high'] })] } })
  const profile = { enabledContributorModels: [choiceId] }
  await f.session.refresh()
  let choices = modelChoices('meta', [...f.session.catalog().values()], profile)
  assert.equal(choices.find(choice => choice.id === choiceId).model.id, id)
  assert.deepEqual(levels(choices.find(choice => choice.id === choiceId).model), ['high'])
  f.session.fetch = async (_url, init) => Response.json({ data: new Headers(init.headers).get('x-tbh-contributor-mode') === '1'
    ? [row(id), row(`${id}-contributor`, { reasoning_effort_variants: [{ tier: 'high' }, { tier: 'max' }], default_reasoning_effort: 'max', output_limit: 32768 })]
    : [row(id)] })
  await f.session.refresh()
  choices = modelChoices('meta', [...f.session.catalog().values()], profile)
  const contributor = choices.find(choice => choice.id === choiceId)
  assert.equal(contributor.enabled, true)
  assert.equal(contributor.model.id, `${id}-contributor`)
  assert.equal(contributor.model.maxTokens, 32768)
  assert.equal(contributor.model[MUSE_DEFAULT_EFFORT], 'max')
  assert.deepEqual(levels(contributor.model), ['high', 'max'])
  assert.equal(choices.filter(choice => choice.contributor).length, 1)
  const off = modelChoices('meta', [...f.session.catalog().values()], { enabledContributorModels: [] })
  assert.equal(off.find(choice => choice.id === choiceId).enabled, false)
  assert.equal(off.find(choice => choice.id === id).headers['x-tbh-contributor-mode'], '0')
  f.session.dispose()
})
