/** Optional GPT Fast tier. This is independent of reasoning effort. */
import { buildBaseOptions } from '@earendil-works/pi-ai/api/simple-options'
import type {
  Api, Model, Models, SimpleStreamOptions, TranscriptContext,
} from '@earendil-works/pi-ai'

/** Only offer Fast on OpenAI's known GPT families and Responses transports. */
export function supportsFastTier(provider: string, model: Pick<Model<Api>, 'api' | 'id'>): boolean {
  if (provider !== 'openai' && provider !== 'openai-codex') return false
  if (model.api !== 'openai-responses' && model.api !== 'openai-codex-responses') return false
  // The documented GPT-5.4–5.6 and GPT-6/6.1 families. Never match Codex-Spark.
  return /^gpt-(?:5\.(?:4|5|6)|6(?:\.1)?)(?:-|$)/.test(model.id)
}

/**
 * streamSimple() does not pass serviceTier through buildBaseOptions in Pi 1.1.0.
 * Use the typed full stream path when Fast is explicitly enabled, retaining
 * its usual context-aware max-token cap, credentials, headers and transport.
 * "priority" is the backwards-compatible wire spelling of OpenAI Fast.
 */
export function streamFast(
  models: Models,
  model: Model<Api>,
  context: TranscriptContext,
  options: SimpleStreamOptions,
) {
  const full = {
    ...buildBaseOptions(model, context, options, options.apiKey),
    ...options.reasoning === undefined ? {} : { reasoningEffort: options.reasoning },
    ...options.toolChoice === undefined ? {} : { toolChoice: options.toolChoice },
    serviceTier: 'priority' as const,
  }
  if (model.api === 'openai-responses') {
    return models.stream(model as Model<'openai-responses'>, context, full)
  }
  if (model.api === 'openai-codex-responses') {
    return models.stream(model as Model<'openai-codex-responses'>, context, full)
  }
  throw new Error('Fast tier is only supported for OpenAI Responses models')
}
