import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { compileOfficial } from '../scripts/upstream.mjs'

await mkdir('.cache', { recursive: true })
await writeFile('.cache/live-catalog-entry.ts', `
export { PiAiAdapter } from '../src/runtime/adapter.ts';
export { resolveProfiles, Config } from '../src/runtime/config.ts';
export { resolveConnectionProfiles } from '../src/runtime/connections.ts';
export { catalogModels } from '../src/runtime/catalog.ts';
export { LiveCatalogSession, catalogBinding } from '../src/live-catalog.mjs';
`)
await compileOfficial('.cache/live-catalog-entry.ts', '.cache/live-catalog-runtime.mjs')
const { PiAiAdapter, resolveProfiles, resolveConnectionProfiles, LiveCatalogSession, catalogModels, catalogBinding, Config } = await import('../.cache/live-catalog-runtime.mjs')

function completion() {
  return new Response([
    { choices: [{ index: 0, delta: { role: 'assistant', reasoning_content: 'reason' }, finish_reason: null }] },
    { choices: [{ index: 0, delta: { content: 'answer' }, finish_reason: null }] },
    { choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 3, completion_tokens: 2 } },
  ].map(value => `data: ${JSON.stringify(value)}\n\n`).join('') + 'data: [DONE]\n\n', { headers: { 'content-type': 'text/event-stream' } })
}

test('DSH exposes and sends Ollama 1017 efforts exactly, including default versus off and boolean models', async t => {
  const id = 'deepseek-v4.1-flash:1017'
  const session = new LiveCatalogSession({ connection: { integrationId: 'pi', serviceId: 'ollama-cloud', profile: {} }, baseline: new Map(), poll: false,
    credentials: { read: async () => ({ type: 'api_key', key: 'fixture' }) },
    fetch: async (url, init) => Response.json(url.endsWith('/tags') ? { models: [{ name: id }, { name: 'boolean-model' }] }
      : { capabilities: ['completion', 'thinking', 'tools'], model_info: { 'test.context_length': 1048576 },
        thinking: JSON.parse(init.body).model === id ? { values: [false, 'low', 'high', 'max'], default: 'high' } : { values: [false, true], default: true } }),
  })
  t.after(() => session.dispose())
  await session.refresh()
  const models = session.catalog('ollama-cloud')
  const savedConnection = { integrationId: 'pi', serviceId: 'ollama-cloud', routeId: 'pi-restore', displayName: 'Restore', authMethod: 'api-key', credentialRecordId: 'restore', profile: {} }
  savedConnection.modelCatalog = JSON.stringify({ ...session.cache.value, binding: catalogBinding(savedConnection), checkedAt: Date.now() })
  const parsedConnection = Config({ connections: { restore: savedConnection } }).connections.get().restore
  const restored = new LiveCatalogSession({ connection: parsedConnection, baseline: new Map(), snapshot: () => parsedConnection.modelCatalog, poll: false })
  t.after(() => restored.dispose())
  assert.equal(restored.catalog('ollama-cloud').get(id)?.contextWindow, 1048576)
  const profiles = resolveProfiles({ 'ollama-cloud': { enabledDiscoveredModels: [id, 'boolean-model'] } }, 'strict', () => models)
  const adapter = new PiAiAdapter({ profiles: () => profiles, resolveApiKey: async () => 'fixture-key' })
  const info = await adapter.resolveModel('ollama-cloud', id)
  assert.deepEqual(info.reasoning.efforts.map(value => value.id), ['off', 'low', 'high', 'max'])
  assert.equal(info.reasoning.defaultEffort, 'high')
  const toggle = await adapter.resolveModel('ollama-cloud', 'boolean-model')
  assert.deepEqual(toggle.reasoning.efforts.map(value => value.id), ['off', 'on'])
  const requests = [], original = globalThis.fetch
  globalThis.fetch = async (url, init) => { requests.push({ url: String(url), body: JSON.parse(init.body) }); return completion() }
  t.after(() => { globalThis.fetch = original })
  const send = async (effort, model = id) => {
    const chunks = []
    for await (const chunk of adapter.stream({ provider: 'ollama-cloud', model, messages: [{ role: 'user', content: [{ type: 'text', text: 'ping' }] }], tools: [],
      ...effort === undefined ? {} : { reasoningEffort: effort } })) chunks.push(chunk)
    return chunks
  }
  for (const effort of ['low', 'high', 'max', 'off', undefined]) await send(effort)
  assert.deepEqual(requests.map(value => value.body.reasoning_effort), ['low', 'high', 'max', 'none', undefined])
  assert.ok(requests.every(value => value.body.model === id && value.url === 'https://ollama.com/v1/chat/completions'))
  await assert.rejects(send('medium'), error => error.code === 'UNSUPPORTED_REASONING_EFFORT')
  await send('on', 'boolean-model')
  assert.equal(requests.at(-1).body.reasoning_effort, 'high')
})

