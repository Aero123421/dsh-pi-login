import { createHash } from 'node:crypto'

export class ExternalIntegrationError extends Error {
  constructor(code = 'external-unavailable') {
    super(['external-unavailable', 'external-models-unsupported', 'external-provider-unavailable', 'external-aborted', 'external-route-conflict', 'external-profile-changed'].includes(code) ? code : 'external-unavailable')
    this.code = this.message
  }
}
const publicText = (value, limit = 200) => typeof value === 'string' && value.length > 0 && value.length <= limit && !/[\u0000-\u001f\u007f]/.test(value) ? value : undefined
const connectionId = (profileKey, routeId) => `x-${createHash('sha256').update(JSON.stringify([profileKey, routeId])).digest('hex').slice(0, 32)}`

/**
 * Official Host metadata only: listProviders(), listConfigurableProviders(),
 * and optionally listModels(exactRoute). settingsNs identifies a public owner
 * namespace, not permission to inspect that namespace or its credentials.
 * This read-only projection neither registers an adapter nor discovers auth
 * flows. Explicit owner capabilities remain separate registry descriptors.
 */
export function createExternalIntegrations({ llm, profileKey = 'default', generation = () => 1, excludeRoutes = () => [], excludeSettingsNamespaces = ['dsh-pi-login', 'llm-pi-ai'], allowModelRead = false, timeout = 20000 } = {}) {
  const integrationId = 'external-host'
  const omittedNamespaces = new Set(excludeSettingsNamespaces)
  let rows = [], failures = [], closed = false, revision = 0
  const controller = new AbortController()

  const exclusions = () => new Set(typeof excludeRoutes === 'function' ? excludeRoutes() : excludeRoutes)
  const allowedRow = route => !exclusions().has(route)
  const current = token => !closed && generation() === token
  async function read(operation, signal, token) {
    if (!current(token)) throw new ExternalIntegrationError('external-profile-changed')
    const deadline = AbortSignal.timeout(timeout)
    const requestSignal = signal ? AbortSignal.any([signal, controller.signal, deadline]) : AbortSignal.any([controller.signal, deadline])
    let onAbort
    try {
      const abort = new Promise((_, reject) => {
        onAbort = () => reject(new ExternalIntegrationError(signal?.aborted || controller.signal.aborted ? 'external-aborted' : 'external-unavailable'))
        if (requestSignal.aborted) onAbort()
        else requestSignal.addEventListener('abort', onAbort, { once: true })
      })
      const value = await Promise.race([Promise.resolve().then(operation), abort])
      if (!current(token)) throw new ExternalIntegrationError('external-profile-changed')
      return value
    } catch (error) {
      if (error instanceof ExternalIntegrationError) throw error
      throw new ExternalIntegrationError('external-unavailable')
    } finally { if (onAbort) requestSignal.removeEventListener('abort', onAbort) }
  }
  function service(row) {
    return { serviceId: row.serviceId, label: row.serviceLabel, methods: [], capabilities: { ...row.capabilities } }
  }
  function copyRows() { return structuredClone(rows) }
  const descriptor = {
    integrationId, label: 'External integrations', source: 'Host LLM directory', status: 'owner-managed',
    listServices: () => rows.map(service),
    listConnections: copyRows,
  }
  async function publicConnections({ signal } = {}) {
    if (closed) throw new ExternalIntegrationError('external-aborted')
    const token = generation(), epoch = ++revision
    const results = await Promise.allSettled([
      read(() => llm?.listProviders?.() ?? [], signal, token),
      read(() => llm?.listConfigurableProviders?.() ?? [], signal, token),
    ])
    if (!current(token)) throw new ExternalIntegrationError('external-profile-changed')
    if (signal?.aborted) throw new ExternalIntegrationError('external-aborted')
    // Partial metadata remains useful. A failed directory never supplies stale
    // ownership/auth facts; the successful directory can still publish rows.
    const live = new Map(), declared = new Map(), errors = []
    const [registered, configurable] = results
    const ingest = (result, target, kind) => {
      if (result.status === 'rejected' || !Array.isArray(result.value)) { errors.push(kind); return }
      for (const raw of result.value.slice(0, 4096)) {
        const routeId = publicText(kind === 'registered' ? raw?.id : raw?.provider, 512)
        if (!routeId || !allowedRow(routeId)) continue
        if (target.has(routeId)) throw new ExternalIntegrationError('external-route-conflict')
        if (kind === 'registered') target.set(routeId, { name: publicText(raw.name) ?? routeId })
        else {
          const source = publicText(raw.settingsNs)
          if (source && omittedNamespaces.has(source)) continue
          target.set(routeId, { name: publicText(raw.displayName) ?? routeId, source: source ?? 'unknown', unavailable: typeof raw.error === 'string' && raw.error.length > 0 })
        }
      }
    }
    ingest(registered, live, 'registered'); ingest(configurable, declared, 'declared')
    // An explicit Pi directory declaration excludes its live route as well.
    if (configurable.status === 'fulfilled' && Array.isArray(configurable.value)) {
      for (const raw of configurable.value) if (omittedNamespaces.has(raw?.settingsNs)) live.delete(raw.provider)
    }
    const candidate = [...new Set([...live.keys(), ...declared.keys()])].map(routeId => {
      const entry = declared.get(routeId), active = live.has(routeId)
      const id = connectionId(profileKey, routeId), name = entry?.name ?? live.get(routeId).name
      return {
        key: id, connectionId: id, integrationId, integrationLabel: descriptor.label,
        serviceId: routeId, serviceLabel: name, routeId, displayName: name,
        source: entry?.source ?? 'unknown', authMethod: 'owner-managed', authStatus: 'owner-managed',
        directoryState: entry?.unavailable ? 'unavailable' : active ? 'live' : 'declared',
        enabled: active, writable: false, inFlight: false, methods: [], profile: {},
        capabilities: { auth: false, models: allowModelRead && active && typeof llm?.listModels === 'function', usage: false, settings: false },
        ownerManaged: true,
      }
    })
    if (epoch === revision) {
      rows = candidate; failures = errors
    }
    return structuredClone(candidate)
  }
  async function models(id, { signal } = {}) {
    if (closed) throw new ExternalIntegrationError('external-aborted')
    const row = rows.find(value => value.connectionId === id)
    if (!row || !allowedRow(row.routeId)) throw new ExternalIntegrationError('external-provider-unavailable')
    if (!row.capabilities.models) throw new ExternalIntegrationError('external-models-unsupported')
    const token = generation(), routeId = row.routeId
    const metadata = await read(() => llm.listModels(routeId), signal, token)
    if (!rows.some(value => value.connectionId === id && value.routeId === routeId && value.enabled) || !allowedRow(routeId)) throw new ExternalIntegrationError('external-provider-unavailable')
    if (!Array.isArray(metadata) || metadata.length > 4096) throw new ExternalIntegrationError('external-unavailable')
    const seen = new Set(), models = metadata.map(value => {
      const modelId = publicText(value?.id, 512), name = publicText(value?.name)
      if (!modelId || !name || value.provider !== routeId || seen.has(modelId)) throw new ExternalIntegrationError('external-unavailable')
      seen.add(modelId)
      // LlmModelInfo metadata only. No Pi defaults, reasoning enum, Fast flags,
      // authentication result, or guessed route capabilities are synthesized.
      return { provider: routeId, id: modelId, name,
        ...publicText(value.description, 1000) ? { description: value.description } : {},
        ...Array.isArray(value.inputModalities) ? { inputModalities: value.inputModalities.map(modality => publicText(modality, 80)).filter(Boolean) } : {},
      }
    })
    const result = { connectionId: id, integrationId, provider: routeId, readOnly: true, models }
    return structuredClone(result)
  }
  return {
    descriptor, publicConnections, refresh: publicConnections, models,
    state: () => ({ failures: [...failures], connections: copyRows() }),
    dispose() { closed = true; revision++; controller.abort(); rows = []; failures = [] },
  }
}
