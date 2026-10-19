import { ProviderCache, ProviderReadError } from './provider-cache.mjs'
import { readProviderJson } from './account-usage-providers.mjs'
import { parsePiCatalog, parseCommandCatalog, parseOllamaModel } from './catalog-parsers.mjs'
import { CATALOG_CONTROL, DISCOVERED_MODEL } from './catalog-metadata.mjs'
import { createHash } from 'node:crypto'

const HOUR = 3600000
const gateways = new Set(['commandcode', 'ollama-cloud'])
const bases = { commandcode: 'https://api.commandcode.ai/provider/v1', 'ollama-cloud': 'https://ollama.com/v1' }
export const catalogBinding = connection => createHash('sha256').update(JSON.stringify([
  connection.serviceId, connection.credentialRecordId, connection.credentialGeneration ?? 0,
  connection.profile?.baseURL, connection.profile?.api, connection.profile?.apiKeyEnv,
  connection.credentialRef, connection.headerRefs ?? {}, connection.profile?.headers ?? {},
])).digest('hex')

/** Public catalog overlays do not claim to describe a user-supplied gateway. */
export function canUseLiveCatalog(connection, baseline) {
  if (connection.integrationId !== 'pi') return false
  const profile = connection.profile ?? {}
  if (profile.models?.length || profile.api || profile.baseURL
    && ![...baseline.values()].some(model => model.baseUrl.replace(/\/+$/, '') === profile.baseURL.replace(/\/+$/, ''))
    && profile.baseURL.replace(/\/+$/, '') !== bases[connection.serviceId]) return false
  if (gateways.has(connection.serviceId) && (profile.apiKeyEnv || connection.credentialRef || Object.keys(connection.headerRefs ?? {}).length
    || Object.keys(profile.headers ?? {}).length)) return false
  return gateways.has(connection.serviceId) || baseline.size > 0
}

