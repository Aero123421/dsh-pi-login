import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MUSE_CODE_EVIDENCE, MuseCodeError } from '../src/muse-code.mjs'
import { normalizeMuseCodeCatalog, normalizeMuseCodeUsage } from '../src/muse-code-observations.mjs'

const binding = { connectionId: 'opaque-connection-A', routeId: 'opaque-route-A' }
const observedAtMs = Date.UTC(2026, 9, 13, 0, 0)
const checkedAt = observedAtMs + 180_000
const usage = (percent = 37, stamp = observedAtMs) => ({
  observedAtMs: stamp, tier: 'fixture-tier',
  window: { usedPercent: percent, resetsAtMs: stamp + 3_600_000, windowDurationMins: 300 },
  weekly: { usedPercent: 12, resetsAtMs: stamp + 86_400_000 },
})
const row = (extra = {}) => ({
  modelId: 'fixture-model', providerId: 'muse', profileId: null, displayLabel: 'Fixture Model',
  contextLimit: null, outputLimit: null, isActive: false, isDefault: true,
  ...extra,
})
const catalog = (models = [row()]) => ({ providerId: 'muse', profileId: null, source: 'bundledCatalog', models })
const code = expected => error => error instanceof MuseCodeError && error.code === expected

test('Muse Code evidence distinguishes stable protocol, experimental login/settings, and live limitations', () => {
  assert.equal(MUSE_CODE_EVIDENCE.sdkVersion, '1.4.7')
  assert.match(MUSE_CODE_EVIDENCE.commit, /^[a-f0-9]{40}$/)
  assert.match(MUSE_CODE_EVIDENCE.experimentalDocsCommit, /^[a-f0-9]{40}$/)
  assert.ok(MUSE_CODE_EVIDENCE.limitations.includes('live-multi-account-isolation-unverified'))
  assert.match(MUSE_CODE_EVIDENCE.accountProtocol, /account-loginstart/)
})

test('usage/read timestamps remain host observations, above-100 usage is valid, and quotas are never fabricated', () => {
  const normalized = normalizeMuseCodeUsage({ ...usage(127), api_key: 'private-key' }, binding, checkedAt)
  assert.equal(normalized.connectionId, binding.connectionId)
  assert.equal(normalized.integrationId, 'meta-muse-code')
  assert.equal(normalized.source, 'last-observed')
  assert.equal(normalized.sourceObservedAt, new Date(observedAtMs).toISOString())
  assert.equal(normalized.checkedAt, new Date(checkedAt).toISOString())
  assert.equal(normalized.windows[0].usedPercent, 127)
  assert.equal(normalized.windows[0].windowSeconds, 18_000)
  assert.equal(normalized.windows[1].windowSeconds, null)
  assert.ok(normalized.windows.every(window => !Object.hasOwn(window, 'quota')))
  assert.doesNotMatch(JSON.stringify(normalized), /private-key|api_key/)
})

test('unobserved usage is absent, not zero; null and malformed payloads fail without response disclosure', () => {
  assert.deepEqual(normalizeMuseCodeUsage(undefined, binding, checkedAt), {
    integrationId: 'meta-muse-code', serviceId: 'muse-code', connectionId: binding.connectionId,
    source: 'last-observed', status: 'unobserved', checkedAt: new Date(checkedAt).toISOString(), windows: [],
  })
  for (const payload of [null, {}, { ...usage(), observedAtMs: '123' }, { ...usage(), weekly: { usedPercent: -1, resetsAtMs: 0 } },
    { ...usage(), window: { ...usage().window, usedPercent: 0.5 } }, { ...usage(), observedAtMs: Infinity },
    { ...usage(), window: { ...usage().window, windowDurationMins: 0 } }]) {
    assert.throws(() => normalizeMuseCodeUsage(payload, binding, checkedAt), code('muse-code-observation-invalid'))
  }
})

test('catalog entries and reasoning tiers are observations, never inferred entitlements or runnable models', () => {
  const normalized = normalizeMuseCodeCatalog(catalog([
    row({ modelId: 'fixture-full-contributor', variants: ['none', 'high', 'ultra'], defaultReasoningEffort: 'high', private_key: 'secret' }),
    row({ modelId: 'fixture-other', variants: 'unknown' }),
  ]))
  assert.equal(normalized.source, 'bundledCatalog')
  assert.deepEqual(normalized.models[0].reasoningEfforts, ['none', 'high', 'ultra'])
  assert.equal(normalized.models[0].defaultReasoningEffort, 'high')
  assert.equal(normalized.models[1].reasoningEfforts, null)
  assert.ok(normalized.models.every(model => model.entitlement === 'unverified' && model.runnable === false))
  assert.ok(normalized.models.every(model => model.contextLimit === null && model.outputLimit === null))
  assert.doesNotMatch(JSON.stringify(normalized), /private_key|secret|contributorMode|apiKey/)
  for (const models of [[row(), row()], [row({ variants: ['invented'] })], [row({ variants: 'unknown', defaultReasoningEffort: 'high' })],
    [row({ variants: ['high', 'high'] })], [row({ contextLimit: -1 })]]) {
    assert.throws(() => normalizeMuseCodeCatalog(catalog(models)), code('muse-code-observation-invalid'))
  }
})

