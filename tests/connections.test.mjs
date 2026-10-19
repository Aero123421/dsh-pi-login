import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ConnectionManager, validateEndpoint } from '../src/connections.mjs'
import { CatalogFiles } from '../src/catalog-files.mjs'
import { IntegrationRegistry } from '../src/registry.mjs'
import { createMuseCodeOwner } from '../src/muse-code-owner.mjs'

function fixture(value = {}, initialRecords = {}, catalogFiles = new CatalogFiles(mkdtempSync(join(tmpdir(), 'dsh-pi-catalog-')))) {
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
  const manager = new ConnectionManager({ settings, credentials, registry, catalogFiles })
  return { manager, registry, records, mutations, writes, deletes, settings, credentials, catalogFiles, get value() { return current }, get revision() { return revision }, set failWrite(value) { failWrite = value } }
}

test('catalog persistence keeps a concurrent rename, survives restart, and rejects a changed account or endpoint', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'deepseek', authMethod: 'api-key', apiKey: 'fixture-original' }, f.revision)
  const binding = f.manager.binding(f.manager.lookup(connectionId))
  await f.manager.update(connectionId, { displayName: 'Concurrent rename' }, f.revision)
  const writesBefore = f.mutations.length
  const snapshot = JSON.stringify({ version: 1, models: [{ id: 'new:1017' }] })
  await f.manager.saveModelCatalog(binding, snapshot)
  assert.equal(f.mutations.length, writesBefore)
  assert.equal(f.value.connections[connectionId].displayName, 'Concurrent rename')
  assert.equal(f.value.connections[connectionId].modelCatalog, undefined)
  assert.equal(f.catalogFiles.readSync(connectionId), snapshot)
  const restarted = fixture(f.value, Object.fromEntries(f.records), f.catalogFiles)
  assert.equal(restarted.catalogFiles.readSync(connectionId), snapshot)
  assert.equal(restarted.manager.lookup(connectionId).modelCatalog, undefined)
  assert.equal(restarted.records.size, 1)
  const cloned = await f.manager.clone(connectionId, 'Clone', f.revision)
  assert.equal(f.catalogFiles.readSync(cloned.connectionId), undefined)
  assert.equal(f.value.connections[cloned.connectionId].modelCatalog, undefined)
  const cancelled = new AbortController(); cancelled.abort()
  await assert.rejects(f.manager.saveModelCatalog(binding, 'cancelled', { signal: cancelled.signal }))
  assert.equal(f.catalogFiles.readSync(connectionId), snapshot)
  await assert.rejects(f.manager.saveModelCatalog({ ...binding, profile: { baseURL: 'https://other.example/v1' } }, 'wrong-endpoint'), error => error.code === 'connection-changed')
  await f.manager.update(connectionId, { apiKey: 'fixture-rotated' }, f.revision)
  assert.equal(f.catalogFiles.readSync(connectionId), undefined)
  await assert.rejects(f.manager.saveModelCatalog(binding, 'late-account-result'), error => error.code === 'connection-changed')
  await f.manager.delete(connectionId, f.revision)
  await assert.rejects(f.manager.saveModelCatalog(binding, 'late-deleted-result'))
  assert.equal(f.value.connections[connectionId], undefined)
  assert.equal(f.catalogFiles.readSync(connectionId), undefined)
})

test('re-login removes the previous account catalog file', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'oauth', displayName: 'Login catalog' }, f.revision)
  const binding = f.manager.binding(f.manager.lookup(connectionId))
  const snapshot = JSON.stringify({ version: 1, models: [{ id: 'old-account' }] })
  await f.manager.saveModelCatalog(binding, snapshot)
  await f.manager.beginLogin(connectionId)
  assert.equal(f.catalogFiles.readSync(connectionId), undefined)
  assert.equal(f.value.connections[connectionId].modelCatalog, undefined)
  assert.equal(f.value.connections[connectionId].credentialGeneration, 1)
})

