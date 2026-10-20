import assert from 'node:assert/strict'
import test from 'node:test'
import { AsyncLocalStorage } from 'node:async_hooks'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { CatalogFiles } from '../src/catalog-files.mjs'
import { ConnectionManager } from '../src/connections.mjs'
import { IntegrationRegistry } from '../src/registry.mjs'
import { LiveCatalogSession, catalogBinding } from '../src/live-catalog.mjs'

const base = { id: 'old', name: 'Old', provider: 'opencode-go', api: 'openai-completions', baseUrl: 'https://opencode.ai/inference/go/v1',
  reasoning: false, contextWindow: 100000, maxTokens: 8192, input: ['text'], cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }

function runExclusive(executing, operation) {
  if (executing.getStore()) return Promise.reject(new Error('HMR transactions cannot be nested'))
  const task = Promise.resolve().then(() => executing.run(true, operation))
  return task
}

test('automatic refresh inside an HMR transaction persists the catalog file', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-pi-hmr-catalog-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const files = new CatalogFiles(dir)
  let revision = 0
  let current = { connections: {}, connectionMigrationVersion: 1, trustedEndpointOrigins: [] }
  const executing = new AsyncLocalStorage()
  const settings = {
    describe: () => [{ ns: 'dsh-pi-login', revision, writable: true, value: structuredClone(current) }],
    mutate: async (ns, operations, expected) => runExclusive(executing, async () => {
      assert.equal(ns, 'dsh-pi-login')
      if (expected !== revision) throw Object.assign(new Error('Conflict'), { code: 'settings-changed' })
      const next = structuredClone(current)
      for (const operation of operations) next[operation.path[0]] = structuredClone(operation.value)
      current = next
      revision++
    }),
  }
  const credentials = {
    listRecords: async () => [], readRecord: async () => undefined, describeRecord: async () => ({ configured: false, writable: true }),
    modifyRecord: async (_key, mutate) => mutate(), deleteRecord: async () => {},
  }
  const registry = new IntegrationRegistry('profile-hmr')
  registry.register({ integrationId: 'pi', label: 'Pi', source: 'builtin', listConnections: () => [],
    listServices: () => [{ serviceId: 'opencode-go', label: 'Go', methods: [{ id: 'api-key', label: 'API key' }], capabilities: { auth: true, models: true, usage: false, settings: true } }] })
  const manager = new ConnectionManager({ settings, credentials, registry, catalogFiles: files })
  const { connectionId } = await manager.create({ integrationId: 'pi', serviceId: 'opencode-go', authMethod: 'api-key', displayName: 'Inside HMR' }, revision)
  const binding = manager.binding(manager.lookup(connectionId))
  const session = new LiveCatalogSession({
    connection: manager.lookup(connectionId), baseline: new Map([[base.id, base]]), poll: false,
    snapshot: () => files.readSync(connectionId),
    persist: (value, options) => manager.saveModelCatalog(binding, value, options),
    isCurrent: () => manager.isCurrent(binding),
    fetch: async () => Response.json([{ ...base, id: 'new:1017', name: 'New' }]),
  })
  t.after(() => session.dispose())
  await runExclusive(executing, () => new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      clearInterval(timer)
      session.refresh().then(resolve, reject)
    }, 0)
  }))
  const saved = JSON.parse(files.readSync(connectionId))
  assert.equal(saved.models.some(model => model.id === 'new:1017'), true)
  assert.equal(current.connections[connectionId].modelCatalog, undefined)
  assert.equal(readdirSync(dir).some(name => name.endsWith('.tmp')), false)
  await assert.rejects(runExclusive(executing, () => settings.mutate('dsh-pi-login', [], revision)), /HMR transactions cannot be nested/)
})

test('catalog files reject unsafe ids and replace atomically', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-pi-catalog-files-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const files = new CatalogFiles(dir)
  assert.throws(() => files.file('../etc'), error => error.code === 'invalid-catalog')
  assert.throws(() => files.file('c-ok/../../passwd'), error => error.code === 'invalid-catalog')
  await files.write('c-ok', '{"version":1}')
  await files.write('c-ok', '{"version":2}')
  assert.equal(files.readSync('c-ok'), '{"version":2}')
  assert.deepEqual(readdirSync(dir), ['catalog-c-ok.json'])
  await files.remove('c-ok')
  assert.equal(files.readSync('c-ok'), undefined)
})

test('a session opened after the settings copy restores that catalog and does not fetch', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-pi-legacy-catalog-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const files = new CatalogFiles(dir)
  let revision = 1
  let current = { connections: {}, connectionMigrationVersion: 1, trustedEndpointOrigins: [] }
  const settings = {
    describe: () => [{ ns: 'dsh-pi-login', revision, writable: true, value: structuredClone(current) }],
    mutate: async (ns, operations, expected) => {
      assert.equal(ns, 'dsh-pi-login')
      if (expected !== revision) throw Object.assign(new Error('Conflict'), { code: 'settings-changed' })
      const next = structuredClone(current)
      for (const operation of operations) next[operation.path[0]] = structuredClone(operation.value)
      current = next
      revision++
    },
  }
  const credentials = {
    listRecords: async () => [], readRecord: async () => undefined, describeRecord: async () => ({ configured: false, writable: true }),
    modifyRecord: async (_key, mutate) => mutate(), deleteRecord: async () => {},
  }
  const registry = new IntegrationRegistry('profile-legacy')
  registry.register({ integrationId: 'pi', label: 'Pi', source: 'builtin', listConnections: () => [],
    listServices: () => [{ serviceId: 'opencode-go', label: 'Go', methods: [{ id: 'api-key', label: 'API key' }], capabilities: { auth: true, models: true, usage: false, settings: true } }] })
  const manager = new ConnectionManager({ settings, credentials, registry, catalogFiles: files })
  const { connectionId } = await manager.create({ integrationId: 'pi', serviceId: 'opencode-go', authMethod: 'api-key', displayName: 'Legacy catalog' }, revision)
  const connection = manager.lookup(connectionId)
  const stored = { ...base, id: 'fixture-new:1017', name: 'Restart catalog fixture', control: { toggle: false }, verified: true }
  current.connections[connectionId].modelCatalog = JSON.stringify({
    version: 1, binding: catalogBinding(connection), checkedAt: Date.now(), models: [stored],
  })
  manager.copyLegacyCatalogs()
  let fetches = 0
  const session = new LiveCatalogSession({
    connection, baseline: new Map([[base.id, base]]), poll: true,
    snapshot: () => files.readSync(connectionId),
    fetch: async () => { fetches++; return Response.json([]) },
  })
  t.after(() => session.dispose())
  const models = session.catalog('opencode-go')
  await new Promise(resolve => setTimeout(resolve, 20))
  assert.equal(models.get('fixture-new:1017')?.name, 'Restart catalog fixture')
  assert.equal(fetches, 0)
  assert.equal(JSON.parse(files.readSync(connectionId)).models[0].id, 'fixture-new:1017')
})

test('legacy catalog files are copied before runtime opens live sessions', () => {
  const source = readFileSync(new URL('../src/index.mjs', import.meta.url), 'utf8')
  const copy = source.indexOf('manager.copyLegacyCatalogs()')
  const runtime = source.indexOf('applyRuntime(')
  assert.ok(copy !== -1 && runtime !== -1 && copy < runtime)
})
