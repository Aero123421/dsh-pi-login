import { CatalogRefreshError } from './provider-catalogs.mjs'
import { randomUUID } from 'node:crypto'

const KEY_PATTERN = /^llm-pi-ai\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const LIVE = 'running'
const NS = 'dsh-pi-login'
const MAX_TIMER_DELAY_MS = 2147483647

export class LoginError extends Error {
  constructor(code) { super(code); this.code = code }
}

function requireString(value, limit = 16384) {
  if (typeof value !== 'string' || value.length === 0 || value.length > limit) throw new LoginError('invalid-request')
  return value
}

function publicNotice(notice) {
  const result = { message: String(notice.message).slice(0, 2048) }
  if (typeof notice.url === 'string') {
    try {
      const url = new URL(notice.url)
      if (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) result.url = url.href
    } catch { /* Ignore invalid provider URLs. */ }
  }
  if (typeof notice.code === 'string') result.code = notice.code.slice(0, 256)
  return result
}

/** Private tickets keep login prompts out of shared tab state. */
export class PiLoginBroker {
  constructor(authorization, credentials, settings, { timeoutMs = 600000, expiryGraceMs = 60000, retentionMs = 60000, catalog, catalogs, connections, catalogsFor, syncFlows } = {}) {
    this.authorization = authorization
    this.credentials = credentials
    this.settings = settings
    this.timeoutMs = timeoutMs
    this.expiryGraceMs = expiryGraceMs
    this.retentionMs = retentionMs
    this.catalog = catalog
    this.catalogs = catalogs
    this.connections = connections
    this.catalogsFor = catalogsFor
    this.syncFlows = syncFlows
    this.attempts = new Map()
    this.closed = false
    this.unwatchConnections = connections?.registry?.subscribe(() => {
      for (const attempt of this.attempts.values()) {
        if (attempt.status === LIVE && attempt.binding && !connections.isCurrent(attempt.binding)) this.withdrawStale(attempt)
      }
    })
  }

  async list() {
    if (this.connections) return (await this.connections.list()).connections
    const section = this.section()
    return Promise.all(this.authorization.list().filter(entry => KEY_PATTERN.test(entry.key)).map(async entry => {
      const credential = await this.credentials.describeRecord(entry.key)
      return {
        key: entry.key, provider: entry.key.slice('llm-pi-ai/'.length), label: entry.label,
        methods: entry.methods.map(method => ({ id: method.id, label: method.label })),
        inFlight: entry.inFlight, configured: credential.configured, writable: credential.writable,
        managed: Object.hasOwn(section?.value?.providers ?? {}, entry.key.slice('llm-pi-ai/'.length)),
        enabled: Object.hasOwn(section?.value?.providers ?? {}, entry.key.slice('llm-pi-ai/'.length)) && section.value.providers[entry.key.slice('llm-pi-ai/'.length)].enabled !== false,
      }
    }))
  }

  section() { return this.connections?.section() ?? this.settings.describe({ redactSecrets: true }).find(row => row.ns === NS) }

  /** The Host resolves legacy keys to records it already owns; clients cannot select record IDs. */
  connection(id) {
    requireString(id, 200)
    if (KEY_PATTERN.test(id)) {
      const found = Object.entries(this.section()?.value?.connections ?? {}).find(([, connection]) => connection.legacyRoute === true && connection.integrationId === 'pi' && `llm-pi-ai/${connection.credentialRecordId}` === id)
      if (!found) throw new LoginError('invalid-request')
      id = found[0]
    }
    const connection = this.connections.lookup(id)
    if (!connection) throw new LoginError('invalid-request')
    return { ...connection, connectionId: id, key: this.connections.authKey(connection) }
  }

  catalogsForConnection(connection) { return this.catalogsFor?.(connection) }

  /** Catalog responses also belong to the endpoint/protocol they queried. */
  isCatalogCurrent(binding) {
    if (!this.connections.isCurrent(binding)) return false
    const current = this.connections.lookup(binding.connectionId)
    const identity = connection => JSON.stringify([
      connection.integrationId, connection.authMethod, connection.credentialRef,
      connection.profile?.baseURL, connection.profile?.api, connection.headerRefs,
    ])
    return identity(current) === identity(binding)
  }

  withdrawStale(attempt) {
    attempt.reason = 'connection-changed'
    attempt.controller.abort()
    this.clearPrompt(attempt, new LoginError('connection-changed'))
    attempt.notice = undefined
  }

