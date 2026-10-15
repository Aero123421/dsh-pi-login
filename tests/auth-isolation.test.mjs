import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { compileOfficial } from '../scripts/upstream.mjs'

// Compile against the pinned Host seams, using the actual Pi SDK for locking,
// refresh, login and cancellation semantics. No external auth requests occur.
await mkdir('work', { recursive: true })
await writeFile('work/auth-isolation-entry.ts', `
export { Context } from '../.cache/upstream/vendor/cordis/src/index.ts';
export { default as AuthorizationService } from '../.cache/upstream/packages/credentials/authorization/src/index.ts';
export { MemoryCredentials } from '../.cache/upstream/packages/credentials/authorization/tests/memory.ts';
export { authContextFrom, connectionAuthFrom, credentialStoreFrom } from '../src/runtime/auth.ts';
export { registerConnectionFlows, registerPiAiFlows } from '../src/runtime/login.ts';
export { catalogProvider } from '../src/runtime/catalog.ts';
export { createModels } from '../src/runtime/models.ts';
`)
await compileOfficial('work/auth-isolation-entry.ts', 'work/auth-isolation-runtime.mjs')
const { Context, AuthorizationService, MemoryCredentials, authContextFrom, connectionAuthFrom, registerConnectionFlows, registerPiAiFlows, catalogProvider, createModels } = await import('../work/auth-isolation-runtime.mjs')
const pause = () => new Promise(resolve => setImmediate(resolve))
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
const oauth = (account, expires = Date.now() + 3600000) => ({ type: 'oauth', access: `${account}-access`, refresh: `${account}-refresh`, expires })

function storage() {
  const records = new Map(), locks = new Map(), reads = []
  return {
    records, reads,
    async readRecord(key) { reads.push(key); return structuredClone(records.get(key)) },
    listRecords() { throw new Error('A scoped store must never enumerate other accounts') },
    async modifyRecord(key, mutate) {
      const previous = locks.get(key) ?? Promise.resolve()
      const result = previous.then(async () => {
        const next = await mutate(structuredClone(records.get(key)))
        if (next !== undefined) records.set(key, structuredClone(next))
        return structuredClone(records.get(key))
      })
      locks.set(key, result.catch(() => {}))
      return result
    },
    async deleteRecord(key) {
      const previous = locks.get(key) ?? Promise.resolve()
      const result = previous.then(() => { records.delete(key) })
      locks.set(key, result.catch(() => {})); await result
    },
  }
}
function scoped(store, id, isCurrent = () => true) {
  return connectionAuthFrom({ get: name => name === 'credentials' ? store : undefined }, {
    connectionId: id, serviceId: 'openai-codex', credentialRecordId: id, isCurrent,
  })
}
function modelsFor(auth, overrides) {
  const native = catalogProvider('openai-codex')
  const provider = { ...native, auth: { ...native.auth, oauth: {
    ...native.auth.oauth, toAuth: async credential => ({ apiKey: credential.access }), ...overrides,
  } } }
  const models = createModels(auth); models.setProvider(provider); return models
}

test('scoped stores preserve native provider IDs and never read other records or ambient credentials', async () => {
  const store = storage(), a = scoped(store, 'c-account-a'), b = scoped(store, 'c-account-b')
  store.records.set('llm-pi-ai/openai-codex', { kind: 'grant', payload: oauth('ambient') })
  await a.credentials.modify('openai-codex', async () => oauth('A'))
  await b.credentials.modify('openai-codex', async () => oauth('B'))
  assert.equal((await a.credentials.read('openai-codex')).refresh, 'A-refresh')
  assert.equal((await b.credentials.read('openai-codex')).refresh, 'B-refresh')
  assert.equal(await a.credentials.read('anthropic'), undefined)
  await assert.rejects(a.credentials.modify('anthropic', async () => oauth('wrong')), error => error.code === 'AUTH_CONNECTION_MISMATCH')
  assert.deepEqual(await a.credentials.list(), [{ providerId: 'openai-codex', type: 'oauth' }])
  assert.deepEqual(new Set(store.reads), new Set(['llm-pi-ai/c-account-a', 'llm-pi-ai/c-account-b']))
  assert.equal(await a.authContext.env('OPENAI_API_KEY'), undefined)
  assert.equal(await a.authContext.fileExists('~/.aws/credentials'), false)
  await a.credentials.delete('openai-codex')
  assert.equal(await a.credentials.read('openai-codex'), undefined)
  assert.equal((await b.credentials.read('openai-codex')).refresh, 'B-refresh')
})

