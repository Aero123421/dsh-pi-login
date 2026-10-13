import assert from 'node:assert/strict'
import test from 'node:test'
import { ConnectionManager, validateEndpoint } from '../src/connections.mjs'
import { IntegrationRegistry } from '../src/registry.mjs'
import { createMuseCodeOwner } from '../src/muse-code-owner.mjs'

function fixture(value = {}, initialRecords = {}) {
  let revision = 0, current = { connections: {}, providers: {}, connectionMigrationVersion: 0, trustedEndpointOrigins: [], ...structuredClone(value) }
  const records = new Map(Object.entries(initialRecords).map(([key, record]) => [key, structuredClone(record)]))
  const mutations = [], writes = [], deletes = []
  let failWrite = false
  const settings = {
    describe: () => [{ ns: 'dsh-pi-login', revision, writable: true, value: structuredClone(current) }],
    async mutate(ns, operations, expected) {
      assert.equal(ns, 'dsh-pi-login')
      if (failWrite || expected !== revision) throw Object.assign(new Error('Conflict'), { code: 'settings-changed' })
      const next = structuredClone(current)
      for (const operation of operations) {
        assert.equal(operation.path.length, 1)
        if (operation.op === 'unset') delete next[operation.path[0]]
        else next[operation.path[0]] = structuredClone(operation.value)
      }
      mutations.push(structuredClone(operations)); current = next; revision++
    },
  }
  const credentials = {
    listRecords: async () => [...records].map(([key, record]) => ({ key, kind: record.kind })),
    readRecord: async key => structuredClone(records.get(key)),
    describeRecord: async key => ({ configured: records.has(key), writable: true }),
    async modifyRecord(key, mutate) {
      writes.push(key)
      const next = await mutate(structuredClone(records.get(key)))
      if (next === undefined) records.delete(key); else records.set(key, structuredClone(next))
      return structuredClone(next)
    },
    async deleteRecord(key) { deletes.push(key); records.delete(key) },
  }
  const registry = new IntegrationRegistry('profile-a')
  registry.register({ integrationId: 'pi', label: 'Pi', source: 'builtin',
    listServices: () => ['openai', 'deepseek'].map(serviceId => ({ serviceId, label: serviceId,
      methods: serviceId === 'openai' ? [{ id: 'oauth', label: 'OAuth' }, { id: 'api-key', label: 'API key' }] : [{ id: 'api-key', label: 'API key' }],
      capabilities: { auth: true, models: true, usage: false, settings: true },
    })), listConnections: () => [],
  })
  const manager = new ConnectionManager({ settings, credentials, registry })
  return { manager, registry, records, mutations, writes, deletes, settings, credentials, get value() { return current }, get revision() { return revision }, set failWrite(value) { failWrite = value } }
}

test('one-time migration atomically retains old OAuth identity, history route, model/Fast/Thinking settings without copying secrets', async () => {
  const profile = { enabled: true, disabledModels: ['hidden-model'], enabledFastModels: ['gpt-6.1-sol::fast'], reasoning: 'high', cacheRetention: 'long' }
  const record = { kind: 'grant', payload: { type: 'oauth', access: 'fixture-access', refresh: 'fixture-refresh', expires: 1234 } }
  const f = fixture({ providers: { openai: profile } }, { 'llm-pi-ai/openai': record })
  assert.equal(await f.manager.migrate(), true)
  const [[id, connection]] = Object.entries(f.value.connections)
  assert.match(id, /^c-/)
  assert.equal(connection.routeId, 'openai')
  assert.equal(connection.credentialRecordId, 'openai')
  assert.equal(connection.credentialGeneration, 0)
  assert.equal(connection.legacyRoute, true)
  assert.deepEqual(connection.profile, profile)
  assert.deepEqual(f.records.get('llm-pi-ai/openai'), record)
  assert.equal(f.records.size, 1)
  assert.deepEqual(f.writes, [])
  assert.equal(f.value.providers, undefined)
  assert.equal(f.value.connectionMigrationVersion, 1)
  assert.equal(f.mutations.length, 1)
  const original = structuredClone(f.value)
  assert.equal(await f.manager.migrate(), false)
  assert.deepEqual(f.value, original)
  assert.doesNotMatch(JSON.stringify(await f.manager.list()), /fixture-access|fixture-refresh/)
})

