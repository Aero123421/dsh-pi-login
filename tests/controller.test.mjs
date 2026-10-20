import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LoginController, finishConnectionCreate, finishConnectionRecover } from '../src/controller.mjs'

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
  let oldDone = false
  const waited = old.then(() => { oldDone = true })
  reply(requests[0], false)
  await new Promise(r => setImmediate(r))
  assert.equal(oldDone, false)
  assert.equal(controller.getSnapshot().status, 'loading')
  assert.equal(controller.load(), current)
  reply(requests[1], true)
  await current
  await waited
  assert.equal(oldDone, true)
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
  let settled = false
  const gate = Promise.all([first, second]).then(() => { settled = true })
  reply(requests[1], false)
  requests[0].reject(new Error('stale failure'))
  await new Promise(r => setImmediate(r))
  assert.equal(settled, false)
  assert.equal(controller.load(), third)
  reply(requests[2], true)
  await gate
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

test('a superseded load resolves only after the latest list is published', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  const first = controller.load()
  const latest = controller.refresh()
  reply(requests[0], false)
  await new Promise(r => setImmediate(r))
  assert.equal(controller.getSnapshot().entries.length, 0)
  let published = false
  controller.subscribe(() => { if (controller.getSnapshot().status === 'ready') published = true })
  let done = false
  const finished = first.then(() => { done = true })
  await new Promise(r => setImmediate(r))
  assert.equal(done, false)
  reply(requests[1], true)
  await latest
  await finished
  assert.equal(published, true)
  assert.equal(done, true)
  assert.deepEqual(controller.getSnapshot(), expected(true))
})

function listReply(request, connections) {
  request.resolve({ ok: true, value: { connections, integrations: [], services: [], profileKey: 'test-profile', generation: 1, revision: 7 } })
}

test('an interrupting refresh still lets Add and sign in open the new connection once', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  controller.publish(expected(true))
  const dialog = controller.scoped()
  const startup = controller.load()
  const opened = []
  const saving = finishConnectionCreate(dialog, { connectionId: 'c-new', saved: true }, {
    method: 'oauth', displayName: 'New', onSaved() {}, onLogin(entry) { opened.push(entry) },
  })
  const interrupt = controller.refresh()
  assert.equal(requests[0].signal.aborted, true)
  assert.equal(requests[1].signal.aborted, true)
  listReply(requests[0], [])
  listReply(requests[1], [{ connectionId: 'c-stale', authMethod: 'oauth', displayName: 'Stale', credentialGeneration: 0 }])
  let done = false
  const finished = saving.then(() => { done = true })
  await new Promise(r => setImmediate(r))
  assert.equal(done, false)
  assert.equal(opened.length, 0)
  listReply(requests[2], [{ connectionId: 'c-new', authMethod: 'oauth', displayName: 'New', credentialGeneration: 0, enabled: false }])
  await interrupt
  await finished
  await startup
  assert.equal(opened.length, 1)
  assert.equal(opened[0].connectionId, 'c-new')
  assert.equal(opened[0].authMethod, 'oauth')
  assert.equal(controller.getSnapshot().entries[0].connectionId, 'c-new')
})

test('an interrupting refresh still lets a settings dialog see the latest credential generation once', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  controller.publish({ ...expected(true), entries: [{ connectionId: 'c-1', credentialGeneration: 0 }] })
  const dialog = controller.scoped()
  const startup = controller.load()
  const saved = []
  const recovering = finishConnectionRecover(dialog, { connectionId: 'c-1', credentialGeneration: 0 }, {
    notice: 'settings-changed', onSaved(notice) { saved.push(notice) },
  })
  const interrupt = controller.refresh()
  listReply(requests[0], [{ connectionId: 'c-1', credentialGeneration: 9 }])
  listReply(requests[1], [{ connectionId: 'c-1', credentialGeneration: 0 }])
  let done = false
  const finished = recovering.then(() => { done = true })
  await new Promise(r => setImmediate(r))
  assert.equal(done, false)
  listReply(requests[2], [{ connectionId: 'c-1', credentialGeneration: 1 }])
  await interrupt
  await finished
  await startup
  assert.deepEqual(saved, ['settings-changed'])
  assert.equal(controller.entry('c-1').credentialGeneration, 1)
})

test('refreshIfMounted skips RPC until the connection page is retained', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  await controller.refreshIfMounted()
  assert.equal(requests.length, 0)
  const release = controller.retain()
  const pending = controller.refreshIfMounted()
  assert.equal(requests.length, 1)
  reply(requests[0], true)
  await pending
  assert.equal(controller.getSnapshot().status, 'ready')
  release()
  await controller.refreshIfMounted()
  assert.equal(requests.length, 1)
})
