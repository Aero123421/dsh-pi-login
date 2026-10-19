import { CATALOG_CONTROL } from './catalog-metadata.mjs'

export const EFFORT_LEVELS = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']

/** Missing metadata is not permission to invent an effort ladder. */
export function thinkingControls(values, defaultValue) {
  if (!Array.isArray(values)) return { reasoning: false }
  const toggle = values.includes(true) && !values.some(value => typeof value === 'string' && value !== 'none')
  const map = Object.fromEntries(EFFORT_LEVELS.map(level => [level, null]))
  for (const level of EFFORT_LEVELS.slice(1)) if (values.includes(level)) map[level] = level
  if (values.includes(false) || values.includes('none')) map.off = 'none'
  // Ollama's documented OpenAI compatibility alias enables boolean-only models.
  if (toggle) map.high = 'high'
  const reasoning = Object.values(map).some(value => value !== null)
  const offeredDefault = values.includes(defaultValue)
    ? defaultValue === false || defaultValue === 'none' ? 'off' : defaultValue === true ? 'on' : defaultValue
    : undefined
  return {
    reasoning,
    ...(reasoning ? { thinkingLevelMap: map } : {}),
    control: { toggle, ...(offeredDefault && (EFFORT_LEVELS.includes(offeredDefault) || offeredDefault === 'on') ? { defaultEffort: offeredDefault } : {}),
      // Keep the original vocabulary for future bridge versions; do not mislabel unknown levels.
      values: values.filter(value => typeof value === 'boolean' || typeof value === 'string').slice(0, 32) },
  }
}

/** SDK defaults often interpret omitted effort as off. Dynamic catalogs keep them distinct. */
export function modelForCatalogRequest(model, effort) {
  if (!model[CATALOG_CONTROL] || effort !== undefined) return model
  return { ...model, thinkingLevelMap: { ...model.thinkingLevelMap, off: null } }
}
