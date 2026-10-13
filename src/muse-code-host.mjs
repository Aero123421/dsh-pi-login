import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, writeFile, readFile, lstat, rm } from 'node:fs/promises'
import { join, isAbsolute } from 'node:path'
import { MuseCodeError } from './muse-code.mjs'
import { normalizeMuseCodeCatalog, normalizeMuseCodeUsage } from './muse-code-observations.mjs'

export const MUSE_CODE_CONTRIBUTOR_TERMS = 'https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode'
export const MUSE_CODE_MODELS = Object.freeze(['muse-wonder-1.0', 'muse-wonder-full-1.0'])
const ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const secret = value => typeof value === 'string' && value.length > 0 && value.length <= 1024 * 1024
const modeKey = key => /^(?:[a-z_]+\.)*contributor_mode$/.test(key)
const opaqueId = value => typeof value === 'string' && value.length > 0 && value.length <= 200 && !/[\u0000-\u001f\u007f]/.test(value)
const EFFORTS = new Set(['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'])
const fail = code => { throw new MuseCodeError(code) }
const dataSignature = connection => JSON.stringify([connection.profileKey, connection.integrationId,
  connection.serviceId, connection.connectionId, connection.credentialRecordId, connection.credentialGeneration])
const leaseSignature = connection => JSON.stringify([dataSignature(connection), connection.generation, connection.museCode])

/** Picker ids are local; each choice retains the exact advertised native id. */
export function museCodeModelChoices(catalog, contributor = false) {
  return MUSE_CODE_MODELS.flatMap(modelId => {
    const model = catalog.models.find(row => row.modelId === modelId)
    if (!model) return []
    const name = modelId === 'muse-wonder-1.0' ? 'Wonder1' : 'Wonder Full'
    return [false, true].map(mode => ({
      ...model, id: `${modelId}${mode ? '::contributor' : ''}`, modelId,
      name: `${name}${mode ? ' Contributor' : ''}`,
      label: `${name}${mode ? ' Contributor' : ''}`,
      contributor: mode, runnable: false, sessionSupported: true,
      isActive: model.isActive && mode === contributor,
      isDefault: model.isDefault && mode === contributor,
    }))
  })
}

export function museCodeCredentialKey(connection) {
  if (!ID.test(connection?.credentialRecordId)) fail('muse-code-connection-changed')
  return `dsh-muse-code/${connection.credentialRecordId}`
}

export function validateMuseCodeConnection(connection) {
  if (connection?.integrationId !== 'meta-muse-code' || connection.serviceId !== 'muse-code'
    || connection.authMethod !== 'oauth' || !ID.test(connection.connectionId)
    || !Number.isSafeInteger(connection.credentialGeneration) || connection.credentialGeneration < 0
    || connection.credentialRef || connection.headerRefs && Object.keys(connection.headerRefs).length
    || connection.profile?.baseURL || connection.profile?.api || connection.profile?.apiKeyEnv
    || connection.profile?.headers && Object.keys(connection.profile.headers).length) fail('muse-code-connection-changed')
  museCodeCredentialKey(connection)
}

/** Complete child environment. No inherited model keys or credential homes. */
export function museCodeEnvironment(home, dataRoot, environment = process.env, platform = process.platform) {
  const env = {}
  for (const key of ['PATH', 'SystemRoot', 'WINDIR', 'ComSpec', 'PATHEXT', 'SSL_CERT_FILE', 'SSL_CERT_DIR', 'NODE_EXTRA_CA_CERTS',
    'HTTPS_PROXY', 'HTTP_PROXY', 'ALL_PROXY', 'NO_PROXY', 'https_proxy', 'http_proxy', 'all_proxy', 'no_proxy']) {
    if (typeof environment[key] === 'string') env[key] = environment[key]
  }
  Object.assign(env, {
    HOME: home, USERPROFILE: home,
    XDG_CONFIG_HOME: join(home, '.config'), XDG_DATA_HOME: dataRoot, XDG_CACHE_HOME: join(home, '.cache'),
    TMPDIR: join(home, 'tmp'), TEMP: join(home, 'tmp'), TMP: join(home, 'tmp'),
    TBH_CREDENTIAL_BACKEND: 'file', TBH_DISABLE_TELEMETRY: '1', MUSE_EXPERIMENTAL_SDK_ENABLED: 'on',
  })
  if (platform === 'win32') Object.assign(env, { APPDATA: join(home, 'AppData', 'Roaming'), LOCALAPPDATA: join(home, 'AppData', 'Local') })
  return env
}