/** Durable, connection-scoped data, never SDK executable code or credentials. */
export class LiveCatalogSession {
  constructor({ connection, baseline, credentials, snapshot = () => undefined, persist = async () => {}, isCurrent = () => true,
    onChange = () => {}, fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, ttl = HOUR, timeout = 30000, poll = true }) {
    Object.assign(this, { connection, baseline, credentials, snapshot, persist, isCurrent, onChange, fetch: request, now, ttl, poll })
    this.provider = connection.serviceId; this.binding = catalogBinding(connection)
    this.version = 0; this.closed = false; this.retryAt = 0
    this.cache = new ProviderCache({ ttl, maxStale: Infinity, timeout, now })
    this.restore()
  }
  restore() {
    try {
      const text = this.snapshot()
      if (typeof text !== 'string' || text.length > 8 * 1024 * 1024) return
      const data = JSON.parse(text)
      if (data.version !== 1 || data.binding !== this.binding || !Number.isFinite(data.checkedAt)
        || !Array.isArray(data.models) || data.models.length > 10000) return
      // Persisted settings are still input; only restore the shape this loader emitted.
      if (!data.models.every(model => model.provider === this.provider && typeof model.id === 'string'
        && typeof model.baseUrl === 'string' && typeof model.api === 'string' && Array.isArray(model.input)
        && Number.isSafeInteger(model.contextWindow) && model.contextWindow > 0 && Number.isSafeInteger(model.maxTokens) && model.maxTokens > 0)) return
      const allowedApis = this.provider === 'commandcode' ? ['anthropic-messages', 'openai-responses', 'openai-completions']
        : this.provider === 'ollama-cloud' ? ['openai-completions'] : [...new Set([...this.baseline.values()].map(model => model.api))]
      const allowedOrigins = gateways.has(this.provider) ? [new URL(bases[this.provider]).origin]
        : [...new Set([...this.baseline.values()].map(model => new URL(model.baseUrl).origin))]
      if (!data.models.every(model => { const url = new URL(model.baseUrl); return allowedApis.includes(model.api)
        && allowedOrigins.includes(url.origin) && url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash })) return
      // Never restore request headers from a serialized catalog.
      data.models = data.models.map(({ headers, ...model }) => model)
      this.cache.value = data; this.cache.observedAt = data.checkedAt
    } catch { /* Invalid or old cache falls back to the installed catalog. */ }
  }
  catalog(provider) {
    if (provider !== this.provider || this.closed) return undefined
    if (!this.isCurrent()) return undefined
    if (!this.timer && this.poll) {
      this.timer = setInterval(() => this.schedule(), Math.min(this.ttl, 60000))
      this.timer.unref?.()
    }
    this.schedule()
    const value = this.cache.value
    const models = gateways.has(provider) && value ? new Map() : new Map(this.baseline)
    for (const row of value?.models ?? []) {
      const { control, verified, ...model } = row
      const base = this.baseline.get(row.id)
      models.set(row.id, { ...base, ...model, [CATALOG_CONTROL]: control ?? {},
        ...base ? {} : { [DISCOVERED_MODEL]: { verified: verified === true } } })
    }
    return models
  }
  schedule() {
    if (this.closed || !this.isCurrent() || this.autoPending || this.cache.pending || this.cache.peek().fresh || this.now() < this.retryAt) return
    this.autoPending = Promise.resolve().then(() => this.refresh()).catch(() => {}).finally(() => { this.autoPending = undefined })
  }
  async json(url, signal, headers = {}, body, maxBytes = 8 * 1024 * 1024) {
    return readProviderJson(await this.fetch(url, { method: body === undefined ? 'GET' : 'POST', redirect: 'error', signal,
      headers: { accept: 'application/json', ...body === undefined ? {} : { 'content-type': 'application/json' }, ...headers },
      ...body === undefined ? {} : { body: JSON.stringify(body) } }), { now: this.now(), maxBytes, allowArray: true })
  }
  async load(signal) {
    if (this.provider === 'commandcode') {
      const body = await this.json('https://api.commandcode.ai/provider/v1/models', signal)
      let references = {}
      try {
        const data = await this.json('https://models.dev/api.json', AbortSignal.any([signal, AbortSignal.timeout(10000)]), {}, undefined, 32 * 1024 * 1024)
        references = data.commandcode?.models ?? {}
      } catch { /* The live roster remains usable with service-default effort. */ }
      return parseCommandCatalog(body, references)
    }
    if (this.provider === 'ollama-cloud') {
      const credential = await this.credentials.read(this.provider)
      if (credential?.type !== 'api_key' || credential.env || typeof credential.key !== 'string' || !/^[\x21-\x7e]+$/.test(credential.key)) throw new ProviderReadError('auth-required')
      const headers = { authorization: `Bearer ${credential.key}` }
      const body = await this.json('https://ollama.com/api/tags', signal, headers)
      if (!Array.isArray(body.models) || body.models.length > 1000) throw new ProviderReadError('error')
      const previous = new Map((this.cache.value?.models ?? []).map(model => [model.id, model]))
      const models = []; let next = 0, incomplete = 0
      await Promise.all(Array.from({ length: Math.min(4, body.models.length) }, async () => {
        while (next < body.models.length) {
          const row = body.models[next++], id = row?.model ?? row?.name
          if (!parseOllamaModel(row)) { incomplete++; continue }
          let show
          try { show = await this.json('https://ollama.com/api/show', signal, headers, { model: id }) }
          catch (error) {
            if (signal.aborted || ['auth-required', 'rate-limited'].includes(error?.code)) throw error
            incomplete++
          }
          const model = parseOllamaModel(row, show, previous.get(id))
          if (model) models.push(model)
        }
      }))
      return { models: models.sort((a, b) => a.id.localeCompare(b.id)), skipped: incomplete }
    }
    const previous = this.cache.value
    const response = await this.fetch(`https://pi.dev/api/models/providers/${encodeURIComponent(this.provider)}?types=chat`, {
      redirect: 'error', signal, headers: { accept: 'application/json', ...previous?.models.length && previous.etag ? { 'if-none-match': previous.etag } : {} },
    })
    if (response.status === 304 && previous) return previous
    // This endpoint is public. A denied catalog read does not revoke the user's
    // inference credentials or the last valid model catalog.
    if (response.status === 401 || response.status === 403) throw new ProviderReadError('error')
    const body = await readProviderJson(response, { maxBytes: 8 * 1024 * 1024, allowArray: true })
    return { ...parsePiCatalog(this.provider, body, this.baseline), etag: response.headers.get('etag') ?? undefined }
  }
  async refresh({ force = false, signal } = {}) {
    if (this.closed || !this.isCurrent()) throw new ProviderReadError('aborted')
    try {
      await this.cache.get(async signal => {
        const result = await this.load(signal)
        if (signal.aborted || this.closed || !this.isCurrent()) throw new ProviderReadError('aborted')
        const value = { ...result, version: 1, binding: this.binding, checkedAt: this.now() }
        await this.persist(JSON.stringify(value), { signal })
        if (signal.aborted || this.closed || !this.isCurrent()) throw new ProviderReadError('aborted')
        return value
      }, { force, signal })
      this.retryAt = 0
    } catch (error) {
      this.retryAt = this.cache.retryAt ?? this.now() + 60000
      throw error
    } finally {
      if (!this.closed && this.isCurrent()) { this.version++; this.onChange() }
    }
  }
  async validate() { if (!this.isCurrent()) this.dispose() }
  invalidate() { this.retryAt = 0; this.cache.observedAt = undefined; this.version++; this.onChange() }
  state() {
    return { checkedAt: this.cache.value?.checkedAt, skipped: this.cache.value?.skipped ?? 0,
      stale: !!this.cache.error || this.cache.peek().stale, error: this.cache.error }
  }
  dispose() { this.closed = true; clearInterval(this.timer); this.cache.dispose() }
}

export function liveCatalogProvider(session) {
  return { session,
    presentation() {
      const state = session.state()
      return { status: { message: state.error ? state.checkedAt ? 'catalogCachedAfterFailure' : 'catalogInitialLoadFailed' : state.skipped ? 'catalogPartiallyUpdated'
        : state.checkedAt ? 'catalogUpdated' : 'catalogUpdating',
      ...state.checkedAt ? { detail: new Date(state.checkedAt).toISOString() } : {} }, notes: ['catalogAutoUpdateHint'] }
    },
    errorCodes: { 'auth-required': 'catalog-login-required', 'rate-limited': 'catalog-rate-limited' },
    errors: { 'catalog-login-required': 'catalogLoginRequired', 'catalog-rate-limited': 'catalogRateLimited' },
  }
}
