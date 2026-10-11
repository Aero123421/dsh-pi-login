import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LoginController } from '../src/controller.mjs'

function setup() {
  const requests = []
  const controller = new LoginController({ rpc: {
    call(path, method, payload, signal) {
      if (!method.endsWith('/list')) return Promise.resolve({ ok: true, value: {} })
      return new Promise((resolve, reject) => requests.push({ signal, resolve, reject }))
    },
  } })
  return { controller, requests }
}

const reply = (request, enabled) => request.resolve({ ok: true, value: [{ enabled }] })

test('ordinary concurrent loads share one request', async t => {
  const { controller, requests } = setup()
  t.after(() => controller.dispose())
  const first = controller.load()
  assert.equal(controller.load(), first)
  assert.equal(requests.length, 1)
  reply(requests[0], false)
  await first
  assert.deepEqual(controller.getSnapshot(), { status: 'ready', entries: [{ enabled: false }], error: false })
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
  assert.deepEqual(controller.getSnapshot(), { status: 'ready', entries: [{ enabled: true }], error: false })
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
    assert.deepEqual(controller.getSnapshot(), { status: 'ready', entries: [{ enabled: true }], error: false })
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
