import { ProviderReadError } from './provider-cache.mjs'
import { EFFORT_LEVELS, thinkingControls } from './catalog-controls.mjs'

const ID = /^[A-Za-z0-9][A-Za-z0-9._:/@+-]{0,255}$/
const COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
const positive = value => Number.isSafeInteger(value) && value > 0 ? value : undefined
const label = (value, fallback) => typeof value === 'string' && value.trim() ? value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 200) : fallback
const object = value => value && typeof value === 'object' && !Array.isArray(value)
// Pi 1.4.0 removed these IDs because the Codex backend rejects them for ChatGPT
// accounts: https://github.com/earendil-works/pi/pull/11173
const unsupportedCodexModels = new Set(['gpt-5.5', 'gpt-5.3-codex-spark'])
export const isUnsupportedPiModel = (provider, id) => provider === 'openai-codex' && unsupportedCodexModels.has(id)
const compatBooleans = new Set([
  'supportsStore', 'supportsDeveloperRole', 'supportsReasoningEffort', 'supportsUsageInStreaming',
  'requiresToolResultName', 'requiresAssistantAfterToolResult', 'requiresThinkingAsText',
  'requiresAssistantReasoningContent', 'requiresReasoningContentOnAssistantMessages', 'requiresMistralToolIds', 'supportsStrictMode',
  'forceAdaptiveThinking', 'supportsLongCacheRetention', 'supportsInterleavedThinking',
  'supportsToolChoice', 'supportsTemperature', 'supportsTopP', 'supportsMidConvoSystemMessages',
])
const compatStrings = {
  maxTokensField: new Set(['max_tokens', 'max_completion_tokens']),
  thinkingFormat: new Set(['openai', 'zai', 'qwen', 'qwen-chat-template', 'chat-template', 'baseten', 'deepseek', 'openrouter', 'ant-ling', 'together', 'string-thinking']),
}

export function catalogRows(body) {
  const rows = Array.isArray(body) ? body : Array.isArray(body?.models) ? body.models
    : Array.isArray(body?.data) ? body.data
      : object(body) && !('models' in body) && !('data' in body) && Object.values(body).every(row => object(row) && typeof row.id === 'string') ? Object.values(body) : undefined
  if (!rows || rows.length > 10000) throw new ProviderReadError('error')
  return rows
}

function safeCompat(value) {
  if (!object(value)) return {}
  return Object.fromEntries(Object.entries(value).filter(([key, entry]) =>
    compatBooleans.has(key) && typeof entry === 'boolean' || compatStrings[key]?.has(entry)))
}

/** Only transports and credential destinations already owned by the installed provider. */
export function parsePiCatalog(provider, body, baseline) {
  const models = [], apis = new Set([...baseline.values()].map(model => model.api))
  const origins = new Set([...baseline.values()].flatMap(model => { try { return [new URL(model.baseUrl).origin] } catch { return [] } }))
  let skipped = 0
  for (const row of catalogRows(body)) {
    if (!object(row) || row.type && row.type !== 'chat') continue
    if (isUnsupportedPiModel(provider, row.id)) { skipped++; continue }
    const base = baseline.get(row.id)
    let url
    try { url = new URL(row.baseUrl ?? base?.baseUrl) } catch { skipped++; continue }
    if (!ID.test(row.id ?? '') || !apis.has(row.api ?? base?.api) || !origins.has(url.origin)
      || url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) { skipped++; continue }
    const contextWindow = positive(row.contextWindow) ?? base?.contextWindow
    const maxTokens = positive(row.maxTokens) ?? base?.maxTokens
    if (!contextWindow || !maxTokens) { skipped++; continue }
    const map = row.thinkingLevelMap ?? base?.thinkingLevelMap
    const reasoning = row.reasoning ?? base?.reasoning ?? false
    // Pi maps are overrides: absent standard levels retain SDK defaults, while
    // null explicitly disables one. Do not turn a sparse map into all-null.
    const thinkingLevelMap = object(map) ? Object.fromEntries(EFFORT_LEVELS.filter(level => Object.hasOwn(map, level)).map(level => [level,
      typeof map[level] === 'string' && map[level].length > 0 && map[level].length <= 64 ? map[level] : null])) : undefined
    const costs = Object.fromEntries(Object.keys(COST).map(key => [key,
      Number.isFinite(row.cost?.[key]) && row.cost[key] >= 0 ? row.cost[key] : base?.cost?.[key] ?? 0]))
    const input = (Array.isArray(row.input) ? row.input : base?.input ?? ['text']).filter(value => value === 'text' || value === 'image')
    models.push({
      id: row.id, name: label(row.name, row.id), provider, api: row.api ?? base.api,
      baseUrl: url.href.replace(/\/$/, ''), contextWindow, maxTokens, input: input.length ? input : ['text'], cost: costs,
      // Unknown models with only a reasoning boolean have no verified effort control.
      reasoning: reasoning === true && (thinkingLevelMap !== undefined || base?.reasoning === true),
      ...(thinkingLevelMap ? { thinkingLevelMap } : {}),
      compat: { ...base?.compat, ...safeCompat(row.compat) }, control: { toggle: false }, verified: true,
    })
  }
  return { models, skipped }
}

