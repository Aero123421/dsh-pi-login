import { ProviderReadError, retryAfterMilliseconds } from './provider-cache.mjs'

// Protocol evidence: Pi SDK 1.1.0 auth/oauth/{openai-codex,meta,github-copilot}.js;
// https://github.com/46ki75/pix/tree/2da5907338b7ef9e952b1decd1a6fe8e74f4c23c/packages/pix-usage
// These independent parsers describe internal HTTP interfaces, not stable public
// billing APIs. Fixture verification is not a live-account compatibility claim.
export const USAGE_ENDPOINTS = Object.freeze({
  anthropic: 'https://api.anthropic.com/api/oauth/usage',
  'openai-codex': 'https://chatgpt.com/backend-api/wham/usage',
  'github-copilot': 'https://api.github.com/copilot_internal/user',
  'opencode-go': 'https://opencode.ai/zen/go/v1/usage',
  meta: 'https://api.meta.ai/muse-code/key',
})
const invalid = () => { throw new ProviderReadError('error') }
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : invalid()
const count = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : invalid()
const optionalBoolean = value => value == null ? undefined : typeof value === 'boolean' ? value : invalid()
const iso = ms => Number.isFinite(ms) && Number.isFinite(new Date(ms).getTime()) ? new Date(ms).toISOString() : invalid()
function calendar(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || iso(Date.parse(`${value}T00:00:00Z`)).slice(0, 10) !== value) invalid()
  return value
}
function timestamp(value) {
  if (value == null) return null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) invalid()
  calendar(value.slice(0, 10))
  if (Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 || Number(value.slice(17, 19)) > 59) invalid()
  return iso(Date.parse(value))
}
function epoch(value, unknownNonpositive = false) {
  if (value == null) return null
  if (typeof value !== 'number' || !Number.isFinite(value)) invalid()
  if (unknownNonpositive && (value <= 0 || !Number.isFinite(new Date(value * 1000).getTime()))) return null
  return iso(count(value) * 1000)
}
const window = (id, scope, usedPercent, resetsAt, windowSeconds) => ({ id, scope, usedPercent: count(usedPercent), resetsAt, windowSeconds })

