import { createHash } from 'node:crypto'
import { ProviderCache, ProviderReadError } from './provider-cache.mjs'
import { readProviderJson, parseMuseUsage } from './account-usage-providers.mjs'
import { MUSE_CONTRIBUTOR, MUSE_CONTRIBUTOR_ONLY, MUSE_CONTRIBUTOR_CAPS, MUSE_EFFORTS_UNVERIFIED, MUSE_DEFAULT_EFFORT, MUSE_CONTRIBUTOR_HEADER } from './catalog-metadata.mjs'

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
// Levels pi-ai already treats as the base set. max and xhigh stay off until
// the account catalog, or a published Standard exception, names them.
const BASE_LEVELS = ['minimal', 'low', 'medium', 'high']
const KNOWN_EFFORTS = new Set([...LEVELS, 'none'])
// Meta's reasoning docs list these levels for muse-wonder-1.0 Standard.
// Contributor listings and every other model ID do not inherit them.
const DOCUMENTED_STANDARD_EFFORTS = new Map([
  ['muse-wonder-1.0', ['minimal', 'low', 'medium', 'high', 'xhigh', 'max']],
])
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
  if (!Array.isArray(variants)) return { efforts: [], unverified: true }
  const names = variants.map(item => typeof item === 'string' ? item
    : item && typeof item === 'object' ? first(item, ['effort', 'reasoning_effort', 'reasoningEffort', 'level', 'id', 'name']) : undefined)
  const efforts = [...new Set(names.filter(name => typeof name === 'string').map(name => name.toLowerCase()))].filter(name => KNOWN_EFFORTS.has(name))
  // An empty list or only unknown keys is not a list of supported levels.
  if (!efforts.length) return { efforts: [], unverified: true }
  return { efforts, unverified: false }
}

function catalogDefault(row) {
  const value = first(row, ['default_reasoning_effort', 'defaultReasoningEffort', 'default_effort'])
  if (typeof value !== 'string') return undefined
  const level = value.toLowerCase()
  return KNOWN_EFFORTS.has(level) ? level : undefined
}

/** Levels this stored row may offer. An unlisted catalog does not include max or xhigh. */
export function offeredMuseEfforts(row) {
  const listed = Array.isArray(row?.efforts) ? row.efforts.filter(effort => KNOWN_EFFORTS.has(effort)) : []
  if (listed.length) return listed
  if (row?.effortsUnverified === true) return [...BASE_LEVELS]
  return []
}

function assignDefault(row, candidate) {
  const offered = offeredMuseEfforts(row)
  if (candidate && offered.includes(candidate)) row.defaultEffort = candidate
  else delete row.defaultEffort
}

/**
 * muse-wonder-1.0 Standard has a published effort range. Apply it only when
 * that Standard listing omitted a usable effort array.
 */
export function withDocumentedStandardEfforts(rows) {
  return rows.map(row => {
    if (row.effortsUnverified !== true) return row
    const documented = DOCUMENTED_STANDARD_EFFORTS.get(row.id)
    if (!documented) return row
    const next = { ...row, efforts: [...documented] }
    delete next.effortsUnverified
    const candidate = next.catalogDefault ?? next.defaultEffort
    delete next.catalogDefault
    delete next.defaultEffort
    assignDefault(next, candidate)
    return next
  })
}

function finalizeRow(row) {
  const next = { ...row }
  const candidate = next.catalogDefault ?? next.defaultEffort
  delete next.catalogDefault
  delete next.defaultEffort
  assignDefault(next, candidate)
  return next
}

function modeSnapshot(row) {
  return {
    name: row.name,
    contextWindow: row.contextWindow,
    maxTokens: row.maxTokens,
    input: [...row.input],
    efforts: [...row.efforts],
    ...row.effortsUnverified === true ? { effortsUnverified: true } : {},
    ...row.defaultEffort ? { defaultEffort: row.defaultEffort } : {},
  }
}

/** Keep one stored row per provider ID, with Contributor limits beside Standard when they differ. */
export function mergeMuseModes(standard, contributor) {
  const offered = new Set(contributor.map(row => row.id))
  const byContributor = new Map(contributor.map(row => [row.id, row]))
  const merged = new Map()
  for (const row of standard) {
    const other = byContributor.get(row.id)
    const contributorChoice = offered.has(row.id) && !row.id.endsWith('-contributor')
    const next = { ...row, contributor: contributorChoice }
    // A native "<id>-contributor" row is the Contributor descriptor. The same
    // base ID's mode-1 row must not become a second choice.
    if (other && contributorChoice && !offered.has(`${row.id}-contributor`) && JSON.stringify(modeSnapshot(row)) !== JSON.stringify(modeSnapshot(other))) {
      next.contributorMode = modeSnapshot(other)
    }
    merged.set(row.id, next)
  }
  for (const row of contributor) {
    if (row.id.startsWith('muse-') && row.id.endsWith('-contributor')) merged.set(row.id, { ...row, contributor: false })
  }
  return [...merged.values()]
}

