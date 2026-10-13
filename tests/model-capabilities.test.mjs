import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getBuiltinModels } from '@earendil-works/pi-ai/providers/all'
import { resolveRouteModels } from '../src/runtime/catalog.ts'
import { getSupportedThinkingLevels } from '../src/runtime/models.ts'
import { supplementCatalog } from '../src/runtime/catalog-additions.ts'
import { modelChoices, fastModelId, streamWithTier, supportsFastTier } from '../src/runtime/fast.ts'

const meta = {
  provider: 'meta',
  defaultContextWindow: 262144,
  defaultMaxTokens: 32768,
  defaultInput: ['text'],
}

test('Muse Wonder is selectable with its own capabilities and respects configured lists', () => {
  const wonder = resolveRouteModels(meta).models.find(model => model.id === 'muse-wonder-1.0')
  assert.ok(wonder)
  assert.equal(wonder.name, 'Muse Wonder')
  assert.equal(wonder.contextWindow, 1048576)
  assert.equal(wonder.maxTokens, 131072)
  assert.deepEqual(wonder.input, ['text', 'image'])
  assert.deepEqual(getSupportedThinkingLevels(wonder), ['minimal', 'low', 'medium', 'high', 'xhigh', 'max'])
  assert.equal(modelChoices('meta', [wonder], {}).find(choice => choice.id === wonder.id)?.enabled, true)
  assert.equal(modelChoices('meta', [wonder], { disabledModels: [wonder.id] })[0].enabled, false)
  assert.deepEqual(resolveRouteModels({ ...meta, models: [{ id: 'muse-spark-1.3' }] }).models.map(model => model.id), ['muse-spark-1.3'])
  const override = resolveRouteModels({ ...meta, modelOverrides: { [wonder.id]: { reasoningEfforts: { high: 'high' } } } }).models.find(model => model.id === wonder.id)
  assert.deepEqual(getSupportedThinkingLevels(override), ['high'])
})

test('SDK entries supersede additions and other providers do not acquire Meta models', () => {
  const current = resolveRouteModels(meta).models.find(model => model.id === 'muse-wonder-1.0')
  const future = { ...current, contextWindow: 2097152, cost: { input: 2, output: 3, cacheRead: 1, cacheWrite: 0 } }
  assert.equal(supplementCatalog('meta', [future]).get(future.id), future)
  assert.equal(supplementCatalog('openai', []).has(current.id), false)
})

test('Muse Wonder uses the real Meta provider and SDK Responses payload for every effort', async () => {
  const { buildProvider } = await import('../src/runtime/provider.ts')
  const model = resolveRouteModels(meta).models.find(model => model.id === 'muse-wonder-1.0')
  const provider = buildProvider({ provider: 'meta', displayName: 'Meta', models: [model], namesCredential: false })
  assert.ok(provider.auth.oauth)
  assert.ok(provider.auth.apiKey)
  const context = { messages: [{ role: 'user', content: [{ type: 'text', text: 'Describe this image' }, { type: 'image', data: 'aGVsbG8=', mimeType: 'image/png' }], timestamp: 0 }] }
  for (const reasoning of getSupportedThinkingLevels(model)) {
    let payload, target
    const events = [
      { type: 'response.created', response: { id: 'resp_wonder' } },
      { type: 'response.completed', response: { id: 'resp_wonder', status: 'completed', output: [], usage: { input_tokens: 3, output_tokens: 1, total_tokens: 4 } } },
    ].map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join('')
    const result = await provider.streamSimple(model, context, {
      apiKey: 'fixture-meta-key', reasoning, maxTokens: 1000, maxRetries: 0,
      onPayload: value => { payload = structuredClone(value) },
      fetch: async url => { target = String(url); return new Response(events, { headers: { 'content-type': 'text/event-stream' } }) },
    }).result()
    assert.equal(result.stopReason, 'stop')
    assert.equal(target, 'https://api.meta.ai/v1/responses')
    assert.equal(payload.model, 'muse-wonder-1.0')
    assert.equal(payload.reasoning.effort, reasoning)
    assert.equal(payload.max_output_tokens, 1000)
    assert.ok(payload.input.flatMap(message => message.content ?? []).some(part => part.type === 'input_image'))
  }
})

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

test('explicit Muse effort declarations override the inherited Pi catalog', () => {
  const override = resolveRouteModels({
    ...meta,
    modelOverrides: { 'muse-spark-1.3': { reasoningEfforts: { high: 'high' } } },
  }).models.find(model => model.id === 'muse-spark-1.3')
  assert.ok(override)
  assert.deepEqual(getSupportedThinkingLevels(override), ['high'])
})

