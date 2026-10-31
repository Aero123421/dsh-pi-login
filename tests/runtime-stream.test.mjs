import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { compileOfficial } from '../scripts/upstream.mjs'
import { stream } from '@earendil-works/pi-ai/api/openai-completions'

await mkdir('.cache', { recursive: true })
await writeFile('.cache/runtime-stream-entry.ts', `export { toStreamChunks } from '../src/runtime/stream.ts';`)
await compileOfficial('.cache/runtime-stream-entry.ts', '.cache/runtime-stream-test.mjs')
const { toStreamChunks } = await import('../.cache/runtime-stream-test.mjs')

// An index-only first tool delta is accepted by the real Pi SDK. Hold the
// next wire event until the adapter consumes toolcall_start so this catches
// freezing the initial empty identity even when SDK partials are mutable.
test('real SDK late tool identity reaches live deltas before final settlement', async () => {
  const model = { id: 'fixture-model', name: 'Fixture', provider: 'fixture', api: 'openai-completions',
    baseUrl: 'https://fixture.invalid/v1', input: ['text'], reasoning: false,
    contextWindow: 4096, maxTokens: 1000, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }
  let started
  const startConsumed = new Promise(resolve => { started = resolve })
  const wire = [
    { marker: 1, choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: '' } }] } }] },
    { marker: 2, choices: [{ delta: { tool_calls: [{ index: 0, id: 'late-call', function: { name: 'write_file', arguments: '{"path":"a.txt",' } }] } }] },
    { marker: 3, choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: '"text":"hello"}' } }] } }] },
    { choices: [{ delta: {}, finish_reason: 'tool_calls' }] },
  ].map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n'
  const events = stream(model, { messages: [{ role: 'user', content: 'Write a file', timestamp: 0 }] }, {
    apiKey: 'fixture-key', maxRetries: 0,
    fetch: async () => new Response(wire, { headers: { 'content-type': 'text/event-stream' } }),
    onProviderStreamEvent: async event => { if (event.marker === 2) await startConsumed },
  })
  const chunks = []
  for await (const chunk of toStreamChunks(events)) {
    chunks.push(chunk)
    if (chunk.type === 'block-start' && chunk.blockType === 'tool-call') started()
  }
  const deltas = chunks.filter(chunk => chunk.type === 'tool-call-delta')
  assert.equal(deltas[0].id, '')
  assert.equal(deltas[0].name, undefined)
  assert.deepEqual(deltas.slice(1).map(chunk => [chunk.id, chunk.name, chunk.argumentsDelta]), [
    ['late-call', 'write_file', '{"path":"a.txt",'],
    ['late-call', 'write_file', '"text":"hello"}'],
  ])
  assert.deepEqual(chunks.find(chunk => chunk.type === 'block-end').block, {
    type: 'tool-call', id: 'late-call', name: 'write_file', arguments: '{"path":"a.txt","text":"hello"}',
  })
  assert.equal(chunks.at(-1).reason.kind, 'tool-calls')
})

test('interleaved calls retain independent identities if a later partial omits its block', async () => {
  const partial = (index, id, name) => ({ content: Array.from({ length: index + 1 }, (_, i) => i === index ? { type: 'toolCall', id, name, arguments: {} } : { type: 'text', text: '' }) })
  async function* source() {
    yield { type: 'toolcall_start', contentIndex: 0, partial: partial(0, '', '') }
    yield { type: 'toolcall_start', contentIndex: 1, partial: partial(1, 'other-call', 'read_file') }
    yield { type: 'toolcall_delta', contentIndex: 0, partial: partial(0, 'late-call', 'write_file'), delta: '{' }
    yield { type: 'toolcall_delta', contentIndex: 1, partial: partial(1, 'other-call', 'read_file'), delta: '{}' }
    yield { type: 'toolcall_delta', contentIndex: 0, partial: { content: [] }, delta: '}' }
    yield { type: 'error', error: { content: [], provider: 'fixture', model: 'fixture', stopReason: 'aborted', usage: { input: 0, output: 0, totalTokens: 0, cacheRead: 0, cacheWrite: 0 } } }
  }
  const chunks = []
  for await (const chunk of toStreamChunks(source())) chunks.push(chunk)
  assert.deepEqual(chunks.filter(chunk => chunk.type === 'tool-call-delta').map(chunk => [chunk.id, chunk.name, chunk.argumentsDelta]), [
    ['late-call', 'write_file', '{'], ['other-call', 'read_file', '{}'], ['late-call', 'write_file', '}'],
  ])
  assert.equal(chunks.at(-1).reason.kind, 'aborted')
  assert.equal(chunks.at(-1).replayState, undefined)
})