test('an existing modelCatalog string is copied once and then removed from settings', async () => {
  const snapshot = JSON.stringify({ version: 1, models: [{ id: 'from-0.8.0' }] })
  const f = fixture({ connections: { 'c-legacy': {
    integrationId: 'pi', serviceId: 'deepseek', routeId: 'c-legacy', displayName: 'Legacy', authMethod: 'api-key',
    credentialRecordId: 'c-legacy', credentialGeneration: 0, enabled: true, profile: {}, modelCatalog: snapshot,
  } } })
  f.manager.copyLegacyCatalogs()
  assert.equal(f.catalogFiles.readSync('c-legacy'), snapshot)
  assert.equal(f.value.connections['c-legacy'].modelCatalog, snapshot)
  assert.equal(await f.manager.migrateModelCatalogs(), true)
  assert.equal(f.value.connections['c-legacy'].modelCatalog, undefined)
  assert.equal(f.catalogFiles.readSync('c-legacy'), snapshot)
  assert.equal(f.value.connections['c-legacy'].displayName, 'Legacy')
  assert.equal(await f.manager.migrateModelCatalogs(), false)
})

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

test('failed create and rotation staging writes never create unowned credentials', async () => {
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
  const staged = Object.values(f.value.connections)
  assert.equal(staged.length, 1)
  assert.equal(staged[0].enabled, false)
  assert.equal(f.records.size, 0)
  assert.equal(f.mutations.length, 1)
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
  let commits = 0
  f.settings.mutate = async (...args) => { await original(...args); if (++commits === 2) f.registry.switchProfile('profile-b') }
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

test('cloning a Muse Code connection keeps model choices but never its login or account catalog', async () => {
  const catalog = [{ id: 'muse-wonder-1.0', name: 'Muse Wonder', contextWindow: 1048576, maxTokens: 131072, input: ['text', 'image'], efforts: ['high'], contributor: true }]
  const f = fixture({ connections: { 'c-muse': {
    integrationId: 'meta-muse-code', serviceId: 'muse-code', routeId: 'muse-c-muse',
    displayName: 'Muse', authMethod: 'oauth', credentialRecordId: 'c-muse',
    credentialGeneration: 0, enabled: true, profile: { enabledContributorModels: ['muse-wonder-1.0::contributor'] }, museCatalog: catalog,
  } } }, { 'llm-pi-ai/c-muse': { kind: 'grant', payload: { type: 'oauth', refresh: 'fixture', access: 'fixture', expires: Date.now() + 100000 } } })
  f.registry.register(createMuseCodeOwner({ ctx: { credentials: f.credentials }, connections: f.manager }))
  assert.equal((await f.manager.list()).connections.find(row => row.connectionId === 'c-muse').configured, true)
  const { connectionId } = await f.manager.clone('c-muse', 'Muse copy', f.revision)
  const copy = f.value.connections[connectionId]
  assert.deepEqual(copy.profile.enabledContributorModels, ['muse-wonder-1.0::contributor'])
  assert.equal(copy.museCatalog, undefined)
  assert.equal(copy.enabled, false)
  assert.equal((await f.manager.list()).connections.find(row => row.connectionId === connectionId).configured, false)
  await f.manager.delete(connectionId, f.revision)
  assert.deepEqual(f.value.connections['c-muse'].museCatalog, catalog)
  assert.equal(f.records.has('llm-pi-ai/c-muse'), true)
  await assert.rejects(f.manager.update('c-muse', { apiKey: 'not-allowed' }, f.revision), error => error.code === 'owner-managed')
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

test('failed credential cleanup retains a disabled deletion record that can be retried after restart', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-delete' }, f.revision)
  const { connectionId: otherId } = await f.manager.create({ integrationId: 'pi', serviceId: 'deepseek', authMethod: 'api-key', apiKey: 'fixture-other' }, f.revision)
  const other = structuredClone(f.value.connections[otherId])
  const binding = f.manager.binding(f.manager.lookup(connectionId))
  const original = f.credentials.deleteRecord
  f.credentials.deleteRecord = async () => { throw Object.assign(new Error('fixture storage failure'), { code: 'EIO' }) }
  await assert.rejects(f.manager.delete(connectionId, f.revision), error => error.code === 'credential-delete-failed' && error.cause.code === 'EIO')
  assert.equal(f.value.connections[connectionId].deletionPending, true)
  assert.equal(f.value.connections[connectionId].enabled, false)
  assert.equal(f.manager.isCurrent(binding), false)
  assert.equal(f.records.size, 2)
  for (const operation of [() => f.manager.update(connectionId, { enabled: true }, f.revision), () => f.manager.clone(connectionId, 'Clone', f.revision), () => f.manager.beginLogin(connectionId), () => f.manager.saveMuseCatalog(binding, [])]) await assert.rejects(operation())
  const row = (await f.manager.list()).connections.find(row => row.connectionId === connectionId)
  assert.equal(row.deletionPending, true)
  assert.equal(row.authStatus, 'deletion-pending')
  assert.equal(row.capabilities.auth, false)
  assert.equal(row.capabilities.models, false)
  assert.equal(row.capabilities.settings, true)
  f.manager.dispose()
  f.registry.switchProfile('profile-a')
  const restarted = new ConnectionManager({ settings: f.settings, credentials: f.credentials, registry: f.registry })
  f.credentials.deleteRecord = original
  assert.deepEqual(await restarted.delete(connectionId, f.revision), { deleted: true })
  assert.equal(f.value.connections[connectionId], undefined)
  assert.equal(f.records.size, 1)
  assert.deepEqual(f.value.connections[otherId], other)
  assert.equal(f.records.get(`llm-pi-ai/${other.credentialRecordId}`).key, 'fixture-other')
})

test('final deletion metadata failure remains retryable without restoring removed credentials', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-delete' }, f.revision)
  const original = f.credentials.deleteRecord
  f.credentials.deleteRecord = async key => { await original(key); f.failWrite = true }
  await assert.rejects(f.manager.delete(connectionId, f.revision), error => error.code === 'settings-changed')
  assert.equal(f.records.size, 0)
  assert.equal(f.value.connections[connectionId].deletionPending, true)
  f.failWrite = false
  f.credentials.deleteRecord = original
  await f.manager.delete(connectionId, f.revision)
  assert.deepEqual(f.value.connections, {})
  assert.equal(f.records.size, 0)
})

test('deletion revokes stale bindings before cleanup and preserves concurrent edits to other connections', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-delete' }, f.revision)
  const { connectionId: otherId } = await f.manager.clone(connectionId, 'Other', f.revision)
  const binding = f.manager.binding(f.manager.lookup(connectionId))
  let entered, release
  const reached = new Promise(resolve => { entered = resolve })
  const gate = new Promise(resolve => { release = resolve })
  const original = f.credentials.deleteRecord
  f.credentials.deleteRecord = async key => { entered(); await gate; await original(key) }
  const deletion = f.manager.delete(connectionId, f.revision)
  await reached
  assert.equal(f.manager.isCurrent(binding), false)
  await assert.rejects(f.manager.delete(connectionId, f.revision), error => error.code === 'busy')
  await f.manager.update(otherId, { displayName: 'Edited while cleanup waited' }, f.revision)
  release()
  await deletion
  assert.equal(f.value.connections[connectionId], undefined)
  assert.equal(f.value.connections[otherId].displayName, 'Edited while cleanup waited')
  assert.equal(f.deletes.length, 1)
})

test('failed revocation never deletes credentials; profile changes after cleanup never write the new profile', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-delete' }, f.revision)
  const before = structuredClone(f.value.connections[connectionId])
  f.failWrite = true
  await assert.rejects(f.manager.delete(connectionId, f.revision))
  assert.deepEqual(f.value.connections[connectionId], before)
  assert.equal(f.records.size, 1)
  assert.deepEqual(f.deletes, [])
  f.failWrite = false
  const original = f.credentials.deleteRecord
  f.credentials.deleteRecord = async key => { await original(key); f.registry.switchProfile('profile-b') }
  await assert.rejects(f.manager.delete(connectionId, f.revision), error => error.code === 'profile-changed')
  assert.equal(f.value.connections[connectionId].deletionPending, true)
  assert.equal(f.records.size, 0)
  assert.equal(f.mutations.length, 3)
})

