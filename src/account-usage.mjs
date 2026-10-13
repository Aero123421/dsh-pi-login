import { createHash } from 'node:crypto'
import { ProviderCache, ProviderReadError } from './provider-cache.mjs'
import { codexAccountId } from './account-usage-providers.mjs'
export { createPiUsageProviders, USAGE_ENDPOINTS } from './account-usage-providers.mjs'

const statuses = new Set(['available', 'unobserved', 'unsupported', 'auth-required', 'stale', 'rate-limited', 'error'])
const label = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(value) ? value : undefined
const instant = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return undefined
  const calendar = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== value.slice(0, 10)) return undefined
  return new Date(value).toISOString()
}
const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined
const iso = value => Number.isFinite(value) ? new Date(value).toISOString() : undefined

/** Only these data fields cross the Host boundary; raw provider payloads never do. */
export function normalizeUsageSnapshot(raw = {}) {
  if (!raw || typeof raw !== 'object') throw new ProviderReadError('error')
  if (!Array.isArray(raw.windows) || raw.windows.length > 50) throw new ProviderReadError('error')
  const seen = new Set()
  const windows = raw.windows.map(row => {
    const id = label(row?.id), scope = label(row?.scope ?? 'account')
    if (!id || !scope || seen.has(`${id}:${scope}`) || row.usedPercent !== null && number(row.usedPercent) === undefined) throw new ProviderReadError('error')
    seen.add(`${id}:${scope}`)
    const windowSeconds = row.windowSeconds == null ? null : number(row.windowSeconds)
    if (windowSeconds === undefined || windowSeconds === 0) throw new ProviderReadError('error')
    const result = { id, scope, usedPercent: row.usedPercent, resetsAt: instant(row.resetsAt) ?? null, windowSeconds }
    if (row.resetsAt != null && result.resetsAt === null) throw new ProviderReadError('error')
    if (row.resetsOn !== undefined) {
      if (result.resetsAt !== null || typeof row.resetsOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.resetsOn) || !Number.isFinite(Date.parse(`${row.resetsOn}T00:00:00Z`)) || new Date(`${row.resetsOn}T00:00:00Z`).toISOString().slice(0, 10) !== row.resetsOn) throw new ProviderReadError('error')
      result.resetsOn = row.resetsOn
    }
    if (['unlimited', 'unavailable', 'unallocated'].includes(row.quotaState)) result.quotaState = row.quotaState
    if (row.quota) {
      const quota = row.quota
      if (!['credits', 'requests', 'tokens', 'USD'].includes(quota.unit)) throw new ProviderReadError('error')
      result.quota = { unit: quota.unit, estimated: quota.estimated === true }
      for (const field of ['used', 'total', 'remaining']) {
        if (quota[field] != null && number(quota[field]) === undefined) throw new ProviderReadError('error')
        result.quota[field] = quota[field] ?? null
      }
    }
    return result
  })
  if (raw.source !== undefined && !['internal-http', 'last-observed'].includes(raw.source)) throw new ProviderReadError('error')
  const source = raw.source === 'last-observed' ? 'last-observed' : 'internal-http'
  const sourceObservedAt = instant(raw.sourceObservedAt)
  if (raw.sourceObservedAt != null && !sourceObservedAt) throw new ProviderReadError('error')
  if (windows.length && !sourceObservedAt) throw new ProviderReadError('error')
  return { source, sourceObservedAt, status: statuses.has(raw.status) ? raw.status : sourceObservedAt ? 'available' : 'unobserved', windows }
}
function fingerprint(connection, credential) {
  if (!credential) return 'absent'
  let identity
  if (credential.type === 'oauth' && connection.serviceId === 'openai-codex') {
    try { identity = codexAccountId(credential.access) } catch { identity = credential.refresh }
  } else identity = credential.type === 'oauth' ? credential.refresh : credential.key ?? JSON.stringify(credential.env ?? {})
  // Process-local comparison tag. Never returned, logged, or used for grouping.
  return createHash('sha256').update(`${credential.type}:${identity ?? ''}`).digest('hex')
}
const scope = connection => JSON.stringify([connection.profileKey, connection.integrationId, connection.serviceId, connection.connectionId, connection.credentialGeneration, connection.authMethod, connection.credentialRecordId, connection.credentialRef, connection.profile?.baseURL, connection.profile?.api, Object.keys(connection.headerRefs ?? {}).some(key => key.toLowerCase() === 'authorization')])
const publicIdentity = connection => ({ integrationId: connection.integrationId, serviceId: connection.serviceId, connectionId: connection.connectionId })

