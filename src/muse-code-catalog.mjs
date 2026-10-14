import { createHash } from 'node:crypto'
import { ProviderCache, ProviderReadError } from './provider-cache.mjs'
import { readProviderJson, parseMuseUsage } from './account-usage-providers.mjs'
import { MUSE_CONTRIBUTOR, MUSE_CONTRIBUTOR_ONLY, MUSE_CONTRIBUTOR_HEADER } from './catalog-metadata.mjs'

/**
 * Muse Code's own account catalog. The official CLI lists models from
 * `/muse-code/models` (not the Model API's `/v1/models`, which omits
 * Muse Code-only models such as Wonder Full) and selects Contributor mode per
 * request with `x-tbh-contributor-mode`. Sign-in, key minting and generation
 * stay with the Pi SDK's Meta provider.
 */
export const MUSE_CODE_MODELS_URL = 'https://api.meta.ai/muse-code/models'
export const MUSE_CODE_KEY_URL = 'https://api.meta.ai/muse-code/key'
const BASE_URL = 'https://api.meta.ai/v1'
const LEVELS = ['minimal', 'low', 'medium', 'high', 'xhigh', 'max']
const ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/
const NON_CHAT = /^(?:muse-image|muse-voice|sam-)/
const oauth = value => value?.type === 'oauth' && typeof value.refresh === 'string' && value.refresh.length > 0
const principalOf = credential => createHash('sha256').update(credential.refresh).digest('hex')
const positive = value => Number.isSafeInteger(value) && value > 0 ? value : undefined
const label = value => typeof value === 'string' && value.trim() ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 100) : undefined
const first = (row, keys) => keys.map(key => row[key]).find(value => value !== undefined && value !== null)

function rowsOf(body) {
  const rows = Array.isArray(body) ? body : first(body, ['data', 'models', 'rows', 'items'])
  return Array.isArray(rows) ? rows : []
}

function effortsOf(row) {
  const variants = first(row, ['reasoning_effort_variants', 'reasoningEffortVariants', 'reasoning_efforts', 'reasoningEfforts', 'variants'])
  if (!Array.isArray(variants)) return undefined
  const names = variants.map(item => typeof item === 'string' ? item
    : item && typeof item === 'object' ? first(item, ['effort', 'reasoning_effort', 'reasoningEffort', 'level', 'id', 'name']) : undefined)
  return [...new Set(names.filter(name => typeof name === 'string').map(name => name.toLowerCase()))]
}

/** Accept the catalog's documented row fields without guessing entitlement. */
export function parseMuseCatalog(body) {
  const rows = []
  for (const row of rowsOf(body)) {
    if (!row || typeof row !== 'object') continue
    const id = first(row, ['id', 'model_id', 'modelId', 'model'])
    if (typeof id !== 'string' || !ID.test(id) || NON_CHAT.test(id) || rows.some(entry => entry.id === id)) continue
    if (row.enabled === false || ['hidden', 'internal', 'disabled'].includes(row.visibility)) continue
    const efforts = effortsOf(row)
    rows.push({
      id, name: label(first(row, ['display_label', 'displayLabel', 'display_name', 'displayName', 'name'])) ?? id,
      contextWindow: positive(first(row, ['context_limit', 'contextLimit', 'context_window', 'contextWindow'])) ?? 1048576,
      maxTokens: positive(first(row, ['output_limit', 'outputLimit', 'max_output_tokens', 'maxTokens'])) ?? 131072,
      // Muse chat models accept images; the catalog only flags video and image output.
      input: ['text', 'image'],
      // An absent list keeps Muse's documented minimal-through-max range.
      efforts: efforts?.length ? efforts.filter(effort => [...LEVELS, 'none'].includes(effort)) : [...LEVELS],
      contributor: false,
    })
  }
  return rows
}

/** Pi model descriptors for the persisted rows. */
export function museModels(rows = []) {
  return new Map(rows.map(row => [row.id, {
    id: row.id, name: row.name, provider: 'meta', api: 'openai-responses', baseUrl: BASE_URL,
    reasoning: row.efforts.some(effort => effort !== 'none'),
    ...row.efforts.some(effort => effort !== 'none') ? { thinkingLevelMap: {
      off: row.efforts.includes('none') ? 'none' : null,
      ...Object.fromEntries(LEVELS.map(level => [level, row.efforts.includes(level) ? level : null])),
    } } : {},
    input: [...row.input], contextWindow: row.contextWindow, maxTokens: row.maxTokens,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    [MUSE_CONTRIBUTOR]: row.contributor === true,
    [MUSE_CONTRIBUTOR_ONLY]: row.id.startsWith('muse-') && row.id.endsWith('-contributor'),
  }]))
}

