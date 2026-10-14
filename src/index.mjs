import { applyLoginUI } from './routes.mjs'
import { apply as applyRuntime, Config } from './runtime/index.ts'
import { catalogModels, catalogProvider, catalogProviderIds, resolveRouteModels } from './runtime/catalog.ts'
import { credentialStoreFrom, connectionAuthFrom } from './runtime/auth.ts'
import { createModels } from './runtime/models.ts'
import { resolveConnectionProfiles, sdkServiceOf, MUSE_CODE_INTEGRATION_ID } from './runtime/connections.ts'
import { IntegrationRegistry } from './registry.mjs'
import { ConnectionManager, ConnectionError, profileKeyFor } from './connections.mjs'
import { AccountUsageManager, createPiUsageProviders } from './account-usage.mjs'
import { createMuseCodeOwner } from './muse-code-owner.mjs'
import { createExternalIntegrations } from './external-integrations.mjs'
import { MuseCodeCatalogSession, museCatalogProvider } from './muse-code-catalog.mjs'
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
    connectionSnapshot: () => config.connections.get(),
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
  const muse = createMuseCodeOwner({ ctx, connections: manager })
  registry.register(muse)
  registry.register(external.descriptor)
  // Optional bundle-local integrations explicitly opt in; never inspect their config or credentials.
  ctx.on('dsh-pi-login/register-integration', owner => registry.register(owner))
  const sessionIdentity = connection => JSON.stringify([connection.serviceId, connection.credentialRecordId, connection.credentialGeneration, connection.credentialRef, connection.profile?.baseURL, connection.profile?.api])
  // Credentials address the SDK provider; currency still checks the stored connection.
  const authFor = connection => {
    const binding = manager.binding(connection)
    return connectionAuthFrom(ctx, { ...binding, serviceId: sdkServiceOf(connection) ?? connection.serviceId, isCurrent: () => manager.isCurrent(binding) })
  }
  const refreshAuth = async (connection, signal) => {
    const service = sdkServiceOf(connection) ?? connection.serviceId
    const auth = authFor(connection)
    const models = createModels(auth)
    models.setProvider(catalogProvider(service))
    await models.getAuth(service, { signal })
    return auth.credentials.read(service)
  }
  const catalogsFor = connection => {
    const id = connection.connectionId
    const identity = sessionIdentity(connection)
    const previous = sessions.get(id)
    if (previous?.identity === identity) return previous.catalogs
    previous?.catalogs.dispose()
    if (connection.integrationId === MUSE_CODE_INTEGRATION_ID) {
      const binding = manager.binding(connection)
      const museSession = new MuseCodeCatalogSession({
        credentials: authFor(connection).credentials,
        snapshot: () => { try { return manager.lookup(id).museCatalog } catch { return undefined } },
        persist: rows => manager.saveMuseCatalog(binding, rows),
        refreshAuth: signal => refreshAuth(manager.lookup(id), signal),
        onChange: () => { revision++; ctx.emit('dsh-pi-login/catalog-updated') },
      })
      const catalogs = new ProviderCatalogs({ [connection.serviceId]: museCatalogProvider(museSession) })
      sessions.set(id, { identity, catalogs, muse: museSession })
      return catalogs
    }
    const meta = connection.serviceId === 'meta' && connection.integrationId === 'pi' ? new MetaCatalogSession({
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
      [`${MUSE_CODE_INTEGRATION_ID}/muse-code`]: { source: 'internal-http',
        read: ({ connection, signal, force }) => { catalogsFor(connection); return sessions.get(connection.connectionId).muse.usage({ signal, force }) } },
    },
    credentials: {
      read: connection => authFor(connection).credentials.read(sdkServiceOf(connection) ?? connection.serviceId),
      refresh: (connection, _record, signal) => refreshAuth(connection, signal),
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
      // A new Muse Code sign-in loads that account's catalog right away.
      if (connection.integrationId === MUSE_CODE_INTEGRATION_ID) void catalogsFor(manager.lookup(id)).refresh(connection.serviceId).catch(() => {})
    },
    authorizeModel: (route, model, profile) => {
      if (!profile.connectionId) return legacyCatalogs.authorizeModel(route, model, profile)
      if (!manager.isCurrent(manager.binding(profile))) throw new ConnectionError('connection-changed')
      return catalogsFor(manager.lookup(profile.connectionId)).authorizeModel(profile.serviceId, model, profile)
    },
  })
  applyLoginUI(ctx, {
    connections: manager, usage, registry, syncFlows: () => runtime.syncFlows(),
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
    for (const value of sessions.values()) value.catalogs.dispose()
    sessions.clear()
  }, 'AI connections: owned lifetime')
  void ctx.fiber.await().then(async () => {
    if (!alive) return
    await manager.migrate()
    manager.changed()
  }).catch(() => { if (alive) ctx.logger.warn('AI connections: migration did not complete; original settings and credentials remain available') })
}
