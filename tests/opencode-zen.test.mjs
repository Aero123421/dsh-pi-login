import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { catalogModels } from '../src/runtime/catalog.ts'
import { listPiServices } from '../src/runtime/provider.ts'
import { ConnectionManager } from '../src/connections.mjs'
import { IntegrationRegistry } from '../src/registry.mjs'
import { compileOfficial } from '../scripts/upstream.mjs'

await mkdir('.cache', { recursive: true })
await writeFile('.cache/opencode-zen-entry.ts', `export { resolveConnectionProfiles } from '../src/runtime/connections.ts';\n`)
await compileOfficial('.cache/opencode-zen-entry.ts', '.cache/opencode-zen-test.mjs')
const { resolveConnectionProfiles } = await import('../.cache/opencode-zen-test.mjs')

const ZEN_URL = 'https://opencode.ai/inference/v1'
const GO_URL = 'https://opencode.ai/inference/go/v1'
const FREE_ID = 'deepseek-v4.1-flash-free'
const GO_FLASH_ID = 'deepseek-v4.1-flash'

function connection(id, serviceId) {
  return {
    integrationId: 'pi', serviceId, routeId: `pi-${id}`, displayName: serviceId,
    authMethod: 'api-key', credentialRecordId: id, credentialGeneration: 0, enabled: true, profile: {},
  }
}

function completion(text) {
  return [
    { choices: [{ delta: { role: 'assistant', content: '' }, index: 0, finish_reason: null }] },
    { choices: [{ delta: { content: text }, index: 0, finish_reason: null }] },
    { choices: [{ delta: {}, index: 0, finish_reason: 'stop' }], usage: { prompt_tokens: 3, completion_tokens: 1 } },
  ].map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n'
}

async function capture(provider, model, apiKey, sessionId) {
  const seen = []
  const events = provider.streamSimple(model, { messages: [{ role: 'user', content: 'ping', timestamp: 0 }] }, {
    apiKey, maxRetries: 0, maxTokens: 16, ...sessionId === undefined ? {} : { sessionId },
    fetch: async (url, init) => {
      const headers = new Headers(init?.headers)
      seen.push({
        url: String(url),
        authorization: headers.get('authorization'),
        session: headers.get('x-opencode-session'),
        model: JSON.parse(init.body).model,
      })
      return new Response(completion('pong'), { headers: { 'content-type': 'text/event-stream' } })
    },
  })
  const text = []
  for await (const event of events) if (event.type === 'text_delta') text.push(event.delta)
  return { seen, text: text.join('') }
}

test('OpenCode Zen and Go are API-key services, and the free model uses the inference URL', async () => {
  const services = listPiServices()
  const byId = new Map(services.map(service => [service.serviceId, service]))
  for (const id of ['openai', 'openai-codex', 'deepseek', 'anthropic', 'github-copilot', 'meta']) {
    assert.ok(byId.has(id), id)
  }
  assert.ok(byId.get('openai').methods.some(method => method.id === 'oauth'))
  assert.ok(byId.get('openai').methods.some(method => method.id === 'api-key'))
  assert.ok(byId.get('openai-codex').methods.some(method => method.id === 'oauth'))
  assert.equal(byId.get('meta').label, 'Meta Model API（Pi経由）')
  assert.equal(byId.get('opencode-go').capabilities.usage, true)
  assert.equal(byId.get('anthropic').capabilities.usage, true)

  const zen = byId.get('opencode')
  const go = byId.get('opencode-go')
  assert.equal(zen.label, 'OpenCode Zen')
  assert.deepEqual(zen.methods.map(method => method.id), ['api-key'])
  assert.equal(zen.capabilities.auth, true)
  assert.equal(zen.capabilities.settings, true)
  assert.equal(zen.capabilities.usage, false)
  assert.equal(go.label, 'OpenCode Go')
  assert.deepEqual(go.methods.map(method => method.id), ['api-key'])
  assert.equal(go.capabilities.usage, true)

  const installed = catalogModels('opencode')
  const free = installed.get(FREE_ID)
  assert.equal(free.baseUrl, ZEN_URL)
  assert.equal(free.api, 'openai-completions')
  assert.ok(!free.baseUrl.includes('/zen/'))
  const freeIds = [...installed.values()].filter(model => model.id.endsWith('-free') || model.cost.input === 0 && model.cost.output === 0).map(model => model.id)
  assert.ok(freeIds.includes(FREE_ID))
  assert.ok(freeIds.includes('big-pickle'))
  for (const model of installed.values()) {
    if (!freeIds.includes(model.id)) continue
    assert.equal(model.baseUrl, ZEN_URL, model.id)
  }

  const goModels = catalogModels('opencode-go')
  assert.equal(goModels.has(FREE_ID), false)
  const flash = goModels.get(GO_FLASH_ID)
  assert.equal(flash.baseUrl, GO_URL)
  assert.ok(flash.cost.input > 0)
  assert.ok(flash.cost.output > 0)

  const routes = resolveConnectionProfiles({
    'c-zen': connection('c-zen', 'opencode'),
    'c-go': connection('c-go', 'opencode-go'),
  })
  const zenChoice = routes.get('pi-c-zen').modelChoices.find(choice => choice.id === FREE_ID)
  const goChoice = routes.get('pi-c-go').modelChoices.find(choice => choice.id === GO_FLASH_ID)
  assert.equal(zenChoice.enabled, true)
  assert.equal(zenChoice.model.baseUrl, ZEN_URL)
  assert.equal(routes.get('pi-c-go').modelChoices.some(choice => choice.id === FREE_ID), false)
  assert.equal(goChoice.model.baseUrl, GO_URL)
  assert.ok(routes.get('pi-c-zen').piProvider.getModels().some(model => model.id === FREE_ID))

  const zenProvider = routes.get('pi-c-zen').piProvider
  const goProvider = routes.get('pi-c-go').piProvider
  const zenCall = await capture(zenProvider, zenChoice.model, 'fixture-zen-key', 'fixture-session')
  assert.deepEqual(zenCall.seen, [{
    url: `${ZEN_URL}/chat/completions`, authorization: 'Bearer fixture-zen-key', session: 'fixture-session', model: FREE_ID,
  }])
  assert.equal(zenCall.text, 'pong')
  const goBare = await capture(goProvider, goChoice.model, 'fixture-go-key')
  assert.equal(goBare.seen[0].session, null)
  const goCall = await capture(goProvider, goChoice.model, 'fixture-go-key', 'fixture-session')
  assert.deepEqual(goCall.seen, [{
    url: `${GO_URL}/chat/completions`, authorization: 'Bearer fixture-go-key', session: 'fixture-session', model: GO_FLASH_ID,
  }])
  assert.equal(goCall.text, 'pong')
})

