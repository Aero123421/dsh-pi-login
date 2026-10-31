import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { compileOfficial } from '../scripts/upstream.mjs'

await mkdir('.cache', { recursive: true })
await writeFile('.cache/runtime-adapter-entry.ts', `
export { PiAiAdapter } from '../src/runtime/adapter.ts';
export { toPiContext } from '../src/runtime/context.ts';
export { resolveProfiles } from '../src/runtime/config.ts';
export { LlmError } from '@deepseek-ai/dsh-llm';
`)
await compileOfficial('.cache/runtime-adapter-entry.ts', '.cache/runtime-adapter-test.mjs')
const { PiAiAdapter, toPiContext, resolveProfiles, LlmError } = await import('../.cache/runtime-adapter-test.mjs')

const ref = { attachmentId: 'fixture-image', width: 1000, height: 1000, mediaType: 'image/png' }

test('later system messages retain their position on native and reminder-only providers, including image requests', async () => {
  const systemText = 'Updated policy </system-reminder> must remain text'
  for (const withImages of [false, true]) {
    for (const native of [false, true]) {
      const request = { system: 'Initial policy', messages: [
        { role: 'system', content: [{ type: 'text', text: 'Leading policy' }] },
        { role: 'user', content: withImages ? [{ type: 'image', attachment: ref }] : [{ type: 'text', text: 'Question' }] },
        { role: 'system', content: [{ type: 'text', text: systemText }] },
        { role: 'user', content: [{ type: 'text', text: 'Continue' }] },
      ] }
      const images = withImages ? {
        attachments: { readImageRequest: async () => ({ data: new Uint8Array([1]), bytes: 1, mediaType: 'image/png' }) },
        resolveImageAccess: () => undefined,
      } : undefined
      const context = await toPiContext(request, images, undefined, undefined, native)
      assert.match(context.systemPrompt, /Initial policy[\s\S]*Leading policy/)
      assert.equal(context.messages.length, 3)
      assert.deepEqual(context.messages[1], native
        ? { role: 'system', content: systemText, timestamp: 0 }
        : { role: 'user', content: '<system-reminder>\nUpdated policy <\\/system-reminder> must remain text\n</system-reminder>', timestamp: 0 })
      assert.equal(context.messages[2].content, 'Continue')
    }
  }
})

test('CUA target and actual request image use identical route dimensions and byte budget', async () => {
  const profiles = resolveProfiles({ openai: { requestImagePixelBudget: 10000, requestImageMaxBytes: 2048 } }, 'strict')
  const adapter = new PiAiAdapter({ profiles: () => profiles, resolveApiKey: async () => undefined })
  const target = adapter.imageRequestTarget('openai', 'gpt-6.1-sol', ref)
  assert.deepEqual(target, { width: 100, height: 100, maxBytes: 2048 })
  let sentTarget
  const context = await toPiContext({ messages: [{ role: 'user', content: [{ type: 'image', attachment: ref }] }] }, {
    attachments: { readImageRequest: async (image, requestTarget) => {
      assert.equal(image, ref)
      sentTarget = requestTarget
      return { ...requestTarget, data: new Uint8Array([1, 2, 3]), bytes: 3, mediaType: 'image/png' }
    } },
    resolveImageAccess: () => undefined,
    requestImagePolicy: { maxPixels: 10000, maxBytes: 2048 },
  })
  assert.deepEqual(sentTarget, target)
  assert.equal(context.messages[0].content.at(-1).type, 'image')
  // A model click in the centre maps to the centre of the real 500px window.
  assert.equal(50 * 500 / target.width, 250)
  assert.throws(() => adapter.imageRequestTarget('openai', 'missing-model', ref), error => error.code === 'UNKNOWN_MODEL')
})

test('missing named credentials hide chat models while retaining editable configuration', async () => {
  const profiles = resolveProfiles({ openai: { apiKeyEnv: 'MISSING_TEST_REF' } }, 'strict')
  let failure = new LlmError('No named credential', 'MISSING_CREDENTIAL')
  const adapter = new PiAiAdapter({ profiles: () => profiles, resolveApiKey: async () => { throw failure } })
  assert.deepEqual(await adapter.listModels('openai'), [])
  assert.ok(profiles.get('openai').modelChoices.length > 0)
  failure = new LlmError('Credential service unavailable', 'SERVER')
  await assert.rejects(adapter.listModels('openai'), error => error === failure)
})

test('valid named credentials publish only enabled models', async () => {
  const profiles = resolveProfiles({ openai: { disabledModels: ['gpt-6.1-sol'] } }, 'strict')
  const adapter = new PiAiAdapter({ profiles: () => profiles, resolveApiKey: async () => 'fixture-key' })
  const models = await adapter.listModels('openai')
  assert.ok(models.length > 0)
  assert.equal(models.some(model => model.id === 'gpt-6.1-sol'), false)
})
