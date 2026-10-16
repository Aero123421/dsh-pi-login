import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { parse } from 'yaml'
import { getBuiltinModels, getBuiltinProviders } from '@earendil-works/pi-ai/providers/all'
const { Context, AuthorizationService, MemoryCredentials, HostConnectionService, PiPlugin, applyEntryPatches } = await import('../.cache/official-host.mjs')

const original = [{ id: 'llm-pi-ai', name: '@deepseek-ai/dsh-llm-pi-ai', config: { providers: { deepseek: {} } } }]
const warnings = []
const composed = applyEntryPatches(original, parse(await readFile('cordis.patch.yml', 'utf8')), (...args) => warnings.push(args))
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
const sdkModels = getBuiltinModels('deepseek')
const legacy = { deepseek: { baseURL, disabledModels: sdkModels.length > 1 ? [sdkModels.at(-1).id] : [], reasoning: 'high' } }
const ctx = new Context()
await ctx.plugin(MemoryCredentials); await ctx.plugin(AuthorizationService)
await ctx.plugin(pluginCtx => { new HostConnectionService(pluginCtx, [], { isAuthenticated: () => true }) })
await ctx.credentials.modifyRecord('llm-pi-ai/deepseek', () => ({ kind: 'api-key', key: 'runtime-existing-key' }))
let config, revision = 0, active = [], adapter, directory = [], replacements = 0
const volatileWrite = Symbol.for('cosmokit.volatile.write')
const fields = ['providers', 'legacyImported', 'connectionMigrationVersion', 'connections', 'trustedEndpointOrigins']
const snapshot = () => Object.fromEntries(fields.map(key => [key, structuredClone(config[key].get())]))
ctx.provide('configEditor', { entries: () => [{ options: { id: 'llm-pi-ai', config: { providers: legacy } } }] })
// Only persistence and LLM registration are doubles. Cordis, schemas,
// Authorization, Credentials, Connection, the shipped plugin and Pi are real.
ctx.provide('settings', {
  configure: (_options, fiber) => { config = fiber.config; return () => {} },
  describe: () => [{ ns: 'dsh-pi-login', revision, writable: true, value: snapshot() }],
  mutate: async (ns, operations, expected) => {
    assert.equal(ns, 'dsh-pi-login'); assert.equal(expected, revision)
    const value = snapshot()
    for (const operation of operations) {
      let parent = value
      for (const key of operation.path.slice(0, -1)) parent = parent[key] ??= {}
      const key = operation.path.at(-1)
      if (operation.op === 'unset') delete parent[key]
      else if (operation.op === 'set') parent[key] = structuredClone(operation.value)
      else throw new Error(`Unexpected settings operation ${operation.op}`)
    }
    const next = PiPlugin.Config(value)
    for (const key of fields) config[key][volatileWrite](next[key].get())
    revision++
    ctx.emit('settings/document-updated', ns, revision)
  },
})
ctx.provide('llm', {
  registerConfigurableProviders: entries => { directory = entries; return { replace: entries => { directory = entries } } },
  registerModelDiscovery: () => () => {},
  registerAdapter: (providers, instance) => { active = providers; adapter = instance; return { replace: providers => { active = providers; replacements++ } } },
})
const plugin = ctx.plugin(PiPlugin, { trustedEndpointOrigins: [baseURL] }); await plugin.await(); config = plugin.config
const pause = () => new Promise(resolve => setImmediate(resolve))
await pause(); await pause()
const handler = ctx.connection.createSharedFetchHandler('/api')
let identity
async function call(method, payload = {}) {
  const endpoint = `dsh-pi-login/${method}`
  const response = await handler.fetch(new Request(`http://localhost/api/${endpoint}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'client-request', rpcId: 'runtime-fixture', method: endpoint, payload: { ...identity, ...payload } }) }))
  const value = await response.json()
  assert.equal(value.result.ok, true, JSON.stringify(value))
  return value.result.value
}
async function listing() {
  const value = await call('connection-list')
  identity = { profileKey: value.profileKey, generation: value.generation }
  assert.doesNotMatch(JSON.stringify(value), /runtime-existing-key|runtime-new-key|runtime-connection-key/)
  return value
}
try {
  assert.equal(config.legacyImported.get(), true)
  assert.equal(config.connectionMigrationVersion.get(), 1)
  assert.deepEqual(config.providers.get(), {})
  const initial = await listing()
  assert.equal(initial.connections.length, 1)
  const migrated = initial.connections[0], id = migrated.connectionId
  assert.equal(migrated.routeId, 'deepseek')
  assert.equal(migrated.key, 'llm-pi-ai/deepseek')
  assert.deepEqual(config.connections.get()[id].profile.disabledModels, legacy.deepseek.disabledModels)
  assert.equal(config.connections.get()[id].profile.reasoning, 'high')
  assert.equal((await ctx.credentials.listRecords()).length, 1, 'Migration must retain the existing record without a secret copy')
  assert.deepEqual(active, ['deepseek'])
  assert.equal(directory.length, 0, 'Connection profiles must not appear in the native provider editor')
  assert.ok(initial.services.length >= getBuiltinProviders().length - 3)
  assert.ok(directory.every(entry => entry.settingsNs === 'dsh-pi-login'))
  for (const provider of getBuiltinProviders()) {
    if (!getBuiltinModels(provider).length) continue
    const profile = PiPlugin.resolveProfiles({ [provider]: {} }, 'strict').get(provider)
    const expected = getBuiltinModels(provider).map(model => model.id)
    if (provider === 'meta' && !expected.includes('muse-wonder-1.0')) expected.push('muse-wonder-1.0')
    assert.deepEqual(profile.piProvider.getModels().map(model => model.id), expected, provider)
  }
  const runtimeModels = await adapter.listModels('deepseek')
  assert.ok(runtimeModels.some(model => model.id === sdkModels[0].id))
  assert.ok(!runtimeModels.some(model => legacy.deepseek.disabledModels.includes(model.id)))
  const result = []
  for await (const chunk of adapter.stream({ provider: 'deepseek', model: sdkModels[0].id, messages: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }] })) result.push(chunk)
  assert.equal(result.filter(chunk => chunk.type === 'text-delta').map(chunk => chunk.text).join(''), 'hello')
  assert.equal(requests[0].headers.authorization, 'Bearer runtime-existing-key')
  assert.equal(requests[0].body.model, sdkModels[0].id)

  const models = await call('models', { connectionId: id })
  await call('set-model', { connectionId: id, model: sdkModels[0].id, enabled: false, revision: models.revision })
  assert.ok(!(await adapter.listModels('deepseek')).some(model => model.id === sdkModels[0].id))
  await assert.rejects(adapter.resolveModel('deepseek', sdkModels[0].id))
  await call('set-model', { connectionId: id, model: sdkModels[0].id, enabled: true, revision })
  await call('connection-update', { connectionId: id, patch: { enabled: false }, revision })
  assert.deepEqual(active, [])
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/deepseek')).key, 'runtime-existing-key')
  await call('connection-update', { connectionId: id, patch: { enabled: true }, revision })
  assert.deepEqual(active, ['deepseek'])

  const created = await call('connection-create', { integrationId: 'pi', serviceId: 'deepseek', authMethod: 'api-key', displayName: 'Second gateway', endpointUrl: baseURL, apiKey: 'runtime-connection-key', revision })
  const second = (await listing()).connections.find(entry => entry.connectionId === created.connectionId)
  assert.notEqual(second.routeId, 'deepseek')
  assert.equal(active.length, 2)
  const secondResult = []
  for await (const chunk of adapter.stream({ provider: second.routeId, model: sdkModels[0].id, messages: [{ role: 'user', content: [{ type: 'text', text: 'second' }] }] })) secondResult.push(chunk)
  assert.ok(secondResult.some(chunk => chunk.type === 'text-delta'))
  assert.equal(requests.at(-1).headers.authorization, 'Bearer runtime-connection-key')
  assert.equal(secondResult.find(chunk => chunk.type === 'finish').replayState.response.scope.connectionId, second.connectionId)
  await call('connection-update', { connectionId: second.connectionId, patch: { apiKey: 'runtime-new-key' }, revision })
  assert.equal((await listing()).connections.find(entry => entry.connectionId === second.connectionId).credentialGeneration, 1)
  await call('connection-delete', { connectionId: second.connectionId, revision })
  assert.deepEqual(active, ['deepseek'])
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/deepseek')).key, 'runtime-existing-key')

  const oauth = await call('connection-create', { integrationId: 'pi', serviceId: 'openai', authMethod: 'oauth', displayName: 'Subscription', revision })
  const oauthEntry = (await listing()).connections.find(entry => entry.connectionId === oauth.connectionId)
  assert.ok(ctx.authorization.describe(oauthEntry.key).methods.some(method => method.id === 'oauth'))
  assert.equal(oauthEntry.configured, false)
  await call('connection-delete', { connectionId: oauth.connectionId, revision })
  assert.ok(replacements >= 4)
  assert.deepEqual(legacy.deepseek.disabledModels, sdkModels.length > 1 ? [sdkModels.at(-1).id] : [])

  // Pi's Meta Model API account catalog is distinct from Muse Code MSP.
  // Only its HTTP responses are fixtures; the RPC and SDK are shipped code.
  const meta = await call('connection-create', { integrationId: 'pi', serviceId: 'meta', authMethod: 'oauth', displayName: 'Model API subscription', revision })
  const metaEntry = (await listing()).connections.find(entry => entry.connectionId === meta.connectionId)
  await ctx.credentials.modifyRecord(metaEntry.key, () => ({ kind: 'grant', payload: { type: 'oauth', refresh: 'runtime-meta-identity', access: 'runtime-meta-old', expires: Date.now() + 100000 } }))
  await call('connection-update', { connectionId: meta.connectionId, patch: { enabled: true }, revision })
  const full = 'muse-wonder-full-1.0', metaRequests = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (input, init) => {
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
    return new Response([
      { type: 'response.created', response: { id: 'resp_full', model: full } },
      { type: 'response.output_item.added', output_index: 0, item: { ...item, content: [] } },
      { type: 'response.content_part.added', output_index: 0, content_index: 0, part: { type: 'output_text', text: '', annotations: [] } },
      { type: 'response.output_text.delta', output_index: 0, content_index: 0, delta: 'full-fixture' },
      { type: 'response.output_item.done', output_index: 0, item },
      { type: 'response.completed', response: { id: 'resp_full', model: full, status: 'completed', output: [item], usage: { input_tokens: 3, output_tokens: 1, total_tokens: 4 } } },
    ].map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join(''), { headers: { 'content-type': 'text/event-stream' } })
  }
  try {
    const refreshed = await call('refresh-models', { connectionId: meta.connectionId })
    assert.equal(refreshed.refresh.status.detail, 'Maximum Usage')
    assert.equal(refreshed.models.find(model => model.id === full).enabled, false)
    assert.doesNotMatch(JSON.stringify(refreshed), /runtime-meta-identity|runtime-meta-minted/)
    assert.equal((await ctx.credentials.readRecord(metaEntry.key)).payload.access, 'runtime-meta-minted', 'Minted access is stored in the owned Credentials record')
    await call('set-model', { connectionId: meta.connectionId, model: full, enabled: true, revision: refreshed.revision })
    assert.ok((await adapter.listModels(metaEntry.routeId)).some(model => model.id === full))
    const prepared = await adapter.prepareCall(metaEntry.routeId, full)
    const result = []
    for await (const chunk of prepared.stream({ provider: metaEntry.routeId, model: full, reasoningEffort: 'high', messages: [{ role: 'user', content: [{ type: 'text', text: 'fixture' }] }] })) result.push(chunk)
    assert.equal(result.filter(chunk => chunk.type === 'text-delta').map(chunk => chunk.text).join(''), 'full-fixture')
    assert.deepEqual(metaRequests.map(request => request.authorization), ['Bearer runtime-meta-identity', 'Bearer runtime-meta-minted', 'Bearer runtime-meta-minted'])
    assert.ok(metaRequests.every(request => request.version === '1.0.0'))
    await ctx.credentials.modifyRecord(metaEntry.key, () => ({ kind: 'grant', payload: { type: 'oauth', refresh: 'runtime-meta-other-identity', access: 'runtime-meta-other-key', expires: Date.now() + 100000 } }))
    const count = metaRequests.length
    await assert.rejects(async () => { for await (const _ of prepared.stream({ provider: metaEntry.routeId, model: full, messages: [] })) {} }, error => error.code === 'meta-refresh-required')
    assert.equal(metaRequests.length, count)
    const changed = await call('models', { connectionId: meta.connectionId })
    assert.ok(!changed.models.some(model => model.id === full))
    assert.ok(!(await adapter.listModels(metaEntry.routeId)).some(model => model.id === full))
    console.log('Pi Meta Model API: connection-scoped RPC/catalog, owned Credentials mint, explicit Full opt-in, real SDK fixture stream and account-change rejection passed; Muse Code MSP and live accounts are not exercised')
  } finally { globalThis.fetch = originalFetch }
  // Meta's Muse Code subscription: Pi's Meta sign-in and SDK stream, Muse Code's
  // own catalog and per-request Contributor header. Only HTTP is a fixture.
  {
    const muse = await call('connection-create', { integrationId: 'meta-muse-code', serviceId: 'muse-code', authMethod: 'oauth', displayName: 'Muse subscription', revision })
    let entry = (await listing()).connections.find(row => row.connectionId === muse.connectionId)
    assert.equal(entry.key, `llm-pi-ai/${config.connections.get()[muse.connectionId].credentialRecordId}`)
    assert.ok(ctx.authorization.describe(entry.key)?.methods.some(method => method.id === 'oauth'), 'Muse Code uses the SDK Meta sign-in flow')
    await ctx.credentials.modifyRecord(entry.key, () => ({ kind: 'grant', payload: { type: 'oauth', refresh: 'runtime-muse-identity', access: 'runtime-muse-key', expires: Date.now() + 3600000 } }))
    await call('connection-update', { connectionId: muse.connectionId, patch: { enabled: true }, revision })
    const route = config.connections.get()[muse.connectionId].routeId
    const museRequests = []
    let nativeCatalog = false, heldListing
    const catalogRow = (id, name, efforts = ['low', 'high'], limits = {}) => ({
      id, display_label: name, context_limit: limits.context ?? 1048576, output_limit: limits.output ?? 65536,
      reasoning_effort_variants: efforts.map(effort => ({ effort })),
      ...limits.defaultEffort ? { defaultReasoningEffort: limits.defaultEffort } : {},
    })
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (input, init) => {
      const url = new URL(input instanceof Request ? input.url : input)
      if (url.hostname !== 'api.meta.ai') return originalFetch(input, init)
      const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
      const mode = headers.get('x-tbh-contributor-mode')
      if (url.pathname === '/muse-code/models') {
        museRequests.push({ path: url.pathname, mode, authorization: headers.get('authorization') })
        if (heldListing) { heldListing.enter(); await heldListing.wait }
        if (nativeCatalog) return Response.json({ data: ['muse-wonder-full-1.0', 'muse-wonder-1.0', 'muse-spark-1.3', 'muse-spark-1.2']
          .flatMap(id => [catalogRow(`${id}-contributor`, `${id} Contributor`), catalogRow(id, id)]) })
        return Response.json({ data: mode === '1'
          ? [catalogRow('muse-wonder-full-1.0', 'Muse Wonder Full', ['high', 'xhigh'], { output: 32768, context: 524288, defaultEffort: 'high' })]
          : [catalogRow('muse-wonder-1.0', 'Muse Wonder'), catalogRow('muse-wonder-full-1.0', 'Muse Wonder Full', ['high', 'xhigh', 'max'], { defaultEffort: 'max' })] })
      }
      assert.equal(url.pathname, '/v1/responses')
      const body = JSON.parse(init?.body ?? await input.clone().text())
      museRequests.push({ path: url.pathname, mode, model: body.model, effort: body.reasoning?.effort, authorization: headers.get('authorization') })
      const item = { type: 'message', id: 'msg_muse', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: 'muse-fixture', annotations: [] }] }
      return new Response([
        { type: 'response.created', response: { id: 'resp_muse', model: body.model } },
        { type: 'response.output_item.added', output_index: 0, item: { ...item, content: [] } },
        { type: 'response.content_part.added', output_index: 0, content_index: 0, part: { type: 'output_text', text: '', annotations: [] } },
        { type: 'response.output_text.delta', output_index: 0, content_index: 0, delta: 'muse-fixture' },
        { type: 'response.output_item.done', output_index: 0, item },
        { type: 'response.completed', response: { id: 'resp_muse', model: body.model, status: 'completed', output: [item], usage: { input_tokens: 3, output_tokens: 1, total_tokens: 4 } } },
      ].map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join(''), { headers: { 'content-type': 'text/event-stream' } })
    }
    try {
      // Opening the model list loads the account catalog without a separate step.
      const loaded = await call('models', { connectionId: muse.connectionId })
      assert.deepEqual(loaded.models.map(model => [model.id, model.enabled, model.contributor === true]), [
        ['muse-wonder-1.0', true, false], ['muse-wonder-full-1.0', true, false], ['muse-wonder-full-1.0::contributor', false, true]])
      assert.deepEqual(museRequests.map(request => [request.mode, request.authorization]), [['0', 'Bearer runtime-muse-key'], ['1', 'Bearer runtime-muse-key']])
      assert.deepEqual(config.connections.get()[muse.connectionId].museCatalog.map(row => [row.id, row.contributor]), [['muse-wonder-1.0', false], ['muse-wonder-full-1.0', true]])
      const storedFull = config.connections.get()[muse.connectionId].museCatalog.find(row => row.id === 'muse-wonder-full-1.0')
      assert.deepEqual(storedFull.efforts, ['high', 'xhigh', 'max'])
      assert.equal(storedFull.defaultEffort, 'max')
      assert.deepEqual(storedFull.contributorMode.efforts, ['high', 'xhigh'])
      assert.equal(storedFull.contributorMode.maxTokens, 32768)
      assert.equal(storedFull.contributorMode.contextWindow, 524288)
      assert.equal(storedFull.contributorMode.defaultEffort, 'high')
      assert.doesNotMatch(JSON.stringify(storedFull), /runtime-muse-/)
      assert.doesNotMatch(JSON.stringify(config.connections.get()[muse.connectionId]), /runtime-muse-/)
      const current = await call('models', { connectionId: muse.connectionId })
      await call('set-model', { connectionId: muse.connectionId, model: 'muse-wonder-full-1.0::contributor', enabled: true, revision: current.revision })
      assert.ok(active.includes(route), 'Muse Code routes register with the Host LLM runtime')
      assert.deepEqual((await adapter.listModels(route)).map(model => model.id), ['muse-wonder-1.0', 'muse-wonder-full-1.0', 'muse-wonder-full-1.0::contributor'])
      assert.equal(adapter.providerInfo(route).name, 'Meta / Muse Code / Muse subscription')
      const stream = async model => {
        const prepared = await adapter.prepareCall(route, model)
        const chunks = []
        for await (const chunk of prepared.stream({ provider: route, model, reasoningEffort: 'high', messages: [{ role: 'user', content: [{ type: 'text', text: 'fixture' }] }] })) chunks.push(chunk)
        return chunks.filter(chunk => chunk.type === 'text-delta').map(chunk => chunk.text).join('')
      }
      assert.equal(await stream('muse-wonder-full-1.0::contributor'), 'muse-fixture')
      assert.equal(await stream('muse-wonder-1.0'), 'muse-fixture')
      assert.deepEqual(museRequests.filter(request => request.path === '/v1/responses').map(request => [request.model, request.mode, request.effort, request.authorization]), [
        ['muse-wonder-full-1.0', '1', 'high', 'Bearer runtime-muse-key'], ['muse-wonder-1.0', '0', 'high', 'Bearer runtime-muse-key']])
      const standardInfo = await adapter.resolveModel(route, 'muse-wonder-full-1.0')
      const contributorInfo = await adapter.resolveModel(route, 'muse-wonder-full-1.0::contributor')
      assert.ok(standardInfo.reasoning.efforts.some(level => level.name === 'Max'))
      assert.ok(!contributorInfo.reasoning.efforts.some(level => level.name === 'Max'))
      assert.equal(contributorInfo.context.contextWindow, 524288)
      assert.equal(standardInfo.reasoning.defaultEffort, standardInfo.reasoning.efforts.find(level => level.name === 'Max').id)
      assert.equal(contributorInfo.reasoning.defaultEffort, contributorInfo.reasoning.efforts.find(level => level.name === 'High').id)
      const beforeMax = museRequests.length
      await assert.rejects(async () => {
        const prepared = await adapter.prepareCall(route, 'muse-wonder-full-1.0::contributor')
        for await (const _chunk of prepared.stream({ provider: route, model: 'muse-wonder-full-1.0::contributor', reasoningEffort: 'max', messages: [{ role: 'user', content: [{ type: 'text', text: 'fixture' }] }] })) {}
      }, error => /does not support reasoning effort "max"/.test(String(error?.message)))
      assert.equal(museRequests.length, beforeMax)
      // The saved catalog keeps the models routable without a new listing.
      const count = museRequests.length
      ctx.emit('dsh-pi-login/catalog-updated')
      assert.deepEqual((await adapter.listModels(route)).map(model => model.id), ['muse-wonder-1.0', 'muse-wonder-full-1.0', 'muse-wonder-full-1.0::contributor'])
      assert.equal(museRequests.length, count)
      // Real account lists may include both native "-contributor" IDs and
      // base IDs in both responses. Existing opt-ins survive normalization;
      // the native default-on rows must not create more Contributor choices.
      nativeCatalog = true
      const normalized = await call('refresh-models', { connectionId: muse.connectionId })
      assert.equal(normalized.models.length, 8)
      assert.equal(normalized.models.filter(model => model.contributor).length, 4)
      assert.equal(normalized.models.filter(model => model.enabled).length, 5)
      assert.ok(normalized.models.every(model => !model.id.endsWith('-contributor')))
      assert.equal(directory.length, 0, 'Native Edit/Delete cannot target a connection-owned profile')
      await stream('muse-wonder-full-1.0::contributor')
      assert.equal(museRequests.at(-1).model, 'muse-wonder-full-1.0-contributor')
      assert.equal(museRequests.at(-1).mode, '1')
      await call('connection-update', { connectionId: muse.connectionId, patch: { profile: {
        disabledModels: ['muse-wonder-full-1.0-contributor', 'muse-wonder-1.0'],
      } }, revision })
      assert.equal((await call('models', { connectionId: muse.connectionId })).models.find(row => row.id === 'muse-wonder-full-1.0::contributor').enabled, false)
      await call('set-model', { connectionId: muse.connectionId, model: 'muse-wonder-full-1.0::contributor', enabled: true, revision })
      assert.deepEqual(config.connections.get()[muse.connectionId].profile.disabledModels, ['muse-wonder-1.0'])
      assert.equal((await call('models', { connectionId: muse.connectionId })).models.find(row => row.id === 'muse-wonder-full-1.0::contributor').enabled, true)
      await call('set-model', { connectionId: muse.connectionId, model: 'muse-wonder-full-1.0::contributor', enabled: false, revision })
      assert.ok(!(await adapter.listModels(route)).some(model => model.id === 'muse-wonder-full-1.0::contributor'))
      assert.throws(() => adapter.prepareCall(route, 'muse-wonder-full-1.0::contributor'))
      await call('set-model', { connectionId: muse.connectionId, model: 'muse-wonder-1.0', enabled: false, revision })
      assert.ok(!(await adapter.listModels(route)).some(model => model.id === 'muse-wonder-1.0'))
      const savedChoices = structuredClone(config.connections.get()[muse.connectionId].profile)
      await call('refresh-models', { connectionId: muse.connectionId })
      assert.deepEqual(config.connections.get()[muse.connectionId].profile, savedChoices, 'Refreshing must not undo off switches')
      // A provider request completing after deletion cannot recreate the
      // connection, its models or its credentials.
      const entered = Promise.withResolvers(), held = Promise.withResolvers()
      heldListing = { enter: entered.resolve, wait: held.promise }
      const pendingRefresh = call('refresh-models', { connectionId: muse.connectionId }).then(() => undefined, error => error)
      await entered.promise
      const others = Object.fromEntries(Object.entries(config.connections.get()).filter(([id]) => id !== muse.connectionId))
      await call('connection-delete', { connectionId: muse.connectionId, revision })
      held.resolve()
      assert.ok(await pendingRefresh instanceof Error)
      await pause(); await pause()
      assert.deepEqual(config.connections.get(), others)
      assert.equal(await ctx.credentials.readRecord(entry.key), undefined)
      assert.ok(!active.includes(route))
      assert.ok((await listing()).connections.every(row => row.connectionId !== muse.connectionId))
      console.log('Meta Muse Code: SDK Meta sign-in record, account catalog in both modes, persisted catalog, Host route registration and Contributor header on real SDK streams passed')
      console.log('Native Muse Contributor catalogs: deduplicated opt-ins, exact native SDK model/header, durable off switches and deletion during refresh without resurrection passed')
    } finally { globalThis.fetch = originalFetch }
  }
  console.log('Shipped plugin: official composition/RPC/Credentials, atomic old-profile migration, preserved routes/model/Thinking state, SDK local stream, multi-connection registration/key rotation/deletion and OAuth flow ownership passed')
} finally { await plugin.dispose(); await ctx.fiber.dispose(); await new Promise(resolve => server.close(resolve)) }

await import('./fast-runtime-check.mjs')
await import('./connection-runtime-check.mjs')