test('Muse deletion retries partial cleanup of both SDK and CLI-era credentials', async () => {
  const connection = { integrationId: 'meta-muse-code', serviceId: 'muse-code', routeId: 'muse-c-muse', displayName: 'Muse', authMethod: 'oauth', credentialRecordId: 'c-muse', credentialGeneration: 0, enabled: true, profile: {} }
  const f = fixture({ connections: { 'c-muse': connection } }, { 'llm-pi-ai/c-muse': { kind: 'grant', payload: {} }, 'dsh-muse-code/c-muse': { kind: 'grant', payload: {} } })
  f.registry.register(createMuseCodeOwner({ ctx: { credentials: f.credentials }, connections: f.manager }))
  const original = f.credentials.deleteRecord
  f.credentials.deleteRecord = async key => { if (key.startsWith('dsh-muse-code/')) throw new Error('fixture CLI record write failed'); await original(key) }
  await assert.rejects(f.manager.delete('c-muse', f.revision), error => error.code === 'credential-delete-failed')
  assert.equal(f.records.has('llm-pi-ai/c-muse'), false)
  assert.equal(f.records.has('dsh-muse-code/c-muse'), true)
  assert.equal(f.value.connections['c-muse'].deletionPending, true)
  f.credentials.deleteRecord = original
  await f.manager.delete('c-muse', f.revision)
  assert.equal(f.records.size, 0)
  assert.deepEqual(f.value.connections, {})
})