export function parseClaudeUsage(payload) {
  const data = object(payload)
  const buckets = [['five_hour', 'account', 18000], ['seven_day', 'account', 604800], ['seven_day_sonnet', 'sonnet', 604800], ['seven_day_opus', 'opus', 604800]]
  if (!buckets.some(([id]) => Object.hasOwn(data, id))) invalid()
  return buckets.filter(([id]) => data[id] != null).map(([id, scope, seconds]) => {
    const bucket = object(data[id])
    return window(id, scope, bucket.utilization, timestamp(bucket.resets_at), seconds)
  })
}
export function parseCodexUsage(payload, observedAt = Date.now()) {
  const data = object(payload)
  if (!Object.hasOwn(data, 'rate_limit')) invalid()
  if (data.rate_limit === null) return []
  const limits = object(data.rate_limit)
  if (!['primary_window', 'secondary_window'].some(id => Object.hasOwn(limits, id))) invalid()
  return ['primary_window', 'secondary_window'].filter(id => limits[id] != null).map(id => {
    const bucket = object(limits[id])
    const seconds = bucket.limit_window_seconds == null ? null : count(bucket.limit_window_seconds)
    if (seconds === 0) invalid()
    const reset = bucket.reset_at != null ? epoch(bucket.reset_at) : bucket.reset_after_seconds != null ? iso(observedAt + count(bucket.reset_after_seconds) * 1000) : null
    return window(id, 'account', bucket.used_percent, reset, seconds)
  })
}
export function parseOpenCodeUsage(payload) {
  const usage = object(object(payload).usage)
  return [['rolling', 18000], ['weekly', 604800], ['monthly', null]].map(([id, seconds]) => {
    const bucket = object(usage[id]), percent = count(bucket.percent)
    if (!['ok', 'rate-limited'].includes(bucket.status) || percent > 100 || (bucket.status === 'rate-limited') !== (percent === 100)) invalid()
    const reset = timestamp(bucket.resetsAt)
    if (reset === null) invalid()
    return window(id, 'account', percent, reset, seconds)
  })
}
export function parseMuseUsage(payload) {
  const data = object(payload)
  if (optionalBoolean(data.require_payment) === true || optionalBoolean(data.is_subs_active) !== true) throw new ProviderReadError('auth-required')
  if (data.subs_usage == null) return []
  const usage = object(data.subs_usage), primary = object(usage.window), weekly = object(usage.weekly)
  const seconds = count(primary.window_duration_mins) * 60
  if (!Number.isSafeInteger(seconds) || seconds <= 0) invalid()
  return [window('window', 'account', primary.used_percent, epoch(primary.resets_at, true), seconds), window('weekly', 'account', weekly.used_percent, epoch(weekly.resets_at, true), 604800)]
}
function copilotReset(data, bucket) {
  if (bucket.quota_reset_at != null && bucket.quota_reset_at !== 0) return { resetsAt: epoch(bucket.quota_reset_at, true) }
  const value = data.quota_reset_date_utc ?? data.quota_reset_date ?? data.limited_user_reset_date
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? { resetsAt: null, resetsOn: calendar(value) } : { resetsAt: timestamp(value) }
}
export function parseCopilotUsage(payload) {
  const data = object(payload), credits = optionalBoolean(data.token_based_billing) === true
  if (!Object.hasOwn(data, 'quota_snapshots')) invalid()
  if (data.quota_snapshots === null) return []
  const buckets = object(data.quota_snapshots)
  // Categories overlap. Preserve one chat-related allowance and never add them.
  const ids = data.copilot_plan === 'free' || data.access_type_sku === 'free_limited_copilot' ? ['chat'] : ['premium_interactions', 'chat']
  for (const id of ids) {
    if (buckets[id] == null) continue
    const bucket = object(buckets[id]), unlimited = optionalBoolean(bucket.unlimited)
    if (unlimited === undefined) invalid()
    let total = bucket.entitlement
    if (total == null || unlimited && (total === -1 || total === '-1')) total = null
    else {
      if (typeof total === 'string') {
        if (!/^\d+(?:\.\d+)?$/.test(total)) invalid()
        total = Number(total)
      }
      total = count(total)
      if (total > Number.MAX_SAFE_INTEGER) invalid()
    }
    if (!unlimited && total === 0) continue
    const result = { id, scope: 'account', usedPercent: null, ...copilotReset(data, bucket), windowSeconds: null }
    const unit = credits ? 'credits' : 'requests'
    if (unlimited) {
      result.quotaState = optionalBoolean(bucket.has_quota) === false && optionalBoolean(bucket.overage_permitted) !== true ? 'unavailable' : 'unlimited'
      if (credits && bucket.credits_used != null) result.quota = { used: count(bucket.credits_used), total: null, remaining: null, unit, estimated: false }
    } else {
      const remainingPercent = count(bucket.percent_remaining)
      if (remainingPercent > 100) invalid()
      result.usedPercent = 100 - remainingPercent
      const remaining = bucket.quota_remaining == null ? null : count(bucket.quota_remaining)
      // Do not imply a denominator when the API does not report one.
      if (total !== null) result.quota = { used: remaining === null ? total * result.usedPercent / 100 : Math.max(0, total - remaining), total, remaining, unit, estimated: remaining === null }
    }
    return [result]
  }
  return []
}

export function codexAccountId(access) {
  try {
    const parts = access.split('.')
    if (parts.length !== 3 || !/^[\w-]+$/.test(parts[1])) throw 0
    const auth = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))['https://api.openai.com/auth']
    if (typeof auth?.chatgpt_account_id !== 'string' || !/^[\x21-\x7e]{1,512}$/.test(auth.chatgpt_account_id)) throw 0
    // Routing metadata only: successful authenticated HTTP remains authoritative.
    return auth.chatgpt_account_id
  } catch { throw new ProviderReadError('auth-required') }
}

