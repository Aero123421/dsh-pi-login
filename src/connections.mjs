import { createHash } from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'
import { RegistryError, newConnectionId, routeForConnection } from './registry.mjs'
import { sdkServiceOf } from './sdk-service.mjs'
import { catalogBinding } from './live-catalog.mjs'

const NS = 'dsh-pi-login'
const RECORD_SCOPE = 'llm-pi-ai'
const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const HEADER = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/
const FORBIDDEN_HEADERS = /^(host|cookie|set-cookie|connection|proxy-.*|content-length|transfer-encoding|origin|referer)$/i
export class ConnectionError extends Error {
  constructor(code) { super(code); this.code = code }
}
export function profileKeyFor(dir = 'default') { return createHash('sha256').update(`dsh-pi-login:${dir}`).digest('hex').slice(0, 24) }
function text(value, limit = 100) {
  if (typeof value !== 'string' || !value.trim() || value.length > limit || /[\u0000-\u001f\u007f]/.test(value)) throw new ConnectionError('invalid-request')
  return value.trim()
}
function credentialKey(id) {
  if (!NAME.test(id)) throw new ConnectionError('invalid-request')
  return `${RECORD_SCOPE}/${id}`
}
/** Custom endpoints require an explicit Host origin grant. No URL from RPC establishes trust. */
export function validateEndpoint(value, allowedOrigins = []) {
  if (value === undefined || value === '') return undefined
  let url
  try { url = new URL(text(value, 2048)) } catch { throw new ConnectionError('invalid-endpoint') }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new ConnectionError('invalid-endpoint')
  if (!allowedOrigins.includes(url.origin)) throw new ConnectionError('endpoint-untrusted')
  return url.href.replace(/\/$/, '')
}
export function validateHeaderRefs(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length > 20) throw new ConnectionError('invalid-request')
  for (const [name, ref] of Object.entries(value)) {
    if (!HEADER.test(name) || FORBIDDEN_HEADERS.test(name) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(ref)) throw new ConnectionError('invalid-header')
  }
  return { ...value }
}

