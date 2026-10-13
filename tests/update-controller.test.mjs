import test from 'node:test'
import assert from 'node:assert/strict'
import { UpdateController } from '../src/update-controller.mjs'
const tick = () => new Promise(resolve => setImmediate(resolve))
function storage() { const values = new Map(); return { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) } }
function deferred() { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }

test('lost begin response retains operation id before RPC and reconnect never resubmits', async () => {
  const saved = storage(), calls = []
  const connection = { rpc: { call: async (_path, method, payload) => {
    calls.push({ method, payload })
    if (method.endsWith('begin')) { assert.equal(saved.getItem('dsh-pi-login:update'), payload.requestId); throw new Error('disconnected') }
    return { ok: true, value: { status: 'unknown', requestId: payload.requestId } }
  } } }
  const old = new UpdateController(connection, saved)
  old.publish({ status: 'available', candidate: { id: '7', version: '0.6.0' } })
  const first = old.begin(), duplicate = old.begin(); await Promise.all([first, duplicate])
  assert.equal(old.state.status, 'unknown'); old.dispose()
  const next = new UpdateController(connection, saved)
  await next.load(); await next.begin()
  assert.equal(calls.filter(call => call.method.endsWith('begin')).length, 1)
  assert.equal(calls.at(-1).method, 'dsh-pi-login/update-reconcile')
  assert.equal(calls[0].payload.requestId, calls.at(-1).payload.requestId)
  next.dispose()
})
test('connection reset and disposal suppress stale check replies', async () => {
  const check = deferred()
  const controller = new UpdateController({ rpc: { call: async (_path, method) => method.endsWith('check') ? check.promise : { ok: true, value: { status: 'idle' } } } }, storage())
  const pending = controller.check(); await tick(); await controller.load()
  check.resolve({ ok: true, value: { status: 'available' } }); await pending
  assert.equal(controller.state.status, 'idle'); controller.dispose()
  controller.publish({ status: 'failed' }); assert.equal(controller.state.status, 'idle')
})
test('explicit host refusal is failed rather than unknown or success', async () => {
  const controller = new UpdateController({ rpc: { call: async () => ({ ok: false, error: { code: 'dsh-pi-login/busy' } }) } }, storage())
  controller.publish({ status: 'available', candidate: { id: '7' } }); await controller.begin()
  assert.equal(controller.state.status, 'failed'); assert.equal(controller.state.reason, 'busy'); controller.dispose()
})
