/** Resolve public DSH routes without changing Pi's native provider identity. */
import type { Api, Model } from '@earendil-works/pi-ai'
import { resolveProfiles } from './config.ts'
import { catalogModels, catalogProvider } from './catalog.ts'
import type { Connection, ResolvedPiAiProviderProfile } from './config.ts'

export function resolveConnectionProfiles(
  connections: Readonly<Record<string, Connection>> | undefined,
  catalogs?: (serviceId: string, connectionId: string) => ReadonlyMap<string, Model<Api>> | undefined,
  validation: 'strict' | 'deferred' = 'strict',
): Map<string, ResolvedPiAiProviderProfile> {
  const routes = new Map<string, ResolvedPiAiProviderProfile>()
  for (const [connectionId, connection] of Object.entries(connections ?? {})) {
    // External integrations own their adapter, route, and credential plane.
    if (connection.integrationId !== 'pi') continue
    if (!connectionId || !connection.serviceId || !connection.routeId || !connection.credentialRecordId) {
      throw new Error('llm-pi-ai: connection identity must be non-empty')
    }
    if (!Number.isSafeInteger(connection.credentialGeneration) || connection.credentialGeneration < 0) {
      throw new Error(`llm-pi-ai: connection "${connectionId}" has an invalid credential generation`)
    }
    if (routes.has(connection.routeId)) throw new Error(`llm-pi-ai: duplicate connection route "${connection.routeId}"`)
    const installed = catalogs?.(connection.serviceId, connectionId)
    const defaults = installed ?? catalogModels(connection.serviceId)
    const native = catalogModels(connection.serviceId)
    const unverified = new Set<string>()
    let source = connection.profile
    // A newly created opaque gateway route has not verified the endpoint's
    // native image/reasoning capabilities. Preserve the original migrated
    // route and explicit Host model declarations; otherwise default only the
    // undeclared capabilities to text and provider-default reasoning.
    if (!connection.legacyRoute && connection.routeId !== connection.serviceId && source.baseURL !== undefined) {
      const endpoint = source.baseURL.replace(/\/+$/, '')
      for (const id of new Set([...defaults.keys(), ...source.models?.map(model => model.id) ?? []])) {
        const baseline = native.get(id)?.baseUrl ?? catalogProvider(connection.serviceId)?.baseUrl
        if (baseline === undefined || endpoint !== baseline.replace(/\/+$/, '')) unverified.add(id)
      }
      if (unverified.size && !source.models?.length) {
        const overrides = { ...source.modelOverrides }
        for (const id of unverified) {
          const declared = overrides[id]
          overrides[id] = {
            ...declared,
            reasoningEfforts: declared?.reasoningEfforts ?? false,
            input: declared?.input?.length ? [...declared.input] : ['text'],
          }
        }
        source = { ...source, modelOverrides: overrides }
      }
    }
    // Resolve each native provider separately: three OpenAI connections must
    // never overwrite one another in a dict keyed by Pi's provider id.
    const profile = resolveProfiles({ [connection.serviceId]: {
      ...source,
      displayName: connection.displayName,
      ...connection.credentialRef === undefined ? {} : { apiKeyEnv: connection.credentialRef },
    } }, validation, () => installed).get(connection.serviceId)!
    const model = profile.piProvider?.getModels()[0]
    routes.set(connection.routeId, {
      ...profile,
      provider: connection.routeId,
      connectionId,
      integrationId: connection.integrationId,
      serviceId: connection.serviceId,
      credentialRecordId: connection.credentialRecordId,
      credentialGeneration: connection.credentialGeneration,
      authMethod: connection.authMethod,
      ...connection.credentialRef === undefined ? {} : { credentialRef: connection.credentialRef },
      ...connection.headerRefs === undefined ? {} : { headerRefs: { ...connection.headerRefs } },
      integrationLabel: connection.integrationLabel ?? (connection.integrationId === 'pi' ? 'Pi' : connection.integrationId),
      serviceLabel: connection.serviceLabel ?? catalogProvider(connection.serviceId)?.name ?? connection.serviceId,
      modelChoices: profile.modelChoices.map(choice => unverified.has(choice.model.id)
        ? { ...choice, capabilityUnverified: true } : choice),
      replayScope: {
        connectionId,
        credentialGeneration: connection.credentialGeneration,
        endpoint: model?.baseUrl ?? connection.profile.baseURL ?? '',
        api: model?.api ?? connection.profile.api ?? '',
        ...connection.legacyRoute ? { legacyRoute: connection.routeId } : {},
      },
    })
  }
  return routes
}
