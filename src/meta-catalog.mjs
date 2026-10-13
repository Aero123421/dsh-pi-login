import { DISCOVERED_MODEL } from './catalog-metadata.mjs'
import { createHash } from 'node:crypto'
import { ProviderCache, ProviderReadError } from './provider-cache.mjs'
import { readProviderJson, parseMuseUsage } from './account-usage-providers.mjs'

// Private provenance survives model object spreads without entering JSON/RPC.
export const META_CATALOG_GRANT = Symbol('dsh-pi-login/meta-catalog-grant')
const LEVELS = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']
const principalOf = credential => createHash('sha256').update(credential.refresh).digest('hex')
const oauth = value => value?.type === 'oauth' && typeof value.refresh === 'string' && value.refresh.length > 0
const fullModel = id => /^muse-wonder-full(?:-|$)/.test(id)
const cleanLabel = value => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 100) : undefined
const positive = value => Number.isSafeInteger(value) && value > 0 ? value : undefined

export class MetaCatalogError extends Error {
  constructor(code) { super(code); this.code = code }
}

function checkProfile(profile) {
  if (profile.apiKeyEnv !== undefined || profile.credentialRef !== undefined) throw new MetaCatalogError('meta-key-override')
  if ((profile.baseURL !== undefined && profile.baseURL.replace(/\/+$/, '') !== 'https://api.meta.ai/v1')
    || (profile.api !== undefined && profile.api !== 'openai-responses')
    || [...Object.keys(profile.headers ?? {}), ...Object.keys(profile.headerRefs ?? {})].some(name => name.toLowerCase() === 'authorization')) {
    throw new MetaCatalogError('meta-settings-incompatible')
  }
}

function learnedModel(row, profile, principal) {
  const context = positive(row.contextWindow ?? row.context_window ?? row.context_length ?? row.limit?.context)
  const output = positive(row.maxTokens ?? row.max_tokens ?? row.max_output_tokens ?? row.limit?.output)
  const input = row.input ?? row.modalities?.input
  const offeredInput = Array.isArray(input) ? input.filter(value => value === 'text' || value === 'image') : []
  const map = row.thinkingLevelMap
  const thinking = map && typeof map === 'object' && !Array.isArray(map)
    ? Object.fromEntries(LEVELS.map(level => [level, typeof map[level] === 'string' && map[level].length > 0 ? map[level] : null]))
    : undefined
  const hasReasoning = row.reasoning === true && thinking && Object.values(thinking).some(value => value !== null)
  const verified = Boolean(context && output && offeredInput.length && (row.reasoning === false || hasReasoning))
  return {
    id: row.id, name: cleanLabel(row.name ?? row.display_name) || (row.id === 'muse-wonder-full-1.0' ? 'Muse Wonder Full' : row.id),
    provider: 'meta', api: 'openai-responses', baseUrl: 'https://api.meta.ai/v1',
    // ID-only listings use explicit conservative route defaults. No guessed
    // image/effort capabilities; absent reasoning leaves the API's default.
    contextWindow: context ?? profile.defaultContextWindow ?? 262144,
    maxTokens: output ?? profile.defaultMaxTokens ?? 32768,
    input: offeredInput.length ? offeredInput : ['text'],
    reasoning: Boolean(hasReasoning), ...hasReasoning ? { thinkingLevelMap: thinking } : {},
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    [META_CATALOG_GRANT]: Object.freeze({ principal, verified }),
    [DISCOVERED_MODEL]: Object.freeze({ verified }),
  }
}

