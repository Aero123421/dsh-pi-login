import type { Api, Model } from '@earendil-works/pi-ai'

/**
 * Model metadata published after the pinned SDK's catalog was generated.
 * Sources and verification limits are recorded in docs/models.md. Keep this
 * separate from SDK data: a future SDK entry takes precedence automatically.
 */
const additions: readonly Model<Api>[] = [{
  id: 'muse-wonder-1.0',
  name: 'Muse Wonder',
  provider: 'meta',
  api: 'openai-responses',
  baseUrl: 'https://api.meta.ai/v1',
  reasoning: true,
  input: ['text', 'image'],
  contextWindow: 1048576,
  maxTokens: 131072,
  thinkingLevelMap: {
    off: null,
    minimal: 'minimal',
    low: 'low',
    medium: 'medium',
    high: 'high',
    xhigh: 'xhigh',
    max: 'max',
  },
  // Meta has not published rates. As with hand-declared models, zero means
  // unknown here; the Harness does not report spend from this metadata.
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
}]

/** Merge additions without replacing any model shipped by the installed SDK. */
export function supplementCatalog(provider: string, installed: readonly Model<Api>[]): Map<string, Model<Api>> {
  const catalog = new Map(installed.map(model => [model.id, model]))
  for (const model of additions) {
    if (model.provider === provider && !catalog.has(model.id)) catalog.set(model.id, model)
  }
  return catalog
}