test('an OpenCode API key can be saved on a Zen connection without being published', async () => {
  let revision = 0
  let current = { connections: {}, providers: {}, connectionMigrationVersion: 1, trustedEndpointOrigins: [] }
  const records = new Map()
  const settings = {
    describe: () => [{ ns: 'dsh-pi-login', revision, writable: true, value: structuredClone(current) }],
    async mutate(_ns, operations, expected) {
      assert.equal(expected, revision)
      const next = structuredClone(current)
      for (const operation of operations) next[operation.path[0]] = structuredClone(operation.value)
      current = next
      revision++
    },
  }
  const credentials = {
    listRecords: async () => [...records].map(([key, record]) => ({ key, kind: record.kind })),
    readRecord: async key => structuredClone(records.get(key)),
    describeRecord: async key => ({ configured: records.has(key), writable: true }),
    async modifyRecord(key, mutate) {
      const next = await mutate(structuredClone(records.get(key)))
      records.set(key, structuredClone(next))
      return structuredClone(next)
    },
    deleteRecord: async key => { records.delete(key) },
  }
  const registry = new IntegrationRegistry('profile-zen')
  registry.register({
    integrationId: 'pi', label: 'Pi', source: '@earendil-works/pi-ai',
    listServices: () => listPiServices(), listConnections: () => [],
  })
  const manager = new ConnectionManager({
    settings, credentials, registry,
    validateProfile: entry => resolveConnectionProfiles({ check: entry }),
  })
  const listed = await manager.list()
  assert.equal(listed.services.find(service => service.serviceId === 'opencode').label, 'OpenCode Zen')
  assert.equal(listed.services.find(service => service.serviceId === 'opencode-go').label, 'OpenCode Go')
  const { connectionId } = await manager.create({
    integrationId: 'pi', serviceId: 'opencode', authMethod: 'api-key', displayName: 'Zen', apiKey: 'fixture-zen-secret',
  }, revision)
  const view = await manager.list()
  const entry = view.connections.find(row => row.connectionId === connectionId)
  assert.equal(entry.authMethod, 'api-key')
  assert.equal(entry.configured, true)
  assert.equal(entry.enabled, true)
  assert.deepEqual(entry.methods.map(method => method.id), ['api-key'])
  assert.equal(records.get(`llm-pi-ai/${connectionId}`).key, 'fixture-zen-secret')
  assert.doesNotMatch(JSON.stringify(view), /fixture-zen-secret/)
  const stored = current.connections[connectionId]
  const resolved = resolveConnectionProfiles({ [connectionId]: stored }).get(stored.routeId)
  assert.equal(resolved.modelChoices.find(choice => choice.id === FREE_ID).model.baseUrl, ZEN_URL)
})