test('new Go catalog models retain the native session header and pending gateway connections are valid', async t => {
  for (const serviceId of ['commandcode', 'ollama-cloud']) {
    const profiles = resolveConnectionProfiles({ 'c-new': { integrationId: 'pi', serviceId, routeId: 'pi-c-new', displayName: serviceId,
      authMethod: 'api-key', credentialRecordId: 'c-new', credentialGeneration: 0, enabled: false, profile: {} } })
    assert.equal(profiles.get('pi-c-new').modelChoices.length, 0)
  }
  const baseline = catalogModels('opencode-go'), base = [...baseline.values()].find(model => model.api === 'openai-completions')
  const session = new LiveCatalogSession({ connection: { integrationId: 'pi', serviceId: 'opencode-go', profile: {} }, baseline, poll: false,
    fetch: async () => Response.json([{ ...base, id: 'new-go-model:1017' }]),
  })
  t.after(() => session.dispose()); await session.refresh()
  const models = session.catalog('opencode-go')
  const profile = resolveProfiles({ 'opencode-go': { enabledDiscoveredModels: ['new-go-model:1017'] } }, 'strict', () => models).get('opencode-go')
  let sent
  const stream = profile.piProvider.streamSimple(models.get('new-go-model:1017'), { messages: [{ role: 'user', content: 'ping', timestamp: 0 }] }, {
    apiKey: 'fixture', sessionId: 'fixture-session', fetch: async (url, init) => { sent = { url: String(url), headers: new Headers(init.headers), body: JSON.parse(init.body) }; return completion() },
  })
  for await (const event of stream) if (event.type === 'error') assert.fail(event.error.errorMessage)
  assert.equal(sent.body.model, 'new-go-model:1017')
  assert.equal(sent.headers.get('x-opencode-session'), 'fixture-session')
})

test('CommandCode routes the same account through all three SDK protocols with explicit effort', async t => {
  const ids = ['claude-opus-4-8', 'gpt-example', 'chat-example']
  const endpoints = ['/messages', '/responses', '/chat/completions']
  const session = new LiveCatalogSession({ connection: { integrationId: 'pi', serviceId: 'commandcode', profile: {} }, baseline: new Map(), poll: false,
    fetch: async url => Response.json(url.includes('models.dev') ? {} : { data: ids.map((id, index) => ({
      id, supported_endpoints: [endpoints[index]], reasoning_efforts: ['high', 'max'], context_length: 131072,
    })) }),
  })
  t.after(() => session.dispose()); await session.refresh()
  const models = session.catalog('commandcode')
  const profile = resolveProfiles({ commandcode: { enabledDiscoveredModels: ids } }, 'strict', () => models).get('commandcode')
  const sent = []
  for (const id of ids) {
    const events = profile.piProvider.streamSimple(models.get(id), { messages: [{ role: 'user', content: 'ping', timestamp: 0 }] }, {
      apiKey: 'fixture-command-key', reasoning: 'high', maxRetries: 0,
      fetch: async (url, init) => {
        sent.push({ url: String(url), headers: new Headers(init.headers), body: JSON.parse(init.body) })
        if (id === 'chat-example') return completion()
        const events = id.startsWith('claude-') ? [
          { type: 'message_start', message: { id: 'msg_fixture', type: 'message', role: 'assistant', model: id, content: [], usage: { input_tokens: 1, output_tokens: 0 } } },
          { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
          { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'answer' } },
          { type: 'content_block_stop', index: 0 },
          { type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 1 } }, { type: 'message_stop' },
        ] : [
          { type: 'response.created', response: { id: 'resp_fixture', model: id } },
          { type: 'response.completed', response: { id: 'resp_fixture', model: id, status: 'completed', output: [], usage: { input_tokens: 1, output_tokens: 0 } } },
        ]
        return new Response(events.map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join(''), { headers: { 'content-type': 'text/event-stream' } })
      },
    })
    let done = false
    for await (const event of events) {
      if (event.type === 'error') assert.fail(event.error.errorMessage)
      if (event.type === 'done') done = true
    }
    assert.equal(done, true)
  }
  assert.deepEqual(sent.map(value => new URL(value.url).pathname), ['/provider/v1/messages', '/provider/v1/responses', '/provider/v1/chat/completions'])
  assert.equal(sent[0].headers.get('x-api-key'), 'fixture-command-key')
  assert.equal(sent[1].headers.get('authorization'), 'Bearer fixture-command-key')
  assert.equal(sent[2].headers.get('authorization'), 'Bearer fixture-command-key')
  assert.equal(sent[0].body.thinking.type, 'adaptive'); assert.equal(sent[0].body.output_config.effort, 'high')
  assert.equal(sent[1].body.reasoning.effort, 'high'); assert.equal(sent[2].body.reasoning_effort, 'high')
})