/** Actual official SDK factory. No paid request happens at spawn/handshake. */
export function createSdkMuseHostFactory({ museBin = 'muse', sdkLoader = () => import('@muse-code/sdk') } = {}) {
  return async ({ home, dataRoot, env, signal }) => {
    let handshake, abort
    try {
      const sdk = await sdkLoader()
      signal?.throwIfAborted()
      handshake = sdk.spawnMspConnection({ command: museBin, args: ['serve'], cwd: home, env,
        shutdownTimeoutMs: 5000 })
      abort = () => { void handshake.close().catch(() => {}) }
      signal?.addEventListener('abort', abort, { once: true })
      const host = await handshake.initialize({
        clientInfo: { name: 'dsh_muse_code', title: 'DS Harness Muse Code', version: '0.6.0' },
        capabilities: { experimentalApi: true, userInputDialogs: false },
      })
      signal?.throwIfAborted()
      const listeners = new Set()
      host.connection.onNotification(notification => { for (const listener of listeners) listener(notification) })
      // Never automatically approve host tools, shell or filesystem access.
      host.connection.onServerRequest(async () => fail('muse-code-llm-unsupported'))
      let closed = false
      return {
        initializeResult: host.initializeResult,
        request: (method, params) => host.connection.request(method, params),
        command: (method, params) => host.connection.command(method, params, { maxAttempts: 1 }),
        onNotification(listener) { listeners.add(listener); return () => listeners.delete(listener) },
        async close() {
          if (closed) return
          closed = true; signal?.removeEventListener('abort', abort); listeners.clear()
          await host.close()
        },
      }
    } catch {
      if (abort) signal?.removeEventListener('abort', abort)
      await handshake?.close().catch(() => {})
      fail('muse-code-cli-required')
    }
  }
}

/** Opaque CLI serialization stays in Credentials; keychain pointers cannot be staged. */
export function museCodeAuthDocument(value) {
  const meta = value?.providers?.meta
  if (!object(value) || !Number.isSafeInteger(value.schema_version) || value.schema_version < 1
    || !object(meta) || meta.mechanism !== 'oauth' || !secret(meta.access_token) || !secret(meta.api_key)
    || meta.storage === 'keychain') fail('muse-code-login-failed')
  if (meta.api_base_url !== undefined) {
    let url
    try { url = new URL(meta.api_base_url) } catch { fail('muse-code-login-failed') }
    if (url.origin !== 'https://api.meta.ai' || !['/', '/v1', '/v1/'].includes(url.pathname)
      || url.search || url.hash || url.username || url.password) fail('muse-code-login-failed')
  }
  return { ...structuredClone(value), providers: { meta: structuredClone(meta) } }
}

function publicAccount(value) {
  if (!object(value) || typeof value.state !== 'string' || typeof value.credentialRequired !== 'boolean') fail('muse-code-protocol-unsupported')
  return { state: ['loggedOut', 'envKey', 'apiKey', 'accountLogin'].includes(value.state) ? value.state : 'unknown',
    credentialRequired: value.credentialRequired }
}

async function bounded(work, signal, timeout = 20_000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  timeoutId.unref?.()
  const combined = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal
  let abort
  try {
    combined.throwIfAborted()
    const cancelled = new Promise((_, reject) => {
      abort = () => reject(new MuseCodeError('muse-code-connection-changed'))
      combined.addEventListener('abort', abort, { once: true })
    })
    return await Promise.race([Promise.resolve().then(work), cancelled])
  } catch (error) {
    if (error instanceof MuseCodeError) throw error
    fail('muse-code-protocol-unsupported')
  } finally {
    clearTimeout(timeoutId)
    if (abort) combined.removeEventListener('abort', abort)
  }
}

/**
 * Official CLI owns OAuth, minting, model calls and quota observation. Only
 * short-lived file-backend auth copies exist outside Host Credentials. XDG
 * session data is separate for every profile/connection/credential generation.
 */
