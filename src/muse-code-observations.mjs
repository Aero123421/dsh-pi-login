import { MUSE_CODE_INTEGRATION_ID, MUSE_CODE_SERVICE_ID, MuseCodeError } from './muse-code.mjs'

const EFFORTS = new Set(['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'])
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const invalid = () => { throw new MuseCodeError('muse-code-observation-invalid') }
const identifier = value => typeof value === 'string' && value.length > 0 && value.length <= 200 && !/[\u0000-\u001f\u007f]/.test(value)
const label = value => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 200) : invalid()
const positive = value => Number.isSafeInteger(value) && value > 0
const nonnegative = value => Number.isSafeInteger(value) && value >= 0
const timestamp = value => nonnegative(value) && value <= 8_640_000_000_000_000
const iso = value => timestamp(value) ? new Date(value).toISOString() : invalid()

function identity(binding) {
  if (!object(binding) || !identifier(binding.connectionId) || !identifier(binding.routeId)) invalid()
  return {
    integrationId: MUSE_CODE_INTEGRATION_ID,
    serviceId: MUSE_CODE_SERVICE_ID,
    connectionId: binding.connectionId,
  }
}

/**
 * SubscriptionUsage only. session/tokenUsage and session/contextUsage cannot
 * enter Account Usage. observedAtMs is the host's last observation, never the
 * time a client queried usage/read. Over-quota percentages remain verbatim.
 * This validates a payload; an owning integration must verify its account.
 */
export function normalizeMuseCodeUsage(usage, binding, checkedAt = Date.now()) {
  const attribution = identity(binding)
  const checked = iso(checkedAt)
  if (usage === undefined) return {
    ...attribution, source: 'last-observed', status: 'unobserved', checkedAt: checked, windows: [],
  }
  if (!object(usage) || !identifier(usage.tier) || !timestamp(usage.observedAtMs)
    || !object(usage.weekly) || !object(usage.window)
    || !nonnegative(usage.weekly.usedPercent) || !timestamp(usage.weekly.resetsAtMs)
    || !nonnegative(usage.window.usedPercent) || !timestamp(usage.window.resetsAtMs)
    || !positive(usage.window.windowDurationMins) || !Number.isSafeInteger(usage.window.windowDurationMins * 60)) invalid()
  return {
    ...attribution, source: 'last-observed', status: 'available',
    sourceObservedAt: iso(usage.observedAtMs), checkedAt: checked,
    windows: [
      { id: 'window', scope: 'muse-code-subscription-window', usedPercent: usage.window.usedPercent,
        resetsAt: iso(usage.window.resetsAtMs), windowSeconds: usage.window.windowDurationMins * 60 },
      { id: 'weekly', scope: 'muse-code-subscription-weekly', usedPercent: usage.weekly.usedPercent,
        resetsAt: iso(usage.weekly.resetsAtMs), windowSeconds: null },
    ],
  }
}

/**
 * Project model/list to diagnostics only. A bundled/logged-out row can exist
 * without a subscription. No entitlement, Contributor mode, image support,
 * default token limit or Thinking tier is inferred from its model id.
 */
export function normalizeMuseCodeCatalog(result) {
  if (!object(result) || !identifier(result.providerId) || !identifier(result.source)
    || !(result.profileId === null || identifier(result.profileId))
    || !Array.isArray(result.models) || result.models.length > 2000) invalid()
  const seen = new Set()
  const models = result.models.map(row => {
    if (!object(row) || !identifier(row.modelId) || !identifier(row.providerId)
      || !(row.profileId === null || identifier(row.profileId))
      || !(row.contextLimit === null || positive(row.contextLimit))
      || !(row.outputLimit === null || positive(row.outputLimit))
      || typeof row.isActive !== 'boolean' || typeof row.isDefault !== 'boolean') invalid()
    const key = JSON.stringify([row.providerId, row.profileId, row.modelId])
    if (seen.has(key)) invalid()
    seen.add(key)
    let reasoningEfforts = null
    if (row.variants !== undefined && row.variants !== 'unknown') {
      if (!Array.isArray(row.variants) || row.variants.some(effort => !EFFORTS.has(effort))
        || new Set(row.variants).size !== row.variants.length) invalid()
      reasoningEfforts = [...row.variants]
    }
    if (row.defaultReasoningEffort !== undefined
      && (!reasoningEfforts || !reasoningEfforts.includes(row.defaultReasoningEffort))) invalid()
    return {
      modelId: row.modelId, providerId: row.providerId, profileId: row.profileId,
      label: label(row.displayLabel), contextLimit: row.contextLimit, outputLimit: row.outputLimit,
      isActive: row.isActive, isDefault: row.isDefault, reasoningEfforts,
      ...row.defaultReasoningEffort !== undefined ? { defaultReasoningEffort: row.defaultReasoningEffort } : {},
      entitlement: 'unverified', runnable: false,
    }
  })
  return { providerId: result.providerId, profileId: result.profileId, source: result.source, models }
}

