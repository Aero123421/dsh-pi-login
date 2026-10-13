import assert from 'node:assert/strict'
import test from 'node:test'
import { IntegrationRegistry } from '../src/registry.mjs'

test('route conflict leaves the previous integration and all other routes registered', () => {
  const registry = new IntegrationRegistry('a')
  for (const integrationId of ['pi', 'external']) registry.register({ integrationId, listServices: () => [], listConnections: () => [] })
  registry.replaceConnections('pi', { 'c-one': { integrationId: 'pi', serviceId: 'openai', routeId: 'pi-c-one' } })
  registry.replaceConnections('external', { 'c-two': { integrationId: 'external', serviceId: 'gateway', routeId: 'external-c-two' } })
  const before = [...registry.routes]
  assert.throws(() => registry.replaceConnections('pi', { 'c-three': { integrationId: 'pi', serviceId: 'openai', routeId: 'external-c-two' } }), error => error.code === 'route-conflict')
  assert.deepEqual([...registry.routes], before)
})

test('a token from profile A stays invalid after A → B → A; owner unload removes only owned routes', () => {
  const registry = new IntegrationRegistry('a')
  const unload = registry.register({ integrationId: 'pi', listServices: () => [], listConnections: () => [] })
  registry.register({ integrationId: 'external', listServices: () => [], listConnections: () => [] })
  const token = registry.token('c-one')
  registry.switchProfile('b'); registry.switchProfile('a')
  assert.equal(registry.isCurrent(token), false)
  registry.replaceConnections('pi', { 'c-one': { integrationId: 'pi', serviceId: 'openai', routeId: 'pi-c-one' } })
  registry.replaceConnections('external', { 'c-two': { integrationId: 'external', serviceId: 'gateway', routeId: 'external-c-two' } })
  unload()
  assert.equal(registry.routes.has('pi-c-one'), false)
  assert.equal(registry.routes.has('external-c-two'), true)
  const current = registry.token('c-two')
  registry.dispose()
  assert.equal(registry.isCurrent(current), false)
})

test('fresh mounts of the same profile cannot accept a previous mount token', () => {
  const first = new IntegrationRegistry('same-profile')
  const old = first.token('c-one')
  first.dispose()
  const next = new IntegrationRegistry('same-profile')
  assert.notEqual(next.generation, old.generation)
  assert.equal(next.isCurrent(old), false)
  assert.equal(next.isCurrent(next.token('c-one')), true)
  next.dispose()
})
