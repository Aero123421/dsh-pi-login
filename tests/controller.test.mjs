import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LoginController } from '../src/controller.mjs'

function setup() {
  const requests = []
  const controller = new LoginController({ rpc: {
    call(path, method, payload, signal) {
      if (!method.endsWith('/connection-list')) return Promise.resolve({ ok: true, value: {} })
      return new Promise((resolve, reject) => requests.push({ signal, resolve, reject }))
    },
  } })
  return { controller, requests }
}

const snapshot = enabled => ({ connections: [{ enabled }], integrations: [], services: [], profileKey: 'test-profile', generation: 1, revision: 7 })
const expected = enabled => ({ status: 'ready', ...snapshot(enabled), entries: [{ enabled }], error: false })
const reply = (request, enabled) => request.resolve({ ok: true, value: snapshot(enabled) })

test('ordinary concurrent loads share one request', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  const first = controller.load()
  assert.equal(controller.load(), first)
  assert.equal(requests.length, 1)
  reply(requests[0], false)
  await first
  assert.deepEqual(controller.getSnapshot(), expected(false))
})

test('refresh after a saved setting invalidates the outstanding list', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  const old = controller.load()
  await controller.call('set-provider', { enabled: true })
  const current = controller.refresh()
  assert.equal(requests.length, 2)
  assert.equal(requests[0].signal.aborted, true)
  reply(requests[0], false)
  await old
  assert.equal(controller.getSnapshot().status, 'loading')
  assert.equal(controller.load(), current)
  reply(requests[1], true)
  await current
  assert.deepEqual(controller.getSnapshot(), expected(true))
})

for (const outcome of ['success', 'failure']) {
  test(`an old connection's delayed ${outcome} cannot overwrite a refreshed connection`, async t => {
    const { controller, requests } = setup()
    t.after(() => controller.dispose())
    const old = controller.load()
    const current = controller.refresh()
    reply(requests[1], true)
    await current
    if (outcome === 'success') reply(requests[0], false)
    else requests[0].reject(new Error('old connection failed'))
    await old
    assert.deepEqual(controller.getSnapshot(), expected(true))
    const next = controller.load()
    assert.equal(requests.length, 3)
    reply(requests[2], true)
    await next
  })
}

test('repeated invalidations retain only the latest request', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  const first = controller.load()
  const second = controller.refresh()
  const third = controller.refresh()
  assert.equal(requests[0].signal.aborted, true)
  assert.equal(requests[1].signal.aborted, true)
  reply(requests[1], false)
  requests[0].reject(new Error('stale failure'))
  await Promise.all([first, second])
  assert.equal(controller.load(), third)
  reply(requests[2], true)
  await third
  assert.equal(controller.getSnapshot().entries[0].enabled, true)
})

test('disposing aborts the list and ignores its late response', async () => {
  const { controller, requests } = setup()
  let updates = 0
  controller.subscribe(() => updates++)
  const pending = controller.load()
  controller.dispose()
  assert.equal(requests[0].signal.aborted, true)
  reply(requests[0], true)
  await pending
  await controller.refresh()
  assert.equal(requests.length, 1)
  assert.equal(updates, 1)
})

test('mutations use the current Host profile identity, replacing caller-supplied scope', async () => {
  const payloads = []
  const controller = new LoginController({ rpc: { async call(path, method, payload) {
    payloads.push(payload)
    return { ok: true, value: method.endsWith('/connection-list') ? snapshot(true) : {} }
  } } })
  await controller.load()
  await controller.mutation('connection-update', { connectionId: 'c-one', profileKey: 'old', generation: 9 })
  assert.deepEqual(payloads[1], { connectionId: 'c-one', profileKey: 'test-profile', generation: 1 })
  controller.dispose()
})

test('dialog scope cannot borrow a newly selected profile for queued writes', async () => {
  const calls = []
  const controller = new LoginController({ rpc: { async call(path, method, payload) {
    calls.push({ method, payload }); return { ok: true, value: {} }
  } } })
  controller.publish(expected(true))
  const dialog = controller.scoped()
  controller.publish({ ...expected(true), profileKey: 'different-profile', generation: 2 })
  await assert.rejects(dialog.mutation('set-model', { connectionId: 'same-id', model: 'm', enabled: true }), /profile-changed/)
  assert.equal(calls.length, 0)
  controller.dispose()
})

test('a delayed scoped read is discarded after profile change', async () => {
  let complete
  const controller = new LoginController({ rpc: { call() { return new Promise(resolve => { complete = resolve }) } } })
  controller.publish(expected(true))
  const read = controller.scoped().call('models', { connectionId: 'same-id' })
  controller.publish({ ...expected(true), profileKey: 'different-profile', generation: 2 })
  complete({ ok: true, value: { models: ['other-account'] } })
  await assert.rejects(read, /profile-changed/)
  controller.dispose()
})

test('model dialog binds account generation even when profile and connection id are unchanged', async () => {
  const calls = []
  const controller = new LoginController({ rpc: { async call(path, method, payload) { calls.push(payload); return { ok: true, value: {} } } } })
  controller.publish({ ...expected(true), entries: [{ connectionId: 'c-account', credentialGeneration: 3 }] })
  const dialog = controller.scoped(controller.state.entries[0])
  await dialog.call('models')
  assert.equal(calls[0].credentialGeneration, 3)
  controller.publish({ ...controller.state, entries: [{ connectionId: 'c-account', credentialGeneration: 4 }] })
  await assert.rejects(dialog.mutation('set-model', { enabled: true }), /connection-changed/)
  assert.equal(calls.length, 1)
  controller.dispose()
})

test('an accepted sign-in that returns after a profile switch is cancelled with its original scope', async () => {
  let complete
  const calls = []
  const controller = new LoginController({ rpc: { call(path, method, payload) {
    calls.push({ method, payload })
    if (method.endsWith('/start')) return new Promise(resolve => { complete = resolve })
    return Promise.resolve({ ok: true, value: {} })
  } } })
  controller.publish(expected(true))
  const started = controller.scoped().start('c-account', 'oauth')
  controller.publish({ ...expected(true), profileKey: 'other-profile', generation: 2 })
  complete({ ok: true, value: { ticket: 'accepted-old-ticket' } })
  await assert.rejects(started, /profile-changed/)
  assert.deepEqual(calls[1].payload, { ticket: 'accepted-old-ticket', profileKey: 'test-profile', generation: 1 })
  assert.equal(controller.tickets.size, 0)
  controller.dispose()
})

test('RPC errors preserve a stable code separately from display text', async () => {
  const controller = new LoginController({ rpc: { async call() { return { ok: false, error: { code: 'dsh-pi-login/credential-delete-failed' } } } } })
  await assert.rejects(controller.call('connection-delete'), error => error.code === 'dsh-pi-login/credential-delete-failed')
  controller.dispose()
})
