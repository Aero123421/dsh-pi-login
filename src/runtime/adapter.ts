/**
 * Pi SDK adapter for Harness LLM requests.
 *
 * Each operation captures an immutable profile and Models snapshot before
 * awaiting credentials. Models.streamSimple() resolves lazily, so changing
 * configuration creates a new collection without affecting in-flight requests.
 * This preserves llm.prepareCall() for the current step.
 *
 * Explicit credential references take priority through the request's apiKey.
 * Missing referenced keys fail instead of falling back to a saved login.
 * Each connection keeps Pi's native provider identity inside its own Models
 * collection. Auth and endpoint resolve once per request; process environment
 * discovery is available only on the pre-migration legacy path.
 *
 * @module dsh-pi-login/runtime/adapter
 */

import type {
  Api,
  AuthContext,
  CredentialStore,
  Model,
  Models,
  ModelThinkingLevel,
  MutableModels,
  SimpleStreamOptions,
  ThinkingLevel,
} from '@earendil-works/pi-ai'
import { createHash } from 'node:crypto'
import {
  attributionHeaders,
  contentHasImage,
  LlmAdapter,
  LlmError,
  ReasoningEffortId,
} from '@deepseek-ai/dsh-llm'
import type {
  GenerateOptions,
  ImageAttachmentAccess,
  LlmModelInfo,
  LlmProviderInfo,
  LlmResolvedModelInfo,
  PreparedAdapterCall,
  ReasoningEffortId as ReasoningEffortIdType,
  ResolvedRetryPolicy,
  StreamChunk,
  ToolSchema,
} from '@deepseek-ai/dsh-llm'
import type { AttachmentStore, ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import { idleWatchdog, timeoutOf } from '@deepseek-ai/dsh-timeout'
import type { ResolvedPiAiProviderProfile } from './config.ts'
import { toPiContext } from './context.ts'
import { conversationUpdates, createModels, getSupportedThinkingLevels } from './models.ts'
import { streamWithTier } from './fast.ts'
import type { ModelChoice } from './fast.ts'
import { toStreamChunks } from './stream.ts'

/**
 * Initially active declaration added to an Anthropic request whose projected
 * tools are all deferred, because Anthropic rejects a tool list without one.
 */
const ANTHROPIC_TOOL_UPDATE_PLACEHOLDER: ToolSchema = {
  name: 'DeferredToolPlaceholder',
  description: 'Reserved placeholder that keeps deferred tool loading active; never call this tool.',
  parameters: { type: 'object', properties: {} },
}

/** One resolution's frozen view: the profiles and the collection built from them. */
interface PiAiSnapshot {
  /** The resolved profiles this collection was built from, used as its identity. */
  profiles: ReadonlyMap<string, ResolvedPiAiProviderProfile>
  /** Providers for exactly those profiles; never mutated once published. */
  models: ReadonlyMap<string, Models>
  auth: ReadonlyMap<string, PiAiAuthInjection>
}

/** Constructor options for {@link PiAiAdapter}: the two resolution hooks the plugin owns. */
export interface PiAiAdapterOptions {
  /** Current validated profiles by provider route; called once per operation. */
  profiles: () => ReadonlyMap<string, ResolvedPiAiProviderProfile>
  /**
   * Resolve the credential for one already-resolved profile; called once per
   * stream call and frozen for that call. `undefined` defers to the route's own
   * pi-ai auth, which for an installed catalog route is its provider-native
   * ambient discovery; the plugin allows that only for a profile naming no
   * credential at all, because a named reference that misses throws `LlmError`
   * `MISSING_CREDENTIAL` rather than falling back.
   */
  resolveApiKey: (provider: string, profile: ResolvedPiAiProviderProfile) => Promise<string | undefined>
  /**
   * Durable native auth for legacy profiles. Connection profiles use
   * authForProfile instead; an omitted binding has no ambient credentials.
   */
  auth?: PiAiAuthInjection
  /** Native credentials bound to this exact connection and generation. */
  authForProfile?: (profile: ResolvedPiAiProviderProfile) => PiAiAuthInjection
  /** Resolve stored header references, never client supplied secrets. */
  resolveHeaders?: (profile: ResolvedPiAiProviderProfile) => Promise<Readonly<Record<string, string>>>
  /** Pin the account key for models learned from a subscription catalog. */
  authorizeModel?: (provider: string, model: Model<Api>, profile: ResolvedPiAiProviderProfile) => Promise<{ apiKey: string, headers?: Readonly<Record<string, string>> } | undefined>
  /** Resolve the optional durable attachment service at request time. */
  resolveAttachments?: () => AttachmentStore | undefined
  /** Bridge one attachment reference into the current model-tool execution world. */
  resolveImageAccess?: (attachments: AttachmentStore, ref: ImageAttachmentRef) => ImageAttachmentAccess | undefined
  /**
   * Observe one assistant history message degrading to provider-neutral
   * conversion because its stored replay state is unusable by this build.
   */
  onReplayDegrade?: (detail: { provider: string; model: string; reason: string }) => void
}

/** The two auth injectables a pi-ai collection is built with. */
export interface PiAiAuthInjection {
  /** Durable storage for credentials pi-ai itself writes: logins, and the refreshes it runs under its own lock. */
  credentials: CredentialStore
  /** Ambient lookups a provider performs while resolving its own auth. */
  authContext: AuthContext
}

/** Copy profile stream knobs into pi-ai's common option vocabulary. */
function profileOptions(
  profile: ResolvedPiAiProviderProfile,
  reasoning: ModelThinkingLevel | undefined,
  apiKey: string | undefined,
): SimpleStreamOptions {
  const enabledReasoning: ThinkingLevel | undefined = reasoning === 'off' ? undefined : reasoning
  return {
    ...apiKey === undefined ? {} : { apiKey },
    ...enabledReasoning === undefined ? {} : { reasoning: enabledReasoning },
    ...profile.thinkingBudgets === undefined ? {} : { thinkingBudgets: profile.thinkingBudgets },
    ...profile.cacheRetention === undefined ? {} : { cacheRetention: profile.cacheRetention },
    ...profile.transport === undefined ? {} : { transport: profile.transport },
    ...profile.timeoutMs === undefined ? {} : { timeoutMs: profile.timeoutMs },
    ...profile.websocketConnectTimeoutMs === undefined ? {} : { websocketConnectTimeoutMs: profile.websocketConnectTimeoutMs },
    // The agent recovery layer owns visible attempts; one adapter call is one SDK attempt.
    maxRetries: 0,
  }
}

/**
 * The profile default this exact model can actually take, for DESCRIBING it.
 * A configured level the model does not support yields none rather than
 * throwing: `resolveModel` builds the model catalog, and a catalog that fails
 * takes its whole provider out of every picker — so one mis-set profile field
 * would hide every model on the route, including the ones that support the
 * level. The request path still refuses, which is where a bad configuration
 * belongs: describing what a model can do must not fail because a deployment
 * asked it for something it cannot.
 * @param model - the resolved model descriptor.
 * @param effort - the profile's configured level, if any.
 * @returns the level when this model supports it, otherwise undefined.
 */
function describableReasoningLevel(
  model: Model<Api>,
  effort: ReasoningEffortIdType | ModelThinkingLevel | undefined,
): ModelThinkingLevel | undefined {
  if (effort === undefined) return undefined
  return getSupportedThinkingLevels(model).some(level => level === effort)
    ? effort as ModelThinkingLevel
    : undefined
}

/** Validate an explicit Harness/profile effort without invoking pi-ai's clamp. */
function resolveReasoningLevel(
  model: Model<Api>,
  effort: ReasoningEffortIdType | ModelThinkingLevel | undefined,
): ModelThinkingLevel | undefined {
  if (effort === undefined) return undefined
  const supported = getSupportedThinkingLevels(model)
  if (supported.some(level => level === effort)) return effort as ModelThinkingLevel
  throw new LlmError(
    `pi-ai provider "${model.provider}" model "${model.id}" does not support reasoning effort "${effort}"`,
    'UNSUPPORTED_REASONING_EFFORT',
  )
}

/**
 * Selectable reasoning efforts for one model, or nothing at all.
 *
 * A model that carries no reasoning metadata — every hand-declared one, and
 * every catalog model pi-ai marks as non-reasoning — is reported by pi-ai as
 * supporting the single level `off`. Passing that through would offer a control
 * that cannot do what it says: `off` is translated to *omitting* the reasoning
 * option, which for such a model is byte-for-byte the same request as naming no
 * effort — so a provider whose own default is to think would keep thinking with
 * `off` selected. Omitting `reasoning` entirely is the seam's way of saying the
 * capability is unavailable, which leaves the surface offering only the
 * provider's default.
 * @param model - the resolved model descriptor.
 * @param defaultLevel - the profile's configured effort, already validated.
 * @returns the `reasoning` field, or an empty object when none can be offered.
 */
function reasoningInfo(
  model: Model<Api>,
  defaultLevel: ModelThinkingLevel | undefined,
): Pick<LlmResolvedModelInfo, 'reasoning'> | Record<string, never> {
  if (!model.reasoning) return {}
  const levels = getSupportedThinkingLevels(model)
  return {
    reasoning: {
      efforts: levels.map(level => ({
        id: ReasoningEffortId(level),
        name: `${level.charAt(0).toUpperCase()}${level.slice(1)}`,
      })),
      ...defaultLevel === undefined ? {} : { defaultEffort: ReasoningEffortId(defaultLevel) },
    },
  }
}

/** Merge deployment headers while removing case-insensitive attribution collisions. */
function requestHeaders(headers: Readonly<Record<string, string>> | undefined): Record<string, string> {
  const attribution = attributionHeaders()
  const reserved = new Set(Object.keys(attribution).map(name => name.toLowerCase()))
  return {
    ...Object.fromEntries(Object.entries(headers ?? {}).filter(([name]) => !reserved.has(name.toLowerCase()))),
    ...attribution,
  }
}

/** Connections never inherit Pi's process environment or another account store. */
const isolatedAuth: PiAiAuthInjection = {
  authContext: { env: async () => undefined, fileExists: async () => false },
  credentials: {
    read: async () => undefined,
    list: async () => [],
    modify: async () => { throw new LlmError('Connection credential store is unavailable', 'MISSING_CREDENTIAL') },
    delete: async () => {},
  },
}

/** Start the read before any other await; SDK lazy auth receives this frozen record. */
function requestAuth(auth: PiAiAuthInjection, profile: ResolvedPiAiProviderProfile, signal?: AbortSignal): PiAiAuthInjection {
  if (profile.connectionId === undefined || auth.credentials === undefined) return auth
  const serviceId = profile.sdkServiceId ?? profile.serviceId!
  let credential = auth.credentials.read(serviceId, { signal }).then(value => {
    if (value === undefined || (profile.authMethod === 'oauth' ? value.type !== 'oauth' : value.type !== 'api_key')) return undefined
    return structuredClone(value)
  })
  // SDK auth can start later (after image preparation). Attach a rejection
  // handler now while retaining the rejection for the actual credential read.
  void credential.catch(() => {})
  return {
    authContext: isolatedAuth.authContext,
    credentials: {
      read: async provider => provider === serviceId ? await credential : undefined,
      list: async () => [],
      modify: async (provider, mutate, options) => {
        if (provider !== serviceId) throw new LlmError('Credential provider does not match connection', 'MISSING_CREDENTIAL')
        // Refreshes still run under Harness's record lock and generation
        // guard; a newer login can never be overwritten by an old request.
        const next = await auth.credentials!.modify(provider, mutate, options)
        credential = Promise.resolve(next === undefined ? undefined : structuredClone(next))
        return next
      },
      delete: async () => { throw new LlmError('Request credential snapshots are read-only', 'MISSING_CREDENTIAL') },
    },
  }
}

/**
 * pi-ai-backed multi-provider adapter. Each operation reads the current
 * profiles, so a configuration change reaches the next request without a
 * restart; model descriptors come from the collection those profiles built.
 */
export class PiAiAdapter extends LlmAdapter {
  private snapshot: PiAiSnapshot | undefined

  constructor(private readonly config: PiAiAdapterOptions) {
    super()
  }

  /**
   * The snapshot for the current profiles. Resolution memoizes its result, so
   * an unchanged configuration is recognized by identity; a changed one gets a
   * brand-new collection, leaving any snapshot an operation already captured
   * untouched for as long as that operation holds it.
   */
  private current(): PiAiSnapshot {
    const profiles = this.config.profiles()
    if (this.snapshot?.profiles === profiles) return this.snapshot
    const models = new Map<string, Models>()
    const auth = new Map<string, PiAiAuthInjection>()
    for (const [route, profile] of profiles) {
      const binding = profile.connectionId === undefined ? this.config.auth ?? isolatedAuth
        : this.config.authForProfile?.(profile) ?? isolatedAuth
      const collection: MutableModels = createModels(binding)
      if (profile.piProvider !== undefined) collection.setProvider(profile.piProvider)
      models.set(route, collection)
      auth.set(route, binding)
    }
    this.snapshot = { profiles, models, auth }
    return this.snapshot
  }

  /** The profile for one route within one snapshot, or the not-owned failure. */
  private profileOf(snapshot: PiAiSnapshot, provider: string): ResolvedPiAiProviderProfile {
    const profile = snapshot.profiles.get(provider)
    if (profile === undefined) {
      throw new LlmError(`pi-ai adapter does not own provider "${provider}"`, 'NO_ADAPTER')
    }
    return profile
  }

  /** The configured descriptor for one exact route/model pair within one snapshot. */
  private modelOf(snapshot: PiAiSnapshot, provider: string, model: string): ModelChoice {
    const profile = this.profileOf(snapshot, provider)
    const failure = profile.modelErrors.get(model)
      ?? (profile.piProvider === undefined ? profile.catalogError : undefined)
    if (failure !== undefined) throw new LlmError(failure, 'INVALID_CONFIG')
    const resolved = profile.modelChoices.find(choice => choice.id === model && choice.enabled)
    if (resolved === undefined) {
      throw new LlmError(`pi-ai provider "${provider}" has no configured model "${model}"`, 'UNKNOWN_MODEL')
    }
    return resolved
  }

  override providerInfo(provider: string): LlmProviderInfo {
    // The configured name, not the route key: `displayName` exists so a
    // deployment can label a route, and a label only the configuration surface
    // reads would leave every selector showing the raw key.
    const profile = this.current().profiles.get(provider)
    return {
      id: provider,
      name: profile?.connectionId === undefined ? profile?.displayName ?? provider
        : [profile.integrationLabel ?? profile.integrationId, profile.serviceLabel ?? profile.serviceId, profile.displayName].filter(Boolean).join(' / '),
    }
  }

  override providerRetryPolicy(provider: string): ResolvedRetryPolicy | undefined {
    return this.current().profiles.get(provider)?.retryPolicy
  }

  override listModels(provider: string): Promise<readonly LlmModelInfo[]> {
    return Promise.resolve().then(() => {
      const snapshot = this.current()
      const profile = this.profileOf(snapshot, provider)
      if (profile.piProvider === undefined) return []
      return profile.modelChoices.filter(choice => choice.enabled).map(choice => ({
        provider, id: choice.id, name: choice.name, inputModalities: [...choice.model.input],
      }))
    })
  }

  override resolveModel(
    provider: string,
    model: string,
    _signal?: AbortSignal,
  ): Promise<LlmResolvedModelInfo> {
    return Promise.resolve().then(() => {
      const snapshot = this.current()
      return this.modelInfo(snapshot, provider, model)
    })
  }

  private modelInfo(snapshot: PiAiSnapshot, provider: string, model: string): LlmResolvedModelInfo {
    const profile = this.profileOf(snapshot, provider)
    const choice = this.modelOf(snapshot, provider, model)
    const resolvedModel = choice.model
    const defaultLevel = describableReasoningLevel(resolvedModel, profile.reasoning)
    // Only a cap the deployment configured is a request default; the
    // catalog's `maxTokens` sizes the model and stops there.
    const configuredMaxTokens = profile.configuredMaxTokens.get(resolvedModel.id)
    return {
      provider,
      id: model,
      name: choice.name,
      inputModalities: [...resolvedModel.input],
      context: { contextWindow: resolvedModel.contextWindow },
      ...configuredMaxTokens === undefined ? {} : { defaultMaxTokens: configuredMaxTokens },
      ...reasoningInfo(resolvedModel, defaultLevel),
      ...conversationUpdates(resolvedModel),
    }
  }

  override prepareCall(provider: string, model: string, _signal?: AbortSignal): Promise<PreparedAdapterCall> {
    const snapshot = this.current()
    return Promise.resolve({
      model: this.modelInfo(snapshot, provider, model),
      stream: options => this.streamWithSnapshot(options, snapshot),
    })
  }

  stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    return this.streamWithSnapshot(options, this.current())
  }

  private async * streamWithSnapshot(
    options: GenerateOptions,
    snapshot: PiAiSnapshot,
  ): AsyncIterable<StreamChunk> {
    if (options.stop !== undefined) {
      throw new LlmError('llm-pi-ai does not support GenerateOptions.stop', 'UNSUPPORTED_OPTION')
    }
    // One capture per stream call, taken before any await: the profile, the
    // model descriptor, and the collection all come from the same immutable
    // snapshot, and the credential freezes with them. A configuration change
    // mid-request builds a separate snapshot, so this request finishes under
    // the one it started with and the next call picks up the new one.
    const profile = this.profileOf(snapshot, options.provider)
    const choice = this.modelOf(snapshot, options.provider, options.model)
    const model = choice.model
    const scopedAuth = requestAuth(snapshot.auth.get(options.provider)!, profile, options.signal)
    let models = snapshot.models.get(options.provider)!
    if (profile.connectionId !== undefined) {
      const collection = createModels(scopedAuth)
      collection.setProvider(profile.piProvider!)
      models = collection
    }
    const replayScope = profile.replayScope === undefined ? undefined : {
      ...profile.replayScope, endpoint: model.baseUrl, api: model.api,
    }
    const replayTarget = { provider: options.provider, serviceId: model.provider, ...replayScope === undefined ? {} : { scope: replayScope } }
    const updates = conversationUpdates(model)
    // pi-ai collapses Anthropic tool updates without an initially active declaration.
    const tools = options.tools ?? []
    const needsPlaceholder = model.api === 'anthropic-messages' && updates.toolUpdate === 'in-history'
      && tools.every(tool => tool.deferLoading === true)
      && options.messages.some(message => message.role === 'developer'
        && message.content.some(block => block.type === 'tool-addition' || block.type === 'tool-removal'))
    const request = needsPlaceholder
      ? { ...options, tools: [ANTHROPIC_TOOL_UPDATE_PLACEHOLDER, ...tools] }
      : options
    const reasoning = resolveReasoningLevel(
      model,
      options.reasoningEffort ?? profile.reasoning,
    )
    const [explicitKey, accountAuthorization, storedHeaders] = await Promise.all([
      this.config.resolveApiKey(options.provider, profile),
      this.config.authorizeModel?.(options.provider, model, profile),
      this.config.resolveHeaders?.(profile),
    ])
    const apiKey = accountAuthorization?.apiKey ?? explicitKey
    if (profile.connectionId !== undefined) {
      // Resolve native auth once, including provider-owned endpoint overrides.
      // The later lazy SDK stream receives only this request's resolved auth;
      // image loading or a concurrent login cannot change its account.
      const resolvedAuth = await models.getAuth(model, { apiKey, signal: options.signal })
      if (resolvedAuth === undefined) throw new LlmError(`Connection "${profile.connectionId}" has no usable credential`, 'MISSING_CREDENTIAL')
      if (replayScope !== undefined) replayScope.endpoint = resolvedAuth.auth.baseUrl ?? model.baseUrl
      const collection = createModels(isolatedAuth)
      collection.setProvider({ ...profile.piProvider!, auth: {
        apiKey: { name: profile.displayName, resolve: async () => resolvedAuth },
      } })
      models = collection
    }

    const consumer = new AbortController()
    const upstream = options.signal === undefined
      ? consumer.signal
      : AbortSignal.any([options.signal, consumer.signal])
    const streamIdleTimeoutMs = profile.streamIdleTimeoutMs
    using watchdog = idleWatchdog(upstream, streamIdleTimeoutMs, 'LLM_STREAM_IDLE_TIMEOUT')

    try {
      const containsImage = options.messages.some(message => contentHasImage(message.content))
      if (containsImage && !model.input.includes('image')) {
        throw new LlmError(`pi-ai model "${model.id}" does not support image input`, 'UNSUPPORTED_CONTENT')
      }
      const attachments = containsImage ? this.config.resolveAttachments?.() : undefined
      if (containsImage && attachments === undefined) {
        throw new LlmError('pi-ai image input requires the durable attachment service', 'UNSUPPORTED_CONTENT')
      }
      const onReplayDegrade = (reason: string): void => {
        this.config.onReplayDegrade?.({ provider: options.provider, model: options.model, reason })
      }
      const context = attachments === undefined
        ? toPiContext(request, undefined, onReplayDegrade, replayTarget)
        : await toPiContext({ ...request, signal: watchdog.signal }, {
          attachments,
          resolveImageAccess: ref => this.config.resolveImageAccess?.(attachments, ref),
          maxRequestImageBytes: profile.maxRequestImageBytes,
          requestImagePolicy: {
            maxPixels: profile.requestImagePixelBudget,
            maxBytes: profile.requestImageMaxBytes,
          },
        }, onReplayDegrade, replayTarget)
      const streamOptions: SimpleStreamOptions = {
        ...profileOptions(profile, reasoning, apiKey),
        ...options.temperature === undefined ? {} : { temperature: options.temperature },
        ...options.maxTokens === undefined ? {} : { maxTokens: options.maxTokens },
        ...options.sessionId === undefined ? {} : { sessionId: replayScope === undefined ? String(options.sessionId)
          : createHash('sha256').update(JSON.stringify([replayScope.connectionId, replayScope.credentialGeneration,
            replayScope.endpoint, replayScope.api, String(options.sessionId)])).digest('hex') },
        signal: watchdog.signal,
        // Profile headers are deployment-owned; attribution names are
        // Harness-owned and therefore win collisions.
        headers: { ...requestHeaders({ ...profile.headers, ...storedHeaders }), ...choice.headers, ...accountAuthorization?.headers },
      }
      const events = choice.serviceTier !== undefined
        ? streamWithTier(models, model, context, streamOptions, choice.serviceTier)
        : models.streamSimple(model, context, streamOptions)
      const iterator = toStreamChunks(events, model.contextWindow, options.signal, options.model, replayScope, options.provider)[Symbol.asyncIterator]()
      let exhausted = false
      try {
        while (true) {
          const result = await watchdog.next(iterator)
          if (result.done) {
            exhausted = true
            return
          }
          yield result.value
        }
      } finally {
        if (!exhausted) {
          consumer.abort('pi-ai stream consumer stopped')
          // A demand the deadline abandoned can stay pending forever, and this
          // generator queues its return behind it; the abort above owns SDK termination.
          /* v8 ignore next -- the detached drain only rejects while unwinding an abandoned stream. */
          void iterator.return(undefined).catch(() => {})
        }
      }
    } catch (error: unknown) {
      if (timeoutOf(watchdog.signal, 'LLM_STREAM_IDLE_TIMEOUT') !== undefined) {
        throw new LlmError(`pi-ai stream idle timeout after ${streamIdleTimeoutMs}ms`, 'TIMEOUT', { cause: error })
      }
      if (options.signal?.aborted) {
        throw new LlmError('pi-ai request aborted by caller', 'ABORTED', { cause: error })
      }
      throw error
    } finally {
      consumer.abort('pi-ai stream consumer stopped')
    }
  }
}
