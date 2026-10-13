/**
 * Registers the Pi adapter and provider configuration.
 * Catalog providers supply defaults; custom routes declare their own profiles.
 *
 * Profiles use the dsh-pi-login settings section. Changes apply to the next
 * request. Route, model catalog, and retry-policy changes update registration
 * on the same adapter instance.
 *
 * @module dsh-pi-login/runtime/index
 */
import type {} from '@deepseek-ai/dsh-settings'

import type {} from '@deepseek-ai/cordis-plugin-loader'

import type { Context } from '@deepseek-ai/cordis'
import type { Api, Model } from '@earendil-works/pi-ai'
import { launchEnvironmentOf } from '@deepseek-ai/dsh-launch-environment'
import { assertUsableApiKey, LlmError, resolveImageAttachmentAccess } from '@deepseek-ai/dsh-llm'
import type { AdapterRegistrationHandle, DirectoryRegistrationHandle, LlmConfigurableProvider } from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-fs'
import { deepEqualJson } from '@deepseek-ai/dsh-util-values'
import { PiAiAdapter } from './adapter.ts'
import { authContextFrom, connectionAuthFrom, credentialStoreFrom } from './auth.ts'
import { catalogProviderIds } from './catalog.ts'
import { assertServiceable, Config, resolveProfiles } from './config.ts'
import type { Connection, ResolvedPiAiProviderProfile } from './config.ts'
import { resolveConnectionProfiles } from './connections.ts'
import { discoverModels } from './discovery.ts'
import type { StoredModelDiscoveryProfile } from './discovery.ts'
import { registerConnectionFlows, registerPiAiFlows } from './login.ts'

export { PiAiAdapter } from './adapter.ts'
export type { PiAiAdapterOptions } from './adapter.ts'
export { Config } from './config.ts'
export { resolveConnectionProfiles } from './connections.ts'
export type {
  Options,
  PiAiCompatProfile,
  PiAiModality,
  PiAiModelOverride,
  PiAiModelProfile,
  PiAiProviderProfile,
  PiAiReasoningEfforts,
  PiAiThinkingFormat,
  ResolvedPiAiProviderProfile,
  Connection,
} from './config.ts'
export { recordKeyFor } from './auth.ts'
export { supportedProtocols } from './provider.ts'

export const name = 'llm-pi-ai'
export const inject = ['llm']

const NS = 'dsh-pi-login'

/**
 * Route metadata and selectable models; replacing registration also publishes
 * the catalog change to Host consumers.
 * Sorted by provider so a settings document that merely reorders its keys is
 * not mistaken for a route change.
 */
function registrationFacts(profiles: ReadonlyMap<string, ResolvedPiAiProviderProfile>): unknown {
  return [...profiles.entries()]
    // `displayName` rides along because the registry hands it to every selector
    // through `providerInfo()`: a rename that did not re-register would leave
    // the old label showing until some unrelated fact happened to change.
    .map(([provider, profile]) => ({
      provider,
      displayName: profile.displayName,
      integrationLabel: profile.integrationLabel,
      serviceLabel: profile.serviceLabel,
      retryPolicy: profile.retryPolicy,
      models: profile.piProvider === undefined ? undefined : profile.modelChoices
        .filter(choice => choice.enabled)
        .map(choice => ({ id: choice.id, name: choice.name })),
    }))
    .sort((left, right) => left.provider.localeCompare(right.provider))
}

/**
 * The configurable-provider directory: every installed catalog route, plus
 * every route the current profiles declare. A hand-declared route has no
 * catalog entry, so without this union it would have no settings address and
 * configuration surfaces could neither show nor edit it.
 * @param profiles - the currently resolved provider profiles.
 * @returns the directory entries in catalog order, declared routes last.
 */
function directoryEntries(
  profiles: ReadonlyMap<string, ResolvedPiAiProviderProfile>,
  settingsNs: string,
  connectionMode = false,
): LlmConfigurableProvider[] {
  const catalog = new Set(catalogProviderIds())
  const entries = new Map<string, LlmConfigurableProvider>()
  const declare = (provider: string, displayName: string, error?: string): void => {
    entries.set(provider, {
      provider,
      displayName,
      settingsNs,
      settingsPath: profiles.get(provider)?.connectionId === undefined
        ? ['providers', provider] : ['connections', profiles.get(provider)!.connectionId!, 'profile'],
      // Membership of the installed catalog, not of the settings document:
      // narrowing a shipped provider's models stores a profile too, and that
      // route is still one pi-ai knows.
      declared: !catalog.has(provider),
      ...error === undefined ? {} : { error },
    })
  }
  if (!connectionMode) for (const provider of catalog) declare(provider, provider)
  for (const [provider, profile] of profiles) declare(provider, profile.displayName, profile.catalogError)
  return [...entries.values()]
}