export class MuseCodeHostManager {
  constructor({ credentials, privateRoot, openHost = createSdkMuseHostFactory(), isCurrent = () => true,
    canExecute = connection => connection.enabled !== false, environment = process.env, now = Date.now } = {}) {
    if (!credentials || !isAbsolute(privateRoot ?? '')) fail('muse-code-cli-required')
    Object.assign(this, { credentials, privateRoot, openHost, isCurrent, canExecute, environment, now })
    this.live = new Map(); this.closed = false
  }

  check(connection, signal) {
    if (this.closed || signal?.aborted || !this.isCurrent(connection)) fail('muse-code-connection-changed')
    validateMuseCodeConnection(connection)
  }

  checkExecution(connection, signal) {
    this.check(connection, signal)
    if (!this.canExecute(connection)) fail('muse-code-connection-disabled')
  }

  async open(connection, { signal, login = false, exclusive = false, observation = false } = {}) {
    this.check(connection, signal)
    const existing = this.live.get(connection.connectionId)
    if (existing) {
      if (!observation || existing.exclusive || existing.signature !== leaseSignature(connection)) fail('muse-code-busy')
      return this.consume(existing, signal, true)
    }
    const controller = new AbortController()
    // The process lifetime belongs to its lease, not its first read caller.
    // Cancelling one consumer cannot close another query or an agent session.
    const combined = controller.signal
    const lease = { connection: structuredClone(connection), signature: leaseSignature(connection),
      exclusive: login || exclusive, controller, consumers: 0, queries: new Map(), close: async () => {} }
    this.live.set(connection.connectionId, lease)
    let home, host
    const close = async () => {
      controller.abort()
      try { await host?.close() } catch {} finally {
        if (home) await rm(home, { recursive: true, force: true }).catch(() => {})
        if (this.live.get(connection.connectionId) === lease) this.live.delete(connection.connectionId)
      }
    }
    lease.close = close
    lease.ready = (async () => {
    try {
      const scope = createHash('sha256').update(dataSignature(connection)).digest('hex')
      const ownedRoot = join(this.privateRoot, scope)
      await mkdir(ownedRoot, { recursive: true, mode: 0o700 })
      this.check(connection, combined)
      home = await mkdtemp(join(ownedRoot, 'home-'))
      const config = join(home, '.config', 'muse'), dataRoot = join(ownedRoot, 'data')
      await Promise.all([mkdir(config, { recursive: true, mode: 0o700 }), mkdir(dataRoot, { recursive: true, mode: 0o700 }),
        mkdir(join(home, 'tmp'), { recursive: true, mode: 0o700 })])
      const record = login ? undefined : await this.credentials.readRecord(museCodeCredentialKey(connection))
      this.check(connection, combined)
      let mode = { enabled: false }
      if (record) {
        if (record.kind !== 'grant' || record.payload?.format !== 'muse-code-cli-auth-v1') fail('muse-code-login-required')
        const document = museCodeAuthDocument(record.payload.authDocument)
        await writeFile(join(config, 'auth.json'), JSON.stringify(document), { mode: 0o600 })
        mode = record.payload.mode ?? mode
      } else if (!login) fail('muse-code-login-required')
      // Connection settings are the transactionally saved user selection.
      // A failed settings CAS must not leave a different model mode active merely
      // because an ephemeral feature probe succeeded before the metadata write.
      if (connection.museCode) mode = {
        enabled: connection.museCode.contributorMode === true,
      }
      await writeFile(join(config, 'settings.json'), JSON.stringify({ schema_version: 1 }), { mode: 0o600 })
      const opening = Promise.resolve().then(() => this.openHost({ home, dataRoot,
        env: museCodeEnvironment(home, dataRoot, this.environment), signal: combined })).then(opened => {
        if (combined.aborted || this.closed || !this.isCurrent(connection)) {
          void opened.close().catch(() => {})
          fail('muse-code-connection-changed')
        }
        return opened
      })
      host = await bounded(() => opening, combined)
      this.check(connection, combined)
      const request = (method, params) => bounded(() => { this.check(connection, combined); return host.request(method, params) }, combined)
      // Feature probe against this actual CLI. An unavailable account/settings
      // surface never falls back to key import, Model API or another account.
      const schema = await request('settings/readSchema')
      const values = await request('settings/read')
      if (schema?.schemaVersion !== 1 || !object(schema.keys) || values?.schemaVersion !== 1 || !object(values.values)) fail('muse-code-protocol-unsupported')
      const keys = Object.keys(schema.keys).filter(key => modeKey(key) && typeof values.values[key] === 'boolean')
      if (keys.length !== 1) fail('muse-code-mode-unavailable')
      const keyPath = keys[0]
      const applyMode = async enabled => {
        const written = await request('settings/writeValue', { keyPath, value: enabled })
        if (written?.keyPath !== keyPath || written.effectiveValue !== enabled) fail('muse-code-mode-unavailable')
        const read = await request('settings/read')
        if (read?.values?.[keyPath] !== enabled) fail('muse-code-mode-unavailable')
        return { keyPath, enabled }
      }
      // Apply the saved model choice instead of inheriting the CLI's default.
      // Login itself never emits a model request.
      mode = await applyMode(login ? false : mode.enabled === true)
      const account = publicAccount(await request('account/read'))
      if (!login && account.state !== 'accountLogin') fail('muse-code-login-required')
      return { host, home, config, dataRoot, signal: combined, request, close, applyMode, mode, account }
    } catch (error) {
      lease.failure = error instanceof MuseCodeError ? error : new MuseCodeError('muse-code-cli-required')
      await close()
      throw lease.failure
    }
    })()
    void lease.ready.catch(() => {})
    return this.consume(lease, signal, false)
  }

