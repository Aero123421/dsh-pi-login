import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { mock } from 'node:test'
import { parse } from 'yaml'
import { getBuiltinModels, getBuiltinProviders } from '@earendil-works/pi-ai/providers/all'
import { PiLoginBroker } from '../src/broker.mjs'
const { Context, AuthorizationService, MemoryCredentials, HostConnectionService, PiPlugin, applyEntryPatches } = await import('../.cache/official-host.mjs')

// Exercise the real composition patch: one active Pi implementation and an
// unchanged built-in profile to restore when the bundle is removed.
const original = [{ id: 'llm-pi-ai', name: '@deepseek-ai/dsh-llm-pi-ai', config: { providers: { deepseek: {} } } }]
const patches = parse(await readFile('cordis.patch.yml', 'utf8'))
const warnings = []
const composed = applyEntryPatches(original, patches, (...args) => warnings.push(args))
assert.deepEqual(warnings, [])
assert.equal(composed.find(entry => entry.id === 'llm-pi-ai').disabled, true)
assert.equal(composed.filter(entry => !entry.disabled).length, 1)
assert.equal(composed.find(entry => !entry.disabled).name, '@local/dsh-pi-login')
assert.equal(original[0].disabled, undefined)

const requests = []
const server = createServer(async (request, response) => {
  const chunks = []; for await (const chunk of request) chunks.push(chunk)
  requests.push({ body: JSON.parse(Buffer.concat(chunks)), headers: request.headers })
  response.writeHead(200, { 'content-type': 'text/event-stream' })
  for (const event of [
    { choices: [{ delta: { role: 'assistant', content: '' }, index: 0, finish_reason: null }] },
    { choices: [{ delta: { content: 'hello' }, index: 0, finish_reason: null }] },
    { choices: [{ delta: {}, index: 0, finish_reason: 'stop' }], usage: { prompt_tokens: 3, completion_tokens: 1 } },
  ]) response.write(`data: ${JSON.stringify(event)}\n\n`)
  response.end('data: [DONE]\n\n')
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const baseURL = `http://127.0.0.1:${server.address().port}`
const ctx = new Context()
await ctx.plugin(MemoryCredentials); await ctx.plugin(AuthorizationService)
await ctx.plugin(pluginCtx => { new HostConnectionService(pluginCtx, [], { isAuthenticated: () => true }) })
const sdkModels = getBuiltinModels('deepseek')
const legacy = { deepseek: { baseURL, headers: { 'X-Deployment': 'preserved' }, modelOverrides: {} } }
let config = PiPlugin.Config({})
let revision = 0, active = [], adapter, directory = [], replacements = 0
const volatileWrite = Symbol.for('cosmokit.volatile.write')
ctx.provide('configEditor', { entries: () => [{ options: { id: 'llm-pi-ai', config: { providers: legacy } } }] })
// These two doubles are the Host registration and persistence seats. Cordis,
// schema, authorization, credentials, adapter conversion, and Pi are real.
ctx.provide('settings', {
  configure: (_options, fiber) => { config = fiber.config; return () => {} },
  describe: () => [{ ns: 'dsh-pi-login', revision, value: { providers: config.providers.get(), legacyImported: config.legacyImported.get() } }],
  update: async (ns, patch, expected) => {
    assert.equal(ns, 'dsh-pi-login'); assert.equal(expected, revision)
    const providers = structuredClone(config.providers.get())
    for (const [id, changes] of Object.entries(patch.providers ?? {})) providers[id] = { ...providers[id], ...changes }
    const next = PiPlugin.Config({ providers, legacyImported: patch.legacyImported ?? config.legacyImported.get() })
    config.providers[volatileWrite](next.providers.get()); config.legacyImported[volatileWrite](next.legacyImported.get()); revision++
    ctx.emit('settings/document-updated', ns, revision)
  },
})
ctx.provide('llm', {
  registerConfigurableProviders: entries => { directory = entries; return { replace: entries => { directory = entries } } },
  registerModelDiscovery: () => () => {},
  registerAdapter: (providers, instance) => { active = providers; adapter = instance; return { replace: providers => { active = providers; replacements++ } } },
})
const plugin = ctx.plugin(PiPlugin, {}); await plugin.await(); config = plugin.config
const pause = () => new Promise(resolve => setImmediate(resolve))
await pause(); await pause()
try {
  assert.equal(config.legacyImported.get(), true)
  assert.equal(config.providers.get().deepseek.headers['X-Deployment'], 'preserved')
  assert.ok(directory.length >= getBuiltinProviders().length - 3)
  assert.ok(directory.every(entry => entry.settingsNs === 'dsh-pi-login'))
  for (const id of getBuiltinProviders()) {
    if (!getBuiltinModels(id).length) continue
    const profile=PiPlugin.resolveProfiles({[id]:{}},'strict').get(id)
    assert.equal(profile.piProvider.getModels().length,getBuiltinModels(id).length,id)
  }
  assert.deepEqual(active, ['deepseek'])
  assert.deepEqual((await adapter.listModels('deepseek')).map(model => model.id), sdkModels.map(model => model.id))
  assert.ok(ctx.authorization.describe('llm-pi-ai/openai').methods.some(method => method.id === 'oauth'))

  // The SDK itself asks for and stores an API key through the official seam.
  await ctx.authorization.begin({ key: 'llm-pi-ai/deepseek', method: 'api-key', interaction: { notify: () => {}, prompt: async () => 'runtime-fixture-key' } })
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/deepseek')).kind, 'api-key')
  const result = []
  for await (const chunk of adapter.stream({ provider: 'deepseek', model: sdkModels[0].id, messages: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }] })) result.push(chunk)
  assert.equal(result.filter(chunk => chunk.type === 'text-delta').map(chunk => chunk.text).join(''), 'hello')
  assert.equal(requests[0].headers.authorization, 'Bearer runtime-fixture-key')
  assert.equal(requests[0].headers['x-deployment'], 'preserved')

  await ctx.settings.update('dsh-pi-login', { providers: { deepseek: { disabledModels: [sdkModels[0].id] } } }, revision)
  assert.ok(!(await adapter.listModels('deepseek')).some(model => model.id === sdkModels[0].id))
  await assert.rejects(adapter.resolveModel('deepseek', sdkModels[0].id))
  await ctx.settings.update('dsh-pi-login', { providers: { deepseek: { enabled: false } } }, revision)
  assert.deepEqual(active, [])
  assert.equal((await ctx.credentials.readRecord('llm-pi-ai/deepseek')).kind, 'api-key')
  await ctx.settings.update('dsh-pi-login', { providers: { deepseek: { enabled: true, disabledModels: [] } } }, revision)
  assert.deepEqual(active, ['deepseek'])
  assert.equal((await adapter.listModels('deepseek')).length, sdkModels.length)
  assert.ok(replacements >= 3)
  assert.deepEqual(legacy.deepseek, { baseURL, headers: { 'X-Deployment': 'preserved' }, modelOverrides: {} })

  // Use the SDK's Models.login and the registered adapter flow. Only the
  // provider's network operation is replaced; expiry must cross Authorization.
  const oauth = PiPlugin.resolveProfiles({openai:{}}, 'strict').get('openai').piProvider.auth.oauth
  const originalLogin = oauth.login
  const broker = new PiLoginBroker(ctx.authorization, ctx.credentials, ctx.settings)
  mock.timers.enable({apis:['setTimeout']})
  try {
    oauth.login = async interaction => {
      interaction.notify({type:'device_code', verificationUri:'https://accounts.example/device', userCode:'RUNTIME-CODE', intervalSeconds:5, expiresInSeconds:900})
      await interaction.prompt({type:'text', message:'Approve device'})
      return {type:'oauth', access:'runtime-device-access', refresh:'runtime-device-refresh', expires:Date.now()+3600000}
    }
    const {ticket} = broker.start('llm-pi-ai/openai', 'oauth')
    await pause(); await pause()
    assert.equal(broker.snapshot(ticket).notice.code, 'RUNTIME-CODE')
    assert.equal('expiresInSeconds' in broker.snapshot(ticket).notice, false)
    mock.timers.tick(10*60*1000); await pause()
    assert.equal(broker.snapshot(ticket).status, 'running')
    mock.timers.tick(4*60*1000+59*1000)
    broker.answer(ticket, broker.snapshot(ticket).prompt.id, 'approved')
    await broker.attempt(ticket).done
    assert.deepEqual(broker.snapshot(ticket), {status:'authorized'})
    assert.equal((await ctx.credentials.readRecord('llm-pi-ai/openai')).kind, 'grant')
  } finally {
    oauth.login = originalLogin
    await broker.dispose()
    mock.timers.reset()
  }
  console.log(`Independent Pi SDK: ${directory.length} providers, SDK catalog, API-key login, device-code expiry relay, streamed response, model/provider toggles, preserved credentials and legacy settings passed`)
} finally { await plugin.dispose(); await ctx.fiber.dispose(); await new Promise(resolve => server.close(resolve)) }