/** Read-only account snapshots scoped by connection and credential generation. */
export class AccountUsageManager {
  constructor({ providers = {}, credentials, now = Date.now, ttl = 300000, maxStale = 3600000, timeout = 20000 } = {}) {
    this.providers = new Map(Object.entries(providers)); this.credentials = credentials; this.now = now
    this.cacheOptions = { now, ttl, maxStale, timeout }; this.entries = new Map(); this.closed = false
  }
  provider(connection) {
    return this.providers.get(`${connection.integrationId}/${connection.serviceId}`) ?? (connection.integrationId === 'pi' ? this.providers.get(connection.serviceId) : undefined)
  }
  entry(connection) {
    const key = scope(connection), existing = this.entries.get(connection.connectionId)
    if (existing?.key === key) return existing
    existing?.cache.dispose()
    const provider = this.provider(connection)
    const entry = { key, provider, cache: new ProviderCache({ ...this.cacheOptions, ...provider?.cache }) }
    this.entries.set(connection.connectionId, entry)
    return entry
  }
  state(connection) {
    const entry = this.entry(connection), view = entry.cache.peek()
    const base = { ...publicIdentity(connection), source: entry.provider?.source === 'last-observed' ? 'last-observed' : 'internal-http', checkedAt: iso(view.checkedAt), status: entry.provider?.read ? 'unobserved' : 'unsupported', windows: [] }
    if (view.retryAt) base.retryAt = iso(view.retryAt)
    if (view.value) {
      Object.assign(base, view.value)
      if (view.stale || view.error || base.sourceObservedAt && this.now() - Date.parse(base.sourceObservedAt) >= entry.cache.ttl) base.status = 'stale'
      if (base.sourceObservedAt && this.now() - Date.parse(base.sourceObservedAt) > entry.cache.maxStale) { base.windows = []; base.status = view.error ?? 'unobserved' }
    } else if (view.error) base.status = view.error === 'account-changed' ? 'auth-required' : view.error
    return structuredClone(base)
  }
  async get(connection, { force = false, signal } = {}) {
    const entry = this.entry(connection)
    if (this.closed) return { ...publicIdentity(connection), source: 'internal-http', status: 'error', windows: [] }
    if (!entry.provider?.read) return this.state(connection)
    const deadline = AbortSignal.timeout(entry.cache.timeout)
    const consumerSignal = signal ? AbortSignal.any([signal, deadline]) : deadline
    const withinDeadline = operation => new Promise((resolve, reject) => {
      const abort = () => reject(new ProviderReadError(signal?.aborted ? 'aborted' : 'error'))
      if (consumerSignal.aborted) return abort()
      consumerSignal.addEventListener('abort', abort, { once: true })
      Promise.resolve().then(operation).then(resolve, reject).finally(() => consumerSignal.removeEventListener('abort', abort))
    })
    try {
      await withinDeadline(() => entry.provider.validate?.(connection))
      let credential
      if (entry.provider.requiresCredentials !== false) {
        credential = await withinDeadline(() => this.credentials?.read(connection))
        const identity = fingerprint(connection, credential)
        if (entry.principal !== undefined && entry.principal !== identity && !entry.refreshing) entry.cache.invalidate()
        if (!entry.refreshing) entry.principal = identity
      }
      await entry.cache.get(async requestSignal => {
        let effective = credential
        if (entry.provider.refreshAccess && effective?.type === 'oauth' && (!effective.access || !Number.isFinite(effective.expires) || effective.expires <= this.now())) {
          if (!this.credentials?.refresh) throw new ProviderReadError('auth-required')
          entry.refreshing = true
          try {
            effective = await this.credentials.refresh(connection, effective, requestSignal)
            entry.principal = fingerprint(connection, effective)
          } catch (error) { throw error instanceof ProviderReadError ? error : new ProviderReadError('auth-required') }
          finally { entry.refreshing = false }
        }
        const raw = await entry.provider.read({ connection, credential: effective, signal: requestSignal, force })
        if (entry.provider.requiresCredentials !== false) {
          const current = await this.credentials?.read(connection)
          if (fingerprint(connection, current) !== fingerprint(connection, effective)) throw new ProviderReadError('account-changed')
        }
        return normalizeUsageSnapshot(raw)
      }, { force, signal: consumerSignal })
      return this.state(connection)
    } catch (error) {
      const code = error instanceof ProviderReadError ? error.code === 'aborted' && deadline.aborted && !signal?.aborted ? 'error' : error.code : 'error'
      if (code === 'aborted') throw new ProviderReadError('aborted')
      if (code === 'unsupported' || code === 'auth-required' || code === 'account-changed') {
        entry.cache.value = undefined
        entry.cache.error = code === 'account-changed' ? 'auth-required' : code
      } else if (!entry.cache.error) entry.cache.error = code
      entry.cache.checkedAt = this.now()
      return this.state(connection)
    }
  }
  invalidate(connectionId) {
    const entry = this.entries.get(connectionId)
    entry?.cache.dispose(); this.entries.delete(connectionId)
  }
  dispose() {
    this.closed = true
    for (const { cache } of this.entries.values()) cache.dispose()
    this.entries.clear()
  }
}