  async consume(lease, signal, observationOnly) {
    lease.consumers++
    const combined = signal ? AbortSignal.any([signal, lease.controller.signal]) : lease.controller.signal
    let released = false
    const close = async () => {
      if (released) return
      released = true
      if (--lease.consumers === 0) await lease.close()
    }
    try {
      const handle = await bounded(() => lease.ready, combined)
      this.check(lease.connection, combined)
      const request = (method, params) => bounded(() => {
        this.check(lease.connection, combined)
        if (!['model/list', 'usage/read'].includes(method)) return handle.host.request(method, params)
        const key = JSON.stringify([method, params])
        if (!lease.queries.has(key)) {
          const query = bounded(() => handle.host.request(method, params), lease.controller.signal)
            .finally(() => lease.queries.delete(key))
          lease.queries.set(key, query)
        }
        return lease.queries.get(key)
      }, combined)
      return { ...handle, signal: combined, request, close, observationOnly }
    } catch (error) {
      await close()
      throw signal?.aborted ? error : lease.failure ?? error
    }
  }

  async authDocument(handle) {
    const path = join(handle.config, 'auth.json')
    const stat = await lstat(path)
    if (!stat.isFile() || stat.size > 2 * 1024 * 1024) fail('muse-code-login-failed')
    try { return museCodeAuthDocument(JSON.parse(await readFile(path, 'utf8'))) } catch { fail('muse-code-login-failed') }
  }

  async commit(connection, handle, mode = handle.mode) {
    this.check(connection, handle.signal)
    const authDocument = await this.authDocument(handle)
    this.check(connection, handle.signal)
    await this.credentials.modifyRecord(museCodeCredentialKey(connection), async () => {
      this.check(connection, handle.signal)
      return { kind: 'grant', payload: { format: 'muse-code-cli-auth-v1', authDocument, mode } }
    })
    this.check(connection, handle.signal)
  }

  async login(connection, { signal, notify = () => {} } = {}) {
    const handle = await this.open(connection, { signal, login: true })
    let unwatch
    try {
      const completed = new Promise(resolve => {
        unwatch = handle.host.onNotification(frame => {
          if (frame.method === 'account/loginCompleted') resolve(frame.params?.outcome)
        })
      })
      const started = await handle.request('account/loginStart', { type: 'deviceCode' })
      let url
      try { url = new URL(started.verificationUrl) } catch { fail('muse-code-login-failed') }
      if (url.protocol !== 'https:' || !['auth.meta.com', 'accountscenter.meta.com'].includes(url.hostname)
        || url.username || url.password || typeof started.userCode !== 'string' || !/^[A-Za-z0-9-]{1,40}$/.test(started.userCode)) fail('muse-code-login-failed')
      this.check(connection, handle.signal)
      notify({ message: 'Sign in with this Muse Code account.', url: url.href, code: started.userCode })
      const outcome = await bounded(() => completed, handle.signal, 600_000)
      if (outcome !== 'granted') fail('muse-code-login-failed')
      const account = publicAccount(await handle.request('account/read'))
      if (account.state !== 'accountLogin') fail('muse-code-login-failed')
      // Reassert the saved model choice after the CLI's subscriber default.
      handle.mode = await handle.applyMode(connection.museCode?.contributorMode === true)
      await this.commit(connection, handle)
      return { authorized: true, account, contributor: handle.mode.enabled, executionKind: 'agent-session', liveVerified: false }
    } catch (error) {
      // A cancelled/missing peer cannot hold credential cleanup indefinitely.
      try { await bounded(() => handle.host.request('account/loginCancel'), undefined, 1000) } catch {}
      if (error instanceof MuseCodeError) throw error
      fail('muse-code-login-failed')
    } finally { unwatch?.(); await handle.close() }
  }