test('real SDK refresh rotates once under the record lock while another account logs in independently', async () => {
  const store = storage(), a = scoped(store, 'c-account-a'), b = scoped(store, 'c-account-b')
  await a.credentials.modify('openai-codex', async () => oauth('A-old', 0))
  const started = deferred(), release = deferred(); let refreshes = 0
  const modelsA = modelsFor(a, { refresh: async credential => {
    refreshes++; assert.equal(credential.refresh, 'A-old-refresh'); started.resolve(); await release.promise
    return oauth('A-rotated')
  } })
  const first = modelsA.getAuth('openai-codex'), second = modelsA.getAuth('openai-codex')
  await started.promise
  const modelsB = modelsFor(b, { login: async () => oauth('B-new') })
  await modelsB.login('openai-codex', 'oauth', { notify: () => {}, prompt: async () => '' })
  assert.equal((await modelsB.getAuth('openai-codex')).auth.apiKey, 'B-new-access')
  release.resolve()
  assert.deepEqual((await Promise.all([first, second])).map(result => result.auth.apiKey), ['A-rotated-access', 'A-rotated-access'])
  assert.equal(refreshes, 1)
  assert.equal((await a.credentials.read('openai-codex')).refresh, 'A-rotated-refresh')
  assert.equal((await b.credentials.read('openai-codex')).refresh, 'B-new-refresh')
})

test('SDK cancellation after refresh begins preserves the rotated token and credential generation', async () => {
  const store = storage(), auth = scoped(store, 'c-account-a'), release = deferred(), started = deferred()
  await auth.credentials.modify('openai-codex', async () => oauth('old', 0))
  const models = modelsFor(auth, { refresh: async () => { started.resolve(); await release.promise; return oauth('rotated') } })
  const controller = new AbortController()
  const refreshing = models.getAuth('openai-codex', { signal: controller.signal })
  await started.promise; controller.abort(); release.resolve()
  await refreshing.catch(() => {})
  await pause()
  assert.equal((await auth.credentials.read('openai-codex')).refresh, 'rotated-refresh')
})

test('deletion, account replacement and profile switching reject delayed and queued credential mutations', async () => {
  for (const change of ['deleted', 'replaced', 'profile-switched']) {
    const store = storage(); let current = true, queuedRan = false
    const auth = scoped(store, 'c-account-a', () => current)
    await auth.credentials.modify('openai-codex', async () => oauth('original'))
    const started = deferred(), release = deferred()
    const delayed = auth.credentials.modify('openai-codex', async () => { started.resolve(); await release.promise; return oauth('stale') })
    await started.promise
    const queued = auth.credentials.modify('openai-codex', async () => { queuedRan = true; return oauth('queued') })
    current = false
    if (change === 'deleted') store.records.delete('llm-pi-ai/c-account-a')
    if (change === 'replaced') store.records.set('llm-pi-ai/c-account-a', { kind: 'grant', payload: oauth('replacement') })
    release.resolve()
    await assert.rejects(delayed, error => error.code === 'STALE_CONNECTION')
    await assert.rejects(queued, error => error.code === 'STALE_CONNECTION')
    assert.equal(queuedRan, false)
    assert.equal(store.records.get('llm-pi-ai/c-account-a')?.payload?.refresh,
      change === 'deleted' ? undefined : change === 'replaced' ? 'replacement-refresh' : 'original-refresh')
  }
})