test('Pi and Muse cannot share an actual credential namespace record across integration IDs', async () => {
  const f = fixture()
  f.registry.register(createMuseCodeOwner({ ctx: { credentials: f.credentials }, connections: f.manager }))
  const common = { authMethod: 'oauth', displayName: 'One', credentialRecordId: 'shared-record', credentialGeneration: 0, enabled: true, profile: {} }
  await assert.rejects(f.manager.write({
    'c-one': { ...common, integrationId: 'pi', serviceId: 'openai', routeId: 'pi-c-one' },
    'c-two': { ...common, integrationId: 'meta-muse-code', serviceId: 'muse-code', routeId: 'muse-c-two' },
  }, f.revision), error => error.code === 'credential-conflict')
  assert.deepEqual(f.value.connections, {})
})

test('re-authentication atomically revokes a Muse account catalog before any new grant can be stored', async () => {
  const profile = { disabledModels: ['muse-wonder-1.0'], enabledContributorModels: ['muse-wonder-1.0::contributor'] }
  const entry = { integrationId: 'meta-muse-code', serviceId: 'muse-code', routeId: 'muse-c-muse', displayName: 'Muse', authMethod: 'oauth', credentialRecordId: 'c-muse', credentialGeneration: 0, enabled: true, profile, museCode: { modelId: 'old-account-only' }, museCatalog: [{ id: 'old-account-only' }] }
  const f = fixture({ connections: { 'c-muse': entry } }, { 'llm-pi-ai/c-muse': { kind: 'grant', payload: { access: 'fixture-old-account' } } })
  f.registry.register(createMuseCodeOwner({ ctx: { credentials: f.credentials }, connections: f.manager }))
  const before = structuredClone(f.value.connections['c-muse'])
  f.failWrite = true
  await assert.rejects(f.manager.beginLogin('c-muse'))
  assert.deepEqual(f.value.connections['c-muse'], before)
  assert.equal(f.manager.pendingLogins.has('c-muse'), false)
  f.failWrite = false
  await f.manager.beginLogin('c-muse')
  const saved = f.value.connections['c-muse']
  assert.equal(saved.credentialGeneration, 1)
  assert.equal(saved.museCatalog, undefined)
  assert.equal(saved.museCode, undefined)
  assert.deepEqual(saved.profile, profile)
  assert.equal(f.records.get('llm-pi-ai/c-muse').payload.access, 'fixture-old-account')
  f.manager.endLogin('c-muse')
  f.manager.dispose()
  const restarted = new ConnectionManager({ settings: f.settings, credentials: f.credentials, registry: f.registry })
  assert.equal(restarted.lookup('c-muse').museCatalog, undefined)
  assert.deepEqual(restarted.lookup('c-muse').profile, profile)
})

test('an unavailable optional owner preserves its connection without blocking unrelated create, rename or delete', async () => {
  const optional = { integrationId: 'optional', serviceId: 'gateway', routeId: 'optional-c-extra', displayName: 'Extra', authMethod: 'api-key', credentialRecordId: 'c-extra', credentialGeneration: 0, enabled: true, profile: {} }
  const f = fixture({ connections: { 'c-extra': optional } })
  f.manager.changed()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-good' }, f.revision)
  await f.manager.update(connectionId, { displayName: 'Renamed' }, f.revision)
  const list = await f.manager.list()
  assert.equal(list.connections.find(row => row.connectionId === 'c-extra').authStatus, 'unavailable')
  assert.equal(list.connections.find(row => row.connectionId === connectionId).displayName, 'Renamed')
  await assert.rejects(f.manager.update('c-extra', { displayName: 'Requires owner' }, f.revision), error => error.code === 'service-unavailable')
  await f.manager.delete(connectionId, f.revision)
  assert.deepEqual(f.value.connections, { 'c-extra': optional })
  assert.equal(f.records.size, 0)
  assert.equal(f.registry.routes.size, 0)
})

