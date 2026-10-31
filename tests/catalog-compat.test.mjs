import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parsePiCatalog } from '../src/catalog-parsers.mjs'

const base = {
  id: 'installed', provider: 'example', api: 'openai-completions', baseUrl: 'https://provider.example/v1',
  contextWindow: 131072, maxTokens: 8192, input: ['text'], reasoning: true,
  thinkingLevelMap: { off: null, high: 'high' },
}

test('new Pi models retain the SDK reasoning-content compatibility flag', () => {
  const baseline = new Map([[base.id, base]])
  const { models, skipped } = parsePiCatalog('example', [true, false, 'true'].map((value, index) => ({
    ...base, id: `new-${index}`, compat: { requiresReasoningContentOnAssistantMessages: value },
  })), baseline)
  assert.equal(skipped, 0)
  assert.equal(models[0].compat.requiresReasoningContentOnAssistantMessages, true)
  assert.equal(models[1].compat.requiresReasoningContentOnAssistantMessages, false)
  assert.equal(Object.hasOwn(models[2].compat, 'requiresReasoningContentOnAssistantMessages'), false)
})