/** Account-bound process-local entitlement, catalog and quota have distinct lives. */
export class MetaCatalogSession {
  constructor({ credentials, profile, baseline, onChange = () => {}, onUsage = () => {}, fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, catalogTTL = 1800000, entitlementTTL = 300000, maxStale = 3600000, timeout = 20000 }) {
    this.credentials = credentials; this.profile = profile; this.baseline = baseline
    this.onChange = onChange; this.onUsage = onUsage; this.fetch = request; this.now = now; this.version = 0
    this.catalogCache = new ProviderCache({ ttl: catalogTTL, maxStale, timeout, now })
    this.entitlementCache = new ProviderCache({ ttl: entitlementTTL, maxStale, timeout, now })
    this.closed = false
  }
  state() {
    const contract = this.entitlementCache.peek(), models = this.catalogCache.peek()
    return { canRefresh: true, account: contract.value?.account, checkedAt: models.checkedAt, discoveredCount: models.value?.size ?? 0,
      stale: Boolean(models.value && (models.stale || models.error)), entitlementStale: Boolean(contract.value && (contract.stale || contract.error)), retryAt: models.retryAt ?? contract.retryAt }
  }
  invalidate() {
    const changed = this.catalogCache.value !== undefined
    this.principal = undefined; this.signature = undefined; this.pending = undefined; this.catalogCache.invalidate(); this.entitlementCache.invalidate()
    if (changed) { this.version++; if (!this.closed) this.onChange() }
  }
  async validate() {
    const profile = this.profile()
    // Model selection/effort updates do not change the account's entitlement.
    // Only authentication and endpoint identity can revoke this session cache.
    const signature = createHash('sha256').update(JSON.stringify({
      baseURL: profile.baseURL, api: profile.api, apiKeyEnv: profile.apiKeyEnv,
      credentialRef: profile.credentialRef, headers: profile.headers, headerRefs: profile.headerRefs,
    })).digest('hex')
    if (this.signature !== undefined && this.signature !== signature) this.invalidate()
    this.signature = signature
    if (!this.principal) return
    const current = await this.credentials.read('meta')
    if (!oauth(current) || principalOf(current) !== this.principal) this.invalidate()
  }
  catalog(provider) {
    const learned = this.catalogCache.peek().value
    if (provider !== 'meta' || !learned) return undefined
    const catalog = new Map(this.baseline('meta'))
    for (const [id] of catalog) if (fullModel(id) && !learned.has(id)) catalog.delete(id)
    for (const [id, model] of learned) if (!catalog.has(id) || fullModel(id)) catalog.set(id, model)
    return catalog
  }
  async readJson(response) {
    try { return await readProviderJson(response, { now: this.now(), maxBytes: 4 * 1024 * 1024 }) }
    catch (error) { throw error }
  }
  publicError(error) {
    if (error instanceof MetaCatalogError) return error
    const codes = { 'auth-required': 'meta-login-required', 'rate-limited': 'meta-rate-limited', 'account-changed': 'meta-account-changed' }
    const result = new MetaCatalogError(codes[error?.code] ?? 'meta-refresh-failed')
    if (Number.isFinite(error?.retryAfterMs)) result.retryAfterMs = error.retryAfterMs
    return result
  }
  async contract({ force = false, signal } = {}) {
    checkProfile(this.profile()); await this.validate()
    const credential = await this.credentials.read('meta')
    if (!oauth(credential)) throw new ProviderReadError('auth-required')
    const principal = principalOf(credential)
    this.principal = principal
    try {
      return await this.entitlementCache.get(async requestSignal => {
        let result
        await this.credentials.modify('meta', async current => {
          if (!oauth(current) || principalOf(current) !== principal) throw new ProviderReadError('account-changed')
          const body = await this.readJson(await this.fetch('https://api.meta.ai/muse-code/key', {
            method: 'POST', redirect: 'error', signal: requestSignal,
            headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-version': '1.0.0', authorization: `Bearer ${current.refresh}` }, body: '{}',
          }))
          const account = { active: typeof body.is_subs_active === 'boolean' ? body.is_subs_active : null,
            tierName: cleanLabel(body.subs_tier_name), tierId: cleanLabel(body.subs_tier_id) }
          const sourceObservedAt = new Date(this.now()).toISOString()
          let usage
          try { usage = { source: 'internal-http', sourceObservedAt, status: 'available', windows: parseMuseUsage(body) } }
          catch (error) { usage = { source: 'internal-http', sourceObservedAt, status: error.code === 'auth-required' ? 'auth-required' : 'error', windows: [] } }
          result = { account, usage }
          // Entitlement is held in this session, never as an OAuth extension flag.
          const { dshPiSubscription: _obsolete, ...standard } = current
          if (account.active !== true) return standard
          if (typeof body.api_key !== 'string' || body.api_key.length === 0) throw new ProviderReadError('auth-required')
          return { ...standard, access: body.api_key, expires: this.now() + 86400000 }
        })
        const current = await this.credentials.read('meta')
        if (this.closed || requestSignal.aborted || !oauth(current) || principalOf(current) !== principal) throw new ProviderReadError('account-changed')
        checkProfile(this.profile())
        if (result.account.active !== true && this.catalogCache.value?.size) {
          this.catalogCache.value = undefined
          if (!this.catalogCache.pending) { this.version++; this.onChange() }
        }
        this.onUsage()
        return result
      }, { force, signal })
    } catch (error) {
      if (error.code === 'auth-required' || error.code === 'account-changed') {
        const changed = this.catalogCache.value !== undefined
        this.catalogCache.value = undefined
        if (changed && !this.catalogCache.pending) { this.version++; this.onChange() }
      }
      throw error
    }
  }
  /** Shared mint for usage, model discovery and host-owned credential renewal. */
  async ensureCredentials({ signal } = {}) {
    await this.validate()
    const current = await this.credentials.read('meta')
    if (!oauth(current)) throw new ProviderReadError('auth-required')
    if (!current.access || !Number.isFinite(current.expires) || current.expires <= this.now()) await this.contract({ force: true, signal })
    const next = await this.credentials.read('meta')
    if (!oauth(next) || typeof next.access !== 'string' || !Number.isFinite(next.expires) || next.expires <= this.now()) throw new ProviderReadError('auth-required')
    return next
  }
  async usage(options = {}) {
    try { return (await this.contract(options)).usage }
    catch (error) {
      // Usage has its own public codes and cannot break model inference.
      if (error instanceof ProviderReadError) throw error
      if (error instanceof MetaCatalogError) throw new ProviderReadError(error.code === 'meta-login-required' ? 'auth-required' : error.code.includes('override') || error.code.includes('incompatible') ? 'unsupported' : 'error')
      throw new ProviderReadError('error')
    }
  }
  refresh(options = {}) {
    if (this.closed) return Promise.reject(new MetaCatalogError('meta-refresh-failed'))
    // Keep direct singleflight promise identity for existing consumers.
    if (this.pending && !options.signal) return this.pending
    const pending = this.runRefresh(options).catch(error => { throw this.publicError(error) })
    if (options.signal) return pending
    this.pending = pending.finally(() => { if (this.pending === stored) this.pending = undefined })
    const stored = this.pending
    return stored
  }
  async runRefresh({ force = false, signal } = {}) {
    checkProfile(this.profile()); await this.validate()
    const prior = this.catalogCache.value
    await this.catalogCache.get(async requestSignal => {
      const contract = await this.contract({ signal: requestSignal })
      if (contract.account.active !== true) return new Map()
      const credential = await this.ensureCredentials({ signal: requestSignal }), principal = this.principal
      if (!oauth(credential) || principalOf(credential) !== principal) throw new ProviderReadError('account-changed')
      const body = await this.readJson(await this.fetch('https://api.meta.ai/v1/models', {
        method: 'GET', redirect: 'error', signal: requestSignal,
        headers: { accept: 'application/json', 'x-api-version': '1.0.0', authorization: `Bearer ${credential.access}` },
      }))
      if (!Array.isArray(body.data) || body.has_more === true || body.next_page !== undefined && body.next_page !== null) throw new ProviderReadError('error')
      const current = await this.credentials.read('meta')
      if (this.closed || requestSignal.aborted || !oauth(current) || principalOf(current) !== principal) throw new ProviderReadError('account-changed')
      if (this.entitlementCache.peek().value?.account.active !== true) throw new ProviderReadError('auth-required')
      checkProfile(this.profile())
      const baseline = this.baseline('meta'), learned = new Map(), profile = this.profile()
      for (const row of body.data) {
        if (!row || typeof row.id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(row.id) || baseline.has(row.id) && !fullModel(row.id) || learned.has(row.id)) continue
        const input = row.input ?? row.modalities?.input
        if (Array.isArray(input) && !input.some(value => value === 'text' || value === 'image')) continue
        if (['image', 'classifier', 'embedding', 'audio'].includes(row.type)) continue
        learned.set(row.id, baseline.has(row.id)
          ? { ...baseline.get(row.id), [META_CATALOG_GRANT]: Object.freeze({ principal, verified: true }), [DISCOVERED_MODEL]: Object.freeze({ verified: true }) }
          : learnedModel(row, profile, principal))
      }
      return learned
    }, { force, signal }).catch(error => {
      if (prior !== undefined && this.catalogCache.value === undefined) { this.version++; this.onChange() }
      throw error
    })
    const learned = this.catalogCache.value
    const image = map => map && JSON.stringify([...map].map(([id, model]) => [id, model, model[META_CATALOG_GRANT]?.verified]))
    if (image(prior) !== image(learned)) { this.version++; this.onChange() }
    return this.state()
  }
  async keyForModel(provider, model, profile) {
    if (provider !== 'meta') return undefined
    const grant = model[META_CATALOG_GRANT]
    if (!grant && !fullModel(model.id)) return undefined
    checkProfile(profile); await this.validate()
    const current = await this.credentials.read('meta')
    const contract = this.entitlementCache.peek()
    if (!grant || !oauth(current) || principalOf(current) !== grant.principal || this.principal !== grant.principal
      || !this.catalogCache.peek().value?.has(model.id) || contract.value?.account.active !== true || contract.error === 'auth-required') {
      throw new MetaCatalogError('meta-refresh-required')
    }
    if (typeof current.access !== 'string' || !Number.isFinite(current.expires) || current.expires <= this.now()) throw new MetaCatalogError('meta-refresh-required')
    return current.access
  }
  dispose() { this.closed = true; this.catalogCache.dispose(); this.entitlementCache.dispose(); this.principal = undefined }
}
