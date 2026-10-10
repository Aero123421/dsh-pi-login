const INITIAL = Object.freeze({ status: 'idle', entries: [], error: false })

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
    if (this.pending) return this.pending
    this.publish({ ...this.state, status: 'loading', error: false })
    this.pending = this.call('list').then(entries => this.publish({ status: 'ready', entries, error: false }), () => this.publish({ ...this.state, status: 'ready', error: true })).finally(() => { this.pending = undefined })
    return this.pending
  }
  async start(key, method) {
    const result = await this.call('start', { key, method })
    if (typeof result.ticket !== 'string') throw new Error('invalid ticket')
    if (this.closed) { await this.call('cancel', result); throw new Error('disposed') }
    this.tickets.add(result.ticket)
    return result.ticket
  }
  async cancel(ticket) { this.tickets.delete(ticket); try { await this.call('cancel', { ticket }) } finally { await this.load() } }
  dispose() { this.closed = true; this.listeners.clear(); for (const ticket of this.tickets) void this.call('cancel', { ticket }).catch(() => {}); this.tickets.clear() }
}