export class MuseCodeCatalogSession {
  constructor({ credentials, snapshot = () => undefined, persist = async () => {}, refreshAuth, onChange = () => {}, onUsage = () => {},
    fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, ttl = 1800000, timeout = 20000 }) {
    Object.assign(this, { credentials, snapshot, persist, refreshAuth, onChange, onUsage, fetch: request, now })
    this.cache = new ProviderCache({ ttl, maxStale: Infinity, timeout, now })
    this.usageCache = new ProviderCache({ ttl: 300000, maxStale: 3600000, timeout, now })
    this.version = 0; this.closed = false
  }
  rows() { return this.cache.peek().value ?? this.snapshot() ?? [] }
  catalog() { return museModels(this.rows()) }
  state() {
    const cached = this.cache.peek()
    return { canRefresh: true, count: this.rows().length, checkedAt: cached.checkedAt, error: cached.error, account: this.account }
  }
  changed() { this.version++; if (!this.closed) this.onChange() }
  invalidate() { this.principal = undefined; this.account = undefined; this.cache.invalidate(); this.usageCache.invalidate() }
  async validate() {
    const current = await this.credentials.read('meta')
    if (this.principal && (!oauth(current) || principalOf(current) !== this.principal)) this.invalidate()
    // First use after sign-in loads the catalog instead of showing an empty list.
    if (!this.rows().length && oauth(current) && !this.closed) await this.refresh().catch(() => {})
  }
  async access(signal) {
    let current = await this.credentials.read('meta')
    if (!oauth(current)) throw new ProviderReadError('auth-required')
    if (!current.access || !Number.isFinite(current.expires) || current.expires <= this.now()) {
      if (!this.refreshAuth) throw new ProviderReadError('auth-required')
      await this.refreshAuth(signal)
      current = await this.credentials.read('meta')
    }
    if (!oauth(current) || typeof current.access !== 'string' || !current.access) throw new ProviderReadError('auth-required')
    this.principal = principalOf(current)
    return current
  }
  async list(credential, mode, signal) {
    return readProviderJson(await this.fetch(MUSE_CODE_MODELS_URL, {
      method: 'GET', redirect: 'error', signal,
      headers: { accept: 'application/json', 'x-api-version': '1.0.0', authorization: `Bearer ${credential.access}`, [MUSE_CONTRIBUTOR_HEADER]: mode },
    }), { now: this.now(), maxBytes: 4 * 1024 * 1024, allowArray: true })
  }
  refresh({ force = true, signal } = {}) {
    if (this.closed) return Promise.reject(new ProviderReadError('aborted'))
    return this.cache.get(async requestSignal => {
      const credential = await this.access(requestSignal)
      const principal = principalOf(credential)
      const standard = parseMuseCatalog(await this.list(credential, '0', requestSignal))
      if (!standard.length) throw new ProviderReadError('error')
      // Contributor choices exist only for models the account lists in that mode.
      const contributor = await this.list(credential, '1', requestSignal).then(parseMuseCatalog, () => [])
      // Keep provider-returned IDs intact, including native Contributor IDs.
      // Choices pair those with their base instead of offering both a native
      // row and a synthetic duplicate. Contributor-only rows must not become
      // ordinary, default-on models when the account catalog is persisted.
      const offered = new Set(contributor.map(row => row.id))
      const merged = new Map(standard.map(row => [row.id, row]))
      for (const row of contributor) {
        if (row.id.startsWith('muse-') && row.id.endsWith('-contributor')) merged.set(row.id, row)
      }
      const rows = [...merged.values()].map(row => ({ ...row,
        contributor: offered.has(row.id) && !row.id.endsWith('-contributor') }))
      const current = await this.credentials.read('meta')
      if (this.closed || requestSignal.aborted || !oauth(current) || principalOf(current) !== principal) throw new ProviderReadError('account-changed')
      return rows
    }, { force, signal }).then(async rows => {
      if (JSON.stringify(rows) !== JSON.stringify(this.snapshot() ?? [])) await this.persist(rows).catch(() => {})
      this.changed()
      return this.state()
    })
  }
  /** The CLI's key mint also reports the subscription and its quota. */
  usage({ signal, force = false } = {}) {
    return this.usageCache.get(async requestSignal => {
      const current = await this.credentials.read('meta')
      if (!oauth(current)) throw new ProviderReadError('auth-required')
      const principal = principalOf(current)
      const body = await readProviderJson(await this.fetch(MUSE_CODE_KEY_URL, {
        method: 'POST', redirect: 'error', signal: requestSignal, body: '{}',
        headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-version': '1.0.0', authorization: `Bearer ${current.refresh}` },
      }), { now: this.now() })
      this.account = { active: typeof body.is_subs_active === 'boolean' ? body.is_subs_active : null, tierName: label(body.subs_tier_name) }
      if (typeof body.api_key === 'string' && body.api_key) {
        // Keep the freshly minted key for this same account only.
        await this.credentials.modify('meta', async stored => oauth(stored) && principalOf(stored) === principal
          ? { ...stored, access: body.api_key, expires: this.now() + 86400000 } : stored).catch(() => {})
      }
      this.onUsage()
      return { source: 'internal-http', sourceObservedAt: new Date(this.now()).toISOString(), status: 'available', windows: parseMuseUsage(body) }
    }, { force, signal })
  }
  dispose() { this.closed = true; this.cache.dispose(); this.usageCache.dispose() }
}

/** ProviderCatalogs entry: presentation, public error codes and request auth. */
export function museCatalogProvider(session) {
  return {
    session,
    presentation() {
      const { count, account } = session.state()
      return {
        ...account?.tierName ? { status: { message: account.active === false ? 'metaSubscriptionInactive' : 'metaSubscriptionActive', detail: account.tierName } } : {},
        notes: count ? [] : ['museCatalogEmpty'],
      }
    },
    errorCodes: { 'auth-required': 'catalog-login-required', 'rate-limited': 'catalog-rate-limited', 'account-changed': 'catalog-account-changed' },
    errors: { 'catalog-login-required': 'museLoginRequired', 'catalog-rate-limited': 'metaRateLimited', 'catalog-account-changed': 'metaAccountChanged', 'catalog-refresh-failed': 'museCatalogFailed' },
    // The SDK's Meta OAuth supplies and renews the key; nothing to override.
    authorizeModel: async () => undefined,
  }
}