test('optional credential generation guards reject old account views before resolving fresh connection data', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'oauth' }, f.revision)
  const payload = { ...f.registry.token(), connectionId, credentialGeneration: 0 }
  assert.doesNotThrow(() => f.manager.guard(payload))
  await f.manager.beginLogin(connectionId)
  assert.throws(() => f.manager.guard(payload), error => error.code === 'connection-changed')
  assert.throws(() => f.manager.guard({ connectionId, credentialGeneration: 0 }, { optional: true }), error => error.code === 'connection-changed')
  assert.throws(() => f.manager.guard({ ...payload, credentialGeneration: NaN }), error => error.code === 'connection-changed')
  assert.doesNotThrow(() => f.manager.guard({ connectionId, credentialGeneration: 1 }, { optional: true }))
  assert.throws(() => f.manager.guard({ ...payload, connectionId: 'c-missing' }), error => error.code === 'connection-unavailable')
})

test('failed create credential save leaves a visible disabled row that can be repaired or deleted', async () => {
  const f = fixture()
  const original = f.credentials.modifyRecord
  f.credentials.modifyRecord = async () => { throw Object.assign(new Error('fixture save failure'), { code: 'EIO' }) }
  await assert.rejects(f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-key' }, f.revision), error => error.code === 'credential-save-failed' && error.metadataCommitted === true)
  const [[id, saved]] = Object.entries(f.value.connections)
  assert.equal(saved.enabled, false)
  assert.equal(f.records.size, 0)
  assert.equal((await f.manager.list()).connections[0].configured, false)
  f.credentials.modifyRecord = original
  await f.manager.update(id, { apiKey: 'fixture-repaired', enabled: true }, f.revision)
  assert.equal(f.value.connections[id].enabled, true)
  assert.equal(f.records.size, 1)
  assert.equal(f.records.get(`llm-pi-ai/${f.value.connections[id].credentialRecordId}`).key, 'fixture-repaired')
  await f.manager.delete(id, f.revision)
  assert.equal(f.records.size, 0)
})

test('failed create activation retains an owned key in a disabled recoverable row', async () => {
  const f = fixture()
  const original = f.credentials.modifyRecord
  f.credentials.modifyRecord = async (...args) => { const result = await original(...args); f.failWrite = true; return result }
  await assert.rejects(f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-key' }, f.revision), error => error.code === 'credential-save-failed' && error.metadataCommitted === true && error.cause.code === 'settings-changed')
  const [[id, saved]] = Object.entries(f.value.connections)
  assert.equal(saved.enabled, false)
  assert.equal(f.records.get(`llm-pi-ai/${saved.credentialRecordId}`).key, 'fixture-key')
  f.failWrite = false
  await f.manager.delete(id, f.revision)
  assert.deepEqual(f.value.connections, {})
  assert.equal(f.records.size, 0)
})

test('failed key swap preserves the current key and durably owns the reserved key for restart cleanup', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-old' }, f.revision)
  const before = structuredClone(f.value.connections[connectionId])
  const original = f.credentials.modifyRecord
  f.credentials.modifyRecord = async (...args) => { const result = await original(...args); f.failWrite = true; return result }
  await assert.rejects(f.manager.update(connectionId, { apiKey: 'fixture-new' }, f.revision), error => error.code === 'settings-changed')
  const saved = f.value.connections[connectionId]
  assert.equal(saved.credentialRecordId, before.credentialRecordId)
  assert.equal(saved.credentialGeneration, before.credentialGeneration + 1)
  assert.equal(saved.credentialCleanupIds.length, 1)
  assert.equal(f.records.get(`llm-pi-ai/${saved.credentialRecordId}`).key, 'fixture-old')
  assert.equal(f.records.get(`llm-pi-ai/${saved.credentialCleanupIds[0]}`).key, 'fixture-new')
  assert.equal((await f.manager.list()).connections[0].credentialCleanupPending, true)
  f.manager.dispose()
  f.registry.switchProfile('profile-a')
  const restarted = new ConnectionManager({ settings: f.settings, credentials: f.credentials, registry: f.registry })
  f.failWrite = false
  await restarted.cleanupCredentials(connectionId, f.revision)
  assert.equal(f.records.size, 1)
  assert.equal(f.value.connections[connectionId].credentialCleanupIds, undefined)
  assert.equal(f.records.get(`llm-pi-ai/${saved.credentialRecordId}`).key, 'fixture-old')
})

test('failed retired key cleanup reports partial completion and retries without undoing the active new key', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-old' }, f.revision)
  const oldId = f.value.connections[connectionId].credentialRecordId
  const original = f.credentials.deleteRecord
  f.credentials.deleteRecord = async () => { throw new Error('fixture retired key cleanup failed') }
  await assert.rejects(f.manager.update(connectionId, { apiKey: 'fixture-new' }, f.revision), error => error.code === 'credential-cleanup-failed' && error.metadataCommitted === true)
  const saved = f.value.connections[connectionId]
  assert.notEqual(saved.credentialRecordId, oldId)
  assert.deepEqual(saved.credentialCleanupIds, [oldId])
  assert.equal(f.records.get(`llm-pi-ai/${saved.credentialRecordId}`).key, 'fixture-new')
  assert.equal(f.records.size, 2)
  const { connectionId: cloneId } = await f.manager.clone(connectionId, 'No retired keys copied', f.revision)
  assert.equal(f.value.connections[cloneId].credentialCleanupIds, undefined)
  f.credentials.deleteRecord = original
  await f.manager.cleanupCredentials(connectionId, f.revision)
  assert.equal(f.records.size, 1)
  assert.equal(f.value.connections[connectionId].credentialRecordId, saved.credentialRecordId)
  assert.equal(f.value.connections[connectionId].credentialCleanupIds, undefined)
})

