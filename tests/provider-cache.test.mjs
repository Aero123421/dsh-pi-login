import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ProviderCache, ProviderReadError, retryAfterMilliseconds } from '../src/provider-cache.mjs'

const at = Date.parse('2026-10-13T12:00:00Z')

test('completed TTL and ten concurrent consumers share one complete read', async t => {
  let now = at, calls = 0, release
  const cache = new ProviderCache({ now: () => now, ttl: 100, maxStale: 1000 })
  t.after(() => cache.dispose())
  const load = async () => { calls++; await new Promise(resolve => { release = resolve }); return { used: 70 } }
  const checks = Array.from({ length: 10 }, () => cache.get(load))
  await new Promise(resolve => setImmediate(resolve)); release()
  for (const value of await Promise.all(checks)) assert.equal(value.used, 70)
  assert.equal(calls, 1)
  await cache.get(() => { throw Error('must use completed cache') })
  now += 101
  assert.equal(cache.peek().stale, true)
  assert.equal(cache.peek().value.used, 70)
  now += 1000
  assert.equal(cache.peek().value, undefined)
})

test('Retry-After seconds and HTTP dates gate even force refresh, independently per scope', async t => {
  let now = at, calls = 0
  const cache = new ProviderCache({ now: () => now }), other = new ProviderCache({ now: () => now })
  t.after(() => { cache.dispose(); other.dispose() })
  const limited = () => { calls++; throw new ProviderReadError('rate-limited', 120000) }
  await assert.rejects(cache.get(limited), /rate-limited/)
  await assert.rejects(cache.get(limited, { force: true }), /rate-limited/)
  assert.equal(calls, 1)
  assert.equal(cache.peek().retryAt, at + 120000)
  assert.equal(await other.get(() => 5), 5)
  now += 120000
  assert.equal(await cache.get(() => 7, { force: true }), 7)
  assert.equal(cache.peek().retryAt, undefined)
  assert.equal(retryAfterMilliseconds('120', at), 120000)
  assert.equal(retryAfterMilliseconds('Tue, 13 Oct 2026 12:02:00 GMT', at), 120000)
  assert.equal(retryAfterMilliseconds('nonsense', at), undefined)
})

test('aborting one consumer retains another; aborting the final consumer cancels shared HTTP', async t => {
  const cache = new ProviderCache()
  t.after(() => cache.dispose())
  let release, sharedSignal
  const first = new AbortController(), second = new AbortController()
  const load = signal => { sharedSignal = signal; return new Promise(resolve => { release = resolve }) }
  const a = cache.get(load, { signal: first.signal }), b = cache.get(load, { signal: second.signal })
  await new Promise(resolve => setImmediate(resolve))
  first.abort()
  await assert.rejects(a, /aborted/)
  assert.equal(sharedSignal.aborted, false)
  release(42)
  assert.equal(await b, 42)
  const final = new AbortController()
  const pending = cache.get(load, { force: true, signal: final.signal })
  await new Promise(resolve => setImmediate(resolve)); final.abort()
  await assert.rejects(pending, /aborted/)
  assert.equal(sharedSignal.aborted, true)
  release(99)
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(cache.peek().value, 42)
})

test('invalidation and disposal reject late uncooperative providers without publishing old data', async () => {
  const cache = new ProviderCache()
  let release
  const pending = cache.get(() => new Promise(resolve => { release = resolve }))
  await new Promise(resolve => setImmediate(resolve))
  cache.invalidate(); release('old-account')
  await assert.rejects(pending, /aborted/)
  assert.equal(cache.peek().value, undefined)
  assert.equal(await cache.get(() => 'new-account'), 'new-account')
  cache.dispose()
  await assert.rejects(cache.get(() => 'wrong'), /aborted/)
})

test('a timeout covers slow resolution and body work; provider error text is never forwarded', async t => {
  const cache = new ProviderCache({ timeout: 15 })
  t.after(() => cache.dispose())
  const keepAlive = setTimeout(() => {}, 50)
  t.after(() => clearTimeout(keepAlive))
  await assert.rejects(cache.get(() => new Promise(() => {})), error => error.code === 'error' && error.message === 'error')
  assert.equal(cache.peek().error, 'error')
  await assert.rejects(cache.get(() => { throw Error('SECRET SDK response') }, { force: true }), error => error.message === 'error')
})