test('Fast choices use confirmed IDs, protocols and endpoints', () => {
  for (const provider of ['openai', 'openai-codex']) {
    const model = getBuiltinModels(provider).find(model => model.id === 'gpt-6.1-sol')
    assert.equal(supportsFastTier(provider, model), true)
    for (const id of ['gpt-7-sol', 'gpt-6.1-sol-custom', 'gpt-5.3-codex-spark', 'gpt-5.5-pro']) {
      assert.equal(supportsFastTier(provider, { ...model, id }), false)
    }
    assert.equal(supportsFastTier(provider, { ...model, api: 'openai-completions' }), false)
    assert.equal(supportsFastTier(provider, { ...model, baseUrl: 'https://gateway.example/v1' }), false)
    assert.equal(supportsFastTier('gateway', model), false)
  }
})

test('normal and Fast choices share capabilities and can be enabled independently', () => {
  const model = getBuiltinModels('openai').find(model => model.id === 'gpt-6.1-sol')
  const id = fastModelId(model.id)
  const defaults = modelChoices('openai', [model], {})
  assert.deepEqual(defaults.map(choice => [choice.id, choice.name, choice.enabled]), [
    [model.id, model.name, true], [id, `${model.name} Fast`, false],
  ])
  const selected = modelChoices('openai', [model], { disabledModels: [model.id], enabledFastModels: [id] })
  assert.equal(selected[0].enabled, false)
  assert.equal(selected[1].enabled, true)
  assert.equal(selected[0].model, selected[1].model)
  assert.throws(() => modelChoices('openai', [model, { ...model, id }], {}), /conflicts/)
})

test('normal and Fast requests preserve Pi payloads across effort levels and both APIs', async () => {
  const context = { messages: [{ role: 'user', content: 'test', timestamp: 0 }] }
  const token = `fixture.${Buffer.from(JSON.stringify({'https://api.openai.com/auth':{chatgpt_account_id:'fixture-account'}})).toString('base64url')}.fixture`
  for (const provider of ['openai', 'openai-codex']) {
    const model = getBuiltinModels(provider).find(model => model.id === 'gpt-6.1-sol')
    const api = await import(`@earendil-works/pi-ai/api/${model.api}`)
    const models = { stream: api.stream }
    for (const reasoning of [undefined, 'low', 'high', 'max']) {
      async function capture(tier) {
        let payload
        const options = { apiKey: token, reasoning, maxTokens: 1000, temperature: 0.5,
          maxRetries: 0, transport: 'sse', sessionId: 'fixture-session', headers: {'X-Fixture':'kept'},
          onPayload: value => { payload = structuredClone(value) },
          fetch: async () => { throw new Error('Fixture blocks all external requests') },
        }
        await (tier ? streamWithTier(models, model, context, options, tier) : api.streamSimple(model, context, options)).result()
        assert.ok(payload, `${provider}/${reasoning}: Pi did not build a request`)
        return payload
      }
      const original = await capture()
      for (const tier of ['default', 'priority']) {
        const actual = await capture(tier)
        assert.equal(actual.service_tier, tier)
        delete actual.service_tier
        assert.deepEqual(actual, original)
      }
    }
  }
})

test('Fast retains SDK service-tier pricing when the provider omits the returned tier', async () => {
  const context = { messages: [] }
  const token = `fixture.${Buffer.from(JSON.stringify({'https://api.openai.com/auth':{chatgpt_account_id:'fixture-account'}})).toString('base64url')}.fixture`
  for (const provider of ['openai', 'openai-codex']) {
    const model = getBuiltinModels(provider).find(model => model.id === 'gpt-6.1-sol')
    const api = await import(`@earendil-works/pi-ai/api/${model.api}`)
    const events = [
      {type:'response.created',response:{id:'resp_fixture'}},
      {type:'response.completed',response:{id:'resp_fixture',status:'completed',output:[],usage:{input_tokens:3,output_tokens:1,total_tokens:4}}},
    ].map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join('')
    const options = { apiKey:token, transport:'sse', maxRetries:0, fetch:async()=>new Response(events,{headers:{'content-type':'text/event-stream'}}) }
    const models = {stream:api.stream}
    const normal = await streamWithTier(models,model,context,options,'default').result()
    const fast = await streamWithTier(models,model,context,options,'priority').result()
    assert.equal(normal.stopReason,'stop'); assert.equal(fast.stopReason,'stop')
    assert.ok(normal.usage.cost.total > 0)
    assert.equal(fast.usage.cost.total,normal.usage.cost.total * 2)
  }
})
