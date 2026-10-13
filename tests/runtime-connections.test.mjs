import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { compileOfficial } from '../scripts/upstream.mjs'

await mkdir('.cache', { recursive: true })
await writeFile('.cache/runtime-connections-entry.ts', `
export { resolveConnectionProfiles } from '../src/runtime/connections.ts';
export { toPiAssistant, toPiReplayState } from '../src/runtime/replay.ts';
`)
await compileOfficial('.cache/runtime-connections-entry.ts', '.cache/runtime-connections-test.mjs')
const { resolveConnectionProfiles, toPiAssistant, toPiReplayState } = await import('../.cache/runtime-connections-test.mjs')

const connection = (id, profile = {}) => ({
  integrationId: 'pi', serviceId: 'openai', routeId: `pi-${id}`, displayName: id,
  authMethod: 'api-key', credentialRecordId: id, credentialGeneration: 0,
  enabled: true, profile,
})
const model = 'gpt-6.1-sol', fast = `${model}::fast`

test('three native catalogs retain unique public routes and independent Fast and Thinking choices', () => {
  const calls = []
  const profiles = resolveConnectionProfiles({
    a: connection('a', { enabledFastModels: [fast], reasoning: 'high' }),
    b: connection('b', { disabledModels: [model], reasoning: 'low' }),
    c: connection('c', { baseURL: 'https://gateway.example/v1', enabledFastModels: [fast] }),
  }, (service, id) => { calls.push([service, id]) })
  assert.deepEqual(calls, [['openai', 'a'], ['openai', 'b'], ['openai', 'c']])
  assert.deepEqual([...profiles.keys()], ['pi-a', 'pi-b', 'pi-c'])
  for (const profile of profiles.values()) {
    assert.equal(profile.piProvider.id, 'openai')
    assert.ok(profile.modelChoices.every(choice => choice.model.provider === 'openai'))
  }
  assert.equal(profiles.get('pi-a').modelChoices.find(choice => choice.id === fast).enabled, true)
  assert.equal(profiles.get('pi-b').modelChoices.find(choice => choice.id === model).enabled, false)
  assert.equal(profiles.get('pi-b').modelChoices.find(choice => choice.id === fast).enabled, false)
  assert.equal(profiles.get('pi-c').modelChoices.some(choice => choice.id === fast), false)
  assert.equal(profiles.get('pi-a').reasoning, 'high')
  assert.equal(profiles.get('pi-b').reasoning, 'low')
  const renamed = resolveConnectionProfiles({ a: { ...connection('a'), displayName: 'Renamed' } }).get('pi-a')
  assert.equal(renamed.provider, 'pi-a')
  assert.equal(renamed.piProvider.id, 'openai')
  assert.throws(() => resolveConnectionProfiles({ a: connection('a'), b: { ...connection('b'), routeId: 'pi-a' } }), /duplicate/)
  assert.equal(resolveConnectionProfiles({ external: { ...connection('external'), integrationId: 'owner-managed' }, muse: { ...connection('muse'), integrationId: 'meta-muse-code' } }).size, 0)
})

const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } }
const native = {
  role: 'assistant', provider: 'openai', api: 'openai-responses', model,
  content: [{ type: 'thinking', thinking: 'thought', thinkingSignature: 'opaque-account-signature' }, { type: 'text', text: 'answer', textSignature: 'opaque-text-id' }],
  responseId: 'opaque-response-id', stopReason: 'stop', usage, timestamp: 0,
}
const scope = { connectionId: 'a', credentialGeneration: 0, endpoint: 'https://api.openai.com/v1', api: 'openai-responses' }
const history = state => ({ role: 'assistant', source: { provider: 'pi-a', model: fast, replayState: state }, content: [{ type: 'reasoning', text: 'thought' }, { type: 'text', text: 'answer' }] })