/** The live CommandCode roster and endpoint list own availability and routing. */
export function parseCommandCatalog(body, references = {}) {
  if (!Array.isArray(body?.data) || body.data.length > 10000) throw new ProviderReadError('error')
  let skipped = 0
  const models = []
  for (const row of body.data) {
    if (!object(row) || !ID.test(row.id ?? '')) { skipped++; continue }
    const endpoints = row.supported_endpoints
    const has = endpoint => Array.isArray(endpoints) && (endpoints.includes(endpoint) || endpoints.includes(`/v1${endpoint}`))
    const api = has('/messages') ? 'anthropic-messages'
      : has('/responses') && row.id.startsWith('gpt-') ? 'openai-responses'
        : has('/chat/completions') ? 'openai-completions' : has('/responses') ? 'openai-responses' : undefined
    if (!api) { skipped++; continue }
    const reference = references[row.id]
    const effort = Array.isArray(row.reasoning_efforts) ? row.reasoning_efforts
      : reference?.reasoning_options?.find(option => option.type === 'effort')?.values
    const controls = thinkingControls(effort, row.default_reasoning_effort)
    const input = row.modalities?.input ?? reference?.modalities?.input
    models.push({
      id: row.id, name: label(row.name, reference?.name ?? row.id), provider: 'commandcode', api,
      baseUrl: `https://api.commandcode.ai/provider${api === 'anthropic-messages' ? '' : '/v1'}`,
      contextWindow: positive(row.context_length) ?? positive(reference?.limit?.context) ?? 131072,
      maxTokens: positive(row.max_output_tokens) ?? positive(reference?.limit?.output) ?? 32768,
      input: Array.isArray(input) && input.includes('image') ? ['text', 'image'] : ['text'], cost: COST,
      ...controls,
      compat: api === 'anthropic-messages' ? { forceAdaptiveThinking: controls.reasoning && /(?:opus[-.](?:4[-.][6-9]|5)|sonnet[-.](?:4[-.]6|5)|haiku[-.]5[-.]5|fable[-.]5|mythos[-.]5)/.test(row.id) }
        : { supportsDeveloperRole: false, supportsStore: false, supportsReasoningEffort: controls.reasoning, maxTokensField: 'max_tokens' },
      verified: !!effort && Array.isArray(input),
    })
  }
  return { models, skipped }
}

export function parseOllamaModel(row, show, previous) {
  if (!object(row)) return undefined
  const id = row.model ?? row.name
  if (!ID.test(id ?? '')) return undefined
  const capabilities = Array.isArray(show?.capabilities) ? show.capabilities : undefined
  if (capabilities && !capabilities.includes('completion')) return undefined
  const contextWindow = positive(Object.entries(show?.model_info ?? {}).find(([key]) => key.endsWith('.context_length'))?.[1])
    ?? previous?.contextWindow ?? 131072
  const controls = thinkingControls(show?.thinking?.values, show?.thinking?.default)
  return {
    id, name: label(row.name, id), provider: 'ollama-cloud', api: 'openai-completions', baseUrl: 'https://ollama.com/v1',
    contextWindow, maxTokens: positive(show?.max_output_tokens) ?? previous?.maxTokens ?? Math.min(contextWindow, 8192),
    input: capabilities ? capabilities.includes('vision') ? ['text', 'image'] : ['text'] : previous?.input ?? ['text'], cost: COST,
    // A missing show response may reuse this exact account/model's metadata. An explicit
    // show response without thinking metadata must not invent a ladder.
    ...(show === undefined && previous ? { reasoning: previous.reasoning, thinkingLevelMap: previous.thinkingLevelMap, control: previous.control } : controls),
    compat: { supportsDeveloperRole: false, supportsStore: false, supportsReasoningEffort: true, maxTokensField: 'max_tokens' },
    verified: !!capabilities && !!show?.model_info,
  }
}
