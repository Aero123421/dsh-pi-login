import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createExternalIntegrations, ExternalIntegrationError } from '../src/external-integrations.mjs'

function fixture(t, options = {}) {
  let registered = [{ id: 'exact/route-A', name: 'Meta' }, { id: 'exact/route-B', name: 'Meta' }, { id: 'live-only', name: 'Gateway' }, { id: 'pi-route', name: 'Pi owned' }]
  let declared = [
    { provider: 'exact/route-A', displayName: 'Meta', settingsNs: 'external-meta', settingsPath: ['profiles', 'a'], apiKey: 'SECRET' },
    { provider: 'exact/route-B', displayName: 'Meta', settingsNs: 'second-meta', settingsPath: ['private', 'b'] },
    { provider: 'dormant', displayName: 'Not configured', settingsNs: 'external-other', settingsPath: [] },
    { provider: 'unavailable', displayName: 'Unavailable', settingsNs: 'external-other', settingsPath: [], error: 'SECRET auth payload' },
    { provider: 'pi-route', displayName: 'Pi owned', settingsNs: 'llm-pi-ai', settingsPath: ['providers', 'pi-route'] },
  ]
  const calls = []
  const llm = {
    listProviders: () => registered,
    listConfigurableProviders: () => declared,
    listModels: async route => {
      calls.push(route)
      return [{ provider: route, id: 'same-model', name: 'Shared model', inputModalities: ['text'], apiKey: 'SECRET-MODEL', raw: 'SECRET' }]
    },
  }
  const helper = createExternalIntegrations({ llm, profileKey: 'profile-a', ...options })
  t.after(() => helper.dispose())
  return { helper, llm, calls, get registered() { return registered }, set registered(value) { registered = value }, get declared() { return declared }, set declared(value) { declared = value } }
}

test('official directories join exact live/dormant routes and preserve owner sources without guessing auth', async t => {
  const f = fixture(t)
  const rows = await f.helper.publicConnections()
  assert.equal(rows.length, 5)
  assert.deepEqual(rows.filter(row => row.displayName === 'Meta').map(row => row.source), ['external-meta', 'second-meta'])
  assert.equal(rows.find(row => row.routeId === 'live-only').source, 'unknown')
  assert.equal(rows.find(row => row.routeId === 'dormant').directoryState, 'declared')
  assert.equal(rows.find(row => row.routeId === 'unavailable').directoryState, 'unavailable')
  assert.ok(rows.every(row => row.authStatus === 'owner-managed' && row.writable === false && row.methods.length === 0))
  assert.ok(rows.every(row => Object.values(row.capabilities).every(value => value === false)))
  assert.doesNotMatch(JSON.stringify(rows), /SECRET|settingsPath|apiKey|private/)
  assert.equal(f.calls.length, 0)
  assert.deepEqual(f.helper.descriptor.listConnections(), rows)
  assert.equal(f.helper.descriptor.listServices().length, rows.length)
})

test('external discovery never reads settings, credentials, authorization or registers routes in Pi', async t => {
  const f = fixture(t)
  for (const key of ['credentials', 'authorization', 'settings', 'registerAdapter', 'generate']) Object.defineProperty(f.llm, key, { get() { throw Error(`must never access ${key}`) } })
  await f.helper.publicConnections()
  assert.equal(f.calls.length, 0)
  await assert.rejects(f.helper.models(f.helper.descriptor.listConnections()[0].connectionId), /external-models-unsupported/)
})

test('display renames keep stable route identity; profile IDs differ and owned routes are excluded exactly', async t => {
  const f = fixture(t, { excludeRoutes: () => ['exact/route-A'] })
  let rows = await f.helper.publicConnections()
  assert.ok(!rows.some(row => row.routeId === 'exact/route-A'))
  const id = rows.find(row => row.routeId === 'exact/route-B').connectionId
  f.declared[1].displayName = 'Renamed'
  rows = await f.helper.publicConnections()
  assert.equal(rows.find(row => row.routeId === 'exact/route-B').connectionId, id)
  const other = createExternalIntegrations({ llm: f.llm, profileKey: 'profile-b' })
  t.after(() => other.dispose())
  assert.notEqual((await other.publicConnections()).find(row => row.routeId === 'exact/route-B').connectionId, id)
})

test('one directory failure preserves the other public directory and redacts failure bodies', async t => {
  const f = fixture(t)
  f.llm.listProviders = () => { throw Error('SECRET registered directory') }
  let rows = await f.helper.publicConnections()
  assert.ok(rows.some(row => row.routeId === 'dormant'))
  assert.ok(!rows.some(row => row.routeId === 'live-only'))
  assert.deepEqual(f.helper.state().failures, ['registered'])
  f.llm.listProviders = () => f.registered
  f.llm.listConfigurableProviders = () => Promise.reject(Error('SECRET configurable directory'))
  rows = await f.helper.publicConnections()
  assert.equal(rows.find(row => row.routeId === 'live-only').directoryState, 'live')
  assert.equal(rows.find(row => row.routeId === 'exact/route-A').source, 'unknown')
  assert.doesNotMatch(JSON.stringify(f.helper.state()), /SECRET/)
})

test('optional read-only model lookup keeps provider/model pairs distinct and isolates provider failures', async t => {
  const f = fixture(t, { allowModelRead: true })
  const rows = await f.helper.publicConnections()
  const a = rows.find(row => row.routeId === 'exact/route-A'), b = rows.find(row => row.routeId === 'exact/route-B')
  const first = await f.helper.models(a.connectionId), second = await f.helper.models(b.connectionId)
  assert.equal(first.models[0].id, second.models[0].id)
  assert.notEqual(first.models[0].provider, second.models[0].provider)
  assert.deepEqual(f.calls, ['exact/route-A', 'exact/route-B'])
  assert.equal(first.readOnly, true)
  assert.doesNotMatch(JSON.stringify([first, second]), /SECRET|apiKey|Fast|reasoning/)
  f.llm.listModels = route => route === a.routeId ? Promise.reject(Error('SECRET failed provider')) : Promise.resolve([{ provider: route, id: 'same-model', name: 'Same' }])
  await assert.rejects(f.helper.models(a.connectionId), error => error.message === 'external-unavailable')
  assert.equal((await f.helper.models(b.connectionId)).models.length, 1)
})

test('route collisions are explicit and old responses cannot survive provider removal or profile switching', async t => {
  let generation = 1
  const f = fixture(t, { allowModelRead: true, generation: () => generation })
  const rows = await f.helper.publicConnections(), row = rows.find(value => value.routeId === 'live-only')
  f.registered = [...f.registered, { id: 'live-only', name: 'Collision' }]
  await assert.rejects(f.helper.publicConnections(), /external-route-conflict/)
  f.registered = f.registered.slice(0, -1)
  let release, began
  f.llm.listModels = () => { began(); return new Promise(resolve => { release = resolve }) }
  const started = new Promise(resolve => { began = resolve })
  const pending = f.helper.models(row.connectionId)
  await started
  f.registered = f.registered.filter(value => value.id !== row.routeId)
  await f.helper.publicConnections()
  release([{ provider: row.routeId, id: 'old-model', name: 'Old' }])
  await assert.rejects(pending, /external-provider-unavailable/)
  f.llm.listProviders = () => new Promise(resolve => { release = resolve })
  const late = f.helper.publicConnections()
  await new Promise(resolve => setImmediate(resolve)); generation++
  release([])
  await assert.rejects(late, /external-profile-changed/)
})