  async read(connection, { signal, includeModels = true, includeUsage = true } = {}) {
    const handle = await this.open(connection, { signal, observation: true })
    let committed = false
    try {
      const [models, usage] = await Promise.allSettled([
        includeModels ? handle.request('model/list', {}).then(normalizeMuseCodeCatalog) : undefined,
        includeUsage ? handle.request('usage/read').then(raw => normalizeMuseCodeUsage(raw.usage, connection, this.now())) : undefined,
      ])
      if (!handle.observationOnly) await this.commit(connection, handle)
      committed = true
      return { account: handle.account, contributor: handle.mode.enabled, executionKind: 'agent-session', liveVerified: false,
        ...includeModels ? models.status === 'fulfilled'
          ? { models: museCodeModelChoices(models.value, handle.mode.enabled),
            diagnostics: models.value.models.filter(model => !MUSE_CODE_MODELS.includes(model.modelId))
              .map(model => ({ ...model, runnable: false, sessionSupported: false })) }
          : { models: [], modelsError: models.reason instanceof MuseCodeError ? models.reason.code : 'muse-code-observation-failed' } : {},
        ...includeUsage ? usage.status === 'fulfilled' ? { usage: usage.value }
          : { usage: { integrationId: 'meta-muse-code', serviceId: 'muse-code', connectionId: connection.connectionId,
            source: 'last-observed', status: 'error', windows: [] },
            usageError: usage.reason instanceof MuseCodeError ? usage.reason.code : 'muse-code-observation-failed' } : {},
      }
    } finally {
      // CLI refresh belongs to its account even if a later catalog/Usage read
      // failed. Preserve a valid updated document under the same lifecycle
      // guard before the short-lived file is removed; never store a failed
      // or partial login, and never let cleanup hide the original error.
      if (!committed && !handle.observationOnly) await this.commit(connection, handle).catch(() => {})
      await handle.close()
    }
  }

  async readModels(connection, options = {}) {
    const result = await this.read(connection, { ...options, includeModels: true, includeUsage: false })
    if (result.modelsError) throw new MuseCodeError(result.modelsError)
    return result
  }

  async readUsage(connection, options = {}) {
    const result = await this.read(connection, { ...options, includeModels: false, includeUsage: true })
    if (result.usageError) throw new MuseCodeError(result.usageError)
    return result.usage
  }

  async configure(connection, patch, { signal } = {}) {
    if (patch.modelId !== undefined && !MUSE_CODE_MODELS.includes(patch.modelId)) fail('muse-code-model-unavailable')
    if (patch.contributorMode !== undefined && typeof patch.contributorMode !== 'boolean') fail('muse-code-mode-unavailable')
    const handle = await this.open(connection, { signal, exclusive: true })
    try {
      const next = { contributorMode: connection.museCode?.contributorMode ?? handle.mode.enabled,
        ...connection.museCode?.modelId ? { modelId: connection.museCode.modelId } : {} }
      if (patch.contributorMode !== undefined) {
        await handle.applyMode(patch.contributorMode)
        next.contributorMode = patch.contributorMode
      }
      const requested = patch.modelId ?? next.modelId
      if (requested !== undefined) {
        const catalog = normalizeMuseCodeCatalog(await handle.request('model/list', {}))
        if (!catalog.models.some(model => model.modelId === requested)) fail('muse-code-model-unavailable')
        next.modelId = requested
      }
      // Root settings CAS owns the persistent mode selection returned here.
      // Auth rotation is preserved separately with the original mode below.
      return { museCode: next }
    } finally {
      await this.commit(connection, handle).catch(() => {})
      await handle.close()
    }
  }

