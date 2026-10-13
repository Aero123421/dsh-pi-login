/** Fixed public codes: errors never retain remote bodies, tokens, or SDK messages. */
export class ProviderReadError extends Error {
  constructor(code = 'error', retryAfterMs) {
    super(['auth-required', 'unsupported', 'rate-limited', 'error', 'aborted', 'account-changed'].includes(code) ? code : 'error')
    this.code = this.message
    if (Number.isFinite(retryAfterMs) && retryAfterMs >= 0) this.retryAfterMs = retryAfterMs
  }
}

export function retryAfterMilliseconds(value, now = Date.now()) {
  if (typeof value !== 'string' || !value.trim()) return undefined
  if (/^\d+(?:\.\d+)?$/.test(value.trim())) return Number(value) * 1000
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? Math.max(0, parsed - now) : undefined
}

/** One scope, one complete value. No polling and no credential storage. */
export class ProviderCache {
  constructor({ ttl = 300000, maxStale = 3600000, timeout = 20000, now = Date.now } = {}) {
    this.ttl = ttl; this.maxStale = maxStale; this.timeout = timeout; this.now = now
    this.epoch = 0; this.failures = 0; this.closed = false
  }
  peek() {
    const age = this.value === undefined ? Infinity : this.now() - this.observedAt
    return {
      value: age <= this.maxStale ? this.value : undefined,
      fresh: age < this.ttl, stale: age >= this.ttl,
      observedAt: this.observedAt, checkedAt: this.checkedAt,
      retryAt: this.retryAt > this.now() ? this.retryAt : undefined,
      error: this.error,
    }
  }
  get(load, { force = false, signal } = {}) {
    if (this.closed || signal?.aborted) return Promise.reject(new ProviderReadError('aborted'))
    if (this.pending) return this.consume(this.pending, signal)
    if (this.retryAt > this.now()) return Promise.reject(new ProviderReadError('rate-limited', this.retryAt - this.now()))
    const cached = this.peek()
    if (!force && cached.fresh && cached.value !== undefined) return Promise.resolve(cached.value)
    const controller = new AbortController(), epoch = this.epoch
    const operation = { controller, consumers: new Set() }
    operation.promise = Promise.resolve().then(async () => {
      const deadline = AbortSignal.timeout(this.timeout)
      const requestSignal = AbortSignal.any([controller.signal, deadline])
      // Racing also bounds providers/credential resolvers that ignore the signal.
      let onAbort
      const cancelled = new Promise((_, reject) => {
        onAbort = () => reject(new ProviderReadError(controller.signal.aborted ? 'aborted' : 'error'))
        requestSignal.addEventListener('abort', onAbort, { once: true })
      })
      try {
        const value = await Promise.race([Promise.resolve().then(() => load(requestSignal)), cancelled])
        if (requestSignal.aborted || this.epoch !== epoch || this.closed) throw new ProviderReadError('aborted')
        this.value = value; this.observedAt = this.now(); this.checkedAt = this.observedAt
        this.error = undefined; this.retryAt = undefined; this.failures = 0
        return value
      } catch (error) {
        const safe = error instanceof ProviderReadError ? error : new ProviderReadError('error')
        if (this.epoch === epoch && !this.closed && safe.code !== 'aborted') {
          this.checkedAt = this.now(); this.error = safe.code
          if (safe.code === 'rate-limited') {
            this.failures++
            this.retryAt = this.now() + (safe.retryAfterMs ?? Math.min(60000 * 2 ** (this.failures - 1), 3600000))
          }
          if (safe.code === 'auth-required' || safe.code === 'account-changed') this.value = undefined
        }
        throw safe
      } finally {
        requestSignal.removeEventListener('abort', onAbort)
      }
    }).finally(() => {
      if (this.pending === operation) this.pending = undefined
    })
    this.pending = operation
    return this.consume(operation, signal)
  }
  consume(operation, signal) {
    const consumer = {}
    operation.consumers.add(consumer)
    if (!signal) {
      // Uncancellable consumers retain the shared operation until completion.
      operation.promise.then(() => operation.consumers.delete(consumer), () => operation.consumers.delete(consumer))
      return operation.promise
    }
    return new Promise((resolve, reject) => {
      const finish = () => { signal.removeEventListener('abort', abort); operation.consumers.delete(consumer) }
      const abort = () => {
        finish(); reject(new ProviderReadError('aborted'))
        if (operation.consumers.size === 0) operation.controller.abort()
      }
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted) return abort()
      operation.promise.then(value => { finish(); resolve(value) }, error => { finish(); reject(error) })
    })
  }
  invalidate() {
    this.epoch++; this.pending?.controller.abort(); this.pending = undefined
    this.value = undefined; this.observedAt = undefined; this.checkedAt = undefined
    this.error = undefined; this.retryAt = undefined; this.failures = 0
  }
  dispose() { this.closed = true; this.invalidate() }
}
