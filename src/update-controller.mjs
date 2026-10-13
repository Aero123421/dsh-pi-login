const STORAGE = 'dsh-pi-login:update'
export class UpdateController {
  constructor(connection, storage) {
    if (storage === undefined) { try { storage = globalThis.sessionStorage } catch {} }
    this.connection = connection; this.storage = storage; this.listeners = new Set()
    this.state = { status: 'idle' }; this.generation = 0; this.closed = false; this.timer = null
    try { this.requestId = storage?.getItem(STORAGE) || undefined } catch {}
  }
  getSnapshot = () => this.state
  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  publish(state) { if (this.closed) return; this.state = state; for (const listener of this.listeners) listener() }
  async call(method, payload = {}) {
    const result = await this.connection.rpc.call('/api', `dsh-pi-login/update-${method}`, payload)
    if (!result.ok) { const error = new Error(result.error.code); error.rejected = true; throw error }
    return result.value
  }
  async load() {
    if (this.closed) return
    const generation = ++this.generation
    clearTimeout(this.timer)
    try {
      const state = await this.call(this.requestId ? 'reconcile' : 'status', this.requestId ? { requestId: this.requestId } : {})
      if (this.closed || generation !== this.generation) return
      if (state.requestId) { this.requestId = state.requestId; try { this.storage?.setItem(STORAGE, state.requestId) } catch {} }
      this.publish(state)
      if (['preparing', 'installing'].includes(state.status)) this.timer = setTimeout(() => { void this.load() }, 800)
    } catch { if (generation === this.generation) this.publish({ ...this.state, status: this.requestId ? 'unknown' : 'blocked', reason: 'network' }) }
  }
  async check() {
    if (this.closed || ['checking', 'preparing', 'installing', 'starting', 'unknown'].includes(this.state.status)) return
    const generation = ++this.generation
    this.publish({ ...this.state, status: 'checking' })
    try {
      const state = await this.call('check')
      if (generation === this.generation) this.publish(state)
    } catch { if (generation === this.generation) this.publish({ ...this.state, status: 'blocked', reason: 'network' }) }
  }
  async begin() {
    if (this.closed || this.state.status !== 'available') return
    const candidate = this.state.candidate, generation = ++this.generation
    this.requestId = crypto.randomUUID()
    try { this.storage?.setItem(STORAGE, this.requestId) } catch {}
    this.publish({ ...this.state, status: 'starting' })
    try {
      const state = await this.call('begin', { candidateId: candidate.id, requestId: this.requestId })
      if (typeof state.requestId !== 'string') throw new Error('invalid request')
      this.requestId = state.requestId
      try { this.storage?.setItem(STORAGE, state.requestId) } catch {}
      if (generation === this.generation) { this.publish({ ...this.state, ...state }); await this.load() }
    } catch (error) { if (generation === this.generation) this.publish({ ...this.state, status: error.rejected ? 'failed' : 'unknown', reason: error.message.endsWith('/busy') ? 'busy' : 'network' }) }
  }
  dispose() { this.closed = true; this.generation++; clearTimeout(this.timer); this.listeners.clear() }
}
