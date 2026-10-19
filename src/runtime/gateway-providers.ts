import type { Api, Provider, ProviderStreams } from '@earendil-works/pi-ai'
import { anthropicMessagesApi } from '@earendil-works/pi-ai/api/anthropic-messages.lazy'
import { openAICompletionsApi } from '@earendil-works/pi-ai/api/openai-completions.lazy'
import { openAIResponsesApi } from '@earendil-works/pi-ai/api/openai-responses.lazy'

/** Provider identity and transport only. Inventories belong to the catalog session. */
export function gatewayProviders(): Provider[] {
  return [
    gateway('commandcode', 'CommandCode', 'https://api.commandcode.ai/provider/v1', {
      'anthropic-messages': anthropicMessagesApi(),
      'openai-completions': openAICompletionsApi(),
      'openai-responses': openAIResponsesApi(),
    }),
    gateway('ollama-cloud', 'Ollama Cloud', 'https://ollama.com/v1', {
      'openai-completions': openAICompletionsApi(),
    }),
  ]
}

function gateway(id: string, name: string, baseUrl: string, apis: Record<string, ProviderStreams>): Provider {
  const apiFor = (api: Api) => {
    const implementation = apis[api]
    if (!implementation) throw new Error(`Unsupported ${name} protocol: ${api}`)
    return implementation
  }
  return {
    id, name, baseUrl,
    auth: { apiKey: { name: `${name} API key`, resolve: async ({ credential }) => ({
      auth: credential?.key === undefined ? {} : { apiKey: credential.key }, source: name,
    }) } },
    getModels: () => [],
    stream: (model, context, options) => apiFor(model.api).stream(model, context, options),
    streamSimple: (model, context, options) => apiFor(model.api).streamSimple(model, context, options),
  }
}
