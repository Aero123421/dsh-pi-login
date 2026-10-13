import { applyLoginUI } from './routes.mjs'
import { apply as applyRuntime, Config } from './runtime/index.ts'
import { catalogModels, catalogProvider, catalogProviderIds, resolveRouteModels } from './runtime/catalog.ts'
import { credentialStoreFrom, connectionAuthFrom } from './runtime/auth.ts'
import { createModels } from './runtime/models.ts'
import { resolveConnectionProfiles } from './runtime/connections.ts'
import { IntegrationRegistry } from './registry.mjs'
import { ConnectionManager, ConnectionError, profileKeyFor } from './connections.mjs'
import { AccountUsageManager, createPiUsageProviders } from './account-usage.mjs'
import { createMuseCodeOwner } from './muse-code-owner.mjs'
import { createExternalIntegrations } from './external-integrations.mjs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { MetaCatalogSession } from './meta-catalog.mjs'
import { metaCatalogProvider } from './meta-catalog-provider.mjs'
import { ProviderCatalogs } from './provider-catalogs.mjs'
import { DISCOVERED_MODEL } from './catalog-metadata.mjs'
import { DEFAULT_INPUT, DEFAULT_CONTEXT_WINDOW, DEFAULT_MAX_TOKENS } from './runtime/config.ts'
import { modelChoices } from './runtime/fast.ts'
export { Config, applyLoginUI }
export { IntegrationRegistry, ConnectionManager, connectionAuthFrom, resolveConnectionProfiles }
export { createMuseCodeOwner }
export { ProviderCatalogs } from './provider-catalogs.mjs'
export { DISCOVERED_MODEL } from './catalog-metadata.mjs'
export { PiAiAdapter } from './runtime/adapter.ts'
export { resolveProfiles } from './runtime/config.ts'
export const inject = ['llm', 'authorization', 'credentials', 'connection', 'settings']
export const name = 'dsh-pi-login'
export function apply(ctx, config, options = {}) {
  const registry = new IntegrationRegistry(profileKeyFor(ctx.get('profileContext')?.dir))
  const legacyProviders = () => ctx.get('configEditor')?.entries().find(entry => entry.options.id === 'llm-pi-ai')?.options.config?.providers ?? {}
  let revision = 0
  const sessions = new Map()
  const legacyCatalogs = new ProviderCatalogs({ meta: metaCatalogProvider(new MetaCatalogSession({
    credentials: credentialStoreFrom(ctx), profile: () => config.providers.get().meta ?? {}, baseline: catalogModels,
    onChange: () => { revision++; ctx.emit('dsh-pi-login/catalog-updated') },
  })) })
  const manager = new ConnectionManager({
    settings: ctx.settings, credentials: ctx.credentials, registry, legacyProviders,
    validateProfile: connection => resolveConnectionProfiles({ check: connection }),
    onChange: connectionId => {
      for (const [id, value] of sessions) {
        const current = config.connections.get()[id]
        if (!current || value.identity !== sessionIdentity(current)) { value.catalogs.dispose(); sessions.delete(id); usage.invalidate(id) }
      }
      ctx.emit('dsh-pi-login/connections-updated', connectionId)
    },
  })
  const external = createExternalIntegrations({ llm: ctx.llm, profileKey: registry.profileKey,
    generation: () => registry.generation, excludeRoutes: () => Object.values(config.connections.get()).map(connection => connection.routeId) })
  manager.extraConnections = () => external.publicConnections()
  const piServices = () => {
    const ids = new Set([...catalogProviderIds(), ...Object.keys(legacyProviders()), ...Object.keys(config.providers.get()), ...Object.values(config.connections.get()).filter(connection => connection.integrationId === 'pi').map(connection => connection.serviceId)])
    return [...ids].map(serviceId => {
      const provider = catalogProvider(serviceId)
      const methods = [
        ...provider?.auth.oauth ? [{ id: 'oauth', label: provider.auth.oauth.loginLabel ?? provider.auth.oauth.name }] : [],
        ...provider?.auth.apiKey || !provider ? [{ id: 'api-key', label: provider?.auth.apiKey?.name ?? 'API key' }] : [],
      ]
      return { serviceId, label: serviceId === 'meta' ? 'Meta Model API（Pi経由）' : provider?.name ?? serviceId, methods,
        capabilities: { auth: methods.length > 0, models: true, settings: true, usage: ['openai-codex', 'anthropic', 'github-copilot', 'opencode-go', 'meta'].includes(serviceId) } }
    })
  }
  registry.register({ integrationId: 'pi', label: 'Pi', source: '@earendil-works/pi-ai', listServices: piServices, listConnections: () => Object.values(manager.raw()) })
  const muse = createMuseCodeOwner({ ctx, connections: manager,
    privateRoot: join(ctx.get('profileContext')?.dir ?? join(tmpdir(), 'dsh-muse-code', registry.profileKey), '.dsh-muse-code'),
    onLogin: async id => {
      const connection = manager.lookup(id)
      manager.markVerified(id)
      usage.invalidate(id)
      if (!connection.enabled) await manager.update(id, { enabled: true }, manager.section()?.revision)
    },
    ...options.muse,
  })
  registry.register(muse)
  registry.register(external.descriptor)
  // Optional bundle-local integrations explicitly opt in; never inspect their config or credentials.
  ctx.on('dsh-pi-login/register-integration', owner => registry.register(owner))
  const museFlows = new Map()
  const syncMuseFlows = () => {
    for (const [id, flow] of museFlows) {
      const current = config.connections.get()[id]
      if (!current || flow.identity !== JSON.stringify([current.credentialRecordId, current.credentialGeneration, current.displayName])) { flow.dispose(); museFlows.delete(id) }
    }
    for (const [id, connection] of Object.entries(config.connections.get())) {
      if (connection.integrationId !== 'meta-muse-code' || museFlows.has(id)) continue
      const value = { ...connection, connectionId: id }
      const binding = manager.binding(value)
      const dispose = muse.registerFlow(ctx, value, () => manager.isCurrent(binding))
      museFlows.set(id, { identity: JSON.stringify([connection.credentialRecordId, connection.credentialGeneration, connection.displayName]), dispose })
    }
  }
  ctx.on('dsh-pi-login/connections-updated', syncMuseFlows)
  const sessionIdentity = connection => JSON.stringify([connection.serviceId, connection.credentialRecordId, connection.credentialGeneration, connection.credentialRef, connection.profile?.baseURL, connection.profile?.api])
  const authFor = connection => {
    const binding = manager.binding(connection)
    return connectionAuthFrom(ctx, { ...binding, isCurrent: () => manager.isCurrent(binding) })
  }
  const catalogsFor = connection => {
    const id = connection.connectionId
    const identity = sessionIdentity(connection)
    const previous = sessions.get(id)
    if (previous?.identity === identity) return previous.catalogs
    previous?.catalogs.dispose()
    const meta = connection.serviceId === 'meta' ? new MetaCatalogSession({
      credentials: authFor(connection).credentials, profile: () => {
        const current = manager.lookup(id)
        return { ...current.profile, headerRefs: current.headerRefs, credentialRef: current.credentialRef }
      },
      baseline: catalogModels, onChange: () => { revision++; ctx.emit('dsh-pi-login/catalog-updated') },
    }) : undefined
    const catalogs = new ProviderCatalogs(meta ? { meta: metaCatalogProvider(meta) } : {})
    sessions.set(id, { identity, catalogs, meta })
    return catalogs
  }
  const usage = new AccountUsageManager({
    providers: {
      ...createPiUsageProviders({ metaSession: connection => { catalogsFor(connection); return sessions.get(connection.connectionId).meta } }),
      'meta-muse-code/muse-code': { source: 'last-observed', requiresCredentials: false,
        read: ({ connection, signal }) => muse.readUsage(connection, { signal }) },
    },
    credentials: {
      read: connection => authFor(connection).credentials.read(connection.serviceId),
      refresh: async (connection, _record, signal) => {
        const auth = authFor(connection)
        const models = createModels(auth)
        models.setProvider(catalogProvider(connection.serviceId))
        await models.getAuth(connection.serviceId, { signal })
        return auth.credentials.read(connection.serviceId)
      },
    },
  })
  const runtime = applyRuntime(ctx, config, {
    connections: () => config.connections.get(), authForProfile: profile => authFor(profile),
    catalog: (provider, id) => id ? catalogsFor(manager.lookup(id)).catalog(provider) : legacyCatalogs.catalog(provider), revision: () => revision,
    onLogin: async id => {
      if (!config.connections.get()[id]) return legacyCatalogs.onLogin(id)
      const connection = manager.lookup(id)
      manager.markVerified(id)
      catalogsFor(connection).onLogin(connection.serviceId)
      usage.invalidate(id)
      if (!connection.enabled) await manager.update(id, { enabled: true }, manager.section()?.revision)
    },
    authorizeModel: (route, model, profile) => {
      if (!profile.connectionId) return legacyCatalogs.authorizeModel(route, model, profile)
      if (!manager.isCurrent(manager.binding(profile))) throw new ConnectionError('connection-changed')
      return catalogsFor(manager.lookup(profile.connectionId)).authorizeModel(profile.serviceId, model, profile)
    },
  })
  applyLoginUI(ctx, {
    connections: manager, usage, registry, syncFlows: () => { runtime.syncFlows(); syncMuseFlows() },
    catalogs: legacyCatalogs, catalogsFor,
    catalog: (provider, profile, connectionId) => {
      const learned = connectionId ? catalogsFor(manager.lookup(connectionId)).catalog(provider) : legacyCatalogs.catalog(provider)
      if (connectionId) {
        const connection = manager.lookup(connectionId)
        const resolved = resolveConnectionProfiles({ [connectionId]: { ...connection, profile } }, () => learned, 'deferred').get(connection.routeId)
        return resolved.modelChoices.map(choice => ({ ...choice,
          capabilityUnverified: choice.capabilityUnverified || choice.discovered && !choice.model[DISCOVERED_MODEL]?.verified }))
      }
      const models = resolveRouteModels({ defaultInput: DEFAULT_INPUT, defaultContextWindow: DEFAULT_CONTEXT_WINDOW, defaultMaxTokens: DEFAULT_MAX_TOKENS, provider, ...profile }, 'deferred', learned).models
      const discovered = new Set(models.filter(model => model[DISCOVERED_MODEL]).map(model => model.id))
      return modelChoices(provider, models, profile, discovered).map(choice => ({ ...choice, capabilityUnverified: choice.discovered && !choice.model[DISCOVERED_MODEL]?.verified }))
    },
  })
  let alive = true
  ctx.effect(() => () => {
    alive = false; manager.dispose(); registry.dispose(); external.dispose(); usage.dispose(); legacyCatalogs.dispose()
    for (const flow of museFlows.values()) flow.dispose()
    museFlows.clear(); void muse.dispose()
    for (const value of sessions.values()) value.catalogs.dispose()
    sessions.clear()
  }, 'AI connections: owned lifetime')
  void ctx.fiber.await().then(async () => {
    if (!alive) return
    await manager.migrate()
    manager.changed()
  }).catch(() => { if (alive) ctx.logger.warn('AI connections: migration did not complete; original settings and credentials remain available') })
}
