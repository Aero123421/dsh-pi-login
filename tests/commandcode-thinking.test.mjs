import { test } from 'node:test'
import assert from 'node:assert/strict'
import { anthropicMessagesApi } from '@earendil-works/pi-ai/api/anthropic-messages.lazy'
import { parseCommandCatalog } from '../src/catalog-parsers.mjs'

async function requestFor(id, reasoning) {
  const model = parseCommandCatalog({ data: [{
    id, supported_endpoints: ['/v1/messages'], reasoning_efforts: ['high', 'max'],
  }] }).models[0]
  const requests = []
  const events = anthropicMessagesApi().streamSimple(model, {
    messages: [{ role: 'user', content: 'ping', timestamp: 0 }],
  }, {
    apiKey: 'fixture-command-key', reasoning, maxRetries: 0,
    fetch: async (url, init) => {
      requests.push({ url: String(url), body: JSON.parse(init.body) })
      const response = [
        { type: 'message_start', message: { id: 'msg_fixture', type: 'message', role: 'assistant', model: id,
          content: [], usage: { input_tokens: 1, output_tokens: 0 } } },
        { type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 0 } },
        { type: 'message_stop' },
      ]
      return new Response(response.map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join(''), {
        headers: { 'content-type': 'text/event-stream' },
      })
    },
  })
  let done = false
  for await (const event of events) {
    if (event.type === 'error') assert.fail(event.error.errorMessage)
    if (event.type === 'done') done = true
  }
  assert.equal(done, true)
  assert.equal(requests.length, 1)
  const url = new URL(requests[0].url)
  assert.equal(url.origin, 'https://api.commandcode.ai')
  assert.equal(url.pathname, '/provider/v1/messages')
  return requests[0].body
}

// Haiku 5.5 uses adaptive thinking, unlike Haiku 4.5:
// https://platform.claude.com/docs/en/models/haiku-5-5/overview
test('CommandCode Haiku 5.5 sends the selected adaptive effort through the SDK', async () => {
  for (const effort of ['high', 'max']) {
    const body = await requestFor('claude-haiku-5-5', effort)
    assert.equal(body.thinking.type, 'adaptive')
    assert.equal(body.output_config.effort, effort)
    assert.equal(body.thinking.budget_tokens, undefined)
  }
})

test('CommandCode Haiku 4.5 keeps budget-based thinking', async () => {
  const body = await requestFor('claude-haiku-4-5', 'high')
  assert.equal(body.thinking.type, 'enabled')
  assert.ok(body.thinking.budget_tokens > 0)
  assert.equal(body.output_config, undefined)
})
