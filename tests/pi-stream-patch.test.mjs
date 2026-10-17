import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import { piStreamPatchPlugin, nodeBundleBanner, patchPiSource, piRoot } from '../scripts/pi-stream-patch.mjs'

await mkdir('.cache', { recursive: true })
const built = await build({
  stdin: { contents: `
    export { stream as completions } from '@earendil-works/pi-ai/api/openai-completions';
    export { stream as responses } from '@earendil-works/pi-ai/api/openai-responses';
    export { stream as anthropic } from '@earendil-works/pi-ai/api/anthropic-messages';
    export { getBuiltinProviders } from '@earendil-works/pi-ai/providers/all';
    export { loadOpenAICodexOAuth, loadOpenAIChatGPTOAuth, loadMetaOAuth } from '${resolve(piRoot, 'dist/auth/oauth/load.js')}';
    export { bedrockConverseStreamApi } from '@earendil-works/pi-ai/api/bedrock-converse-stream.lazy';
  `, resolveDir: resolve('.') },
  outfile: '.cache/pi-stream-patch-test.mjs', bundle: true, platform: 'node', format: 'esm', target: 'node22',
  plugins: [piStreamPatchPlugin()], banner: { js: nodeBundleBanner }, metafile: true, logLevel: 'silent',
})
const sdk = await import('../.cache/pi-stream-patch-test.mjs')
const model = { id: 'fixture', name: 'Fixture', provider: 'fixture', baseUrl: 'https://fixture.invalid/v1', input: ['text'],
  reasoning: false, contextWindow: 1000000, maxTokens: 100000,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }
const context = { messages: [{ role: 'user', content: 'Write a file', timestamp: 0 }] }

function completionWire(argumentsText) {
  const wire = []
  for (let offset = 0; offset < argumentsText.length; offset += 64) wire.push({ choices: [{ delta: { tool_calls: [{ index: 0,
    ...offset === 0 ? { id: 'call' } : {}, function: { ...offset === 0 ? { name: 'write_file' } : {}, arguments: argumentsText.slice(offset, offset + 64) } }] } }] })
  wire.push({ choices: [{ delta: {}, finish_reason: 'tool_calls' }] })
  return wire.map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n'
}

async function collect(stream, api, wire) {
  const events = []
  for await (const event of stream({ ...model, api }, context, {
    apiKey: 'fixture', maxRetries: 0,
    fetch: async () => new Response(wire, { headers: { 'content-type': 'text/event-stream' } }),
  })) events.push(event)
  assert.equal(events.at(-1).type, 'done', events.at(-1).error?.errorMessage)
  return events
}