test('opaque replay belongs to exact connection generation, endpoint and protocol; durable text survives', () => {
  const state = toPiReplayState(native, fast, scope, 'pi-a')
  const target = { provider: 'pi-a', serviceId: 'openai', scope }
  const restored = toPiAssistant(history(state), undefined, target)
  assert.equal(restored.model, model)
  assert.equal(restored.provider, 'openai')
  assert.equal(restored.responseId, native.responseId)
  assert.equal(restored.content[0].thinkingSignature, native.content[0].thinkingSignature)
  for (const other of [
    { ...target, provider: 'pi-b', scope: { ...scope, connectionId: 'b' } },
    { ...target, scope: { ...scope, credentialGeneration: 1 } },
    { ...target, scope: { ...scope, endpoint: 'https://gateway.example/v1' } },
    { ...target, scope: { ...scope, api: 'anthropic-messages' } },
    { ...target, serviceId: 'openai-codex' },
    { provider: 'pi-a' },
  ]) {
    let reason
    const neutral = toPiAssistant(history(state), value => { reason = value }, other)
    assert.ok(reason)
    assert.equal(neutral.api, 'dsh-foreign')
    assert.equal(neutral.responseId, undefined)
    assert.equal(neutral.content[0].thinkingSignature, undefined)
    assert.equal(neutral.content[1].textSignature, undefined)
    assert.equal(neutral.content[1].text, 'answer')
  }
})

test('migration restores unscoped replay only on its original route before credential replacement', () => {
  const old = { ...history(toPiReplayState(native, fast)), source: { provider: 'openai', model: fast, replayState: toPiReplayState(native, fast) } }
  const migrated = { provider: 'openai', serviceId: 'openai', scope: { ...scope, legacyRoute: 'openai' } }
  assert.equal(toPiAssistant(old, undefined, migrated).responseId, native.responseId)
  for (const target of [
    { ...migrated, scope: { ...migrated.scope, credentialGeneration: 1 } },
    { ...migrated, provider: 'pi-b', scope: { ...scope, connectionId: 'b' } },
  ]) assert.equal(toPiAssistant(old, undefined, target).api, 'dsh-foreign')
})

test('new opaque gateways default to text and no Thinking while native and migrated capabilities remain intact', () => {
  const nativeProfile = resolveConnectionProfiles({ native: connection('native') }).get('pi-native')
  const nativeModel = nativeProfile.modelChoices.find(choice => choice.id === model).model
  assert.equal(nativeModel.reasoning, true)
  assert.ok(nativeModel.input.includes('image'))
  const profile = { baseURL: 'https://gateway.example/v1' }
  const profiles = resolveConnectionProfiles({
    gateway: connection('gateway', profile),
    legacy: { ...connection('legacy', profile), legacyRoute: true },
    split: { ...connection('split', profile), routeId: 'openai' },
  })
  const gateway = profiles.get('pi-gateway').modelChoices.find(choice => choice.id === model)
  assert.equal(gateway.model.reasoning, false)
  assert.deepEqual(gateway.model.input, ['text'])
  assert.equal(gateway.capabilityUnverified, true)
  for (const route of ['pi-legacy', 'openai']) {
    const choice = profiles.get(route).modelChoices.find(choice => choice.id === model)
    assert.equal(choice.model.reasoning, nativeModel.reasoning)
    assert.deepEqual(choice.model.input, nativeModel.input)
  }
  assert.equal(nativeProfile.modelChoices.find(choice => choice.id === model).capabilityUnverified, undefined)
})

test('explicit Host gateway model capabilities are preserved independently of conservative defaults', () => {
  const profile = { baseURL: 'https://gateway.example/v1' }
  const profiles = resolveConnectionProfiles({
    declared: connection('declared', { ...profile, models: [{ id: model, input: ['text', 'image'], reasoningEfforts: { high: 'high' } }] }),
    reasoning: connection('reasoning', { ...profile, modelOverrides: { [model]: { reasoningEfforts: { high: 'high' } } } }),
    images: connection('images', { ...profile, modelOverrides: { [model]: { input: ['text', 'image'] } } }),
  })
  const chosen = route => profiles.get(route).modelChoices.find(choice => choice.id === model).model
  assert.equal(chosen('pi-declared').reasoning, true)
  assert.deepEqual(chosen('pi-declared').input, ['text', 'image'])
  assert.equal(chosen('pi-reasoning').reasoning, true)
  assert.deepEqual(chosen('pi-reasoning').input, ['text'])
  assert.equal(chosen('pi-images').reasoning, false)
  assert.deepEqual(chosen('pi-images').input, ['text', 'image'])
})
