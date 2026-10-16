import { buildBaseOptions } from '@earendil-works/pi-ai/api/simple-options'
import type { Api, Context, Model, Models, SimpleStreamOptions, TranscriptContext } from '@earendil-works/pi-ai'
import { catalogProvider, PiAiCatalogError } from './catalog.ts'
import { MUSE_CONTRIBUTOR, MUSE_CONTRIBUTOR_ONLY, MUSE_CONTRIBUTOR_CAPS, MUSE_EFFORTS_UNVERIFIED, MUSE_CONTRIBUTOR_HEADER } from '../catalog-metadata.mjs'

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
export function contributorModelId(model: string): string { return `${model}::contributor` }

export interface ModelChoice {
  id: string
  name: string
  model: Model<Api>
  enabled: boolean
  discovered?: boolean
  capabilityUnverified?: boolean
  serviceTier?: 'default' | 'priority'
  /** Muse Code Contributor mode: Meta may train on this choice's content. */
  contributor?: boolean
  /** Per-choice request headers; credentials never travel here. */
  headers?: Readonly<Record<string, string>>
  /** The account catalog did not list reasoning efforts, so Max is not offered. */
  effortsUnverified?: boolean
}

function museRecord(model: Model<Api>): Record<symbol, unknown> {
  return model as unknown as Record<symbol, unknown>
}

function unverifiedChoice(model: Model<Api>): { effortsUnverified: true } | Record<string, never> {
  return museRecord(model)[MUSE_EFFORTS_UNVERIFIED] === true ? { effortsUnverified: true } : {}
}

/** Shared by settings and the adapter; Fast choices require an explicit opt-in. */
export function modelChoices(provider: string, models: readonly Model<Api>[], profile: {
  disabledModels?: readonly string[]
  enabledFastModels?: readonly string[]
  enabledDiscoveredModels?: readonly string[]
  enabledContributorModels?: readonly string[]
  models?: readonly { id: string }[]
}, discoveredIds: ReadonlySet<string> = new Set()): ModelChoice[] {
  const ids = new Set(models.map(model => model.id))
  const byId = new Map(models.map(model => [model.id, model]))
  const configuredIds = new Set(profile.models?.map(model => model.id) ?? [])
  return models.flatMap(model => {
    const supported = supportsFastTier(provider, model)
    const muse = museRecord(model)[MUSE_CONTRIBUTOR]
    if (muse !== undefined) {
      const contributorOnly = museRecord(model)[MUSE_CONTRIBUTOR_ONLY] === true
      if (contributorOnly) {
        const base = byId.get(model.id.slice(0, -'-contributor'.length))
        // The base offers this exact native descriptor under one stable UI
        // choice. If the base is absent, offer only the returned native ID.
        if (base && museRecord(base)[MUSE_CONTRIBUTOR] !== undefined) return []
        return [{ id: model.id, name: model.name, model, contributor: true,
          enabled: profile.enabledContributorModels?.includes(model.id) === true && !profile.disabledModels?.includes(model.id),
          headers: { [MUSE_CONTRIBUTOR_HEADER]: '1' }, ...unverifiedChoice(model) }]
      }
      // A Muse Code request always states its mode, so a Standard choice
      // never inherits the account's Contributor default.
      const standard: ModelChoice = { id: model.id, name: model.name, model,
        enabled: !profile.disabledModels?.includes(model.id), headers: { [MUSE_CONTRIBUTOR_HEADER]: '0' },
        ...unverifiedChoice(model) }
      const native = byId.get(`${model.id}-contributor`)
      const nativeContributor = native && museRecord(native)[MUSE_CONTRIBUTOR_ONLY] === true ? native : undefined
      const caps = museRecord(model)[MUSE_CONTRIBUTOR_CAPS]
      const sameIdCaps = caps && typeof caps === 'object' && (caps as Model<Api>).id === model.id ? caps as Model<Api> : undefined
      if (!muse && !nativeContributor && !sameIdCaps) return [standard]
      const id = contributorModelId(model.id)
      if (ids.has(id)) throw new PiAiCatalogError(`Contributor model ID "${id}" conflicts with a configured model`)
      // Native IDs keep the provider's model id. A same-id Contributor listing
      // keeps the base id and its own effort map, instead of Standard's.
      const contributorModel = nativeContributor ?? sameIdCaps ?? model
      return [standard, { id, name: `${model.name} Contributor`, model: contributorModel, contributor: true,
        enabled: profile.enabledContributorModels?.includes(id) === true && !(nativeContributor && profile.disabledModels?.includes(nativeContributor.id)),
        headers: { [MUSE_CONTRIBUTOR_HEADER]: '1' }, ...unverifiedChoice(contributorModel) }]
    }
    const ordinary: ModelChoice = {
      id: model.id, name: model.name, model,
      enabled: !profile.disabledModels?.includes(model.id) && (!discoveredIds.has(model.id) || profile.enabledDiscoveredModels?.includes(model.id) === true || configuredIds.has(model.id)),
      ...discoveredIds.has(model.id) ? { discovered: true } : {},
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
  models: Models, model: Model<Api>, context: Context,
  options: SimpleStreamOptions, serviceTier: 'default' | 'priority',
) {
  const full = {
    // The transcript brand is type-only. Models.stream normalizes before the
    // provider, and buildBaseOptions only estimates tokens from the messages.
    ...buildBaseOptions(model, context as TranscriptContext, options, options.apiKey),
    ...options.reasoning === undefined ? {} : { reasoningEffort: options.reasoning },
    ...options.toolChoice === undefined ? {} : { toolChoice: options.toolChoice },
    serviceTier,
  }
  if (model.api === 'openai-responses') return models.stream(model as Model<'openai-responses'>, context, full)
  if (model.api === 'openai-codex-responses') return models.stream(model as Model<'openai-codex-responses'>, context, full)
  throw new Error('Fast choices require an OpenAI Responses API')
}