test('an interrupted credential rotation prevents concurrent deletion and stale profile writes', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-old' }, f.revision)
  let entered, release
  const reached = new Promise(resolve => { entered = resolve })
  const gate = new Promise(resolve => { release = resolve })
  const original = f.credentials.modifyRecord
  f.credentials.modifyRecord = async (...args) => { entered(); await gate; return original(...args) }
  const update = f.manager.update(connectionId, { apiKey: 'fixture-new' }, f.revision)
  await reached
  for (const operation of [() => f.manager.delete(connectionId, f.revision), () => f.manager.beginLogin(connectionId), () => f.manager.update(connectionId, { displayName: 'Race' }, f.revision), () => f.manager.cleanupCredentials(connectionId, f.revision)]) await assert.rejects(operation(), error => error.code === 'busy')
  f.registry.switchProfile('profile-b')
  release()
  await assert.rejects(update, error => error.code === 'profile-changed')
  assert.equal(f.records.size, 1)
  const saved = f.value.connections[connectionId]
  assert.equal(f.records.get(`llm-pi-ai/${saved.credentialRecordId}`).key, 'fixture-old')
  assert.equal(saved.credentialCleanupIds.length, 1)
  assert.equal(f.records.has(`llm-pi-ai/${saved.credentialCleanupIds[0]}`), false)
})

test('switching authentication method retains the retired key journal when cleanup fails', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-old' }, f.revision)
  const oldId = f.value.connections[connectionId].credentialRecordId
  const original = f.credentials.deleteRecord
  f.credentials.deleteRecord = async () => { throw new Error('fixture cleanup failure') }
  await assert.rejects(f.manager.update(connectionId, { authMethod: 'oauth' }, f.revision), error => error.code === 'credential-cleanup-failed')
  assert.equal(f.value.connections[connectionId].authMethod, 'oauth')
  assert.equal(f.value.connections[connectionId].enabled, false)
  assert.deepEqual(f.value.connections[connectionId].credentialCleanupIds, [oldId])
  f.credentials.deleteRecord = original
  await f.manager.delete(connectionId, f.revision)
  assert.equal(f.records.size, 0)
  assert.deepEqual(f.value.connections, {})
})

test('retired-key cleanup refuses an active record shared by manually corrupted metadata', async () => {
  const f = fixture()
  const { connectionId } = await f.manager.create({ integrationId: 'pi', serviceId: 'openai', authMethod: 'api-key', apiKey: 'fixture-current' }, f.revision)
  const { connectionId: otherId } = await f.manager.create({ integrationId: 'pi', serviceId: 'deepseek', authMethod: 'api-key', apiKey: 'fixture-other' }, f.revision)
  f.value.connections[connectionId].credentialCleanupIds = [f.value.connections[otherId].credentialRecordId]
  await assert.rejects(f.manager.cleanupCredentials(connectionId, f.revision), error => error.code === 'credential-conflict')
  assert.equal(f.records.size, 2)
  assert.deepEqual(f.deletes, [])
})