test('packaged SDK has no external Pi modules and all hidden OAuth/Bedrock loaders resolve', async () => {
  const output = Object.values(built.metafile.outputs)[0]
  assert.equal(output.imports.some(item => item.path.includes('@earendil-works/pi-ai')), false)
  const code = await readFile('.cache/pi-stream-patch-test.mjs', 'utf8')
  assert.equal(/importOAuthModule\(|importNodeOnlyApi\(/.test(code), false)
  for (const load of [sdk.loadOpenAICodexOAuth, sdk.loadOpenAIChatGPTOAuth, sdk.loadMetaOAuth]) {
    const oauth = await load()
    assert.equal(typeof oauth.login, 'function')
  }
  assert.equal(typeof sdk.bedrockConverseStreamApi().stream, 'function')
  assert.ok(sdk.getBuiltinProviders('openai-codex'))
})

test('large 64-byte tool deltas parse the full arguments once and preserve every byte', async () => {
  for (const size of [32 * 1024, 128 * 1024, 256 * 1024]) {
    const argumentsText = JSON.stringify({ text: 'あ\\"\n'.repeat(Math.ceil(size / 4)).slice(0, size) })
    const wire = completionWire(argumentsText)
    let parses = 0
    const original = JSON.parse
    JSON.parse = function (text, ...args) {
      if (typeof text === 'string' && text.startsWith('{"text":')) parses++
      return original.call(this, text, ...args)
    }
    let events
    try { events = await collect(sdk.completions, 'openai-completions', wire) }
    finally { JSON.parse = original }
    assert.equal(parses, 1, `full argument parse count for ${size} characters`)
    assert.equal(events.filter(event => event.type === 'toolcall_delta').map(event => event.delta).join(''), argumentsText)
    const end = events.find(event => event.type === 'toolcall_end')
    assert.deepEqual(end.toolCall.arguments, JSON.parse(argumentsText))
    assert.equal(end.toolCall.argumentsError, undefined)
  }
})

test('patched completions retain strict final validation for malformed and nonobject JSON', async () => {
  for (const argumentsText of ['{"scope":"selected",', '[]', 'null', '7', '{"a":1} invalid']) {
    const events = await collect(sdk.completions, 'openai-completions', completionWire(argumentsText))
    const end = events.find(event => event.type === 'toolcall_end')
    assert.deepEqual(end.toolCall.arguments, {})
    assert.equal(typeof end.toolCall.argumentsError, 'string')
    assert.ok(end.toolCall.argumentsError.includes(argumentsText))
  }
})

test('patched Responses and Anthropic retain final arguments and reject malformed objects', async () => {
  for (const argumentsText of ['{"scope":"selected"}', '{"scope":"selected",']) {
    const responses = [
      { type: 'response.created', response: { id: 'response-fixture', status: 'in_progress' } },
      { type: 'response.output_item.added', output_index: 0, item: { type: 'function_call', id: 'fc', call_id: 'call', name: 'write_file', arguments: '' } },
      { type: 'response.function_call_arguments.delta', output_index: 0, delta: argumentsText },
      { type: 'response.function_call_arguments.done', output_index: 0, arguments: argumentsText },
      { type: 'response.output_item.done', output_index: 0, item: { type: 'function_call', id: 'fc', call_id: 'call', name: 'write_file', arguments: argumentsText } },
      { type: 'response.completed', response: { id: 'response-fixture', status: 'completed', usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 } } },
    ].map(event => `data: ${JSON.stringify(event)}\n\n`).join('')
    const anthropic = [
      { type: 'message_start', message: { id: 'message-fixture', model: 'fixture', role: 'assistant', content: [], usage: { input_tokens: 1, output_tokens: 0 } } },
      { type: 'content_block_start', index: 0, content_block: { type: 'tool_use', id: 'call', name: 'write_file', input: {} } },
      { type: 'content_block_delta', index: 0, delta: { type: 'input_json_delta', partial_json: argumentsText } },
      { type: 'content_block_stop', index: 0 },
      { type: 'message_delta', delta: { stop_reason: 'tool_use' }, usage: { output_tokens: 1 } },
      { type: 'message_stop' },
    ].map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join('')
    for (const [stream, api, wire] of [[sdk.responses, 'openai-responses', responses], [sdk.anthropic, 'anthropic-messages', anthropic]]) {
      const events = await collect(stream, api, wire)
      const end = events.find(event => event.type === 'toolcall_end')
      if (argumentsText.endsWith('}')) {
        assert.deepEqual(end.toolCall.arguments, { scope: 'selected' }, api)
        assert.equal(end.toolCall.argumentsError, undefined, api)
      } else {
        assert.equal(typeof end.toolCall.argumentsError, 'string', api)
      }
    }
  }
})

test('SDK source drift fails the streaming patch instead of silently dropping it', async () => {
  assert.throws(() => patchPiSource('api/openai-completions.js', 'changed upstream source'), /patch mismatch/)
  const source = await readFile(resolve(piRoot, 'dist/api/openai-completions.js'), 'utf8')
  assert.throws(() => patchPiSource('api/openai-completions.js', source.replaceAll('parseToolCallArguments(', 'removedFinalValidator(')), /final argument validation missing/)
})