  async startAgentSession(connection, { modelId = connection.museCode?.modelId, workspaceRoot, signal } = {}) {
    this.checkExecution(connection, signal)
    if (!MUSE_CODE_MODELS.includes(modelId)) fail('muse-code-model-unavailable')
    if (!isAbsolute(workspaceRoot ?? '')) fail('muse-code-session-failed')
    const handle = await this.open(connection, { signal })
    try {
      const catalog = normalizeMuseCodeCatalog(await handle.request('model/list', {}))
      const model = catalog.models.find(row => row.modelId === modelId)
      if (!model) fail('muse-code-model-unavailable')
      this.checkExecution(connection, handle.signal)
      const result = await bounded(() => handle.host.command('session/start', {
        modelId, providerId: model.providerId, workspaceRoot, approvalMode: 'denyUnmatched',
      }), handle.signal)
      if (!opaqueId(result?.session?.sessionId) || result.session.modelId !== modelId
        || result.session.providerId !== model.providerId) fail('muse-code-session-failed')
      return new MuseCodeAgentSession(this, connection, handle, result.session, model.reasoningEfforts)
    } catch (error) {
      await handle.close()
      if (error instanceof MuseCodeError) throw error
      fail('muse-code-session-failed')
    }
  }

  async resumeAgentSession(connection, { sessionId, signal } = {}) {
    if (!opaqueId(sessionId)) fail('muse-code-session-failed')
    const handle = await this.open(connection, { signal })
    try {
      const result = await bounded(() => handle.host.command('session/resume', { sessionId, excludeItems: false }), handle.signal)
      if (result?.session?.sessionId !== sessionId || !MUSE_CODE_MODELS.includes(result.session.modelId)) fail('muse-code-session-failed')
      const catalog = normalizeMuseCodeCatalog(await handle.request('model/list', { sessionId }))
      const model = catalog.models.find(row => row.modelId === result.session.modelId && row.providerId === result.session.providerId)
      if (!model) fail('muse-code-model-unavailable')
      return new MuseCodeAgentSession(this, connection, handle, result.session, model.reasoningEfforts)
    } catch (error) {
      await handle.close()
      if (error instanceof MuseCodeError) throw error
      fail('muse-code-session-failed')
    }
  }

  async closeConnection(connectionId) {
    await this.live.get(connectionId)?.close()
  }

  async dispose() {
    this.closed = true
    await Promise.all([...this.live.values()].map(lease => lease.close()))
  }
}

function publicItem(item) {
  if (!object(item) || !opaqueId(item.itemId) || !opaqueId(item.kind)) fail('muse-code-session-failed')
  return { itemId: item.itemId, kind: item.kind,
    ...typeof item.status === 'string' ? { status: item.status.slice(0, 100) } : {},
    ...typeof item.text === 'string' ? { text: item.text.slice(0, 512 * 1024) } : {},
    ...typeof item.tool === 'string' ? { tool: item.tool.slice(0, 200) } : {},
    ...typeof item.visibleOutput === 'string' ? { output: item.visibleOutput.slice(0, 512 * 1024) } : {},
  }
}

/**
 * Native agent-session API, deliberately distinct from DSH GenerateOptions.
 * Tools are owned by Muse Code; arbitrary DSH tool schemas/results are never
 * represented as compatible. No retries or cross-account fallback are added.
 */
export class MuseCodeAgentSession {
  constructor(manager, connection, handle, session, reasoningEfforts) {
    this.manager = manager; this.connection = structuredClone(connection); this.handle = handle
    this.sessionId = session.sessionId; this.modelId = session.modelId
    this.reasoningEfforts = reasoningEfforts
    this.activeTurnId = session.activeTurnId ?? undefined; this.closed = false; this.sending = false
  }

  state() {
    return { integrationId: 'meta-muse-code', serviceId: 'muse-code', connectionId: this.connection.connectionId,
      routeId: this.connection.routeId, sessionId: this.sessionId, modelId: this.modelId,
      contributor: this.handle.mode.enabled, executionKind: 'agent-session', toolOwner: 'muse-code',
      llmCompatible: false, liveVerified: false, activeTurnId: this.activeTurnId }
  }

