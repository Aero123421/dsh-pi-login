const INITIAL = Object.freeze({ status: 'idle', entries: [], integrations: [], services: [], error: false })

export class LoginController {
  constructor(connection) { this.connection = connection; this.state = INITIAL; this.listeners = new Set(); this.pending = undefined; this.closed = false; this.tickets = new Map(); this.mounts = 0 }
  getSnapshot = () => this.state
  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  publish(state) { if (this.closed) return; this.state = state; for (const listener of this.listeners) listener() }
  async call(method, payload = {}, signal) {
    const result = await this.connection.rpc.call('/api', `dsh-pi-login/${method}`, payload, signal)
    if (!result.ok) { const error = new Error(result.error.code); error.code = result.error.code; throw error }
    return result.value
  }
  load() {
    if (this.closed) return Promise.resolve()
    if (this.pending) return this.pending.promise
    const request = { abort: new AbortController() }
    // A newer refresh() replaces this request. Wait for that request instead of
    // resolving with the list that was current when this one started.
    const follow = () => this.pending && this.pending !== request ? this.pending.promise : undefined
    request.promise = this.call('connection-list', {}, request.abort.signal).then(snapshot => {
      if (this.pending !== request) return follow()
      this.publish({ status: 'ready', ...snapshot, entries: snapshot.connections ?? [], error: false })
    }, () => {
      if (this.pending !== request) return follow()
      this.publish({ ...this.state, status: 'ready', error: true })
    }).finally(() => { if (this.pending === request) this.pending = undefined })
    this.pending = request
    this.publish({ ...this.state, status: 'loading', error: false })
    return request.promise
  }
  refresh() {
    const previous = this.pending
    this.pending = undefined
    const next = this.load()
    previous?.abort.abort()
    return next
  }
  entry(connectionId) {
    return this.state.entries.find(item => item.connectionId === connectionId)
  }
  /** The connection page is showing. Background events must not fetch while it is hidden. */
  retain() {
    this.mounts += 1
    return () => { this.mounts = Math.max(0, this.mounts - 1) }
  }
  refreshIfMounted() {
    if (this.closed || this.mounts === 0) return Promise.resolve()
    return this.refresh()
  }
  scope() { const { profileKey, generation } = this.state; return { profileKey, generation } }
  isCurrent(scope) {
    if (this.closed || scope.profileKey !== this.state.profileKey || scope.generation !== this.state.generation) return false
    if (scope.credentialGeneration !== undefined) return this.state.entries.some(entry => entry.connectionId === scope.connectionId && entry.credentialGeneration === scope.credentialGeneration)
    return true
  }
  assertCurrent(scope) {
    if (this.isCurrent(scope)) return
    const code = !this.closed && scope.profileKey === this.state.profileKey && scope.generation === this.state.generation ? 'connection-changed' : 'profile-changed'
    const error = new Error(code); error.code = code; throw error
  }
  // Dialogs own the profile they were opened in. Delayed work must not acquire
  // a newer profile's authority from a shared controller at send time.
  scoped(entry) {
    const scope = { ...this.scope(), ...(entry?.credentialGeneration !== undefined ? { connectionId: entry.connectionId, credentialGeneration: entry.credentialGeneration } : {}) }
    const call = async (method, payload = {}, signal) => {
      this.assertCurrent(scope)
      const result = await this.call(method, { ...payload, ...scope }, signal)
      this.assertCurrent(scope)
      return result
    }
    const scoped = {
      scoped: () => scoped,
      tickets: this.tickets, call, mutation: call,
      start: (id, method) => this.start(id, method, scope),
      cancel: ticket => this.cancel(ticket, scope),
      refresh: async () => { this.assertCurrent(scope); await this.refresh(); this.assertCurrent(scope) },
      entry: connectionId => this.entry(connectionId),
      getSnapshot: this.getSnapshot,
    }
    return scoped
  }
  mutation(method, payload = {}, signal) {
    return this.call(method, { ...payload, ...this.scope() }, signal)
  }
  async start(connectionId, method, scope = this.scope()) {
    this.assertCurrent(scope)
    const result = await this.call('start', { connectionId, method, ...scope })
    if (typeof result.ticket !== 'string') throw new Error('invalid ticket')
    if (!this.isCurrent(scope)) {
      // The start may have been accepted before the profile/reset/unload.
      // Cancel with its original authority, never with the new profile.
      await this.call('cancel', { ...result, ...scope }).catch(() => {})
      this.assertCurrent(scope)
    }
    this.tickets.set(result.ticket, scope)
    return result.ticket
  }
  async cancel(ticket, scope = this.tickets.get(ticket) ?? this.scope()) {
    this.tickets.delete(ticket)
    try { await this.call('cancel', { ticket, ...scope }) }
    finally { if (this.isCurrent(scope)) await this.refresh() }
  }
  dispose() {
    this.closed = true; this.pending?.abort.abort(); this.pending = undefined; this.listeners.clear()
    for (const [ticket, scope] of this.tickets) void this.call('cancel', { ticket, ...scope }).catch(() => {})
    this.tickets.clear()
  }
}

/** The connection just created, taken by id from the list refresh has published. */
export function createdLoginEntry(controller, result, fallback = {}) {
  const created = result?.connection ?? result ?? {}
  return result?.connection ?? controller.entry(created.connectionId) ?? {
    connectionId: created.connectionId, authMethod: fallback.authMethod, displayName: fallback.displayName, enabled: false,
  }
}

export async function finishConnectionCreate(controller, result, { method, displayName, onSaved, onLogin }) {
  await controller.refresh()
  onSaved()
  if (method !== 'oauth') return
  onLogin(createdLoginEntry(controller, result, { authMethod: method, displayName }))
}

export async function finishConnectionRecover(controller, entry, { onSaved, notice }) {
  await controller.refresh()
  const current = controller.entry(entry.connectionId)
  if (current && current.credentialGeneration !== entry.credentialGeneration) onSaved(notice)
}
