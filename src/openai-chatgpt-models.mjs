// SIWC: https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference
// The account listing is authoritative for identity, order and picker visibility.
export function chatGPTModelRows(payload) {
  if (!Array.isArray(payload?.models)) throw new Error('invalid-model-list')
  const seen = new Set()
  return payload.models.flatMap(row => {
    if (!row || row.visibility !== 'list' || typeof row.slug !== 'string'
      || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(row.slug) || seen.has(row.slug)) return []
    seen.add(row.slug)
    const name = typeof row.display_name === 'string' ? row.display_name.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 200) : ''
    return [{ id: row.slug, name: name || row.slug }]
  })
}
