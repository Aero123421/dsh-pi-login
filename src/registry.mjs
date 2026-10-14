import { randomUUID, randomInt } from 'node:crypto'

export class RegistryError extends Error {
  constructor(code) { super(code); this.code = code }
}

const ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
export function newConnectionId() { return `c-${randomUUID()}` }
export function routeForConnection(id) {
  if (!ID.test(id)) throw new RegistryError('invalid-connection')
  return `pi-${id}`
}

/** Bundle-local capability contract. Owners retain auth, execution and secrets. */
export class IntegrationRegistry {
  constructor(profileKey) {
    this.profileKey = profileKey
    // A fresh mount, including A → B → A or restart, must never reuse a tab's token.
    this.generation = randomInt(1, 2 ** 48 - 1)
    this.integrations = new Map()
    this.listeners = new Set()
    this.routes = new Map()
    this.closed = false
  }
  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  emit(type, integrationId, connectionId) {
    const event = { type, profileKey: this.profileKey, generation: this.generation, integrationId, connectionId }
    for (const listener of this.listeners) listener(event)
  }
  register(owner, ownRegistration) {
    if (this.closed || !ID.test(owner.integrationId) || this.integrations.has(owner.integrationId)) throw new RegistryError('integration-conflict')
    if (typeof owner.listServices !== 'function' || typeof owner.listConnections !== 'function') throw new RegistryError('invalid-integration')
    this.integrations.set(owner.integrationId, owner)
    this.emit('registered', owner.integrationId)
    const unregister = () => {
      if (this.integrations.get(owner.integrationId) !== owner) return
      this.integrations.delete(owner.integrationId)
      for (const [routeId, entry] of this.routes) if (entry.integrationId === owner.integrationId) this.routes.delete(routeId)
      this.emit('unregistered', owner.integrationId)
    }
    // Cordis emit() discards listener return values. An optional owner can
    // explicitly attach this disposer to its own context through the callback.
    try {
      if (ownRegistration !== undefined) {
        if (typeof ownRegistration !== 'function') throw new RegistryError('invalid-integration')
        ownRegistration(unregister)
      }
    } catch (error) { unregister(); throw error }
    return unregister
  }
  owner(integrationId) {
    const owner = this.integrations.get(integrationId)
    if (!owner) throw new RegistryError('integration-unavailable')
    return owner
  }
  services() {
    return [...this.integrations.values()].flatMap(owner => owner.listServices().map(service => ({
      integrationId: owner.integrationId, serviceId: service.serviceId,
      label: String(service.label ?? service.serviceId),
      methods: (service.methods ?? []).map(({ id, label }) => ({ id, label })),
      ...Array.isArray(service.apis) ? { apis: service.apis.filter(api => typeof api === 'string') } : {},
      capabilities: Object.fromEntries(['auth', 'models', 'usage', 'settings'].map(key => [key, service.capabilities?.[key] === true])),
      ...service.unavailableReason ? { unavailableReason: service.unavailableReason } : {},
      ...service.executionKind ? { executionKind: service.executionKind } : {},
      ...service.termsUrl || service.sourceTermsUrl ? { termsUrl: service.termsUrl ?? service.sourceTermsUrl } : {},
      ...service.executionKind ? { llmCompatible: service.llmCompatible === true } : {},
      ...service.requiresHostCli ? { requiresHostCli: true } : {},
    })))
  }
  service(integrationId, serviceId) {
    const service = this.services().find(entry => entry.integrationId === integrationId && entry.serviceId === serviceId)
    if (!service) throw new RegistryError('service-unavailable')
    return service
  }
  /** Validate all routes before publishing any replacement. */
  replaceConnections(integrationId, connections) {
    this.owner(integrationId)
    const candidate = new Map([...this.routes].filter(([, entry]) => entry.integrationId !== integrationId))
    for (const [connectionId, connection] of Object.entries(connections)) {
      if (connection.integrationId !== integrationId) continue
      if (!ID.test(connectionId) || !ID.test(connection.routeId)) throw new RegistryError('invalid-connection')
      if (candidate.has(connection.routeId)) throw new RegistryError('route-conflict')
      candidate.set(connection.routeId, { integrationId, serviceId: connection.serviceId, connectionId })
    }
    const before = JSON.stringify([...this.routes])
    this.routes = candidate
    if (JSON.stringify([...candidate]) !== before) this.emit('connections-changed', integrationId)
  }
  token(connectionId) { return { profileKey: this.profileKey, generation: this.generation, connectionId } }
  isCurrent(token) { return !this.closed && token.profileKey === this.profileKey && token.generation === this.generation }
  switchProfile(profileKey) {
    this.profileKey = profileKey; this.generation++; this.routes.clear()
    this.emit('profile-changed')
  }
  dispose() { this.closed = true; this.generation++; this.emit('disposed'); this.listeners.clear(); this.integrations.clear(); this.routes.clear() }
}
