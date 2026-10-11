import { buildBaseOptions } from '@earendil-works/pi-ai/api/simple-options'
import type { Api, Model, Models, SimpleStreamOptions, TranscriptContext } from '@earendil-works/pi-ai'
import { catalogProvider, PiAiCatalogError } from './catalog.ts'

// Exact IDs advertised by OpenAI's Fast pricing and Codex speed documentation.
// Keep this small table with SDK updates; unknown IDs and gateways stay ordinary.
const GPT_FAST_IDS = [
  'gpt-5.5', 'gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna',
  'gpt-6-astra', 'gpt-6-sol', 'gpt-6-luna', 'gpt-6.1-sol',
]
const API_FAST_IDS = new Set(['gpt-5', 'gpt-5-mini', 'gpt-5.1', 'gpt-5.2', 'gpt-5.4', 'gpt-5.4-mini', ...GPT_FAST_IDS])
const CODEX_FAST_IDS = new Set(GPT_FAST_IDS)

export function supportsFastTier(provider: string, model: Model<Api>): boolean {
  const supported = provider === 'openai' ? API_FAST_IDS : provider === 'openai-codex' ? CODEX_FAST_IDS : undefined
  if (!supported?.has(model.id)) return false
  const original = catalogProvider(provider)?.getModels().find(entry => entry.id === model.id)
  return original !== undefined && model.api === original.api
    && model.baseUrl.replace(/\/+$/, '') === original.baseUrl.replace(/\/+$/, '')
}

export function fastModelId(model: string): string { return `${model}::fast` }

export interface ModelChoice {
  id: string
  name: string
  model: Model<Api>
  enabled: boolean
  serviceTier?: 'default' | 'priority'
}

/** Shared by settings and the adapter; Fast choices require an explicit opt-in. */
export function modelChoices(provider: string, models: readonly Model<Api>[], profile: {
  disabledModels?: readonly string[]
  enabledFastModels?: readonly string[]
}): ModelChoice[] {
  const ids = new Set(models.map(model => model.id))
  return models.flatMap(model => {
    const supported = supportsFastTier(provider, model)
    const ordinary: ModelChoice = {
      id: model.id, name: model.name, model, enabled: !profile.disabledModels?.includes(model.id),
      ...supported ? { serviceTier: 'default' as const } : {},
    }
    if (!supported) return [ordinary]
    const id = fastModelId(model.id)
    if (ids.has(id)) throw new PiAiCatalogError(`Fast model ID "${id}" conflicts with a configured model`)
    return [ordinary, {
      id, name: `${model.name} Fast`, model,
      enabled: profile.enabledFastModels?.includes(id) === true, serviceTier: 'priority' as const,
    }]
  })
}

/** Use Pi's own option builder, reasoning mapping and service-tier accounting. */
export function streamWithTier(
  models: Models, model: Model<Api>, context: TranscriptContext,
  options: SimpleStreamOptions, serviceTier: 'default' | 'priority',
) {
  const full = {
    ...buildBaseOptions(model, context, options, options.apiKey),
    ...options.reasoning === undefined ? {} : { reasoningEffort: options.reasoning },
    ...options.toolChoice === undefined ? {} : { toolChoice: options.toolChoice },
    serviceTier,
  }
  if (model.api === 'openai-responses') return models.stream(model as Model<'openai-responses'>, context, full)
  if (model.api === 'openai-codex-responses') return models.stream(model as Model<'openai-codex-responses'>, context, full)
  throw new Error('Fast choices require an OpenAI Responses API')
}