test('abort during a login credential write prevents a late grant commit', async () => {
  const store = storage(), auth = scoped(store, 'c-account-a'), controller = new AbortController(), release = deferred()
  const mutation = auth.credentials.modify('openai-codex', async () => { await release.promise; return oauth('cancelled') }, { signal: controller.signal })
  await pause(); controller.abort(); release.resolve()
  await assert.rejects(mutation, error => error.name === 'AbortError')
  assert.equal(store.records.size, 0)
})

test('mutating an SDK credential snapshot cannot alter a Host record before a rejected commit', async () => {
  let current = true, record = { kind: 'grant', payload: oauth('original') }
  const auth = scoped({
    readRecord: async () => record,
    modifyRecord: async (_key, mutate) => { const next = await mutate(record); if (next !== undefined) record = next; return record },
  }, 'c-account-a', () => current)
  const read = await auth.credentials.read('openai-codex')
  read.refresh = 'mutated-read'
  assert.equal(record.payload.refresh, 'original-refresh')
  await assert.rejects(auth.credentials.modify('openai-codex', async credential => {
    credential.refresh = 'mutated-refresh'
    current = false
    return credential
  }), error => error.code === 'STALE_CONNECTION')
  assert.equal(record.payload.refresh, 'original-refresh')
})

async function flowFixture(t) {
  const ctx = new Context(); await ctx.plugin(MemoryCredentials); await ctx.plugin(AuthorizationService)
  let connections = {
    'c-account-a': { integrationId: 'pi', serviceId: 'openai-codex', credentialRecordId: 'c-account-a', credentialGeneration: 0, authMethod: 'oauth', displayName: 'Account A', profile: {} },
    'c-account-b': { integrationId: 'pi', serviceId: 'openai-codex', credentialRecordId: 'c-account-b', credentialGeneration: 0, authMethod: 'oauth', displayName: 'Account B', profile: {} },
  }
  const loggedIn = []
  const flows = registerConnectionFlows(ctx, () => connections, id => { loggedIn.push(id) })
  t.after(async () => { flows.dispose(); await ctx.fiber.dispose() })
  const native = catalogProvider('openai-codex'), login = native.auth.oauth.login
  t.after(() => { native.auth.oauth.login = login })
  return { ctx, flows, native, loggedIn, get connections() { return connections }, set connections(value) { connections = value } }
}

test('live flows bind actual SDK login to the selected account and disappear on removal', async t => {
  const f = await flowFixture(t)
  assert.deepEqual(f.ctx.authorization.list().map(entry => entry.methods.map(method => method.id)), [['oauth'], ['oauth']])
  f.native.auth.oauth.login = async () => oauth('account-b')
  const outcome = await f.ctx.authorization.begin({ key: 'llm-pi-ai/c-account-b', method: 'oauth', interaction: { notify: () => {}, prompt: async () => '' } })
  assert.deepEqual(outcome, { status: 'authorized' })
  assert.equal((await f.ctx.credentials.readRecord('llm-pi-ai/c-account-b')).payload.refresh, 'account-b-refresh')
  assert.equal(await f.ctx.credentials.readRecord('llm-pi-ai/c-account-a'), undefined)
  assert.deepEqual(f.loggedIn, ['c-account-b'])
  delete f.connections['c-account-b']
  f.ctx.emit('settings/document-updated', 'dsh-pi-login', 1)
  assert.equal(f.ctx.authorization.describe('llm-pi-ai/c-account-b'), undefined)
  f.flows.dispose(); assert.deepEqual(f.ctx.authorization.list(), [])
})