  isAttemptCurrent(attempt) {
    return !attempt.binding || this.connections.isCurrent(attempt.binding)
  }

  models(key) {
    if (this.connections) {
      const connection = this.connection(key)
      if (!this.catalog) throw new LoginError('invalid-request')
      const profile = connection.profile ?? {}
      const models = this.catalog(connection.serviceId, profile, connection.connectionId)
      return { connectionId: connection.connectionId, revision: this.section()?.revision, enabled: connection.enabled !== false,
        refresh: this.catalogsForConnection(connection)?.state(connection.serviceId, models) ?? { canRefresh: false },
        models: models.map(model => ({ id: model.id, name: model.name, enabled: model.enabled ?? !profile.disabledModels?.includes(model.id),
          fast: model.serviceTier === 'priority',
          ...model.contributor ? { contributor: true } : {},
          ...model.discovered ? { discovered: true } : {},
          ...model.capabilityUnverified === true ? { capabilityUnverified: true } : {},
        })) }
    }
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key) || !this.catalog) throw new LoginError('invalid-request')
    const provider = key.slice('llm-pi-ai/'.length)
    const section = this.section()
    const profile = section?.value?.providers?.[provider] ?? {}
    const models = this.catalog(provider, profile)
    return { revision: section?.revision, enabled: Object.hasOwn(section?.value?.providers ?? {}, provider) && profile.enabled !== false,
      refresh: this.catalogs?.state(provider, models) ?? { canRefresh: false },
      models: models.map(model => ({
        id: model.id, name: model.name, enabled: model.enabled ?? !profile.disabledModels?.includes(model.id),
        fast: model.serviceTier === 'priority',
        ...model.discovered ? { discovered: true } : {},
        ...model.capabilityUnverified === true ? { capabilityUnverified: true } : {},
      })) }
  }

  async setModel(key, model, enabled, revision) {
    const binding = this.connections ? this.connections.binding(this.connection(key)) : undefined
    await this.validateModels(key)
    if (binding && !this.isCatalogCurrent(binding)) throw new LoginError('connection-changed')
    if (typeof enabled !== 'boolean' || !Number.isSafeInteger(revision)) throw new LoginError('invalid-request')
    const current = this.models(key)
    const choice = current.models.find(entry => entry.id === model)
    if (!choice) throw new LoginError('invalid-request')
    if (current.revision !== revision) throw new LoginError('settings-changed')
    const connection = this.connections ? this.connection(key) : undefined
    const provider = connection?.serviceId ?? key.slice('llm-pi-ai/'.length)
    const profile = connection?.profile ?? this.section().value?.providers?.[provider]
    if (!profile) throw new LoginError('not-enabled')
    const optIn = choice.fast || choice.contributor || choice.discovered
    const field = choice.fast ? 'enabledFastModels' : choice.contributor ? 'enabledContributorModels' : choice.discovered ? 'enabledDiscoveredModels' : 'disabledModels'
    const selected = new Set(profile[field] ?? [])
    if (optIn ? enabled : !enabled) selected.add(model)
    else selected.delete(model)
    const changes = { [field]: [...selected] }
    if (choice.contributor && connection && enabled) {
      const native = this.catalog(provider, profile, connection.connectionId).find(entry => entry.id === model)?.model
      // An old native Contributor row could have been explicitly switched
      // off. Keep that opt-out until this canonical choice is turned on;
      // never clear the separate Standard model's disabled state.
      if (native?.id.endsWith('-contributor') && profile.disabledModels?.includes(native.id)) {
        changes.disabledModels = profile.disabledModels.filter(id => id !== native.id)
      }
    }
    if (choice.discovered) {
      const disabled = new Set(profile.disabledModels ?? [])
      if (enabled) disabled.delete(model); else disabled.add(model)
      changes.disabledModels = [...disabled]
    }
    if (connection) await this.connections.update(connection.connectionId, { profile: changes }, revision)
    else await this.settings.update(NS, { providers: { [provider]: changes } }, revision)
    return { saved: true }
  }

  provider(key) {
    if (this.connections) return this.connection(key).serviceId
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError('invalid-request')
    return key.slice('llm-pi-ai/'.length)
  }

  async validateModels(key) {
    if (this.connections) {
      const connection = this.connection(key), binding = this.connections.binding(connection)
      await this.catalogsForConnection(connection)?.validate(connection.serviceId)
      if (!this.isCatalogCurrent(binding)) throw new LoginError('connection-changed')
      return
    }
    await this.catalogs?.validate(this.provider(key))
  }

  async refreshModels(key) {
    if (this.connections) {
      const connection = this.connection(key)
      if (this.closed) throw new LoginError('unavailable')
      const catalogs = this.catalogsForConnection(connection)
      const binding = this.connections.binding(connection)
      if (!catalogs) throw new LoginError('catalog-refresh-unsupported')
      try {
        await catalogs.refresh(connection.serviceId)
        if (!this.isCatalogCurrent(binding)) throw new LoginError('connection-changed')
        return this.models(key)
      }
      catch (error) { throw new LoginError(error instanceof CatalogRefreshError || error instanceof LoginError ? error.code : 'catalog-refresh-failed') }
    }
    const provider = this.provider(key)
    if (this.closed) throw new LoginError('unavailable')
    if (!this.catalogs) throw new LoginError('catalog-refresh-unsupported')
    try { await this.catalogs.refresh(provider); return this.models(key) }
    catch (error) { throw new LoginError(error instanceof CatalogRefreshError ? error.code : 'catalog-refresh-failed') }
  }

  async setProvider(key, enabled, revision) {
    if (this.connections) {
      if (typeof enabled !== 'boolean' || !Number.isSafeInteger(revision)) throw new LoginError('invalid-request')
      const connection = this.connection(key)
      await this.connections.update(connection.connectionId, { enabled }, revision)
      return { saved: true }
    }
    if (typeof enabled !== 'boolean' || !Number.isSafeInteger(revision) || !KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError('invalid-request')
    const section = this.section()
    if (!section || section.revision !== revision) throw new LoginError('settings-changed')
    const provider = key.slice('llm-pi-ai/'.length)
    const profile = section.value?.providers?.[provider]
    if (!profile && !(await this.credentials.describeRecord(key)).configured) throw new LoginError('not-connected')
    await this.settings.update(NS, { providers: { [provider]: { enabled } } }, revision)
    return { saved: true }
  }

  start(key, method) {
    if (this.closed) throw new LoginError('unavailable')
    const connection = this.connections ? this.connection(key) : undefined
    if (connection) {
      if (method !== connection.authMethod) throw new LoginError('unsupported-method')
      key = connection.key
    }
    if (!connection && !KEY_PATTERN.test(requireString(key, 200))) throw new LoginError('invalid-request')
    const entry = this.authorization.describe(key)
    if (!entry || !entry.methods.some(option => option.id === method)) throw new LoginError('unsupported-method')
    if (entry.inFlight || [...this.attempts.values()].some(attempt => attempt.key === key && attempt.status === LIVE)) throw new LoginError('busy')
    if (this.attempts.size >= 32) throw new LoginError('busy')
    const ticket = randomUUID()
    const attempt = { key, ticket, status: LIVE, controller: new AbortController(), prompt: undefined, notice: undefined,
      ...connection ? { connectionId: connection.connectionId, context: this.connections.registry?.token(connection.connectionId) } : {} }
    this.attempts.set(ticket, attempt)
    this.armTimeout(attempt, this.timeoutMs)
    attempt.done = Promise.resolve().then(async () => {
      if (connection) {
        if (attempt.controller.signal.aborted) return { status: 'cancelled' }
        if (attempt.context && !this.connections.registry.isCurrent(attempt.context)) return { status: 'cancelled' }
        const current = await this.connections.beginLogin(connection.connectionId)
        attempt.loginStarted = true
        attempt.credentialGeneration = current.credentialGeneration
        attempt.binding = this.connections.binding(current)
        this.syncFlows?.()
        if (attempt.context && !this.connections.registry.isCurrent(attempt.context)) this.withdrawStale(attempt)
        if (attempt.controller.signal.aborted) return { status: 'cancelled' }
      }
      return this.authorization.begin({
      key, method, signal: attempt.controller.signal,
      interaction: {
        notify: notice => this.notify(attempt, notice),
        prompt: prompt => this.ask(attempt, prompt),
      },
      })
    }).then(outcome => {
      attempt.status = outcome.status === 'authorized' && !attempt.controller.signal.aborted && this.isAttemptCurrent(attempt) ? 'authorized' : 'cancelled'
      if (attempt.status === 'authorized') attempt.reason = undefined
    }, error => {
      attempt.status = attempt.controller.signal.aborted ? 'cancelled' : 'failed'
      if (!attempt.controller.signal.aborted && error instanceof Error && /^Device flow timed out(?:$| after one or more slow_down responses\.)/.test(error.message)) attempt.reason = 'provider-expired'
    }).finally(() => {
      if (attempt.loginStarted) this.connections.endLogin(connection.connectionId)
      clearTimeout(attempt.timer)
      this.clearPrompt(attempt, new LoginError('cancelled'))
      // OAuth URLs, device codes, and the answered prompt do not outlive a flow.
      attempt.notice = undefined
      attempt.timer = setTimeout(() => this.attempts.delete(ticket), this.retentionMs)
      attempt.timer.unref?.()
    })
    return { ticket }
  }

  armTimeout(attempt, delayMs) {
    clearTimeout(attempt.timer)
    attempt.timer = setTimeout(() => { void this.cancel(attempt.ticket, 'timeout').catch(() => {}) }, delayMs)
    attempt.timer.unref?.()
  }

  notify(attempt, notice) {
    if (attempt.status !== LIVE || attempt.controller.signal.aborted || this.closed || !this.isAttemptCurrent(attempt)) return
    attempt.notice = publicNotice(notice)
    const expires = notice.expiresInSeconds
    if (typeof expires !== 'number' || !Number.isFinite(expires) || expires <= 0) return
    const delayMs = Math.max(this.timeoutMs, expires * 1000 + this.expiryGraceMs)
    // The SDK starts its deadline when it issues the code; leave time for the final token exchange.
    if (delayMs <= MAX_TIMER_DELAY_MS) this.armTimeout(attempt, delayMs)
  }

  attempt(ticket) {
    const result = this.attempts.get(requireString(ticket, 100))
    if (!result) throw new LoginError('expired')
    return result
  }

  snapshot(ticket) {
    const attempt = this.attempt(ticket)
    if (attempt.status === LIVE && !this.isAttemptCurrent(attempt)) this.withdrawStale(attempt)
    return {
      status: attempt.status,
      ...attempt.reason === undefined ? {} : { reason: attempt.reason },
      ...attempt.notice === undefined ? {} : { notice: attempt.notice },
      ...attempt.prompt === undefined ? {} : { prompt: attempt.prompt.view },
    }
  }

  checkTicketConnection(ticket, connectionId) {
    if (!this.connections || connectionId === undefined) return
    if (this.attempt(ticket).connectionId !== this.connection(connectionId).connectionId) throw new LoginError('invalid-request')
  }

  ask(attempt, prompt) {
    if (attempt.controller.signal.aborted || prompt.signal?.aborted || !this.isAttemptCurrent(attempt)) return Promise.reject(new LoginError('cancelled'))
    this.clearPrompt(attempt, new LoginError('replaced'))
    const id = randomUUID()
    const view = { id, kind: prompt.kind, message: String(prompt.message).slice(0, 2048) }
    if (!['secret', 'text', 'select'].includes(view.kind)) return Promise.reject(new LoginError('unsupported-prompt'))
    if (prompt.kind === 'select') view.options = prompt.options.map(option => ({ id: String(option.id), label: String(option.label), ...option.description === undefined ? {} : { description: String(option.description) } }))
    else if (typeof prompt.placeholder === 'string') view.placeholder = prompt.placeholder.slice(0, 1024)
    return new Promise((resolve, reject) => {
      const abort = () => {
        if (attempt.prompt?.view.id === id) this.clearPrompt(attempt, new LoginError('withdrawn'))
      }
      attempt.prompt = { view, resolve, reject, cleanup: () => { prompt.signal?.removeEventListener('abort', abort); attempt.controller.signal.removeEventListener('abort', abort) } }
      prompt.signal?.addEventListener('abort', abort, { once: true })
      attempt.controller.signal.addEventListener('abort', abort, { once: true })
    })
  }

  clearPrompt(attempt, error) {
    const prompt = attempt.prompt
    attempt.prompt = undefined
    prompt?.cleanup()
    if (error) prompt?.reject(error)
    return prompt
  }

  answer(ticket, id, value) {
    const attempt = this.attempt(ticket)
    if (!this.isAttemptCurrent(attempt)) { this.withdrawStale(attempt); throw new LoginError('connection-changed') }
    const prompt = attempt.prompt
    if (attempt.status !== LIVE || !prompt || prompt.view.id !== id) throw new LoginError('expired-prompt')
    if (typeof value !== 'string' || value.length > 16384) throw new LoginError('invalid-request')
    if (prompt.view.kind === 'select' && !prompt.view.options.some(option => option.id === value)) throw new LoginError('invalid-choice')
    this.clearPrompt(attempt).resolve(value)
    return { accepted: true }
  }

  async cancel(ticket, reason) {
    const attempt = this.attempt(ticket)
    if (attempt.status === LIVE && !attempt.controller.signal.aborted) {
      attempt.reason = reason
      attempt.controller.abort()
      this.clearPrompt(attempt, new LoginError('cancelled'))
    }
    await attempt.done
    return { status: attempt.status }
  }

  async enable(key) {
    if (this.connections) {
      const connection = this.connection(key)
      const binding = this.connections.binding(connection)
      const owner = this.connections.registry.owner(connection.integrationId)
      const description = owner.describeConnection ? await owner.describeConnection(connection)
        : connection.integrationId === 'pi' ? await this.credentials.describeRecord(connection.key) : undefined
      if (!description?.configured) throw new LoginError('not-connected')
      if (!this.connections.isCurrent(binding)) throw new LoginError('connection-changed')
      if (connection.credentialRef) throw new LoginError('api-key-override')
      if (connection.enabled !== false) return { enabled: true }
      if (owner.enable) return owner.enable(connection)
      await this.connections.update(connection.connectionId, { enabled: true }, this.section()?.revision)
      return { enabled: true }
    }
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError('invalid-request')
    if (!(await this.credentials.describeRecord(key)).configured) throw new LoginError('not-connected')
    const provider = key.slice('llm-pi-ai/'.length)
    const section = this.section()
    if (!section) throw new LoginError('unavailable')
    const existing = section.value?.providers?.[provider]
    if (existing?.apiKeyEnv) throw new LoginError('api-key-override')
    if (existing && existing.enabled !== false) return { enabled: true }
    await this.settings.update(NS, { providers: { [provider]: { enabled: true } } }, section.revision)
    return { enabled: true }
  }

  async useLogin(key) {
    if (this.connections) {
      const connection = this.connection(key)
      if (connection.credentialRef || connection.authMethod !== 'oauth') throw new LoginError('unsupported-method')
      return this.enable(connection.connectionId)
    }
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError('invalid-request')
    if (!(await this.credentials.describeRecord(key)).configured) throw new LoginError('not-connected')
    const section = this.section()
    if (!section) throw new LoginError('unavailable')
    const provider = key.slice('llm-pi-ai/'.length)
    await this.settings.mutate(NS, [{ op: 'unset', path: ['providers', provider, 'apiKeyEnv'] }], section.revision)
    return this.enable(key)
  }

  async dispose() {
    this.closed = true
    this.unwatchConnections?.()
    const pending = []
    for (const attempt of this.attempts.values()) {
      clearTimeout(attempt.timer)
      attempt.controller.abort()
      this.clearPrompt(attempt, new LoginError('cancelled'))
      pending.push(attempt.done)
    }
    await Promise.allSettled(pending)
    for (const attempt of this.attempts.values()) clearTimeout(attempt.timer)
    this.attempts.clear()
  }
}

