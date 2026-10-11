import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveRouteModels } from '../src/runtime/catalog.ts'
import { getSupportedThinkingLevels } from '../src/runtime/models.ts'
import { streamFast, supportsFastTier } from '../src/runtime/fast.ts'

const meta = {
  provider: 'meta',
  defaultContextWindow: 262144,
  defaultMaxTokens: 32768,
  defaultInput: ['text'],
}

test('Muse Spark Max availability inherits directly from Pi catalog', () => {
  const models = resolveRouteModels(meta).models
  const standard = models.find(model => model.id === 'muse-spark-1.3')
  const contributor = models.find(model => model.id === 'muse-spark-1.3-contributor')
  assert.ok(standard)
  assert.ok(contributor)
  const stdLevels = getSupportedThinkingLevels(standard)
  const ctrLevels = getSupportedThinkingLevels(contributor)
  assert.ok(stdLevels.includes('max'))
  assert.ok(!ctrLevels.includes('max'))
})

test('explicit Muse effort declarations override catalog corrections', () => {
  const override = resolveRouteModels({
    ...meta,
    modelOverrides: { 'muse-spark-1.3': { reasoningEfforts: { high: 'high' } } },
  }).models.find(model => model.id === 'muse-spark-1.3')
  assert.ok(override)
  assert.deepEqual(getSupportedThinkingLevels(override), ['high'])
})

test('Fast tier is limited to OpenAI GPT models on supported Responses APIs', () => {
  assert.equal(supportsFastTier('openai-codex', { id: 'gpt-6-sol', api: 'openai-codex-responses' }), true)
  assert.equal(supportsFastTier('openai', { id: 'gpt-6.1-sol', api: 'openai-responses' }), true)
  assert.equal(supportsFastTier('openai', { id: 'gpt-5.6-luna', api: 'openai-responses' }), true)
  assert.equal(supportsFastTier('openai', { id: 'gpt-5.3-codex-spark', api: 'openai-responses' }), false)
  assert.equal(supportsFastTier('meta', { id: 'gpt-6-sol', api: 'openai-responses' }), false)
  assert.equal(supportsFastTier('openai', { id: 'gpt-6-sol', api: 'openai-completions' }), false)
  assert.equal(supportsFastTier('openai', { id: 'gpt-7-sol', api: 'openai-responses' }), false)
})

test('Fast requests set service_tier through the full SDK path, without changing thinking effort', () => {
  const model = {
    id: 'gpt-6-sol', name: 'GPT-6 Sol', api: 'openai-codex-responses', provider: 'openai-codex',
    baseUrl: 'https://chatgpt.com/backend-api', reasoning: true, input: ['text'],
    contextWindow: 128000, maxTokens: 4096,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  }
  let seen
  const models = { stream: (_model, _context, options) => { seen = options; return {} } }
  const context = { messages: [] }
  streamFast(models, model, context, {
    reasoning: 'max', apiKey: 'test-key', headers: { 'X-Trace': 'safe' }, maxTokens: 1000,
  })
  assert.equal(seen.serviceTier, 'priority')
  assert.equal(seen.reasoningEffort, 'max')
  assert.equal(seen.maxTokens, 1000)
  assert.equal(seen.apiKey, 'test-key')
  assert.deepEqual(seen.headers, { 'X-Trace': 'safe' })
})
