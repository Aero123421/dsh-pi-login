import test from 'node:test'
import assert from 'node:assert/strict'
import { includeProfileBundle } from '../scripts/host-boot-check.mjs'

test('a profile without bundles lists the package instead of throwing', () => {
  const missing = { dsh: { profile: { name: 'boot' } } }
  includeProfileBundle(missing, '@local/dsh-pi-login')
  assert.deepEqual(missing.dsh.profile.bundles, ['@local/dsh-pi-login'])
  assert.equal(missing.dsh.profile.name, 'boot')
  includeProfileBundle(missing, '@local/dsh-pi-login')
  assert.deepEqual(missing.dsh.profile.bundles, ['@local/dsh-pi-login'])

  const empty = {}
  includeProfileBundle(empty, '@local/dsh-pi-login')
  assert.deepEqual(empty.dsh.profile.bundles, ['@local/dsh-pi-login'])

  const present = { dsh: { profile: { bundles: ['other'] } } }
  includeProfileBundle(present, '@local/dsh-pi-login')
  assert.deepEqual(present.dsh.profile.bundles, ['other', '@local/dsh-pi-login'])
})
