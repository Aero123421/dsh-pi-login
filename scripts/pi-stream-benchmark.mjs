import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import { build } from 'esbuild'
import { piStreamPatchPlugin, nodeBundleBanner } from './pi-stream-patch.mjs'

// Synthetic local SSE; no network request or API key is required.
await mkdir('.cache', { recursive: true })
const implementations = []
for (const patched of [false, true]) {
  const outfile = `.cache/pi-stream-benchmark-${patched ? 'patched' : 'original'}.mjs`
  await build({ stdin: { contents: "export { stream } from '@earendil-works/pi-ai/api/openai-completions'", resolveDir: resolve('.') },
    outfile, bundle: true, platform: 'node', format: 'esm', target: 'node22', logLevel: 'silent',
    plugins: patched ? [piStreamPatchPlugin()] : [], banner: { js: nodeBundleBanner } })
  implementations.push((await import(`../${outfile}`)).stream)
}
const model = { id: 'fixture', name: 'Fixture', provider: 'fixture', api: 'openai-completions', baseUrl: 'https://fixture.invalid/v1',
  input: ['text'], reasoning: false, contextWindow: 1000000, maxTokens: 100000,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }
const context = { messages: [{ role: 'user', content: 'Write a file', timestamp: 0 }] }
function wireFor(argumentsText) {
  const events = []
  for (let offset = 0; offset < argumentsText.length; offset += 64) events.push({ choices: [{ delta: { tool_calls: [{ index: 0,
    id: 'call', function: { name: 'write_file', arguments: argumentsText.slice(offset, offset + 64) } }] } }] })
  events.push({ choices: [{ delta: {}, finish_reason: 'tool_calls' }] })
  return events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n'
}
async function measure(stream, argumentsText, wire) {
  let end
  const started = performance.now()
  for await (const event of stream(model, context, { apiKey: 'fixture', maxRetries: 0,
    fetch: async () => new Response(wire, { headers: { 'content-type': 'text/event-stream' } }) })) {
    if (event.type === 'toolcall_end') end = event.toolCall
    if (event.type === 'error') throw new Error(event.error.errorMessage)
  }
  const elapsed = performance.now() - started
  assert.equal(end?.argumentsError, undefined)
  assert.equal(JSON.stringify(end?.arguments), argumentsText)
  return elapsed
}
const summary = values => { const ordered = [...values].sort((a, b) => a - b); return { median: +ordered[1].toFixed(2), min: +ordered[0].toFixed(2), max: +ordered[2].toFixed(2) } }
console.log(JSON.stringify({ node: process.version, platform: process.platform, arch: process.arch, deltaBytes: 64, repetitions: 3 }))
for (const stream of implementations) {
  const text = JSON.stringify({ text: 'x'.repeat(1024) })
  await measure(stream, text, wireFor(text))
}
for (const bytes of [32, 64, 128, 256].map(kib => kib * 1024)) {
  const text = JSON.stringify({ text: 'x'.repeat(bytes) })
  const wire = wireFor(text)
  const measurements = [[], []]
  for (let repetition = 0; repetition < 3; repetition++) {
    for (let index = 0; index < implementations.length; index++) measurements[index].push(await measure(implementations[index], text, wire))
  }
  console.log(JSON.stringify({ textBytes: bytes, originalMs: summary(measurements[0]), patchedMs: summary(measurements[1]) }))
}
