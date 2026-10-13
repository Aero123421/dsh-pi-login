const ERROR_CODES = new Set(['catalog-login-required', 'catalog-key-override', 'catalog-settings-incompatible', 'catalog-account-changed', 'catalog-rate-limited', 'catalog-refresh-failed', 'catalog-refresh-unsupported'])
const copyKey = value => typeof value === 'string' && /^[A-Za-z][A-Za-z0-9]{0,79}$/.test(value) ? value : undefined

export class CatalogRefreshError extends Error {
  constructor(code) { super(ERROR_CODES.has(code) ? code : 'catalog-refresh-failed'); this.code = this.message }
}

/** Per-plugin provider sessions. The UI and RPC never choose provider protocols. */
export class ProviderCatalogs {
  constructor(providers = {}) {
    this.providers = new Map(Object.entries(providers))
    this.pending = new Map()
    this.closed = false
  }
  revision() { return [...this.providers.values()].reduce((sum, { session }) => sum + (session.version ?? 0), 0) }
  catalog(provider) { return this.providers.get(provider)?.session.catalog?.(provider) }
  validate(provider) { return this.providers.get(provider)?.session.validate?.() }
  onLogin(provider) { this.providers.get(provider)?.session.invalidate?.() }
  authorizeModel(provider, model, profile) { return this.providers.get(provider)?.authorizeModel?.(model, profile) }
  state(provider, models = []) {
    const entry = this.providers.get(provider)
    if (!entry?.session.refresh) return { canRefresh: false }
    // Explicit public presentation fields only; never spread a session state.
    const view = entry.presentation?.(models) ?? {}
    const message = copyKey(view.status?.message)
    const detail = typeof view.status?.detail === 'string' ? view.status.detail.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 100) : undefined
    return {
      canRefresh: true,
      ...message ? { status: { message, ...detail ? { detail } : {} } } : {},
      notes: (Array.isArray(view.notes) ? view.notes : []).map(copyKey).filter(Boolean).slice(0, 10),
      errors: Object.fromEntries(Object.entries(entry.errors ?? {}).flatMap(([code, key]) => ERROR_CODES.has(code) && copyKey(key) ? [[code, key]] : [])),
    }
  }
  refresh(provider) {
    if (this.closed) return Promise.reject(new CatalogRefreshError('catalog-refresh-failed'))
    const entry = this.providers.get(provider)
    if (!entry?.session.refresh) return Promise.reject(new CatalogRefreshError('catalog-refresh-unsupported'))
    if (this.pending.has(provider)) return this.pending.get(provider)
    const pending = Promise.resolve().then(() => {
      if (this.closed) throw new CatalogRefreshError('catalog-refresh-failed')
      return entry.session.refresh({ force: true })
    }).then(() => {
      if (this.closed) throw new CatalogRefreshError('catalog-refresh-failed')
    }).catch(error => {
      if (error instanceof CatalogRefreshError) throw error
      const code = entry.errorCodes?.[error?.code]
      throw new CatalogRefreshError(code ?? 'catalog-refresh-failed')
    }).finally(() => this.pending.delete(provider))
    this.pending.set(provider, pending)
    return pending
  }
  dispose() {
    this.closed = true
    for (const { session } of this.providers.values()) session.dispose?.()
  }
}
