export const SERVICE_GROUPS = [
  { id: 'pi', label: 'Pi' }, { id: 'meta', label: 'Meta' },
  { id: 'commandcode', label: 'CommandCode' }, { id: 'ollama-cloud', label: 'Ollama Cloud' },
  { id: 'opencode', label: 'OpenCode' },
]

/** Presentation only: saved owner, route and credential identities never change. */
export function serviceGroup(entry) {
  if (entry.integrationId === 'meta-muse-code' || entry.integrationId === 'pi' && entry.serviceId === 'meta') return 'meta'
  if (entry.integrationId !== 'pi') return 'external'
  if (['opencode', 'opencode-go'].includes(entry.serviceId)) return 'opencode'
  if (['commandcode', 'ollama-cloud'].includes(entry.serviceId)) return entry.serviceId
  return 'pi'
}