test('migration conflict keeps old settings and credentials intact; restart retries once', async () => {
  const f = fixture({ providers: { deepseek: { enabled: false, disabledModels: ['deepseek-chat'] } } }, { 'llm-pi-ai/deepseek': { kind: 'api-key', key: 'fixture-secret' } })
  const before = structuredClone(f.value)
  f.failWrite = true
  await assert.rejects(f.manager.migrate(), error => error.code === 'settings-changed')
  assert.deepEqual(f.value, before)
  assert.equal(f.records.size, 1)
  assert.equal(f.mutations.length, 0)
  f.failWrite = false
  assert.equal(await f.manager.migrate(), true)
  assert.equal(Object.keys(f.value.connections).length, 1)
  assert.equal(Object.values(f.value.connections)[0].enabled, false)
  assert.equal(await f.manager.migrate(), false)
})

test('migration separates an active API reference and its saved OAuth grant without copying or deleting that grant', async () => {
  const grant = { kind: 'grant', payload: { type: 'oauth', access: 'fixture-saved-access', refresh: 'fixture-saved-refresh', expires: 1234 } }
  const f = fixture({ providers: { openai: { enabled: true, apiKeyEnv: 'CORPORATE_API_KEY', reasoning: 'high', enabledFastModels: ['gpt-6.1-sol::fast'] } } }, { 'llm-pi-ai/openai': grant })
  await f.manager.migrate()
  const entries = Object.entries(f.value.connections)
  assert.equal(entries.length, 2)
  const [apiId, api] = entries.find(([, entry]) => entry.authMethod === 'api-key')
  const [oauthId, oauth] = entries.find(([, entry]) => entry.authMethod === 'oauth')
  assert.equal(api.routeId, 'openai')
  assert.equal(api.credentialRef, 'CORPORATE_API_KEY')
  assert.notEqual(api.credentialRecordId, 'openai')
  assert.equal(api.legacyRoute, false)
  assert.notEqual(oauth.routeId, 'openai')
  assert.equal(oauth.credentialRecordId, 'openai')
  assert.equal(oauth.profile.apiKeyEnv, undefined)
  assert.equal(oauth.enabled, false)
  assert.deepEqual(oauth.profile.enabledFastModels, api.profile.enabledFastModels)
  assert.deepEqual(f.writes, [])
  assert.equal(f.records.size, 1)
  await f.manager.update(oauthId, { enabled: true }, f.revision)
  assert.equal((await f.manager.list()).connections.find(row => row.connectionId === oauthId).configured, true)
  await f.manager.update(apiId, { apiKey: 'fixture-new-api-key' }, f.revision)
  await f.manager.delete(apiId, f.revision)
  assert.deepEqual(f.records.get('llm-pi-ai/openai'), grant)
  assert.equal(f.records.size, 1)
  assert.equal(Object.values(f.value.connections)[0].enabled, true)
})

test('secret header migration requires repair and never partially converts a second provider', async () => {
  const f = fixture({ providers: { deepseek: { enabled: false }, openai: { headers: { Authorization: 'fixture-sensitive-header' } } } })
  const before = structuredClone(f.value)
  await assert.rejects(f.manager.migrate(), error => error.code === 'migration-header-repair-required')
  assert.deepEqual(f.value, before)
  assert.deepEqual(f.writes, [])
  assert.deepEqual(f.mutations, [])
})

