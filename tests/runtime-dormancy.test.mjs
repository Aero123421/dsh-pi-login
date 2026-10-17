import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { compileOfficial, upstreamRoot, ensureUpstream } from '../scripts/upstream.mjs'

await ensureUpstream()
await mkdir('.cache', { recursive: true })
const llmRoot = join(upstreamRoot, 'packages/llm/llm/src')
// Run the actual pinned LlmRuntime registry implementation and real Cordis
// effects. Only RPC decorators are removed: these tests need no generated
// gateway, and all registration validation/replacement bodies stay untouched.
const runtime = (await readFile(join(llmRoot, 'index.ts'), 'utf8'))
  .replace(/^\s*@Remote(?:\([^\n]*\))?\s*\n/gm, '')
  .replace(/from '\.\//g, `from '${llmRoot}/`)
await writeFile('.cache/official-dormancy-llm.ts', runtime)
await writeFile('.cache/runtime-dormancy-entry.ts', `
export { Context } from './upstream/vendor/cordis/src/index.ts';
export { LlmRuntime } from './official-dormancy-llm.ts';
export { Config, apply } from '../src/runtime/index.ts';
export { catalogModels } from '../src/runtime/catalog.ts';
export { OpenAIChatGPTCatalogSession } from '../src/openai-chatgpt-catalog.mjs';
`)
await compileOfficial('.cache/runtime-dormancy-entry.ts', '.cache/runtime-dormancy-test.mjs')
const { Context, LlmRuntime, Config, apply, catalogModels, OpenAIChatGPTCatalogSession } = await import('../.cache/runtime-dormancy-test.mjs')

const connection = id => ({ integrationId: 'pi', serviceId: 'openai', routeId: `pi-${id}`, displayName: id,
  authMethod: 'api-key', credentialRecordId: id, credentialGeneration: 0, enabled: true, profile: {} })

test('actual Host registry stays dormant after empty migration and supports create, delete-all, and recreate', async () => {
  const ctx = new Context()
  await ctx.plugin(context => { new LlmRuntime(context) })
  const config = Config({ connectionMigrationVersion: 1, connections: {} })
  const catalogLookups = []
  const fiber = ctx.plugin({ inject: ['llm'], apply: context => { apply(context, config, {
    catalog: (_service, id) => {
      if (!Object.hasOwn(config.connections.get(), id)) throw new Error('Draft connection is not committed yet')
      catalogLookups.push(id)
      return undefined
    },
    revision: () => 0,
    authorizeModel: async () => undefined,
    onLogin: () => {},
  }) } })
  try {
    await fiber.await()
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [])
    assert.deepEqual(ctx.llm.listProviders(), [])
    // Exercise the same pre-commit config waterfall as real ConfigEditor:
    // a candidate id must never be sent to a live manager.lookup callback.
    const validate = entries => {
      const candidate = { connectionMigrationVersion: 1, connections: entries }
      return ctx.waterfall(fiber, 'internal/config', candidate, () => candidate)
    }
    assert.doesNotThrow(() => validate({ a: connection('a') }))
    assert.deepEqual(catalogLookups, [])
    const set = entries => {
      config.connections[Symbol.for('cosmokit.volatile.write')](entries)
      ctx.emit('settings/document-updated', 'dsh-pi-login')
    }
    set({ a: connection('a') })
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [], 'Connection-owned profiles have no native Edit/Delete surface')
    assert.deepEqual(ctx.llm.listProviders().map(entry => entry.id), ['pi-a'])
    catalogLookups.length = 0
    assert.doesNotThrow(() => validate({ a: { ...connection('a'), credentialGeneration: 1 } }))
    assert.doesNotThrow(() => validate({ a: { ...connection('a'), profile: { baseURL: 'https://gateway.example/v1' } } }))
    assert.deepEqual(catalogLookups, [])
    set({})
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [])
    assert.deepEqual(ctx.llm.listProviders(), [])
    set({ b: connection('b') })
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [])
    assert.deepEqual(ctx.llm.listProviders().map(entry => entry.id), ['pi-b'])
    await fiber.dispose()
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [])
    assert.deepEqual(ctx.llm.listProviders(), [])
  } finally { await ctx.fiber.dispose() }
})

test('actual Host rejects empty initial registrations but permits atomic empty replacement', async () => {
  const ctx = new Context()
  await ctx.plugin(context => { new LlmRuntime(context) })
  try {
    assert.throws(() => ctx.llm.registerConfigurableProviders([]), error => error.code === 'INVALID_DIRECTORY')
    const entry = { provider: 'fixture', displayName: 'Fixture', settingsNs: 'fixture', settingsPath: ['connections', 'fixture'], declared: true }
    const handle = ctx.llm.registerConfigurableProviders([entry])
    handle.replace([])
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [])
    handle.replace([entry])
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [entry])
    handle()
    assert.deepEqual(ctx.llm.listConfigurableProviders(), [])
  } finally { await ctx.fiber.dispose() }
})


test('actual Host starts a saved SIWC connection with overrides and publishes its automatically restored account catalog', async () => {
  const ctx = new Context()
  await ctx.plugin(context => { new LlmRuntime(context) })
  const saved = { ...connection('saved-siwc'), authMethod: 'oauth', profile: { modelOverrides: { 'gpt-6.1-sol': { contextWindow: 272000 } } } }
  const config = Config({ connectionMigrationVersion: 1, connections: { saved } })
  const session = new OpenAIChatGPTCatalogSession({
    credentials: { read: async () => ({ type: 'oauth', access: 'fixture-access', refresh: 'fixture-refresh', expires: Date.now() + 3600000 }) },
    profile: () => saved.profile, baseline: catalogModels,
    fetch: async () => Response.json({ models: [{ slug: 'gpt-6.1-sol', display_name: 'Account Sol', visibility: 'list' }] }),
    onChange: () => ctx.emit('dsh-pi-login/catalog-updated'),
  })
  const fiber = ctx.plugin({ inject: ['llm'], apply: context => { apply(context, config, {
    catalog: service => session.catalog(service), revision: () => session.version,
    authorizeModel: async () => undefined, onLogin: () => {},
  }) } })
  try {
    await fiber.await()
    if (session.autoPending) await session.autoPending
    assert.deepEqual(ctx.llm.listProviders().map(provider => provider.id), ['pi-saved-siwc'])
    const restored = await ctx.llm.listModels('pi-saved-siwc')
    assert.deepEqual(restored.map(model => model.id), ['gpt-6.1-sol'])
    assert.equal(restored[0].name, 'Account Sol')
    assert.equal(config.connections.get().saved.profile.modelOverrides['gpt-6.1-sol'].contextWindow, 272000)
  } finally { session.dispose(); await ctx.fiber.dispose() }
})