  async * send(text, { reasoningEffort, tools } = {}) {
    if (this.closed || this.sending || this.activeTurnId) fail('muse-code-busy')
    if (typeof text !== 'string' || !text.length || text.length > 512 * 1024) fail('muse-code-session-failed')
    if (tools !== undefined) fail('muse-code-llm-unsupported')
    if (reasoningEffort !== undefined && (!EFFORTS.has(reasoningEffort)
      || !this.reasoningEfforts?.includes(reasoningEffort))) fail('muse-code-mode-unavailable')
    this.manager.checkExecution(this.connection, this.handle.signal)
    this.sending = true
    const events = [], items = new Map()
    let wake, terminal = false, overflow = false, turnId
    const unwatch = this.handle.host.onNotification(frame => {
      if (frame.params?.sessionId !== this.sessionId) return
      if (events.length >= 256) overflow = true
      else events.push(frame)
      wake?.(); wake = undefined
    })
    try {
      const ack = await bounded(() => this.handle.host.command('turn/start', { sessionId: this.sessionId,
        input: [{ type: 'text', text }],
        ...reasoningEffort === undefined ? {} : { reasoningEffort },
      }), this.handle.signal)
      // Admission can queue a native turn before this caller receives its
      // ack. Capture the host's exact target first so every unsupported
      // disposition is cancelled in finally, rather than left to run later.
      if (ack?.status === 'accepted' && opaqueId(ack.turnId)) this.activeTurnId = turnId = ack.turnId
      if (ack?.status !== 'accepted' || !turnId) fail('muse-code-session-failed')
      if (ack.disposition !== 'started') fail('muse-code-busy')
      yield { type: 'started', turnId }
      while (!terminal) {
        this.manager.check(this.connection, this.handle.signal)
        if (overflow) fail('muse-code-session-failed')
        if (!events.length) await bounded(() => new Promise(resolve => { wake = resolve }), this.handle.signal, 60_000)
        while (events.length && !terminal) {
          const frame = events.shift(), params = frame.params
          if (params.turnId !== undefined && params.turnId !== turnId) continue
          if (params.item?.turnId !== undefined && params.item.turnId !== turnId) continue
          if (['item/started', 'item/updated', 'item/completed'].includes(frame.method) && opaqueId(params.item?.itemId)) {
            items.set(params.item.itemId, { kind: params.item.kind, turnId: params.item.turnId })
          }
          if (frame.method === 'item/delta' && typeof params.delta === 'string' && opaqueId(params.itemId)) {
            if ((params.field === undefined || params.field === 'text') && items.get(params.itemId)?.kind === 'agentMessage'
              && items.get(params.itemId)?.turnId === turnId) yield { type: 'text-delta', itemId: params.itemId, text: params.delta }
          } else if (frame.method === 'item/completed') {
            yield { type: 'item', item: publicItem(params.item) }
          } else if (frame.method === 'turn/completed') {
            terminal = true
            if (!['completed', 'cancelled', 'failed'].includes(params.terminal)) fail('muse-code-session-failed')
            // Provider error messages can contain diagnostics. Return only the
            // terminal and a fixed code; no automatic re-submission occurs.
            yield { type: 'completed', turnId, terminal: params.terminal,
              ...params.terminal === 'failed' ? { error: 'muse-code-session-failed' } : {} }
          }
        }
      }
      await this.manager.commit(this.connection, this.handle)
    } catch (error) {
      if (error instanceof MuseCodeError) throw error
      fail('muse-code-session-failed')
    } finally {
      unwatch(); wake = undefined; this.sending = false
      if (!terminal && turnId) await this.cancel().catch(() => {})
      this.activeTurnId = undefined
    }
  }

  async cancel() {
    this.manager.check(this.connection, this.handle.signal)
    if (!this.activeTurnId) return { cancelled: false }
    await bounded(() => this.handle.host.command('turn/cancel', { sessionId: this.sessionId, turnId: this.activeTurnId }), this.handle.signal)
    return { cancelled: true }
  }

  async history() {
    this.manager.check(this.connection, this.handle.signal)
    const result = await this.handle.request('session/read', { sessionId: this.sessionId, excludeItems: false })
    if (result?.session?.sessionId !== this.sessionId || result.session.modelId !== this.modelId
      || result.history?.mode !== 'inline' || !Array.isArray(result.history.items)) fail('muse-code-session-failed')
    return result.history.items.map(publicItem)
  }

  async close() {
    if (this.closed) return
    this.closed = true
    if (this.activeTurnId) await this.cancel().catch(() => {})
    await this.handle.close()
  }
}