const usage = { input: 3, output: 2, totalTokens: 5, cacheRead: 0, cacheWrite: 0 }
const fixtureModel = { id: 'fixture-model', name: 'Fixture', provider: 'fixture', api: 'openai-completions',
  baseUrl: 'https://fixture.invalid/v1', input: ['text'], reasoning: false,
  contextWindow: 4096, maxTokens: 1000, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }

function toolEvents(argumentsText) {
  const wire = [
    { choices: [{ delta: { tool_calls: [{ index: 0, id: 'call', function: { name: 'optional_tool', arguments: argumentsText } }] } }] },
    { choices: [{ delta: {}, finish_reason: 'tool_calls' }], usage: { prompt_tokens: 3, completion_tokens: 2 } },
  ].map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n'
  return stream(fixtureModel, { messages: [{ role: 'user', content: 'Use a tool', timestamp: 0 }] }, {
    apiKey: 'fixture-key', maxRetries: 0,
    fetch: async () => new Response(wire, { headers: { 'content-type': 'text/event-stream' } }),
  })
}

test('real SDK malformed final arguments cannot become valid empty tool arguments', async () => {
  for (const argumentsText of ['{"scope":"selected",', '[]', 'null', '42', '{"a":1} trailing']) {
    const chunks = []
    for await (const chunk of toStreamChunks(toolEvents(argumentsText))) chunks.push(chunk)
    assert.equal(chunks.some(chunk => chunk.type === 'block-end' && chunk.block.type === 'tool-call'), false)
    assert.equal(chunks.at(-1).reason.kind, 'error')
    assert.equal(chunks.at(-1).reason.failure.code, 'INVALID_TOOL_ARGUMENTS')
    assert.equal(chunks.at(-1).replayState, undefined)
    assert.equal(chunks.at(-2).usage.totalTokens, 5)
    assert.equal(JSON.stringify(chunks.at(-1)).includes(argumentsText), false)
  }
})

test('real SDK valid empty arguments and populated objects stay executable', async () => {
  for (const argumentsText of ['{}', '{"scope":"selected"}']) {
    const chunks = []
    for await (const chunk of toStreamChunks(toolEvents(argumentsText))) chunks.push(chunk)
    assert.deepEqual(JSON.parse(chunks.find(chunk => chunk.type === 'block-end').block.arguments), JSON.parse(argumentsText))
    assert.equal(chunks.at(-1).reason.kind, 'tool-calls')
    assert.ok(chunks.at(-1).replayState)
  }
})

test('terminal-only invalid arguments also fail closed', async () => {
  async function* source() {
    yield { type: 'done', message: { stopReason: 'toolUse', usage, content: [
      { type: 'toolCall', id: 'call', name: 'optional_tool', arguments: {}, argumentsError: 'invalid JSON' },
    ] } }
  }
  const chunks = []
  for await (const chunk of toStreamChunks(source())) chunks.push(chunk)
  assert.equal(chunks.at(-1).reason.failure.code, 'INVALID_TOOL_ARGUMENTS')
  assert.equal(chunks.at(-1).replayState, undefined)
})

test('upstream transient errors map to retryable codes while permanent failures retain their codes', async () => {
  const examples = [
    ['Unable to forward upstream stream', 'TRANSPORT'],
    ['The service is temporarily unavailable', 'SERVER'],
    ['upstream_stream_read_error', 'TRANSPORT'],
    ['Upstream HTTP/2 stream failed', 'TRANSPORT'],
    ['503 Service Unavailable', 'SERVER'],
    ['401 Unable to forward upstream stream', 'AUTH'],
    ['403 The service is temporarily unavailable', 'AUTH'],
    ['429 upstream_stream_read_error', 'RATE_LIMIT'],
    ['400 Upstream HTTP/2 stream failed', 'INVALID_REQUEST'],
    ['413 The service is temporarily unavailable', 'CONTEXT_WINDOW_EXCEEDED'],
    ['Unrecognized model output', 'PI_AI_ERROR'],
  ]
  for (const [errorMessage, code] of examples) {
    async function* source() {
      yield { type: 'error', error: { content: [], stopReason: 'error', errorMessage, usage } }
    }
    const chunks = []
    for await (const chunk of toStreamChunks(source())) chunks.push(chunk)
    assert.equal(chunks.at(-1).reason.failure.code, code, errorMessage)
  }
})
