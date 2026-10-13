import { DISCOVERED_MODEL } from './catalog-metadata.mjs'
import { createHash } from 'node:crypto'

// Private provenance survives model object spreads without entering JSON/RPC.
export const META_CATALOG_GRANT = Symbol('dsh-pi-login/meta-catalog-grant')
const MAX_BYTES = 4 * 1024 * 1024
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
  if (profile.apiKeyEnv !== undefined) throw new MetaCatalogError('meta-key-override')
  if ((profile.baseURL !== undefined && profile.baseURL.replace(/\/+$/, '') !== 'https://api.meta.ai/v1')
    || (profile.api !== undefined && profile.api !== 'openai-responses')
    || Object.keys(profile.headers ?? {}).some(name => name.toLowerCase() === 'authorization')) {
    throw new MetaCatalogError('meta-settings-incompatible')
  }
}

async function readJson(response) {
  if (!response.ok) {
    await response.body?.cancel().catch(() => {})
    throw new MetaCatalogError(response.status === 429 ? 'meta-rate-limited' : response.status === 401 || response.status === 403 ? 'meta-login-required' : 'meta-refresh-failed')
  }
  const declared = Number(response.headers.get('content-length'))
  if (declared > MAX_BYTES) { await response.body?.cancel(); throw new MetaCatalogError('meta-refresh-failed') }
  const reader = response.body?.getReader()
  if (!reader) throw new MetaCatalogError('meta-refresh-failed')
  let size = 0
  const chunks = []
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BYTES) throw new MetaCatalogError('meta-refresh-failed')
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    const parsed = JSON.parse(new TextDecoder().decode(bytes))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new MetaCatalogError('meta-refresh-failed')
    return parsed
  } finally { await reader.cancel().catch(() => {}) }
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

/** Account-bound, process-local catalog. Refresh never performs inference. */
export class MetaCatalogSession {
  constructor({ credentials, profile, baseline, onChange = () => {}, fetch: request = (...args) => globalThis.fetch(...args) }) {
    this.credentials = credentials; this.profile = profile; this.baseline = baseline
    this.onChange = onChange; this.fetch = request; this.version = 0
    this.controller = new AbortController(); this.closed = false
  }
  state() { return { canRefresh: true, account: this.account, checkedAt: this.checkedAt, discoveredCount: this.learned?.size ?? 0 } }
  invalidate() {
    this.principal = undefined; this.learned = undefined; this.account = undefined; this.checkedAt = undefined
    this.version++; if (!this.closed) this.onChange()
  }
  async validate() {
    if (!this.principal) return
    const current = await this.credentials.read('meta')
    if (!oauth(current) || principalOf(current) !== this.principal) this.invalidate()
  }
  catalog(provider) {
    if (provider !== 'meta' || !this.learned) return undefined
    const catalog = new Map(this.baseline('meta'))
    for (const [id, model] of this.learned) if (!catalog.has(id) || fullModel(id)) catalog.set(id, model)
    return catalog
  }
  refresh() {
    if (this.closed) return Promise.reject(new MetaCatalogError('meta-refresh-failed'))
    if (this.pending) return this.pending
    this.pending = this.runRefresh().catch(error => {
      if (error instanceof MetaCatalogError) throw error
      // Never forward response bodies, SDK errors or credentials to RPC.
      throw new MetaCatalogError('meta-refresh-failed')
    }).finally(() => { this.pending = undefined })
    return this.pending
  }
  async runRefresh() {
    checkProfile(this.profile())
    await this.validate()
    const credential = await this.credentials.read('meta')
    if (!oauth(credential)) throw new MetaCatalogError('meta-login-required')
    const principal = principalOf(credential)
    const signal = AbortSignal.any([this.controller.signal, AbortSignal.timeout(20000)])
    let account
    const refreshed = await this.credentials.modify('meta', async current => {
      if (!oauth(current) || principalOf(current) !== principal) throw new MetaCatalogError('meta-account-changed')
      const body = await readJson(await this.fetch('https://api.meta.ai/muse-code/key', {
        method: 'POST', redirect: 'error', signal,
        headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-version': '1.0.0', authorization: `Bearer ${current.refresh}` },
        body: '{}',
      }))
      account = { active: typeof body.is_subs_active === 'boolean' ? body.is_subs_active : null,
        tierName: cleanLabel(body.subs_tier_name), tierId: cleanLabel(body.subs_tier_id) }
      if (account.active !== true) return { ...current, dshPiSubscription: account }
      if (typeof body.api_key !== 'string' || body.api_key.length === 0) throw new MetaCatalogError('meta-login-required')
      return { ...current, access: body.api_key, expires: Date.now() + 86400000, dshPiSubscription: account }
    })
    if (this.closed) throw new MetaCatalogError('meta-refresh-failed')
    checkProfile(this.profile())
    if (account.active !== true) {
      this.principal = principal; this.learned = new Map(); this.account = account; this.checkedAt = Date.now()
      this.version++; this.onChange(); return this.state()
    }
    const body = await readJson(await this.fetch('https://api.meta.ai/v1/models', {
      method: 'GET', redirect: 'error', signal,
      headers: { accept: 'application/json', 'x-api-version': '1.0.0', authorization: `Bearer ${refreshed.access}` },
    }))
    if (!Array.isArray(body.data) || body.has_more === true || body.next_page !== undefined && body.next_page !== null) throw new MetaCatalogError('meta-refresh-failed')
    const current = await this.credentials.read('meta')
    if (this.closed || !oauth(current) || principalOf(current) !== principal) throw new MetaCatalogError('meta-account-changed')
    checkProfile(this.profile())
    const baseline = this.baseline('meta')
    const learned = new Map()
    const profile = this.profile()
    for (const row of body.data) {
      if (!row || typeof row.id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(row.id) || baseline.has(row.id) && !fullModel(row.id) || learned.has(row.id)) continue
      const input = row.input ?? row.modalities?.input
      if (Array.isArray(input) && !input.some(value => value === 'text' || value === 'image')) continue
      if (['image', 'classifier', 'embedding', 'audio'].includes(row.type)) continue
      if (account.active !== true) continue
      // Full is never invented from a name or a guessed suffix: the account
      // must have a confirmed active subscription and advertise this exact ID.
      learned.set(row.id, baseline.has(row.id)
        ? { ...baseline.get(row.id), [META_CATALOG_GRANT]: Object.freeze({ principal, verified: true }), [DISCOVERED_MODEL]: Object.freeze({ verified: true }) }
        : learnedModel(row, profile, principal))
    }
    this.principal = principal; this.learned = learned; this.account = account; this.checkedAt = Date.now()
    this.version++; this.onChange()
    return this.state()
  }
  async keyForModel(provider, model, profile) {
    if (provider !== 'meta') return undefined
    const grant = model[META_CATALOG_GRANT]
    if (!grant && !fullModel(model.id)) return undefined
    checkProfile(profile)
    const current = await this.credentials.read('meta')
    if (!grant || !oauth(current) || principalOf(current) !== grant.principal || this.principal !== grant.principal
      || !this.learned?.has(model.id) || current.dshPiSubscription?.active !== true) {
      throw new MetaCatalogError('meta-refresh-required')
    }
    if (typeof current.access !== 'string' || current.expires <= Date.now()) throw new MetaCatalogError('meta-refresh-required')
    return current.access
  }
  dispose() { this.closed = true; this.controller.abort(); this.invalidate() }
}
