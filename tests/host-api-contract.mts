// Compile-only consumer contract against an isolated official DSH install.
// The fixture function is never invoked; tsc runs with noEmit.
import type { Context } from '@deepseek-ai/cordis'
import { evaluatePluginCompatibility } from '@deepseek-ai/dsh-app-boot'
import { credentialKey } from '@deepseek-ai/dsh-credentials'
import '@deepseek-ai/dsh-authorization'
import '@deepseek-ai/dsh-client-connection'
import '@deepseek-ai/dsh-settings'
import '@deepseek-ai/dsh-llm'
import type { LlmResolvedModelInfo } from '@deepseek-ai/dsh-llm'

export async function contract(ctx: Context) {
  const issue = evaluatePluginCompatibility({ name: '@local/dsh-pi-login', version: '0.8.1',
    peerDependencies: { '@deepseek-ai/dsh-llm': '>=0.2.1-alpha.2 <0.3.0-0' } }, {}, '0.2.1-rc.5')
  const requirements: Record<string, string> | undefined = issue?.requirements
  const key = credentialKey('llm-pi-ai', 'contract-fixture')
  await ctx.credentials.modifyRecord(key, async () => ({ kind: 'api-key', key: 'fixture-not-real' }))
  await ctx.credentials.readRecord(key)
  ctx.authorization.registerFlow({ key, label: 'Fixture', methods: [{ id: 'oauth', label: 'Fixture' }],
    async run(session) { session.notify({ message: 'Fixture only' }) } })
  ctx.connection.fetch.register({ path: '/api/contract-fixture', methods: ['POST'], requestBody: 'buffered',
    async fetch() { return Response.json({ ok: true }) } })
  ctx.settings.describe()
  const model: Pick<LlmResolvedModelInfo, 'provider' | 'id' | 'name' | 'context' | 'systemPromptUpdate'> = {
    provider: 'fixture', id: 'fixture', name: 'Fixture', context: { contextWindow: 262144 }, systemPromptUpdate: 'in-history',
  }
  return { requirements, model }
}