/** Accept the catalog's documented row fields without guessing entitlement. */
export function parseMuseCatalog(body) {
  const rows = []
  for (const row of rowsOf(body)) {
    if (!row || typeof row !== 'object') continue
    const id = first(row, ['id', 'model_id', 'modelId', 'model'])
    if (typeof id !== 'string' || !ID.test(id) || NON_CHAT.test(id) || rows.some(entry => entry.id === id)) continue
    if (row.enabled === false || ['hidden', 'internal', 'disabled'].includes(row.visibility)) continue
    const parsed = effortsOf(row)
    const next = {
      id, name: label(first(row, ['display_label', 'displayLabel', 'display_name', 'displayName', 'name'])) ?? id,
      contextWindow: positive(first(row, ['context_limit', 'contextLimit', 'context_window', 'contextWindow'])) ?? 1048576,
      maxTokens: positive(first(row, ['output_limit', 'outputLimit', 'max_output_tokens', 'maxTokens'])) ?? 131072,
      // Muse chat models accept images; the catalog only flags video and image output.
      input: ['text', 'image'],
      efforts: parsed.efforts,
      contributor: false,
      ...parsed.unverified ? { effortsUnverified: true } : {},
    }
    const rawDefault = catalogDefault(row)
    if (rawDefault && offeredMuseEfforts(next).includes(rawDefault)) next.defaultEffort = rawDefault
    else if (rawDefault) next.catalogDefault = rawDefault
    rows.push(next)
  }
  return rows
}

function descriptor(row) {
  const efforts = offeredMuseEfforts(row)
  const reasoning = efforts.some(effort => effort !== 'none')
  const model = {
    id: row.id, name: row.name, provider: 'meta', api: 'openai-responses', baseUrl: BASE_URL,
    reasoning,
    ...reasoning ? { thinkingLevelMap: {
      off: efforts.includes('none') ? 'none' : null,
      ...Object.fromEntries(LEVELS.map(level => [level, efforts.includes(level) ? level : null])),
    } } : {},
    input: [...row.input], contextWindow: row.contextWindow, maxTokens: row.maxTokens,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    [MUSE_CONTRIBUTOR]: row.contributor === true,
    [MUSE_CONTRIBUTOR_ONLY]: row.id.startsWith('muse-') && row.id.endsWith('-contributor'),
    ...row.effortsUnverified === true ? { [MUSE_EFFORTS_UNVERIFIED]: true } : {},
    ...row.defaultEffort && efforts.includes(row.defaultEffort) ? { [MUSE_DEFAULT_EFFORT]: row.defaultEffort } : {},
  }
  const mode = row.contributorMode
  if (mode && positive(mode.contextWindow) && positive(mode.maxTokens) && Array.isArray(mode.efforts)) {
    model[MUSE_CONTRIBUTOR_CAPS] = descriptor({
      id: row.id, name: mode.name || row.name, contextWindow: mode.contextWindow, maxTokens: mode.maxTokens,
      input: mode.input?.length ? mode.input : row.input, efforts: mode.efforts,
      effortsUnverified: mode.effortsUnverified === true, defaultEffort: mode.defaultEffort, contributor: true,
    })
  }
  return model
}

/** Pi model descriptors for the persisted rows. */
export function museModels(rows = []) {
  return new Map(rows.map(row => [row.id, descriptor(row)]))
}

