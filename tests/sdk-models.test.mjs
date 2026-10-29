import test from 'node:test'
import assert from 'node:assert/strict'
import { openaiCodexProvider } from '@earendil-works/pi-ai/providers/openai-codex'
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai'
import { minimaxProvider } from '@earendil-works/pi-ai/providers/minimax'
import { minimaxCnProvider } from '@earendil-works/pi-ai/providers/minimax-cn'
import { xaiProvider } from '@earendil-works/pi-ai/providers/xai'
import { getSupportedThinkingLevels } from '@earendil-works/pi-ai'

test('the pinned SDK removes rejected Codex IDs without removing the OpenAI API model', () => {
  const codex = new Set(openaiCodexProvider().getModels().map(model => model.id))
  assert.equal(codex.has('gpt-5.5'), false)
  assert.equal(codex.has('gpt-5.3-codex-spark'), false)
  assert.equal(codex.has('gpt-6.1-sol'), true)
  assert.ok(openaiProvider().getModels().some(model => model.id === 'gpt-5.5'))
})

test('MiniMax M3.1 Flash exposes low through max and cannot disable thinking in either region', () => {
  for (const provider of [minimaxProvider(), minimaxCnProvider()]) {
    const model = provider.getModels().find(model => model.id === 'MiniMax-M3.1-Flash')
    assert.ok(model, `${provider.id} must list MiniMax-M3.1-Flash`)
    assert.equal(model.reasoning, true)
    assert.equal(model.api, 'anthropic-messages')
    assert.deepEqual(getSupportedThinkingLevels(model), ['low', 'medium', 'high', 'xhigh', 'max'])
    assert.equal(model.thinkingLevelMap.high, 'high')
    assert.equal(model.thinkingLevelMap.max, 'max')
    assert.equal(model.thinkingLevelMap.off, null)
  }
})

test('Grok 4.3 and 4.5 expose native xhigh with their distinct thinking-off support', () => {
  const models = xaiProvider().getModels()
  for (const id of ['grok-4.3', 'grok-4.5']) {
    const model = models.find(model => model.id === id)
    assert.ok(model, `xai must list ${id}`)
    assert.equal(model.reasoning, true)
    assert.equal(model.api, 'openai-responses')
    assert.equal(model.thinkingLevelMap.xhigh, 'xhigh')
    assert.deepEqual(getSupportedThinkingLevels(model), [
      ...id === 'grok-4.3' ? ['off'] : [], 'low', 'medium', 'high', 'xhigh',
    ])
    assert.equal(model.thinkingLevelMap.off, id === 'grok-4.3' ? 'none' : null)
  }
})
