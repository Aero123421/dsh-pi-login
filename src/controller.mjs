const INITIAL = Object.freeze({ status: 'idle', entries: [], integrations: [], services: [], error: false })

export class LoginController {
  constructor(connection) { this.connection = connection; this.state = INITIAL; this.listeners = new Set(); this.pending = undefined; this.closed = false; this.tickets = new Set() }
  getSnapshot = () => this.state
  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  publish(state) { if (this.closed) return; this.state = state; for (const listener of this.listeners) listener() }
  async call(method, payload = {}, signal) {
    const result = await this.connection.rpc.call('/api', `dsh-pi-login/${method}`, payload, signal)
    if (!result.ok) throw new Error(result.error.code)
    return result.value
  }
  load() {
    if (this.closed) return Promise.resolve()
    if (this.pending) return this.pending.promise
    const request = { abort: new AbortController() }
    request.promise = this.call('connection-list', {}, request.abort.signal).then(snapshot => {
      if (this.pending === request) this.publish({ status: 'ready', ...snapshot, entries: snapshot.connections ?? [], error: false })
    }, () => {
      if (this.pending === request) this.publish({ ...this.state, status: 'ready', error: true })
    }).finally(() => { if (this.pending === request) this.pending = undefined })
    this.pending = request
    this.publish({ ...this.state, status: 'loading', error: false })
    return request.promise
  }
  refresh() {
    const previous = this.pending
    this.pending = undefined
    previous?.abort.abort()
    return this.load()
  }
  mutation(method, payload = {}, signal) {
    const { profileKey, generation } = this.state
    return this.call(method, { ...payload, profileKey, generation }, signal)
  }
  async start(connectionId, method) {
    const result = await this.mutation('start', { connectionId, method })
    if (typeof result.ticket !== 'string') throw new Error('invalid ticket')
    if (this.closed) { await this.mutation('cancel', result); throw new Error('disposed') }
    this.tickets.add(result.ticket)
    return result.ticket
  }
  async cancel(ticket) { this.tickets.delete(ticket); try { await this.mutation('cancel', { ticket }) } finally { await this.refresh() } }
  dispose() { this.closed = true; this.pending?.abort.abort(); this.pending = undefined; this.listeners.clear(); for (const ticket of this.tickets) void this.mutation('cancel', { ticket }).catch(() => {}); this.tickets.clear() }
}