/** Connection metadata and credential ownership; all public values are allowlisted. */
export class ConnectionManager {
  constructor({ settings, credentials, registry, connectionSnapshot, validateProfile = () => {}, onChange = () => {}, legacyProviders = () => ({}), extraConnections = async () => [] }) {
    Object.assign(this, { settings, credentials, registry, connectionSnapshot, validateProfile, onChange, legacyProviders, extraConnections })
    this.closed = false
    this.pendingLogins = new Set()
    this.pendingDeletes = new Set()
    this.pendingCredentialWrites = new Set()
    this.verified = new Map()
  }
  section() { return this.settings.describe({ redactSecrets: false }).find(row => row.ns === NS) }
  // SettingsForms describes only ACTIVE fibers. Catalog resolution also runs
  // during apply(), so read the owning fiber's live Config before activation.
  raw() { return this.connectionSnapshot?.() ?? this.section()?.value?.connections ?? {} }
  lookup(connectionId, { allowDeleting = false } = {}) {
    if (this.closed || typeof connectionId !== 'string' || !Object.hasOwn(this.raw(), connectionId)) throw new ConnectionError('connection-unavailable')
    if (this.raw()[connectionId].deletionPending && !allowDeleting) throw new ConnectionError('connection-deleting')
    return { ...structuredClone(this.raw()[connectionId]), connectionId }
  }
  isCurrent(binding) {
    if (this.closed) return false
    const connection = this.raw()[binding.connectionId]
    return this.registry.isCurrent(binding) && !!connection && !connection.deletionPending && connection.integrationId === binding.integrationId && connection.serviceId === binding.serviceId && connection.credentialRecordId === binding.credentialRecordId && connection.credentialGeneration === binding.credentialGeneration
  }
  binding(connection) { return { ...connection, profileKey: this.registry.profileKey, generation: this.registry.generation } }
  authKey(connection) {
    return connection.integrationId === 'pi' ? credentialKey(connection.credentialRecordId) : this.registry.owner(connection.integrationId).authKey(connection)
  }
  markVerified(connectionId) {
    const connection = this.lookup(connectionId)
    this.verified.set(connectionId, { record: connection.credentialRecordId, credentialGeneration: connection.credentialGeneration, verifiedAt: new Date().toISOString() })
  }
  guard(payload, { optional = false } = {}) {
    if (!(optional && payload.profileKey === undefined && payload.generation === undefined)
      && (payload.profileKey !== this.registry.profileKey || payload.generation !== this.registry.generation)) throw new ConnectionError('profile-changed')
    if (payload.credentialGeneration !== undefined) {
      const current = this.raw()[payload.connectionId]
      if (!current) throw new ConnectionError('connection-unavailable')
      if (!Number.isSafeInteger(payload.credentialGeneration) || payload.credentialGeneration !== current.credentialGeneration) throw new ConnectionError('connection-changed')
    }
  }
  writable(revision) {
    if (this.closed) throw new ConnectionError('connection-unavailable')
    const section = this.section()
    if (!section || section.writable === false) throw new ConnectionError('read-only')
    if (!Number.isSafeInteger(revision) || section.revision !== revision) throw new ConnectionError('settings-changed')
    return section
  }
  validate(connections, previous) {
    const routes = new Set()
    const records = new Set()
    for (const [id, connection] of Object.entries(connections)) {
      if (!NAME.test(id) || !NAME.test(connection.routeId) || !NAME.test(connection.credentialRecordId) || routes.has(connection.routeId)) throw new ConnectionError('route-conflict')
      // Integrations may own the same Credentials namespace (Pi and Muse do).
      const record = connection.integrationId === 'pi' || this.registry.integrations.has(connection.integrationId)
        ? this.authKey(connection) : `${connection.integrationId}/${connection.credentialRecordId}`
      if (records.has(record)) throw new ConnectionError('credential-conflict')
      records.add(record)
      routes.add(connection.routeId)
      if (connection.credentialCleanupIds !== undefined && (!Array.isArray(connection.credentialCleanupIds) || connection.integrationId !== 'pi' && connection.credentialCleanupIds.length > 0 || connection.credentialCleanupIds.some(id => typeof id !== 'string' || !NAME.test(id) || id === connection.credentialRecordId))) throw new ConnectionError('invalid-request')
      // A temporarily unmounted optional owner must not freeze unrelated
      // edits. Its unchanged record stays intact; new/changed records still
      // require the owner's own validation and writable service contract.
      if (previous && isDeepStrictEqual(connection, previous[id])) continue
      const service = this.registry.service(connection.integrationId, connection.serviceId)
      if (!service.capabilities.settings) throw new ConnectionError('unsupported')
      if (!['oauth', 'api-key'].includes(connection.authMethod)) throw new ConnectionError('unsupported-method')
      if (connection.authMethod === 'oauth' && !service.methods.some(entry => entry.id === 'oauth')) throw new ConnectionError('unsupported-method')
      if (connection.authMethod === 'api-key' && !service.methods.some(entry => entry.id === 'api-key')) throw new ConnectionError('unsupported-method')
      text(connection.displayName)
      if (connection.profile?.headers && Object.keys(connection.profile.headers).length) throw new ConnectionError('secret-headers-require-reference')
      if (connection.headerRefs) validateHeaderRefs(connection.headerRefs)
      if (connection.integrationId !== 'pi') {
        const owner = this.registry.owner(connection.integrationId)
        if (!owner.validateConnection) throw new ConnectionError('owner-managed')
        owner.validateConnection({ ...connection, connectionId: id })
      }
      if (sdkServiceOf(connection) !== undefined) this.validateProfile(connection)
    }
  }
  async write(connections, revision, extra = [], token = this.registry.token()) {
    if (this.closed || !this.registry.isCurrent(token)) throw new ConnectionError('profile-changed')
    this.writable(revision)
    this.validate(connections, this.raw())
    try { await this.settings.mutate(NS, [{ op: 'set', path: ['connections'], value: connections }, ...extra], revision) }
    catch (error) {
      if (error?.code === 'SETTINGS_CONFLICT') throw new ConnectionError('settings-changed')
      if (['EACCES', 'EPERM', 'EROFS'].includes(error?.code) || error?.message === 'Configuration for "dsh-pi-login" is overridden by a home patch or command-line overlay') throw new ConnectionError('read-only')
      throw error
    }
    if (this.closed || !this.registry.isCurrent(token)) {
      const error = new ConnectionError('profile-changed')
      error.metadataCommitted = true
      throw error
    }
    this.changed()
  }
  changed(connectionId) {
    for (const integrationId of this.registry.integrations.keys()) this.registry.replaceConnections(integrationId, this.raw())
    this.registry.emit('changed', undefined, connectionId)
    this.onChange(connectionId)
  }
  async list() {
    const token = this.registry.token()
    const section = this.section()
    const connections = await Promise.all(Object.keys(this.raw()).map(async id => {
      const connection = this.lookup(id, { allowDeleting: true })
      try {
      const service = this.registry.service(connection.integrationId, connection.serviceId)
      const owner = this.registry.owner(connection.integrationId)
      const key = this.authKey(connection)
      const record = connection.integrationId === 'pi' ? await this.credentials.describeRecord(key) : await owner.describeConnection(connection)
      const configured = connection.credentialRef ? !!(await this.credentials.describe?.(connection.credentialRef))?.configured : record.configured === true
      const stored = sdkServiceOf(connection) !== undefined && connection.authMethod === 'oauth' && configured ? await this.credentials.readRecord(key) : undefined
      const expired = stored?.kind === 'grant' && Number.isFinite(stored.payload?.expires) && stored.payload.expires <= Date.now()
      const verified = this.verified.get(id)
      const isVerified = verified?.record === connection.credentialRecordId && verified.credentialGeneration === connection.credentialGeneration
      return {
        key, connectionId: id, integrationId: connection.integrationId, integrationLabel: owner.label,
        serviceId: connection.serviceId, serviceLabel: service.label,
        routeId: connection.routeId, displayName: connection.displayName, authMethod: connection.authMethod,
        credentialGeneration: connection.credentialGeneration,
        configured, writable: section?.writable !== false && record.writable !== false,
        enabled: !connection.deletionPending && connection.enabled !== false, deletionPending: connection.deletionPending === true, credentialCleanupPending: !!connection.credentialCleanupIds?.length, inFlight: this.pendingLogins.has(id) || this.pendingDeletes.has(id) || this.pendingCredentialWrites.has(id),
        methods: service.methods.filter(method => method.id === connection.authMethod),
        authStatus: connection.deletionPending ? 'deletion-pending' : this.pendingLogins.has(id) ? 'updating' : expired ? 'expired' : configured && isVerified ? 'verified' : record.authStatus ?? (configured ? 'saved' : 'auth-required'), capabilities: connection.deletionPending ? { auth: false, models: false, usage: false, settings: true } : service.capabilities,
        ...isVerified ? { verifiedAt: verified.verifiedAt } : {},
        profile: { ...connection.profile?.baseURL ? { baseURL: connection.profile.baseURL } : {}, ...connection.profile?.api ? { api: connection.profile.api } : {} },
        revision: section?.revision,
      }
      } catch {
        return { connectionId: id, integrationId: connection.integrationId, integrationLabel: connection.integrationId,
          serviceId: connection.serviceId, serviceLabel: connection.serviceId, routeId: connection.routeId,
          displayName: connection.displayName, authMethod: connection.authMethod, enabled: !connection.deletionPending && connection.enabled !== false, deletionPending: connection.deletionPending === true, credentialCleanupPending: !!connection.credentialCleanupIds?.length,
          configured: false, writable: false, inFlight: false, methods: [], authStatus: 'unavailable',
          capabilities: { auth: false, models: false, settings: false, usage: false }, revision: section?.revision }
      }
    }))
    const extra = await this.extraConnections()
    if (this.closed || !this.registry.isCurrent(token)) throw new ConnectionError('profile-changed')
    return {
      profileKey: token.profileKey, generation: token.generation, revision: section?.revision,
      integrations: [...this.registry.integrations.values()].map(owner => ({ integrationId: owner.integrationId, id: owner.integrationId, label: owner.label, source: owner.source })),
      services: this.registry.services(), connections: [...connections, ...extra],
    }
  }
  async create(input, revision) {
    const token = this.registry.token()
    const section = this.writable(revision)
    const service = this.registry.service(input.integrationId, input.serviceId)
    const owner = this.registry.owner(input.integrationId)
    if (!service.capabilities.settings) throw new ConnectionError('unsupported')
    const id = newConnectionId()
    const connection = {
      integrationId: input.integrationId, serviceId: input.serviceId, routeId: input.integrationId === 'pi' ? routeForConnection(id) : owner.routeIdFor(id),
      displayName: text(input.displayName ?? service.label), authMethod: input.authMethod,
      credentialRecordId: id, credentialGeneration: 0, enabled: false,
      profile: {},
    }
    if (input.integrationId !== 'pi' && [input.apiKey, input.endpointUrl, input.api, input.headerRefs].some(value => value !== undefined)) throw new ConnectionError('owner-managed')
    if (owner.initialConnection) Object.assign(connection, owner.initialConnection())
    if (input.endpointUrl) connection.profile.baseURL = validateEndpoint(input.endpointUrl, section.value.trustedEndpointOrigins)
    if (input.api) connection.profile.api = text(input.api, 100)
    if (input.headerRefs) connection.headerRefs = validateHeaderRefs(input.headerRefs)
    const next = { ...this.raw(), [id]: connection }
    this.validate(next, this.raw())
    const secret = input.apiKey === undefined ? undefined : text(input.apiKey, 16384)
    if (secret !== undefined && input.authMethod !== 'api-key') throw new ConnectionError('unsupported-method')
    // The metadata row owns the record before a secret can be written. A
    // failed second store is visible and deletable instead of becoming orphaned.
    this.pendingCredentialWrites.add(id)
    let metadataCommitted = false
    try {
      await this.write(next, revision, [], token)
      metadataCommitted = true
      if (secret !== undefined) {
        const current = () => {
          if (this.closed || !this.registry.isCurrent(token)) throw new ConnectionError('profile-changed')
          const saved = this.raw()[id]
          if (!saved || saved.deletionPending || saved.credentialRecordId !== id || saved.credentialGeneration !== 0) throw new ConnectionError('connection-changed')
        }
        current()
        try { await this.credentials.modifyRecord(credentialKey(id), () => { current(); return { kind: 'api-key', key: secret } }) }
        catch (cause) {
          if (cause instanceof ConnectionError) { cause.metadataCommitted = true; throw cause }
          const error = new ConnectionError('credential-save-failed'); error.cause = cause; error.metadataCommitted = true; throw error
        }
        current()
        await this.write({ ...this.raw(), [id]: { ...this.raw()[id], enabled: true } }, this.section()?.revision, [], token)
      }
    } catch (cause) {
      if (!metadataCommitted || ['profile-changed', 'connection-changed', 'credential-save-failed'].includes(cause?.code)) throw cause
      // Activation can fail after both the row and its key were saved. Report
      // that partial create just like a failed key save so Add cannot duplicate it.
      const error = new ConnectionError('credential-save-failed')
      error.cause = cause
      error.metadataCommitted = true
      throw error
    } finally { this.pendingCredentialWrites.delete(id) }
    return { connectionId: id, saved: true }
  }
  async update(connectionId, patch, revision) {
    const token = this.registry.token()
    const section = this.writable(revision)
    const connection = this.lookup(connectionId)
    if (this.pendingCredentialWrites.has(connectionId) || this.pendingDeletes.has(connectionId)) throw new ConnectionError('busy')
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) throw new ConnectionError('invalid-request')
    const allowed = new Set(['displayName', 'enabled', 'apiKey', 'endpointUrl', 'api', 'headerRefs', 'profile', 'authMethod'])
    if (Object.keys(patch).some(key => !allowed.has(key))) throw new ConnectionError('invalid-request')
    if (connection.integrationId !== 'pi' && ['apiKey', 'endpointUrl', 'api', 'headerRefs', 'authMethod'].some(key => patch[key] !== undefined)) throw new ConnectionError('owner-managed')
    if (sdkServiceOf(connection) === undefined && patch.profile !== undefined) throw new ConnectionError('owner-managed')
    if (patch.displayName !== undefined) connection.displayName = text(patch.displayName)
    if (patch.enabled !== undefined) {
      if (typeof patch.enabled !== 'boolean') throw new ConnectionError('invalid-request')
      connection.enabled = patch.enabled
    }
    if (patch.endpointUrl !== undefined) {
      const url = validateEndpoint(patch.endpointUrl, section.value.trustedEndpointOrigins)
      if (url === undefined) delete connection.profile.baseURL; else connection.profile.baseURL = url
    }
    if (patch.api !== undefined) {
      if (!patch.api) delete connection.profile.api; else connection.profile.api = text(patch.api)
    }
    if (patch.headerRefs) connection.headerRefs = validateHeaderRefs(patch.headerRefs)
    // Internal model operation only: explicit allowlist prevents changing endpoint or secrets here.
    if (patch.profile) {
      const fields = ['disabledModels', 'enabledFastModels', 'enabledDiscoveredModels', 'enabledContributorModels', 'reasoning']
      if (Object.keys(patch.profile).some(key => !fields.includes(key))) throw new ConnectionError('invalid-request')
      Object.assign(connection.profile, patch.profile)
    }
    const oldRecordId = connection.credentialRecordId
    const cleanupIds = new Set(connection.credentialCleanupIds ?? [])
    let staged = false
    this.pendingCredentialWrites.add(connectionId)
    try {
      if (patch.authMethod !== undefined && patch.authMethod !== connection.authMethod) {
        if (!['oauth', 'api-key'].includes(patch.authMethod)) throw new ConnectionError('unsupported-method')
        connection.authMethod = patch.authMethod
        connection.credentialRecordId = newConnectionId()
        connection.credentialGeneration++; connection.enabled = false
        delete connection.credentialRef; delete connection.profile.apiKeyEnv
      }
      if (patch.apiKey !== undefined) {
        if (connection.authMethod !== 'api-key') throw new ConnectionError('unsupported-method')
        const secret = text(patch.apiKey, 16384)
        this.validate({ ...this.raw(), [connectionId]: connection }, this.raw())
        const newRecordId = newConnectionId()
        const original = this.raw()[connectionId]
        const generation = original.credentialGeneration + 1
        // Retire a reserved record before writing it. Until the swap commits,
        // the current key stays active and the new key is recoverable garbage.
        await this.write({ ...this.raw(), [connectionId]: { ...original, credentialGeneration: generation, credentialCleanupIds: [...cleanupIds, newRecordId] } }, revision, [], token)
        staged = true
        const stagedConnection = structuredClone(this.raw()[connectionId])
        const current = () => {
          if (this.closed || !this.registry.isCurrent(token)) throw new ConnectionError('profile-changed')
          const saved = this.raw()[connectionId]
          if (!saved || !isDeepStrictEqual(saved, stagedConnection)) throw new ConnectionError('connection-changed')
        }
        current()
        try { await this.credentials.modifyRecord(credentialKey(newRecordId), () => { current(); return { kind: 'api-key', key: secret } }) }
        catch (cause) {
          if (cause instanceof ConnectionError) { cause.metadataCommitted = true; throw cause }
          const error = new ConnectionError('credential-save-failed'); error.cause = cause; error.metadataCommitted = true; throw error
        }
        current()
        connection.credentialRecordId = newRecordId; connection.credentialGeneration++
        delete connection.credentialRef
        delete connection.profile.apiKeyEnv
      }
      if (connection.integrationId === 'pi' && connection.credentialRecordId !== oldRecordId) cleanupIds.add(oldRecordId)
      if (cleanupIds.size) connection.credentialCleanupIds = [...cleanupIds]
      else delete connection.credentialCleanupIds
      delete connection.connectionId
      await this.write({ ...this.raw(), [connectionId]: connection }, staged ? this.section()?.revision : revision, [], token)
    } finally {
      this.pendingCredentialWrites.delete(connectionId)
    }
    if (connection.credentialCleanupIds?.length) await this.cleanupCredentials(connectionId, this.section()?.revision)
    return { saved: true }
  }
  async clone(connectionId, displayName, revision) {
    const token = this.registry.token()
    const original = this.lookup(connectionId)
    if (this.pendingCredentialWrites.has(connectionId)) throw new ConnectionError('busy')
    const id = newConnectionId()
    const owner = this.registry.owner(original.integrationId)
    const copy = { ...original, routeId: original.integrationId === 'pi' ? routeForConnection(id) : owner.routeIdFor(id), credentialRecordId: id, credentialGeneration: 0,
      displayName: text(displayName ?? `${original.displayName} (copy)`), enabled: false }
    delete copy.connectionId; delete copy.credentialRef; delete copy.headerRefs; delete copy.legacyRoute; delete copy.museCatalog; delete copy.modelCatalog; delete copy.credentialCleanupIds
    delete copy.profile.apiKeyEnv; delete copy.profile.headers
    await this.write({ ...this.raw(), [id]: copy }, revision, [], token)
    return { saved: true, connectionId: id }
  }
  /** Retry only the Pi record IDs durably retired by this connection. */
  async cleanupCredentials(connectionId, revision) {
    const token = this.registry.token()
    this.writable(revision)
    const connection = this.lookup(connectionId)
    if (connection.integrationId !== 'pi') throw new ConnectionError('owner-managed')
    if (this.pendingCredentialWrites.has(connectionId) || this.pendingDeletes.has(connectionId)) throw new ConnectionError('busy')
    this.pendingCredentialWrites.add(connectionId)
    const current = () => {
      if (this.closed || !this.registry.isCurrent(token)) throw new ConnectionError('profile-changed')
      const saved = this.lookup(connectionId)
      if (saved.credentialRecordId !== connection.credentialRecordId || saved.credentialGeneration !== connection.credentialGeneration) throw new ConnectionError('connection-changed')
      return saved
    }
    try {
      for (const id of connection.credentialCleanupIds ?? []) {
        current()
        const key = credentialKey(id)
        if (Object.values(this.raw()).some(value => value.credentialRecordId === id || (value.integrationId === 'pi' || this.registry.integrations.has(value.integrationId)) && this.authKey(value) === key)) throw new ConnectionError('credential-conflict')
        try { await this.credentials.deleteRecord(key) }
        catch (cause) { const error = new ConnectionError('credential-cleanup-failed'); error.cause = cause; error.metadataCommitted = true; throw error }
        const saved = current()
        saved.credentialCleanupIds = saved.credentialCleanupIds.filter(value => value !== id)
        if (!saved.credentialCleanupIds.length) delete saved.credentialCleanupIds
        delete saved.connectionId
        await this.write({ ...this.raw(), [connectionId]: saved }, this.section()?.revision, [], token)
      }
      return { saved: true }
    } finally { this.pendingCredentialWrites.delete(connectionId) }
  }
  async delete(connectionId, revision) {
    const token = this.registry.token()
    this.writable(revision)
    const connection = this.lookup(connectionId, { allowDeleting: true })
    if (this.pendingDeletes.has(connectionId) || this.pendingCredentialWrites.has(connectionId)) throw new ConnectionError('busy')
    this.pendingDeletes.add(connectionId)
    try {
      // Persist the revocation before touching Credentials. A failed cleanup or
      // a restart keeps an inert, visible row that the same Delete can retry.
      if (!connection.deletionPending) {
        connection.deletionPending = true
        connection.enabled = false
        connection.credentialGeneration++
        delete connection.connectionId
        await this.write({ ...this.raw(), [connectionId]: connection }, revision, [], token)
      }
      const current = () => {
        if (this.closed || !this.registry.isCurrent(token)) throw new ConnectionError('profile-changed')
        const saved = this.raw()[connectionId]
        if (!saved?.deletionPending || saved.credentialRecordId !== connection.credentialRecordId || saved.credentialGeneration !== connection.credentialGeneration || saved.integrationId !== connection.integrationId) throw new ConnectionError('connection-changed')
      }
      current()
      try {
        for (const recordId of new Set([connection.credentialRecordId, ...connection.credentialCleanupIds ?? []])) {
          current()
          const key = this.authKey({ ...connection, credentialRecordId: recordId })
          if (Object.entries(this.raw()).some(([id, value]) => id !== connectionId && (
            value.credentialRecordId === recordId
            || (value.integrationId === 'pi' || this.registry.integrations.has(value.integrationId)) && this.authKey(value) === key
          ))) throw new ConnectionError('credential-conflict')
          if (connection.integrationId === 'pi') await this.credentials.deleteRecord(key)
          else await this.registry.owner(connection.integrationId).deleteCredentials(connection)
        }
      } catch (cause) {
        const error = new ConnectionError('credential-delete-failed')
        error.cause = cause
        throw error
      }
      current()
      // Preserve concurrent changes to other connections; SettingsForms still
      // checks the revision atomically if another writer wins from here.
      const next = { ...this.raw() }; delete next[connectionId]
      await this.write(next, this.section()?.revision, [], token)
      return { deleted: true }
    } finally {
      this.pendingDeletes.delete(connectionId)
    }
  }
  /** Store the account catalog a Muse Code refresh returned; no model is enabled by this. */
  async saveMuseCatalog(binding, rows, { signal } = {}) {
    signal?.throwIfAborted()
    if (!this.isCurrent(binding)) throw new ConnectionError('connection-changed')
    const token = this.registry.token()
    const connection = this.lookup(binding.connectionId)
    connection.museCatalog = structuredClone(rows)
    delete connection.museCode
    delete connection.connectionId
    await this.write({ ...this.raw(), [binding.connectionId]: connection }, this.section()?.revision, [], token)
  }
  /** Compare the connection and endpoint again before the revision-checked write. */
  async saveModelCatalog(binding, value, { signal } = {}) {
    for (let attempt = 0; attempt < 3; attempt++) {
      signal?.throwIfAborted()
      if (!this.isCurrent(binding) || catalogBinding(binding) !== catalogBinding(this.lookup(binding.connectionId))) throw new ConnectionError('connection-changed')
      const token = this.registry.token(), connection = this.lookup(binding.connectionId)
      connection.modelCatalog = value
      delete connection.connectionId
      try { await this.write({ ...this.raw(), [binding.connectionId]: connection }, this.section()?.revision, [], token); return }
      catch (error) { if (error.code !== 'settings-changed' || attempt === 2) throw error }
    }
  }
  async beginLogin(connectionId) {
    const token = this.registry.token()
    const connection = this.lookup(connectionId)
    if (this.pendingLogins.has(connectionId) || this.pendingCredentialWrites.has(connectionId)) throw new ConnectionError('busy')
    this.pendingLogins.add(connectionId)
    const section = this.section()
    connection.credentialGeneration++
    // Re-authentication may commit a different account before the catalog
    // refresh succeeds. Revoke the old durable account catalog in this same
    // write, never after credential commit where a crash could preserve it.
    if (connection.integrationId === 'meta-muse-code') {
      delete connection.museCatalog
      delete connection.museCode
    }
    delete connection.connectionId
    try { await this.write({ ...this.raw(), [connectionId]: connection }, section?.revision, [], token) }
    catch (error) { this.pendingLogins.delete(connectionId); throw error }
    return this.lookup(connectionId)
  }
  endLogin(connectionId) { this.pendingLogins.delete(connectionId) }
  /** One atomic metadata conversion. Existing credential records and route IDs stay in place. */
  async migrate() {
    const token = this.registry.token()
    const section = this.section()
    if (!section || section.value.connectionMigrationVersion >= 1 || section.writable === false) return false
    const providers = { ...(section.value.legacyImported ? {} : this.legacyProviders()), ...(section.value.providers ?? {}) }
    for (const record of await this.credentials.listRecords()) {
      if (!record.key.startsWith(`${RECORD_SCOPE}/`)) continue
      const id = record.key.slice(RECORD_SCOPE.length + 1)
      if (NAME.test(id) && this.registry.services().some(service => service.integrationId === 'pi' && service.serviceId === id) && !Object.hasOwn(providers, id)) providers[id] = { enabled: false }
    }
    const next = { ...this.raw() }
    for (const [serviceId, profile] of Object.entries(providers)) {
      if (!NAME.test(serviceId)) throw new ConnectionError('migration-invalid-route')
      if (Object.values(next).some(connection => connection.legacyRoute && connection.routeId === serviceId)) continue
      const service = this.registry.service('pi', serviceId)
      const record = await this.credentials.describeRecord(credentialKey(serviceId))
      const stored = await this.credentials.readRecord(credentialKey(serviceId))
      const authMethod = profile.apiKeyEnv || stored?.kind === 'api-key' ? 'api-key' : service.methods.some(entry => entry.id === 'oauth') ? 'oauth' : 'api-key'
      const id = newConnectionId()
      const copy = structuredClone(profile)
      // Legacy header literals are moved into Credentials in a separate explicit repair;
      // keep migration atomic and refuse rather than copy secrets into new metadata.
      if (copy.headers && Object.keys(copy.headers).length) throw new ConnectionError('migration-header-repair-required')
      delete copy.headers
      const separateStoredOAuth = !!profile.apiKeyEnv && stored?.kind === 'grant'
      next[id] = {
        integrationId: 'pi', serviceId, routeId: serviceId, displayName: profile.displayName ?? service.label,
        authMethod, credentialRecordId: separateStoredOAuth ? id : serviceId, credentialGeneration: 0,
        ...profile.apiKeyEnv ? { credentialRef: profile.apiKeyEnv } : {},
        enabled: profile.enabled !== false, legacyRoute: !separateStoredOAuth, profile: copy,
      }
      if (separateStoredOAuth) {
        // The old profile selected the reference but still held a saved login.
        // Preserve both methods as independent metadata, without copying a grant.
        const oauthId = newConnectionId()
        const oauthProfile = structuredClone(copy)
        delete oauthProfile.apiKeyEnv
        next[oauthId] = { integrationId: 'pi', serviceId, routeId: routeForConnection(oauthId),
          displayName: `${profile.displayName ?? service.label} (OAuth)`, authMethod: 'oauth',
          credentialRecordId: serviceId, credentialGeneration: 0, enabled: false, profile: oauthProfile }
      }
    }
    await this.write(next, section.revision, [
      { op: 'set', path: ['connectionMigrationVersion'], value: 1 },
      { op: 'set', path: ['legacyImported'], value: true },
      { op: 'unset', path: ['providers'] },
    ], token)
    return true
  }
  dispose() { this.closed = true; this.pendingLogins.clear(); this.pendingDeletes.clear(); this.pendingCredentialWrites.clear(); this.verified.clear() }
}
