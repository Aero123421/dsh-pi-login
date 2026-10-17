import { createHash } from 'node:crypto'
import { LlmError } from '@deepseek-ai/dsh-llm'
import { DISCOVERED_MODEL } from './catalog-metadata.mjs'
import { ProviderCache, ProviderReadError } from './provider-cache.mjs'
import { readProviderJson } from './account-usage-providers.mjs'
import { chatGPTModelRows } from './openai-chatgpt-models.mjs'

const BASE = 'https://api.openai.com/v1'
const oauth = credential => credential?.type === 'oauth' && typeof credential.refresh === 'string' && credential.refresh.length > 0
const principal = credential => createHash('sha256').update(credential.refresh).digest('hex')
const signature = profile => JSON.stringify([profile.baseURL, profile.api, profile.apiKeyEnv, profile.credentialRef, profile.headers, profile.headerRefs])

export function hasChatGPTCredentialOverride(profile = {}) {
  return profile.apiKeyEnv !== undefined || profile.credentialRef !== undefined
    || [...Object.keys(profile.headers ?? {}), ...Object.keys(profile.headerRefs ?? {})].some(key => key.toLowerCase() === 'authorization')
}

/** Only the documented SIWC transport may receive a ChatGPT access token. */
export function isChatGPTProfile(profile = {}) {
  return !hasChatGPTCredentialOverride(profile)
    && (profile.baseURL === undefined || profile.baseURL.replace(/\/+$/, '') === BASE)
    && (profile.api === undefined || profile.api === 'openai-responses')
}

/** Account-owned model choices; no OAuth tokens or account identifiers enter public metadata. */
export class OpenAIChatGPTCatalogSession {
  constructor({ credentials, profile, baseline, refreshAuth, onChange = () => {}, fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, ttl = 1800000, timeout = 20000 }) {
    this.credentials = credentials; this.profile = profile; this.baseline = baseline; this.refreshAuth = refreshAuth
    this.onChange = onChange; this.fetch = request; this.now = now; this.version = 0
    this.cache = new ProviderCache({ ttl, maxStale: ttl, timeout, now }); this.closed = false; this.autoRetryAt = 0
  }
  invalidate() {
    this.autoRetryAt = 0; this.cache.invalidate(); this.principal = undefined; this.signature = undefined
    this.version++; if (!this.closed) this.onChange()
  }
  async validate() {
    const profile = this.profile()
    if (!isChatGPTProfile(profile) || this.signature !== undefined && this.signature !== signature(profile)) { this.invalidate(); return }
    if (this.principal === undefined) return
    const current = await this.credentials.read('openai')
    if (!oauth(current) || principal(current) !== this.principal) this.invalidate()
  }
  catalog(provider) {
    if (provider !== 'openai') return undefined
    if (!isChatGPTProfile(this.profile())) return new Map()
    const cached = this.cache.peek()
    // Reading a saved connection after startup or TTL expiry renews its account
    // list. No polling: catalog readers and inference are the refresh triggers.
    if (!this.closed && !cached.fresh && !this.autoPending && this.now() >= this.autoRetryAt) {
      this.autoPending = Promise.resolve().then(() => this.refresh()).catch(() => {
        this.autoRetryAt = this.now() + 60000
      }).finally(() => { this.autoPending = undefined })
    }
    return cached.value ?? new Map()
  }
  async refresh({ force = false, signal } = {}) {
    if (this.closed) throw new ProviderReadError('aborted')
    await this.validate()
    const profile = this.profile()
    if (!isChatGPTProfile(profile)) throw new ProviderReadError('unsupported')
    const binding = signature(profile), epoch = this.cache.epoch, before = this.cache.value
    try {
      const value = await this.cache.get(async requestSignal => {
        let credential = await this.credentials.read('openai')
        if (!oauth(credential)) throw new ProviderReadError('auth-required')
        if (!credential.access || !Number.isFinite(credential.expires) || credential.expires <= this.now()) {
          if (!this.refreshAuth) throw new ProviderReadError('auth-required')
          credential = await this.refreshAuth(requestSignal)
        }
        if (!oauth(credential) || typeof credential.access !== 'string' || !/^[\x21-\x7e]+$/.test(credential.access)
          || !Number.isFinite(credential.expires) || credential.expires <= this.now()) throw new ProviderReadError('auth-required')
        const account = principal(credential)
        const body = await readProviderJson(await this.fetch(`${BASE}/models`, {
          method: 'GET', redirect: 'error', signal: requestSignal,
          headers: { accept: 'application/json', authorization: `Bearer ${credential.access}` },
        }), { now: this.now(), maxBytes: 4 * 1024 * 1024 })
        let rows
        try { rows = chatGPTModelRows(body) } catch { throw new ProviderReadError('error') }
        const current = await this.credentials.read('openai')
        if (this.closed || requestSignal.aborted || this.cache.epoch !== epoch || !oauth(current) || principal(current) !== account
          || binding !== signature(this.profile()) || !isChatGPTProfile(this.profile())) throw new ProviderReadError('account-changed')
        const baseline = this.baseline('openai')
        const models = new Map(rows.map(row => {
          const known = baseline.get(row.id)
          return [row.id, known ? { ...known, name: row.name } : {
            ...row, provider: 'openai', api: 'openai-responses', baseUrl: BASE,
            // The SIWC listing supplies no capacities or effort contract. Use
            // configured conservative defaults for new IDs, retaining SDK
            // metadata (including 272K) only for exact known IDs.
            contextWindow: profile.defaultContextWindow ?? 262144,
            maxTokens: profile.defaultMaxTokens ?? 32768,
            input: ['text'], reasoning: false,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            [DISCOVERED_MODEL]: Object.freeze({ verified: false }),
          }]
        }))
        this.principal = account; this.signature = binding
        return models
      }, { force, signal })
      if (before !== value) { this.version++; if (!this.closed) this.onChange() }
      return value
    } catch (error) {
      if (before !== undefined && this.cache.value === undefined) { this.version++; if (!this.closed) this.onChange() }
      throw error
    }
  }
  async authorizeModel(model) {
    try {
      const models = await this.refresh()
      if (!models.has(model.id)) throw new ProviderReadError('unsupported')
    } catch {
      throw new LlmError('Could not verify this model in the selected ChatGPT account. Reload the account model list and choose an available model.', 'CHATGPT_MODEL_UNAVAILABLE')
    }
  }
  dispose() { this.closed = true; this.cache.dispose(); this.principal = undefined }
}

export function openAIChatGPTCatalogProvider(session) {
  return { session, authorizeModel: model => session.authorizeModel(model), errorCodes: {
    'auth-required': 'catalog-login-required', 'unsupported': 'catalog-settings-incompatible',
    'account-changed': 'catalog-account-changed', 'rate-limited': 'catalog-rate-limited',
  } }
}
