import { randomUUID } from 'node:crypto'

const KEY_PATTERN = /^llm-pi-ai\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const LIVE = 'running'
const NS = 'dsh-pi-login'

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
  constructor(authorization, credentials, settings, { timeoutMs = 600000, retentionMs = 60000, catalog } = {}) {
    this.authorization = authorization
    this.credentials = credentials
    this.settings = settings
    this.timeoutMs = timeoutMs
    this.retentionMs = retentionMs
    this.catalog = catalog
    this.attempts = new Map()
    this.closed = false
  }

  async list() {
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

  section() { return this.settings.describe({ redactSecrets: true }).find(row => row.ns === NS) }

  models(key) {
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key) || !this.catalog) throw new LoginError('invalid-request')
    const provider = key.slice('llm-pi-ai/'.length)
    const section = this.section()
    const profile = section?.value?.providers?.[provider] ?? {}
    return { revision: section?.revision, enabled: Object.hasOwn(section?.value?.providers ?? {}, provider) && profile.enabled !== false,
      models: this.catalog(provider, profile).map(model => ({ id: model.id, name: model.name, enabled: !profile.disabledModels?.includes(model.id) })) }
  }

  async setModel(key, model, enabled, revision) {
    if (typeof enabled !== 'boolean' || !Number.isSafeInteger(revision)) throw new LoginError('invalid-request')
    const current = this.models(key)
    if (!current.models.some(entry => entry.id === model)) throw new LoginError('invalid-request')
    if (current.revision !== revision) throw new LoginError('settings-changed')
    const provider = key.slice('llm-pi-ai/'.length)
    const profile = this.section().value?.providers?.[provider]
    if (!profile) throw new LoginError('not-enabled')
    const disabled = new Set(profile.disabledModels ?? [])
    enabled ? disabled.delete(model) : disabled.add(model)
    await this.settings.update(NS, { providers: { [provider]: { disabledModels: [...disabled] } } }, revision)
    return { saved: true }
  }

  async setProvider(key, enabled, revision) {
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
    if (!KEY_PATTERN.test(requireString(key, 200))) throw new LoginError('invalid-request')
    const entry = this.authorization.describe(key)
    if (!entry || !entry.methods.some(option => option.id === method)) throw new LoginError('unsupported-method')
    if (entry.inFlight || [...this.attempts.values()].some(attempt => attempt.key === key && attempt.status === LIVE)) throw new LoginError('busy')
    if (this.attempts.size >= 32) throw new LoginError('busy')
    const ticket = randomUUID()
    const attempt = { key, ticket, status: LIVE, controller: new AbortController(), prompt: undefined, notice: undefined }
    this.attempts.set(ticket, attempt)
    attempt.timer = setTimeout(() => this.cancel(ticket), this.timeoutMs)
    attempt.timer.unref?.()
    attempt.done = Promise.resolve().then(() => this.authorization.begin({
      key, method, signal: attempt.controller.signal,
      interaction: {
        notify: notice => { if (attempt.status === LIVE) attempt.notice = publicNotice(notice) },
        prompt: prompt => this.ask(attempt, prompt),
      },
    })).then(outcome => {
      attempt.status = outcome.status === 'authorized' ? 'authorized' : 'cancelled'
    }, () => {
      attempt.status = attempt.controller.signal.aborted ? 'cancelled' : 'failed'
    }).finally(() => {
      clearTimeout(attempt.timer)
      this.clearPrompt(attempt, new LoginError('cancelled'))
      // OAuth URLs, device codes, and the answered prompt do not outlive a flow.
      attempt.notice = undefined
      attempt.timer = setTimeout(() => this.attempts.delete(ticket), this.retentionMs)
      attempt.timer.unref?.()
    })
    return { ticket }
  }

  attempt(ticket) {
    const result = this.attempts.get(requireString(ticket, 100))
    if (!result) throw new LoginError('expired')
    return result
  }

  snapshot(ticket) {
    const attempt = this.attempt(ticket)
    return {
      status: attempt.status,
      ...attempt.notice === undefined ? {} : { notice: attempt.notice },
      ...attempt.prompt === undefined ? {} : { prompt: attempt.prompt.view },
    }
  }

  ask(attempt, prompt) {
    if (attempt.controller.signal.aborted || prompt.signal?.aborted) return Promise.reject(new LoginError('cancelled'))
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
    const prompt = attempt.prompt
    if (attempt.status !== LIVE || !prompt || prompt.view.id !== id) throw new LoginError('expired-prompt')
    if (typeof value !== 'string' || value.length > 16384) throw new LoginError('invalid-request')
    if (prompt.view.kind === 'select' && !prompt.view.options.some(option => option.id === value)) throw new LoginError('invalid-choice')
    this.clearPrompt(attempt).resolve(value)
    return { accepted: true }
  }

  async cancel(ticket) {
    const attempt = this.attempt(ticket)
    attempt.controller.abort()
    this.clearPrompt(attempt, new LoginError('cancelled'))
    await attempt.done
    return { status: attempt.status }
  }

  async enable(key) {
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
  switch (method) {
    case 'list': return broker.list()
    case 'start': return broker.start(payload.key, payload.method)
    case 'state': return broker.snapshot(payload.ticket)
    case 'answer': return broker.answer(payload.ticket, payload.id, payload.value)
    case 'cancel': return broker.cancel(payload.ticket)
    case 'enable': return broker.enable(payload.key)
    case 'models': return broker.models(payload.key)
    case 'set-model': return broker.setModel(payload.key, payload.model, payload.enabled, payload.revision)
    case 'set-provider': return broker.setProvider(payload.key, payload.enabled, payload.revision)
    case 'use-login': return broker.useLogin(payload.key)
    default: throw new LoginError('invalid-request')
  }
}