test('generation changes withdraw a provider that ignores abort without saving or enabling it', async t => {
  const f = await flowFixture(t), release = deferred(), started = deferred()
  f.native.auth.oauth.login = async () => { started.resolve(); await release.promise; return oauth('late-account-a') }
  const attempt = f.ctx.authorization.begin({ key: 'llm-pi-ai/c-account-a', method: 'oauth', interaction: { notify: () => {}, prompt: async () => '' } })
  await started.promise
  f.connections['c-account-a'] = { ...f.connections['c-account-a'], credentialGeneration: 1 }
  f.flows.sync()
  assert.deepEqual(await attempt, { status: 'cancelled' })
  release.resolve(); await pause(); await pause()
  assert.equal(await f.ctx.credentials.readRecord('llm-pi-ai/c-account-a'), undefined)
  assert.deepEqual(f.loggedIn, [])
})

test('renaming a connection updates its public flow label without cancelling its login', async t => {
  const f = await flowFixture(t), release = deferred(), started = deferred()
  f.native.auth.oauth.login = async () => { started.resolve(); await release.promise; return oauth('renamed-account') }
  const attempt = f.ctx.authorization.begin({ key: 'llm-pi-ai/c-account-a', method: 'oauth', interaction: { notify: () => {}, prompt: async () => '' } })
  await started.promise
  f.connections['c-account-a'] = { ...f.connections['c-account-a'], displayName: 'Renamed account' }
  f.flows.sync()
  assert.equal(f.ctx.authorization.describe('llm-pi-ai/c-account-a').label, 'Renamed account')
  release.resolve()
  assert.deepEqual(await attempt, { status: 'authorized' })
  assert.deepEqual(f.loggedIn, ['c-account-a'])
})

test('legacy flow disposal synchronously releases retained keys for connection migration', async t => {
  const ctx = new Context(); await ctx.plugin(MemoryCredentials); await ctx.plugin(AuthorizationService)
  t.after(() => ctx.fiber.dispose())
  const withdraw = registerPiAiFlows(ctx, scoped(ctx.credentials, 'c-unused'))
  assert.ok(ctx.authorization.describe('llm-pi-ai/openai-codex'))
  withdraw()
  assert.equal(ctx.authorization.describe('llm-pi-ai/openai-codex'), undefined)
  const migrated = registerConnectionFlows(ctx, () => ({
    'c-migrated': { integrationId: 'pi', serviceId: 'openai-codex', credentialRecordId: 'openai-codex', credentialGeneration: 0, authMethod: 'oauth', displayName: 'Migrated account', profile: {} },
  }))
  t.after(() => migrated.dispose())
  assert.equal(ctx.authorization.describe('llm-pi-ai/openai-codex').label, 'Migrated account')
})

test('connection flow registration preserves the Host config waterfall for other plugins', async t => {
  const f = await flowFixture(t)
  const raw = { path: 'fixture.patch.yml', enableLogs: false }
  assert.equal(f.ctx.waterfall(f.ctx.fiber, 'internal/config', raw, () => raw), raw)
})

test('a resolved credential is returned and is not replaced by the launch environment', async () => {
  const stored = new Context()
  stored.provide('launchEnvironment', { get: name => name === 'OPENAI_API_KEY' ? { value: 'launch-secret', source: 'process' } : undefined })
  stored.provide('credentials', { resolve: async ref => ref === 'OPENAI_API_KEY' ? { value: 'stored-secret', source: 'file' } : undefined })
  assert.equal(await authContextFrom(stored).env('OPENAI_API_KEY'), 'stored-secret')

  const missing = new Context()
  missing.provide('launchEnvironment', { get: name => name === 'OPENAI_API_KEY' ? { value: 'launch-secret', source: 'process' } : undefined })
  missing.provide('credentials', { resolve: async () => undefined })
  assert.equal(await authContextFrom(missing).env('OPENAI_API_KEY'), 'launch-secret')

  const absent = new Context()
  absent.provide('launchEnvironment', { get: name => name === 'OPENAI_API_KEY' ? { value: 'launch-secret', source: 'process' } : undefined })
  assert.equal(await authContextFrom(absent).env('OPENAI_API_KEY'), 'launch-secret')
})