test('create and key rotation roll back orphan credentials on failed metadata write', async () => {
  const f = fixture()
  f.failWrite = true
  await assert.rejects(f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-create' }, f.revision))
  assert.equal(f.records.size, 0)
  assert.deepEqual(f.value.connections, {})
  f.failWrite = false
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-original' }, f.revision)
  const before = structuredClone(f.value.connections[connectionId])
  f.failWrite = true
  await assert.rejects(f.manager.update(connectionId, { apiKey: 'fixture-new' }, f.revision))
  assert.deepEqual(f.value.connections[connectionId], before)
  assert.equal(f.records.size, 1)
  assert.equal(f.records.get(`llm-pi-ai/${before.credentialRecordId}`).key, 'fixture-original')
  f.failWrite = false
  await f.manager.update(connectionId, { apiKey: 'fixture-new' }, f.revision)
  assert.equal(f.value.connections[connectionId].credentialGeneration, 1)
  assert.equal(f.records.size, 1)
  assert.notEqual(f.value.connections[connectionId].credentialRecordId, before.credentialRecordId)
})

test('a create suspended in credential storage cannot write the next profile with the same revision', async () => {
  const f = fixture()
  let entered, release
  const reached = new Promise(resolve => { entered = resolve })
  const gate = new Promise(resolve => { release = resolve })
  const original = f.credentials.modifyRecord
  f.credentials.modifyRecord = async (...args) => { entered(); await gate; return original(...args) }
  const create = f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-profile-a' }, f.revision)
  await reached
  f.registry.switchProfile('profile-b')
  release()
  await assert.rejects(create, error => error.code === 'profile-changed')
  assert.deepEqual(f.value.connections, {})
  assert.equal(f.records.size, 0)
  assert.deepEqual(f.mutations, [])
})

test('connection listing cannot stamp old entries with the profile token after a delayed credential read', async () => {
  const f = fixture()
  await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'oauth', displayName: 'Profile A account' }, f.revision)
  let entered, release
  const reached = new Promise(resolve => { entered = resolve })
  const gate = new Promise(resolve => { release = resolve })
  const original = f.credentials.describeRecord
  f.credentials.describeRecord = async (...args) => { entered(); await gate; return original(...args) }
  const listing = f.manager.list()
  await reached
  f.registry.switchProfile('profile-b')
  release()
  await assert.rejects(listing, error => error.code === 'profile-changed')
})

test('a profile switch after metadata commit preserves the credential of the committed connection', async () => {
  const f = fixture()
  const original = f.settings.mutate
  f.settings.mutate = async (...args) => { await original(...args); f.registry.switchProfile('profile-b') }
  await assert.rejects(f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-committed-a' }, f.revision), error => error.code === 'profile-changed' && error.metadataCommitted === true)
  assert.equal(Object.keys(f.value.connections).length, 1)
  const connection = Object.values(f.value.connections)[0]
  assert.equal(f.records.get(`llm-pi-ai/${connection.credentialRecordId}`).key, 'fixture-committed-a')
  assert.deepEqual(f.deletes, [])
})

test('same-provider clone keeps models and gets a disabled route with no copied credentials; deleting it preserves original', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', displayName: 'Personal', apiKey: 'fixture-original' }, f.revision)
  await f.manager.update(connectionId, { profile: { enabledFastModels: ['gpt-6.1-sol::fast'] } }, f.revision)
  const { connectionId: cloneId } = await f.manager.clone(connectionId, 'Work', f.revision)
  const original = f.value.connections[connectionId], clone = f.value.connections[cloneId]
  assert.equal(clone.enabled, false)
  assert.notEqual(clone.routeId, original.routeId)
  assert.notEqual(clone.credentialRecordId, original.credentialRecordId)
  assert.deepEqual(clone.profile.enabledFastModels, original.profile.enabledFastModels)
  assert.equal(f.records.size, 1)
  const listing = await f.manager.list()
  assert.equal(listing.connections.find(row => row.connectionId === cloneId).configured, false)
  assert.doesNotMatch(JSON.stringify(listing), /fixture-original/)
  await f.manager.delete(cloneId, f.revision)
  assert.equal(f.records.size, 1)
  assert.equal(Object.keys(f.value.connections).length, 1)
})

