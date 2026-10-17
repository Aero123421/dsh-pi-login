import test from 'node:test'
import assert from 'node:assert/strict'
import { createModelEditor } from '../src/model-snapshot.mjs'

const catalog = (revision, enabled) => ({ revision, models: [{ id: 'muse', enabled }] })

test('a stale catalog reload cannot replace a switch that already saved', () => {
  const editor = createModelEditor()
  const first = editor.beginReload()
  assert.equal(first.accept(catalog(3, false)), true)
  const reload = editor.beginReload()
  const toggle = editor.beginToggle('muse', true)
  assert.equal(reload.accept(catalog(3, false)), false)
  assert.equal(toggle.reconcile(catalog(4, true)).models[0].enabled, true)
  toggle.finish()
  assert.equal(reload.accept(catalog(3, false)), false)
  const late = editor.beginReload()
  assert.equal(late.accept(catalog(3, false)), false)
  assert.equal(late.accept(catalog(4, true)), true)
})

test('pending switch values stay on top of an older snapshot', () => {
  const editor = createModelEditor()
  editor.note(catalog(2, false))
  const toggle = editor.beginToggle('muse', true)
  assert.deepEqual(toggle.overlay(catalog(2, false)).models, [{ id: 'muse', enabled: true }])
  toggle.finish()
  assert.equal(editor.project(catalog(2, false)).models[0].enabled, false)
})

test('a newer toggle is not cleared by an older toggle finishing', () => {
  const editor = createModelEditor()
  const older = editor.beginToggle('muse', true)
  const newer = editor.beginToggle('muse', false)
  older.finish()
  assert.equal(editor.project(catalog(1, true)).models[0].enabled, false)
  assert.equal(older.reconcile(catalog(2, true)).models[0].enabled, false)
  assert.equal(newer.reconcile(catalog(2, false)).models[0].enabled, false)
  newer.finish()
  assert.equal(editor.project(catalog(2, false)).models[0].enabled, false)
})

test('another connection does not inherit the previous published revision', () => {
  const first = createModelEditor()
  first.note(catalog(8, true))
  const second = createModelEditor()
  const load = second.beginReload()
  assert.equal(load.accept(catalog(1, false)), true)
})

test('a failed write reconciles to Host state while another model remains pending', () => {
  const editor = createModelEditor()
  const original = { revision: 3, models: [{ id: 'muse', enabled: true }, { id: 'spark', enabled: false }] }
  editor.note(original)
  const failed = editor.beginToggle('muse', false)
  const newer = editor.beginToggle('spark', true)
  const confirmed = failed.reconcile(original)
  assert.deepEqual(confirmed.models, [{ id: 'muse', enabled: true }, { id: 'spark', enabled: true }])
  failed.finish()
  assert.deepEqual(editor.project(original).models, confirmed.models)
  assert.equal(newer.reconcile({ ...original, revision: 4, models: confirmed.models }).models[1].enabled, true)
})

test('a settled write cannot undo a newer same-model choice or cross disposal', () => {
  const editor = createModelEditor()
  const older = editor.beginToggle('muse', false)
  const newer = editor.beginToggle('muse', true)
  assert.equal(older.reconcile(catalog(4, false)).models[0].enabled, true)
  assert.equal(newer.reconcile(catalog(5, true)).models[0].enabled, true)
  const stale = editor.beginToggle('muse', false)
  assert.equal(stale.reconcile(catalog(4, false)), undefined)
  editor.invalidate()
  assert.equal(stale.reconcile(catalog(6, false)), undefined)
})
