import test from 'node:test'
import assert from 'node:assert/strict'
import { UpdateController } from '../src/update-controller.mjs'
const profileKey = 'a'.repeat(64)
const tick = () => new Promise(resolve => setImmediate(resolve))
function storage() { const values = new Map(); return { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) } }
function deferred() { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }

test('lost begin response retains operation id before RPC and reconnect never resubmits', async () => {
  const saved = storage(), calls = []
  const connection = { rpc: { call: async (_path, method, payload) => {
    calls.push({ method, payload })
    if (method.endsWith('begin')) { assert.equal(saved.getItem('dsh-pi-login:update:' + profileKey), payload.requestId); throw new Error('disconnected') }
    return { ok: true, value: method.endsWith('status') ? { status: 'idle', profileKey } : { status: 'unknown', profileKey, requestId: payload.requestId } }
  } } }
  const old = new UpdateController(connection, saved)
  old.publish({ status: 'available', profileKey, candidate: { id: '7', version: '0.6.0' } })
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
test('a new check clears stale incompatibility details while the reply is pending', async () => {
  const check = deferred()
  const controller = new UpdateController({ rpc: { call: async (_path, method) => method.endsWith('check') ? check.promise : { ok: true, value: { status: 'idle' } } } }, storage())
  controller.publish({ status: 'blocked', reason: 'incompatible', requiredDshVersion: 'old-range', candidate: { id: 'old-candidate' } })
  const pending = controller.check(); await tick()
  assert.equal(controller.state.status, 'checking')
  assert.equal(controller.state.reason, undefined)
  assert.equal(controller.state.requiredDshVersion, undefined)
  assert.equal(controller.state.candidate, undefined)
  check.resolve({ ok: true, value: { status: 'blocked', reason: 'network' } }); await pending
  assert.equal(controller.state.reason, 'network')
  controller.dispose()
})
test('a stale update candidate is not reported as a network failure', async () => {
  const controller = new UpdateController({ rpc: { call: async () => ({ ok: false, error: { code: 'dsh-pi-login/stale-candidate' } }) } }, storage())
  controller.publish({ status: 'available', profileKey, candidate: { id: '7' } })
  await controller.begin()
  assert.equal(controller.state.status, 'failed')
  assert.equal(controller.state.reason, 'stale-candidate')
  controller.dispose()
})

test('explicit host refusal is failed rather than unknown or success', async () => {
  const controller = new UpdateController({ rpc: { call: async () => ({ ok: false, error: { code: 'dsh-pi-login/busy' } }) } }, storage())
  controller.publish({ status: 'available', profileKey, candidate: { id: '7' } }); await controller.begin()
  assert.equal(controller.state.status, 'failed'); assert.equal(controller.state.reason, 'busy'); controller.dispose()
})

test('incompatible begin refusal clears an unadmitted id and preserves the required range', async () => {
  const saved = storage(), calls = []
  const controller = new UpdateController({ rpc: { call: async (_path, method) => {
    calls.push(method)
    return { ok: true, value: { status: 'blocked', reason: 'incompatible', requiredDshVersion: '>=0.2.2 <0.3.0-0', profileKey } }
  } } }, saved)
  controller.publish({ status: 'available', profileKey, candidate: { id: '7', version: '0.6.0' } }); await controller.begin()
  assert.deepEqual(calls, ['dsh-pi-login/update-begin'])
  assert.equal(controller.state.status, 'blocked')
  assert.equal(controller.state.reason, 'incompatible')
  assert.equal(controller.state.requiredDshVersion, '>=0.2.2 <0.3.0-0')
  assert.equal(controller.state.candidate, undefined)
  assert.equal(controller.requestId, undefined)
  assert.equal(saved.getItem('dsh-pi-login:update:' + profileKey), undefined)
  controller.dispose()
})

test('reconnect restores required DSH range from an admitted operation journal', async () => {
  const saved = storage(), requestId = crypto.randomUUID(), calls = []
  saved.setItem('dsh-pi-login:update:' + profileKey, requestId)
  const controller = new UpdateController({ rpc: { call: async (_path, method, payload) => {
    calls.push({ method, payload })
    if (method.endsWith('status')) return { ok: true, value: { status: 'idle', profileKey } }
    return { ok: true, value: { status: 'failed', reason: 'incompatible', requiredDshVersion: '>=0.2.2 <0.3.0-0', profileKey, requestId } }
  } } }, saved)
  await controller.load()
  assert.equal(calls.at(-1).method, 'dsh-pi-login/update-reconcile')
  assert.equal(calls.at(-1).payload.requestId, requestId)
  assert.equal(controller.state.status, 'failed')
  assert.equal(controller.state.reason, 'incompatible')
  assert.equal(controller.state.requiredDshVersion, '>=0.2.2 <0.3.0-0')
  controller.dispose()
})

test('authoritative begin refusal clears the rejected id and reconnect discovers the accepted operation', async () => {
  const saved = storage(), calls = []
  const controller = new UpdateController({ rpc: { call: async (_path, method, payload) => {
    calls.push({ method, payload })
    return method.endsWith('begin') ? { ok: false, error: { code: 'dsh-pi-login/busy' } } : { ok: true, value: { status: 'restart-required', profileKey, requestId: 'accepted-operation', runtimeVersion: '0.5.0' } }
  } } }, saved)
  controller.publish({ status: 'available', profileKey, candidate: { id: '7' } }); await controller.begin()
  assert.equal(saved.getItem('dsh-pi-login:update:' + profileKey), undefined)
  await controller.load()
  assert.equal(calls.at(-1).method, 'dsh-pi-login/update-reconcile')
  assert.equal(controller.state.status, 'restart-required')
  assert.equal(controller.requestId, 'accepted-operation')
  controller.dispose()
})

const candidate = { id: 'release', version: '0.6.0' }
test('same origin profile switch never reconciles another profile and retains original lost receipt', async () => {
  const saved = storage(),
    calls = []
  let current = profileKey
  const other = 'b'.repeat(64)
  const connection = {
    rpc: {
      call: async (_base, method, payload) => {
        calls.push({ method, payload })
        if (method.endsWith('begin')) throw new Error('lost response')
        return {
          ok: true,
          value: method.endsWith('status')
            ? { status: 'idle', profileKey: current }
            : { status: 'unknown', profileKey: current, requestId: payload.requestId },
        }
      },
    },
  }
  const controller = new UpdateController(
    connection, saved,
  )
  controller.publish({ status: 'available', candidate, profileKey })
  await controller.begin()
  const original = controller.requestId
  current = other
  await controller.load()
  assert.equal(controller.state.status, 'idle')
  assert.equal(controller.requestId, undefined)
  assert.equal(calls.filter(call => call.method.endsWith('reconcile')).length, 0)
  current = profileKey
  await controller.load()
  assert.equal(calls.at(-1).payload.requestId, original)
  assert.equal(calls.at(-1).payload.profileKey, profileKey)
  assert.equal(controller.state.status, 'unknown')
  controller.dispose()
})

test('late begin response from previous profile cannot overwrite current receipt', async () => {
  let finish
  const saved = storage(),
    other = 'b'.repeat(64)
  const controller = new UpdateController(
    {
      rpc: {
        call: async (_base, method, payload) => {
          if (method.endsWith('begin'))
            return new Promise(resolve => {
              finish = () =>
                resolve({ ok: true, value: { status: 'installing', profileKey, requestId: payload.requestId } })
            })
          return { ok: true, value: { status: 'idle', profileKey: other } }
        },
      },
    },
    saved,
  )
  controller.publish({ status: 'available', candidate, profileKey })
  const begin = controller.begin()
  await new Promise(resolve => setImmediate(resolve))
  await controller.load()
  finish()
  await begin
  assert.equal(controller.profileKey, other)
  assert.equal(controller.requestId, undefined)
  assert.equal(controller.state.status, 'idle')
  assert.equal(saved.getItem('dsh-pi-login:update:' + other), undefined)
  controller.dispose()
})

test('authoritative active server operation replaces old browser receipt', async () => {
  const saved = storage(),
    calls = [],
    old = crypto.randomUUID(),
    current = crypto.randomUUID()
  saved.setItem('dsh-pi-login:update:' + profileKey, old)
  const controller = new UpdateController(
    {
      rpc: {
        call: async (_base, method, payload) => {
          calls.push({ method, payload })
          return {
            ok: true,
            value: {
              status: 'installing',
              profileKey,
              requestId: method.endsWith('status') ? current : payload.requestId,
            },
          }
        },
      },
    },
    saved,
  )
  await controller.load()
  assert.equal(controller.requestId, current)
  assert.equal(calls.at(-1).payload.requestId, current)
  assert.equal(controller.state.status, 'installing')
  assert.equal(saved.getItem('dsh-pi-login:update:' + profileKey), current)
  assert.equal(
    calls.some(call => call.method.endsWith('begin')),
    false,
  )
  controller.dispose()
})