test('cloning Muse model settings retains the selected Contributor model without duplicating its login', async () => {
  const selection = { modelId: 'muse-wonder-full-1.0', contributorMode: true }
  const f = fixture({ connections: { 'c-muse': {
    integrationId: 'meta-muse-code', serviceId: 'muse-code', routeId: 'muse-c-muse',
    displayName: 'Muse', authMethod: 'oauth', credentialRecordId: 'c-muse',
    credentialGeneration: 0, enabled: true, profile: {}, museCode: selection,
  } } }, { 'dsh-muse-code/c-muse': { kind: 'grant', payload: { format: 'fixture' } } })
  const owner = createMuseCodeOwner({ ctx: { credentials: f.credentials }, connections: f.manager,
    privateRoot: '/fixture/not-started', openHost: () => { throw new Error('Cloning must not start Muse') } })
  f.registry.register(owner)
  try {
    const { connectionId } = await f.manager.clone('c-muse', 'Muse copy', f.revision)
    const copy = f.value.connections[connectionId]
    assert.deepEqual(copy.museCode, selection)
    assert.equal(copy.enabled, false)
    assert.equal((await f.manager.list()).connections.find(row => row.connectionId === connectionId).configured, false)
    assert.equal(f.records.size, 1)
    await f.manager.delete(connectionId, f.revision)
    assert.deepEqual(f.value.connections['c-muse'].museCode, selection)
    assert.equal(f.records.has('dsh-muse-code/c-muse'), true)
  } finally { await owner.dispose() }
})

test('login generation and profile change reject stale auth and RPC identities', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'oauth' }, f.revision)
  const old = f.manager.binding(f.manager.lookup(connectionId))
  assert.equal(f.manager.isCurrent(old), true)
  const login = await f.manager.beginLogin(connectionId)
  assert.equal(login.credentialGeneration, 1)
  assert.equal(f.manager.isCurrent(old), false)
  await assert.rejects(f.manager.beginLogin(connectionId), error => error.code === 'busy')
  f.manager.endLogin(connectionId)
  const current = f.manager.binding(f.manager.lookup(connectionId))
  assert.equal(f.manager.isCurrent(current), true)
  f.registry.switchProfile('profile-b')
  assert.equal(f.manager.isCurrent(current), false)
  assert.throws(() => f.manager.guard({ profileKey: 'profile-a', generation: 1 }), error => error.code === 'profile-changed')
  f.manager.dispose()
  assert.equal(f.manager.isCurrent(current), false)
})

test('custom endpoints need exact Host origin trust; endpoint secrets and credential authority cannot enter through metadata', async () => {
  const f = fixture({ trustedEndpointOrigins: ['https://gateway.example'] })
  assert.throws(() => validateEndpoint('http://127.0.0.1:8080'), error => error.code === 'endpoint-untrusted')
  for (const endpoint of ['https://key@gateway.example/v1', 'https://gateway.example/v1?api_key=secret', 'https://gateway.example/v1#secret', 'file:///tmp/config']) assert.throws(() => validateEndpoint(endpoint, ['https://gateway.example']), error => error.code === 'invalid-endpoint')
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', endpointUrl: 'https://gateway.example/v1' }, f.revision)
  await assert.rejects(f.manager.update(connectionId, { credentialRecordId: 'someone-else' }, f.revision), error => error.code === 'invalid-request')
  await assert.rejects(f.manager.update(connectionId, { profile: { headers: { Authorization: 'secret' } } }, f.revision), error => error.code === 'invalid-request')
  assert.equal(f.value.connections[connectionId].profile.baseURL, 'https://gateway.example/v1')
})

test('two metadata connections cannot share one credential record even with distinct routes', async () => {
  const f = fixture()
  const entry = { integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', displayName: 'One', credentialRecordId: 'shared-record', credentialGeneration: 0, enabled: true, profile: {} }
  await assert.rejects(f.manager.write({
    'c-one': { ...entry, routeId: 'pi-c-one' },
    'c-two': { ...entry, routeId: 'pi-c-two', displayName: 'Two' },
  }, f.revision), error => error.code === 'credential-conflict')
  assert.deepEqual(f.value.connections, {})
  assert.deepEqual(f.mutations, [])
})
