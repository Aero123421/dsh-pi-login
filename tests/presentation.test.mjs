import test from 'node:test'
import assert from 'node:assert/strict'
import { formatTime, retryWait, statusOf, usageLimited, versionDiffersLine } from '../src/presentation.mjs'
import { en, ja } from '../src/locales.mjs'

const entry = (patch) => ({ configured: true, enabled: true, authStatus: 'saved', ...patch })

test('a saved key is not shown as a completed sign-in', () => {
  assert.deepEqual(statusOf(entry({ authStatus: 'verified' })), { dot: 'done', copy: 'connected' })
  assert.deepEqual(statusOf(entry({ authStatus: 'saved' })), { dot: 'warning', copy: 'savedUnverified' })
  assert.deepEqual(statusOf(entry({ authStatus: undefined })), { dot: 'warning', copy: 'savedUnverified' })
  assert.deepEqual(statusOf(entry({ enabled: false, authStatus: 'verified' })), { dot: 'idle', copy: 'statusOff' })
  assert.deepEqual(statusOf(entry({ configured: false })), { dot: 'idle', copy: 'notConnected' })
  assert.deepEqual(statusOf(entry({ authStatus: 'expired' })), { dot: 'error', copy: 'authExpired' })
  assert.deepEqual(statusOf(entry({ deletionPending: true })), { dot: 'warning', copy: 'deletionPendingShort' })
})

test('rate-limit expiry is a clock check and does not invent a retry', () => {
  const now = Date.parse('2026-10-15T00:00:00.000Z')
  assert.equal(usageLimited({ status: 'rate-limited', retryAt: '2026-10-15T00:00:01.000Z' }, now), true)
  assert.equal(usageLimited({ status: 'rate-limited', retryAt: '2026-10-15T00:00:00.000Z' }, now), false)
  assert.equal(usageLimited({ status: 'available', retryAt: '2099-01-01T00:00:00.000Z' }, now), false)
  assert.equal(retryWait('2026-10-15T00:00:00.400Z', now), 400)
  assert.equal(retryWait('not-a-date', now), 0)
  assert.equal(Math.min(retryWait('2099-01-01T00:00:00.000Z', now), 2 ** 31 - 1), 2 ** 31 - 1)
})

test('an installed package with a different version names both versions', () => {
  const state = { reason: 'version-differs', installedVersion: '9.9.9', expectedVersion: '0.5.0' }
  const english = versionDiffersLine(state, key => en[key])
  const japanese = versionDiffersLine(state, key => ja[key])
  assert.match(english, /9\.9\.9/)
  assert.match(english, /0\.5\.0/)
  assert.match(japanese, /9\.9\.9/)
  assert.match(japanese, /0\.5\.0/)
  assert.match(versionDiffersLine({ installedVersion: '1.2.3' }, key => en[key]), /1\.2\.3/)
  assert.doesNotMatch(versionDiffersLine({ installedVersion: '1.2.3' }, key => en[key]), /Previous version:/)
  assert.match(versionDiffersLine({}, key => ja[key]), /確認できませんでした/)
  assert.equal(en['updateReason_version-differs'].includes('not the previous version'), true)
  assert.equal(ja['updateReason_version-differs'].includes('直前の版ではありません'), true)
})

test('a calendar reset date stays on that day in a negative offset', () => {
  const utc = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 9, 15)))
  const shifted = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'America/Los_Angeles' }).format(new Date('2026-10-15'))
  assert.equal(formatTime('2026-10-15', { dateOnly: true, lang: 'en-US' }), utc)
  assert.notEqual(formatTime('2026-10-15', { dateOnly: true, lang: 'en-US' }), shifted)
  assert.equal(formatTime('2026-02-31', { dateOnly: true, lang: 'en-US' }), '2026-02-31')
  const instant = formatTime('2026-10-15T17:00:00.000Z', { lang: 'en-US', timeZone: 'UTC' })
  assert.match(instant, /2026/)
  assert.match(instant, /5:00/)
})
