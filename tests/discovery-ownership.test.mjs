import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { compileOfficial, upstreamRoot } from '../scripts/upstream.mjs'

await mkdir('.cache', { recursive: true })
await writeFile('.cache/discovery-ownership-entry.ts', "export { discoverModels } from '../src/runtime/discovery.ts';\n")
await compileOfficial('.cache/discovery-ownership-entry.ts', '.cache/discovery-ownership-test.mjs')
const { discoverModels } = await import('../.cache/discovery-ownership-test.mjs')
const hostRoot = join(upstreamRoot, 'packages/llm/llm/src')
const hostSource = (await readFile(join(hostRoot, 'index.ts'), 'utf8')).replace(/^\s*@Remote(?:\([^\n]*\))?\s*\n/gm, '').replace(/from '\.\//g, `from '${hostRoot}/`)
await writeFile('.cache/discovery-host-llm.ts', hostSource)
await writeFile('.cache/discovery-host-entry.ts', `export { Context } from './upstream/vendor/cordis/src/index.ts';\nexport { LlmRuntime } from './discovery-host-llm.ts';\nexport { Config, apply } from '../src/runtime/index.ts';\n`)
await compileOfficial('.cache/discovery-host-entry.ts', '.cache/discovery-host-test.mjs')
const { Context, LlmRuntime, Config, apply } = await import('../.cache/discovery-host-test.mjs')
const draft = { provider: 'pi-c-test', baseURL: 'https://gateway.example/v1', api: 'openai-completions' }
const stored = overrides => ({ baseURL: draft.baseURL, api: draft.api, headers: { 'x-tenant-key': 'fixture-private-header' }, resolveApiKey: async () => 'fixture-saved-key', ...overrides })
function stubFetch(t, operation) {
  const original = globalThis.fetch
  globalThis.fetch = operation
  t.after(() => { globalThis.fetch = original })
}

test('saved discovery credentials cannot follow a draft endpoint or protocol change', async t => {
  let reads = 0, fetches = 0
  stubFetch(t, async () => { fetches++; return Response.json({ data: [] }) })
  for (const patch of [{ baseURL: 'https://untrusted.example/v1' }, { baseURL: 'https://gateway.example/other-tenant' }, { api: 'anthropic-messages' }]) {
    await assert.rejects(discoverModels({ ...draft, ...patch }, () => stored({ resolveApiKey: async () => { reads++; return 'fixture-saved-key' } })), error => error.code === 'DISCOVERY_CREDENTIAL_SCOPE')
  }
  assert.equal(reads, 0)
  assert.equal(fetches, 0)
})

test('matching saved transport inherits credentials and refuses redirects', async t => {
  let captured
  stubFetch(t, async (url, options) => {
    captured = { url, options }
    return Response.json({ data: [{ id: 'fixture-model' }] })
  })
  const result = await discoverModels({ ...draft, baseURL: `${draft.baseURL}/` }, () => stored())
  assert.equal(result[0].id, 'fixture-model')
  assert.equal(captured.url, `${draft.baseURL}/models`)
  assert.equal(captured.options.headers.get('authorization'), 'Bearer fixture-saved-key')
  assert.equal(captured.options.headers.get('x-tenant-key'), 'fixture-private-header')
  assert.equal(captured.options.redirect, 'error')
})

test('explicit draft key never inherits another transport secret headers', async t => {
  let reads = 0, captured
  stubFetch(t, async (_url, options) => { captured = options.headers; return Response.json({ data: [] }) })
  await discoverModels({ ...draft, baseURL: 'https://other.example/v1', apiKey: 'fixture-explicit-key' }, () => stored({ resolveApiKey: async () => { reads++; return 'fixture-saved-key' } }))
  assert.equal(reads, 0)
  assert.equal(captured.get('authorization'), 'Bearer fixture-explicit-key')
  assert.equal(captured.get('x-tenant-key'), null)
})

test('draft endpoint interrogation without a saved route remains available without inherited auth', async t => {
  let captured
  stubFetch(t, async (_url, options) => { captured = options.headers; return Response.json({ data: [{ id: 'fixture-public' }] }) })
  const result = await discoverModels({ baseURL: 'https://public.example/v1' })
  assert.equal(result[0].id, 'fixture-public')
  assert.equal(captured.get('authorization'), null)
})

test('discovery refuses a saved account changed during credential resolution or body reading', async t => {
  let current = true, fetches = 0
  stubFetch(t, async () => {
    fetches++
    return new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{"data":[]}')); current = false; controller.close() } }), { headers: { 'content-type': 'application/json' } })
  })
  await assert.rejects(discoverModels(draft, () => stored({ isCurrent: () => current, resolveApiKey: async () => { current = false; return 'fixture-saved-key' } })), error => error.code === 'DISCOVERY_CONNECTION_CHANGED')
  assert.equal(fetches, 0)
  current = true
  await assert.rejects(discoverModels(draft, () => stored({ isCurrent: () => current })), error => error.code === 'DISCOVERY_CONNECTION_CHANGED')
  assert.equal(fetches, 1)
})

test('discovery rejects secret-bearing endpoint URL before reading saved credentials or fetching', async t => {
  let reads = 0, fetches = 0
  stubFetch(t, async () => { fetches++; return Response.json({ data: [] }) })
  for (const baseURL of ['https://user:fixture-secret@gateway.example/v1', 'https://gateway.example/v1?key=fixture-secret', 'https://gateway.example/v1#fixture-secret', 'file:///private']) {
    await assert.rejects(discoverModels({ ...draft, baseURL }, () => stored({ resolveApiKey: async () => { reads++; return 'fixture-saved-key' } })), error => error.code === 'INVALID_DISCOVERY' && !error.message.includes('fixture-secret'))
  }
  assert.equal(reads, 0)
  assert.equal(fetches, 0)
})


test('actual Host discovery callback binds saved reference to transport and current connection', async t => {
  let reads = 0, duringRead
  const ctx = new Context()
  ctx.provide('credentials', { resolve: async () => { reads++; duringRead?.(); return { value: 'fixture-host-reference' } } })
  await ctx.plugin(child => { new LlmRuntime(child) })
  const connection = { integrationId: 'pi', serviceId: 'openai', routeId: 'pi-c-probe', displayName: 'probe', authMethod: 'api-key',
    credentialRecordId: 'c-probe', credentialGeneration: 0, credentialRef: 'SAVED_FIXTURE_KEY', enabled: true,
    profile: { baseURL: draft.baseURL, api: draft.api, models: [{ id: 'fixture-model' }] } }
  const config = Config({ connectionMigrationVersion: 1, connections: { 'c-probe': connection } })
  const fiber = ctx.plugin({ inject: ['llm'], apply: child => { apply(child, config) } })
  await fiber.await()
  let fetches = 0
  stubFetch(t, async () => { fetches++; return Response.json({ data: [] }) })
  const probe = { ...draft, provider: connection.routeId }
  try {
    await assert.rejects(ctx.llm.discoverModels('dsh-pi-login', { ...probe, baseURL: 'https://untrusted.example/v1' }), error => error.code === 'DISCOVERY_CREDENTIAL_SCOPE')
    assert.equal(reads, 0)
    await ctx.llm.discoverModels('dsh-pi-login', probe)
    assert.equal(reads, 1)
    assert.equal(fetches, 1)
    duringRead = () => { config.connections[Symbol.for('cosmokit.volatile.write')]({ 'c-probe': { ...connection, credentialGeneration: 1 } }) }
    await assert.rejects(ctx.llm.discoverModels('dsh-pi-login', probe), error => error.code === 'DISCOVERY_CONNECTION_CHANGED')
    assert.equal(fetches, 1, 'changed account is refused before network')
  } finally { await fiber.dispose(); await ctx.fiber.dispose() }
})