/** Uses the authenticated Host Connection RPC transport. */
export async function dispatch(broker, method, payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new LoginError('invalid-request')
  if (broker.connections && ['start', 'answer', 'cancel', 'enable', 'set-model', 'set-provider', 'use-login'].includes(method)) broker.connections.guard(payload)
  if (broker.connections && ['models', 'refresh-models'].includes(method)) broker.connections.guard(payload, { optional: true })
  const target = payload.connectionId ?? payload.key
  if (['state', 'answer', 'cancel'].includes(method)) broker.checkTicketConnection(payload.ticket, payload.connectionId)
  switch (method) {
    case 'list': return broker.list()
    case 'start': return broker.start(target, payload.method)
    case 'state': return broker.snapshot(payload.ticket)
    case 'answer': return broker.answer(payload.ticket, payload.id, payload.value)
    case 'cancel': return broker.cancel(payload.ticket)
    case 'enable': return broker.enable(target)
    case 'models': await broker.validateModels(target); return broker.models(target)
    case 'refresh-models': return broker.refreshModels(target)
    case 'set-model': return broker.setModel(target, payload.model, payload.enabled, payload.revision)
    case 'set-provider': return broker.setProvider(target, payload.enabled, payload.revision)
    case 'use-login': return broker.useLogin(target)
    default: throw new LoginError('invalid-request')
  }
}