/** Register one generic pi-ai adapter for all configured provider routes. */
export function apply(ctx: Context, config: Config, live?: {
  catalog: (provider: string, connectionId?: string) => ReadonlyMap<string, Model<Api>> | undefined
  connections?: () => Readonly<Record<string, Connection>> | undefined
  authForProfile?: import('./adapter.ts').PiAiAdapterOptions['authForProfile']
  revision: () => number
  authorizeModel: NonNullable<import('./adapter.ts').PiAiAdapterOptions['authorizeModel']>
  onLogin: (provider: string) => void
}): { syncFlows: () => void } {
  ctx.inject(['settings'], (child) => { child.effect(() => child.settings.configure({ auto: false }, ctx.fiber)) })
  const settingsNs = NS
  let lastRaw: unknown
  let lastCatalogRevision: number | undefined
  let memoized: ReadonlyMap<string, ResolvedPiAiProviderProfile> | undefined
  const connections = (): Readonly<Record<string, Connection>> | undefined => config.connectionMigrationVersion.get() >= 1
    ? live?.connections?.() ?? config.connections.get() : undefined
  /**
   * The resolved profiles for the current configuration, memoized by the raw
   * snapshot's identity — which is also what makes the adapter's own snapshot
   * stable across operations that observe no change.
   *
   * Catalog diagnostics stay in the snapshot beside serviceable models, so
   * stored configuration remains visible after an installed catalog changes.
   * Scalar configuration errors still reject resolution.
   */
  const profiles = (): ReadonlyMap<string, ResolvedPiAiProviderProfile> => {
    const currentConnections = connections()
    const raw = currentConnections ?? config.providers.get()
    const revision = live?.revision()
    if (raw === lastRaw && revision === lastCatalogRevision && memoized !== undefined) return memoized
    const next = currentConnections === undefined
      ? resolveProfiles(structuredClone(raw) as import('./config.ts').Options['providers'], 'deferred', live?.catalog)
      : resolveConnectionProfiles(structuredClone(currentConnections), live?.catalog, 'deferred')
    if (currentConnections === undefined) {
      for (const [provider, profile] of Object.entries(config.providers.get())) if (profile.enabled === false) next.delete(provider)
    } else {
      for (const connection of Object.values(currentConnections)) if (connection.enabled === false) next.delete(connection.routeId)
    }
    lastRaw = raw
    lastCatalogRevision = revision
    memoized = next
    return next
  }
  profiles()
  ctx.on('internal/config', function (this: import('@deepseek-ai/cordis').Fiber, _raw, next) {
    const raw: unknown = next()
    if (this !== ctx.fiber) return raw
    const candidate = Config(raw as import('./config.ts').Options)
    assertServiceable(
      { providers: structuredClone(candidate.providers.get()) } as import('./config.ts').Options,
      { providers: structuredClone(config.providers.get()) } as import('./config.ts').Options,
    )
    if (candidate.connectionMigrationVersion.get() >= 1) {
      const previous = config.connections.get()
      const changed = Object.fromEntries(Object.entries(candidate.connections.get()).filter(([id, entry]) => !deepEqualJson(entry, previous[id])))
      resolveConnectionProfiles(changed, (serviceId, connectionId) => {
        const before = previous[connectionId], after = changed[connectionId]
        // ConfigEditor validates before committing its candidate. New ids and
        // new account/transport bindings cannot be looked up in live settings;
        // validate them against Pi's installed baseline instead of resolving
        // a missing draft or borrowing the previous connection's catalog.
        if (before === undefined || before.serviceId !== after.serviceId
          || before.credentialRecordId !== after.credentialRecordId
          || before.credentialGeneration !== after.credentialGeneration
          || before.profile.baseURL !== after.profile.baseURL || before.profile.api !== after.profile.api) return undefined
        return live?.catalog(serviceId, connectionId)
      })
      const routes = Object.values(candidate.connections.get()).map(connection => connection.routeId)
      if (new Set(routes).size !== routes.length) throw new Error('llm-pi-ai: duplicate connection routes')
    }
    return raw
  })

  const resolveApiKey = async (
    provider: string,
    profile: ResolvedPiAiProviderProfile,
  ): Promise<string | undefined> => {
    const ref = profile.apiKeyEnv
    // Only a profile that names no credential at all defers to pi-ai's
    // provider-native discovery. Once one is named, a miss must fail loud:
    // handing pi-ai `undefined` would let it pick up an unrelated ambient key
    // (OPENAI_API_KEY and friends), billing another tenant for a request the
    // deployment meant to authenticate differently.
    if (ref === undefined) return undefined
    const credentials = ctx.get('credentials')
    const hit = credentials !== undefined
      ? (await credentials.resolve(ref))?.value
      // Without the seam the environment is the whole credential plane.
      : profile.connectionId === undefined ? launchEnvironmentOf(ctx).get(ref)?.value : undefined
    if (hit !== undefined && hit.length > 0) return assertUsableApiKey(hit, 'llm-pi-ai', ref)
    throw new LlmError(
      `llm-pi-ai: no credential for provider route "${provider}"; its profile resolves ${ref}, which is not`
      + ` set — store ${ref} through the credentials service (the web Models page writes it) or export it,`
      + ' and remove apiKeyEnv only if this provider should authenticate from pi-ai\'s own environment discovery',
      'MISSING_CREDENTIAL',
    )
  }

  // Legacy auth remains available until migration; connection collections bind
  // one native service to one credential record and never consult ambient auth.
  const auth = { credentials: credentialStoreFrom(ctx), authContext: authContextFrom(ctx) }
  const adapter = new PiAiAdapter({
    profiles,
    resolveApiKey,
    auth,
    authForProfile: profile => live?.authForProfile?.(profile) ?? (profile.connectionId === undefined ? auth : connectionAuthFrom(ctx, {
      connectionId: profile.connectionId,
      serviceId: profile.serviceId!,
      credentialRecordId: profile.credentialRecordId!,
      isCurrent: () => {
        const current = connections()?.[profile.connectionId!]
        return current !== undefined && current.serviceId === profile.serviceId
          && current.credentialRecordId === profile.credentialRecordId
          && current.credentialGeneration === profile.credentialGeneration
      },
    })),
    resolveHeaders: async profile => {
      const entries = await Promise.all(Object.entries(profile.headerRefs ?? {}).map(async ([name, ref]) => {
        const credentials = ctx.get('credentials')
        const value = (await credentials?.resolve(ref as import('@deepseek-ai/dsh-credentials').CredentialRef))?.value
        if (!value) throw new LlmError(`llm-pi-ai: missing credential for header "${name}"`, 'MISSING_CREDENTIAL')
        new Headers([[name, value]])
        return [name, value] as const
      }))
      return Object.fromEntries(entries)
    },
    authorizeModel: live?.authorizeModel,
    resolveAttachments: () => ctx.get('attachments'),
    resolveImageAccess: (attachments, ref) => resolveImageAttachmentAccess(
      attachments,
      hostPath => ctx.get('fs')?.processPathFromHostPath(hostPath),
      ref,
    ),
    onReplayDegrade: ({ provider, model, reason }) => {
      ctx.logger.warn(
        `llm-pi-ai: unusable replay state on assistant history for route "${provider}/${model}";`
        + ` sending that message as provider-neutral content (${reason})`,
      )
    },
  })
  // Withdraw dormant native flows when migration completes. From then on only
  // saved connections own an authorization flow and their chosen auth method.
  let authorizedContext: Context | undefined
  let legacyFlows: import('@deepseek-ai/cordis').Fiber | undefined
  let withdrawLegacyFlows: (() => void) | undefined
  let connectionFlows: ReturnType<typeof registerConnectionFlows> | undefined
  const syncFlows = (): void => {
    if (authorizedContext === undefined) return
    if (connections() !== undefined) {
      // Fiber disposal is awaitable and can defer individual effects. The
      // migrated connection may retain a native record key, so withdraw the
      // old declarations synchronously before registering their replacement.
      withdrawLegacyFlows?.(); withdrawLegacyFlows = undefined
      if (legacyFlows !== undefined) { void legacyFlows.dispose(); legacyFlows = undefined }
      connectionFlows ??= registerConnectionFlows(authorizedContext, () => connections() ?? {}, live?.onLogin)
      connectionFlows.sync()
    } else if (legacyFlows === undefined) {
      connectionFlows?.dispose(); connectionFlows = undefined
      legacyFlows = authorizedContext.plugin(child => { withdrawLegacyFlows = registerPiAiFlows(child, auth, live?.onLogin) })
    }
  }
  ctx.inject(['authorization'], authorized => { authorizedContext = authorized; syncFlows() })
  // The migrated directory contains saved connections, including disabled
  // entries that still need a settings address. Registration contains enabled
  // routes only; an empty connection set withdraws every Pi route.
  let directory: DirectoryRegistrationHandle | undefined
  let directoryFacts: unknown
  const ensureDirectory = (): void => {
    const currentConnections = connections()
    const entries = directoryEntries(currentConnections === undefined ? profiles()
      : resolveConnectionProfiles(structuredClone(currentConnections), live?.catalog, 'deferred'), settingsNs, currentConnections !== undefined)
    if (deepEqualJson(entries, directoryFacts)) return
    // Atomic replace, never dispose-then-register: a route another adapter
    // family already declares (a profile keyed `deepseek-official`) would
    // otherwise leave this plugin's whole directory withdrawn and the Models
    // page empty. The candidate set is validated first, so a collision keeps
    // the previous entries serving and only costs a diagnostic.
    if (directory === undefined) {
      // Host requires a nonempty initial registration. A migrated profile
      // with no saved Pi connections stays dormant until its first connection
      // appears; replace([]) remains valid for an existing registration.
      if (entries.length === 0) { directoryFacts = entries; return }
      directory = ctx.llm.registerConfigurableProviders(entries)
    } else {
      directory.replace(entries)
    }
    directoryFacts = entries
  }
  ensureDirectory()
  /** Host-owned request inputs for discovery of one configured route. */
  const storedDiscoveryProfile = (
    provider: string | undefined,
  ): StoredModelDiscoveryProfile | undefined => {
    if (provider === undefined) return undefined
    const profile = profiles().get(provider)
    if (profile === undefined) return undefined
    return {
      headers: profile.headers,
      resolveApiKey: () => resolveApiKey(provider, profile),
    }
  }
  // Interrogating an endpoint is a configuration-time action over a draft, so
  // it is offered for the whole namespace rather than per route: the provider
  // a surface is adding does not exist yet. The draft is the whole request
  // except the stored credential and deployment-owned headers: the curated UI
  // accepts neither, so an already-configured route supplies both inside the
  // Host rather than widening the discovery request.
  ctx.llm.registerModelDiscovery(settingsNs, (request, signal) => discoverModels(
    { ...request, ...signal === undefined ? {} : { signal } },
    () => storedDiscoveryProfile(request.provider),
  ))
  // Route effects bind to this apply fiber via the stable `ctx` reference,
  // even when a swap runs inside the scoped settings callback below. A bare
  // mount (zero routes) is the dormant posture: nothing registers until a
  // settings section supplies profiles, and routes drop when it empties.
  let registration: AdapterRegistrationHandle | undefined
  let registeredFacts: unknown
  const ensureRegistrationFacts = (): void => {
    const facts = registrationFacts(profiles())
    if (deepEqualJson(facts, registeredFacts)) return
    // The registry captures route metadata, and catalog consumers refresh on
    // replacement, so changes to either must re-register. The swap is
    // atomic (same adapter instance, validated before anything moves): a
    // conflicting route leaves the previous routes serving requests, and
    // `registeredFacts` only advances once the registry actually holds the
    // new set — so returning to a working configuration always re-applies.
    const routes = [...profiles().keys()]
    if (registration === undefined) {
      // Dormant bare mount: nothing is registered until a section supplies
      // profiles, and an empty section keeps it that way.
      if (routes.length === 0) {
        registeredFacts = facts
        return
      }
      registration = ctx.llm.registerAdapter(routes, adapter)
    } else {
      registration.replace(routes)
    }
    registeredFacts = facts
  }
  ensureRegistrationFacts()

  ctx.on('dsh-pi-login/catalog-updated', () => { syncFlows(); ensureRegistrationFacts(); ensureDirectory() })

  ctx.on('loader/volatile-update', () => {
    try { syncFlows(); ensureRegistrationFacts(); ensureDirectory() }
    catch (error) {
      ctx.logger.error('llm-pi-ai: configuration conflicts with an existing provider route')
      ctx.logger.error(error)
    }
  })
  ctx.on('settings/document-updated', (namespace) => {
    if (namespace !== NS) return
    try { syncFlows(); ensureRegistrationFacts(); ensureDirectory() }
    catch (error) { ctx.logger.error('Pi plugin: could not apply model settings'); ctx.logger.error(error) }
  })
  return { syncFlows }
}
