import assert from 'node:assert/strict'
import test from 'node:test'
import { claimSubmit } from '../src/submit-lock.mjs'

test('claimSubmit is set before any later state update and rejects re-entry', () => {
  const lock = { current: false }
  const calls = []
  function save() {
    if (!claimSubmit(lock)) return false
    calls.push('busy')
    return true
  }
  assert.equal(save(), true)
  assert.equal(lock.current, true)
  assert.equal(save(), false)
  assert.deepEqual(calls, ['busy'])
  lock.current = false
  assert.equal(save(), true)
})