export async function readProviderJson(response, { now = Date.now(), maxBytes = 262144, allowArray = false } = {}) {
  if (!response.ok) {
    await response.body?.cancel().catch(() => {})
    throw new ProviderReadError(response.status === 401 || response.status === 403 ? 'auth-required' : response.status === 429 ? 'rate-limited' : 'error', response.status === 429 ? retryAfterMilliseconds(response.headers.get('retry-after'), now) : undefined)
  }
  if (Number(response.headers.get('content-length')) > maxBytes) { await response.body?.cancel().catch(() => {}); invalid() }
  const reader = response.body?.getReader()
  if (!reader) invalid()
  const chunks = []; let length = 0
  try {
    for (;;) {
      const next = await reader.read()
      if (next.done) break
      length += next.value.byteLength
      if (length > maxBytes) invalid()
      chunks.push(next.value)
    }
    const bytes = new Uint8Array(length); let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    const value = JSON.parse(new TextDecoder().decode(bytes))
    return allowArray && Array.isArray(value) ? value : object(value)
  } catch (error) { throw error instanceof ProviderReadError ? error : new ProviderReadError('error') }
  finally { await reader.cancel().catch(() => {}) }
}

function standardProfile(connection, allowedBases) {
  const profile = connection.profile ?? {}
  if (connection.credentialRef || profile.apiKeyEnv || [...Object.keys(profile.headers ?? {}), ...Object.keys(connection.headerRefs ?? {})].some(key => key.toLowerCase() === 'authorization')) throw new ProviderReadError('unsupported')
  if (profile.baseURL !== undefined && !allowedBases.includes(profile.baseURL.replace(/\/+$/, ''))) throw new ProviderReadError('unsupported')
}
const token = value => typeof value === 'string' && /^[\x21-\x7e]+$/.test(value) && !value.startsWith('!') ? value : (() => { throw new ProviderReadError('auth-required') })()
export function createPiUsageProviders({ fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, metaSession } = {}) {
  const definitions = {
    anthropic: { bases: ['https://api.anthropic.com'], parser: parseClaudeUsage, refreshAccess: true },
    'openai-codex': { bases: ['https://chatgpt.com/backend-api'], parser: parseCodexUsage, refreshAccess: true },
    'github-copilot': { bases: ['https://api.individual.githubcopilot.com', 'https://api.business.githubcopilot.com', 'https://api.enterprise.githubcopilot.com'], parser: parseCopilotUsage },
    'opencode-go': { bases: ['https://opencode.ai/zen/go', 'https://opencode.ai/zen/go/v1'], parser: parseOpenCodeUsage, apiKey: true },
  }
  const providers = Object.fromEntries(Object.entries(definitions).map(([id, definition]) => [id, {
    source: 'internal-http', refreshAccess: definition.refreshAccess === true,
    validate: connection => standardProfile(connection, definition.bases),
    async read({ connection, credential, signal }) {
      standardProfile(connection, definition.bases)
      let headers = { accept: 'application/json' }
      if (definition.apiKey) {
        if (credential?.type !== 'api_key' || credential.env || connection.authMethod !== 'api-key') throw new ProviderReadError('unsupported')
        headers.authorization = `Bearer ${token(credential.key)}`
      } else {
        if (credential?.type !== 'oauth' || connection.authMethod !== 'oauth') throw new ProviderReadError(credential ? 'unsupported' : 'auth-required')
        if (id === 'github-copilot') {
          if (credential.enterpriseUrl !== undefined && credential.enterpriseUrl !== null && credential.enterpriseUrl !== '') throw new ProviderReadError('unsupported')
          headers.authorization = `token ${token(credential.refresh)}`
          headers['x-github-api-version'] = '2025-04-01'
        } else {
          headers.authorization = `Bearer ${token(credential.access)}`
          if (id === 'anthropic') headers['anthropic-beta'] = 'oauth-2025-04-20'
          else headers['chatgpt-account-id'] = codexAccountId(credential.access)
        }
      }
      const body = await readProviderJson(await request(USAGE_ENDPOINTS[id], { method: 'GET', redirect: 'error', signal, headers }), { now: now() })
      const observedAt = now()
      return { source: 'internal-http', sourceObservedAt: iso(observedAt), windows: definition.parser(body, observedAt) }
    },
  }]))
  if (metaSession) providers.meta = {
    source: 'internal-http',
    validate: connection => standardProfile(connection, ['https://api.meta.ai/v1']),
    read: ({ connection, signal, force }) => metaSession(connection).usage({ signal, force }),
  }
  return providers
}