export class MuseCodeCatalogSession {
  constructor({ credentials, snapshot = () => undefined, persist = async () => {}, refreshAuth, onChange = () => {}, onUsage = () => {},
    fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, ttl = 1800000, timeout = 20000 }) {
    Object.assign(this, { credentials, snapshot, persist, refreshAuth, onChange, onUsage, fetch: request, now })
    this.cache = new ProviderCache({ ttl, maxStale: Infinity, timeout, now })
    this.usageCache = new ProviderCache({ ttl: 300000, maxStale: 3600000, timeout, now })
    this.version = 0; this.closed = false; this.useSnapshot = true; this.lifecycle = new AbortController()
  }
  rows() { return this.cache.peek().value ?? (this.useSnapshot ? this.snapshot() : undefined) ?? [] }
  catalog() { return museModels(this.rows()) }
  state() {
    const cached = this.cache.peek()
    return { canRefresh: true, count: this.rows().length, checkedAt: cached.checkedAt, error: cached.error, account: this.usageCache.peek().value?.account }
  }
  changed() { this.version++; if (!this.closed) this.onChange() }
  invalidate() {
    // A saved catalog belongs to the previous sign-in. Hiding only the process
    // cache would fall back to that saved account's models after a failed read.
    // The connection owner clears the durable snapshot before reauthentication.
    this.principal = undefined; this.useSnapshot = false; this.cache.invalidate(); this.usageCache.invalidate(); this.changed()
  }
  async currentCredential(signal) {
    if (this.closed || signal?.aborted) throw new ProviderReadError('aborted')
    const deadline = AbortSignal.timeout(this.cache.timeout)
    const epoch = this.cache.epoch
    const bounded = AbortSignal.any([this.lifecycle.signal, deadline, ...signal ? [signal] : []])
    let abort
    const cancelled = new Promise((_, reject) => {
      abort = () => reject(new ProviderReadError(signal?.aborted || this.closed ? 'aborted' : 'error'))
      bounded.addEventListener('abort', abort, { once: true })
    })
    try {
      const current = await Promise.race([this.credentials.read('meta'), cancelled])
      if (this.closed) throw new ProviderReadError('aborted')
      if (this.cache.epoch !== epoch) throw new ProviderReadError('account-changed')
      return current
    } catch (error) {
      throw error instanceof ProviderReadError ? error : new ProviderReadError('error')
    } finally { bounded.removeEventListener('abort', abort) }
  }
  async validate() {
    const current = await this.currentCredential()
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
      const standard = withDocumentedStandardEfforts(parseMuseCatalog(await this.list(credential, '0', requestSignal))).map(finalizeRow)
      if (!standard.length) throw new ProviderReadError('error')
      // Contributor choices exist only for models the account lists in that mode.
      // A failed read is not evidence that Contributor models disappeared.
      // Publish one complete two-mode catalog, or retain the previous value.
      const contributor = parseMuseCatalog(await this.list(credential, '1', requestSignal)).map(finalizeRow)
      // Keep provider-returned IDs intact, including native Contributor IDs.
      // Choices pair those with their base instead of offering both a native
      // row and a synthetic duplicate. Same-ID Contributor limits stay on the
      // base row so a restart does not inherit Standard's effort list.
      const rows = mergeMuseModes(standard, contributor)
      const current = await this.credentials.read('meta')
      if (this.closed || requestSignal.aborted || !oauth(current) || principalOf(current) !== principal) throw new ProviderReadError('account-changed')
      if (JSON.stringify(rows) !== JSON.stringify(this.snapshot() ?? [])) {
        await this.persist(rows, { signal: requestSignal })
      }
      const stored = await this.credentials.read('meta')
      if (this.closed || requestSignal.aborted || !oauth(stored) || principalOf(stored) !== principal) throw new ProviderReadError('account-changed')
      return rows
    }, { force, signal }).then(() => {
      if (this.closed) throw new ProviderReadError('aborted')
      this.changed()
      return this.state()
    }).catch(error => {
      if (error?.code === 'account-changed') this.invalidate()
      throw error
    })
  }
  /** The CLI's key mint also reports the subscription and its quota. */
  async usage({ signal, force = false } = {}) {
    // Check identity even when the quota cache is fresh. A Credentials writer
    // outside the login flow may replace the grant without disposing us.
    const credential = await this.currentCredential(signal)
    if (!oauth(credential)) {
      this.invalidate()
      throw new ProviderReadError('auth-required')
    }
    const identity = principalOf(credential)
    if (this.principal && this.principal !== identity) this.invalidate()
    this.principal = identity
    return this.usageCache.get(async requestSignal => {
      const current = await this.credentials.read('meta')
      if (!oauth(current)) throw new ProviderReadError('auth-required')
      const principal = principalOf(current)
      const body = await readProviderJson(await this.fetch(MUSE_CODE_KEY_URL, {
        method: 'POST', redirect: 'error', signal: requestSignal, body: '{}',
        headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-version': '1.0.0', authorization: `Bearer ${current.refresh}` },
      }), { now: this.now() })
      const account = { active: typeof body.is_subs_active === 'boolean' ? body.is_subs_active : null, tierName: label(body.subs_tier_name) }
      const stored = await this.credentials.read('meta')
      if (this.closed || requestSignal.aborted || !oauth(stored) || principalOf(stored) !== principal) throw new ProviderReadError('account-changed')
      if (account.active === true && typeof body.api_key === 'string' && body.api_key) {
        // Keep the freshly minted key for this same account only.
        await this.credentials.modify('meta', async stored => {
          if (this.closed || requestSignal.aborted || !oauth(stored) || principalOf(stored) !== principal) throw new ProviderReadError('account-changed')
          return { ...stored, access: body.api_key, expires: this.now() + 86400000 }
        })
      }
      const currentAfterWrite = await this.credentials.read('meta')
      if (this.closed || requestSignal.aborted || !oauth(currentAfterWrite) || principalOf(currentAfterWrite) !== principal) throw new ProviderReadError('account-changed')
      let status = 'available', windows = []
      try { windows = parseMuseUsage(body) }
      catch (error) { status = error?.code === 'auth-required' ? 'auth-required' : 'error' }
      return { account, usage: { source: 'internal-http', sourceObservedAt: new Date(this.now()).toISOString(), status, windows } }
    }, { force, signal }).then(result => {
      if (!this.closed && this.usageCache.peek().value === result) this.onUsage()
      return result.usage
    }).catch(error => {
      if (error?.code === 'account-changed') this.invalidate()
      throw error
    })
  }
  dispose() { this.closed = true; this.lifecycle.abort(); this.cache.dispose(); this.usageCache.dispose() }
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
