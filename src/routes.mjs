import { PiLoginBroker, LoginError, dispatch } from './broker.mjs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { PluginUpdates } from './updates.mjs'
import { ConnectionError } from './connections.mjs'
import { RegistryError } from './registry.mjs'
import { updateRefusalReason } from './presentation.mjs'
export function applyLoginUI(ctx, options = {}) {
  const broker = new PiLoginBroker(ctx.authorization, ctx.credentials, ctx.settings, options)
  let writes = 0
  let appBoot
  let appBootSpecifier
  const loadAppBoot = () => {
    const moduleName = '@deepseek-ai/dsh-app-boot'
    const anchor = ctx.get('profileContext')?.installAnchor
    const resolved = anchor ? pathToFileURL(createRequire(anchor).resolve(moduleName)).href : moduleName
    if (appBootSpecifier !== resolved) {
      appBootSpecifier = resolved
      appBoot = import(resolved)
    }
    return appBoot
  }
  const updates = new PluginUpdates({
    manager: () => ctx.get('pluginManager'), profileDir: ctx.get('profileContext')?.dir,
    runtimeVersion: async () => (await loadAppBoot()).getDshRuntimeVersion(),
    compatibilityEvaluator: async (packageJson, exemptions, runtimeVersion) => {
      const evaluate = (await loadAppBoot()).evaluatePluginCompatibility
      return typeof evaluate === 'function' ? evaluate(packageJson, exemptions, runtimeVersion) : null
    },
    isBusy: () => writes > 0 || ctx.authorization.list().some(entry => entry.key.startsWith('llm-pi-ai/') && entry.inFlight),
    ...options.updates,
  })
  ctx.effect(() => () => { updates.dispose(); broker.dispose() }, 'dsh-pi-login: private attempts and update retrieval')
  const connectionMutations = ['connection-create', 'connection-update', 'connection-clone', 'connection-delete', 'connection-cleanup']
  for (const method of ['connection-list', ...connectionMutations, 'usage', 'list', 'start', 'state', 'answer', 'cancel', 'enable', 'models', 'refresh-models', 'set-model', 'set-provider', 'use-login', 'update-status', 'update-check', 'update-begin', 'update-reconcile']) {
    const endpoint = `dsh-pi-login/${method}`
    ctx.connection.fetch.register({
      path: `/api/${endpoint}`, methods: ['POST'], requestBody: 'buffered',
      async fetch(request) {
        let rpcId
        try {
          if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return new Response('unsupported media type', { status: 415 })
          const envelope = await request.json()
          if (envelope?.type !== 'client-request' || typeof envelope.rpcId !== 'string' || envelope.rpcId.length > 100 || envelope.method !== endpoint) return new Response('invalid request', { status: 400 })
          rpcId = envelope.rpcId
          request.signal.throwIfAborted()
          // A write error leaves modelCatalog in settings. The next request tries the migration again.
          if (options.connections?.migrateModelCatalogs) await options.connections.migrateModelCatalogs().catch(error => {
            if (request.signal.aborted) throw error
          })
          let value
          if (method.startsWith('update-')) {
            const payload = envelope.payload
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new LoginError('invalid-request')
            try {
              if (method === 'update-status') value = await updates.status()
              else if (method === 'update-check') value = await updates.check()
              else if (method === 'update-begin') value = await updates.begin(payload.candidateId, payload.requestId, payload.profileKey)
              else value = await updates.reconcile(payload.requestId)
            } catch (error) {
              const reason = updateRefusalReason(error instanceof Error ? error.message : '')
              throw new LoginError(reason === 'network' ? 'update-failed' : reason)
            }
          } else {
            const mutation = [...connectionMutations, 'start', 'answer', 'enable', 'set-model', 'set-provider', 'use-login'].includes(method)
            if (mutation && updates.running) throw new LoginError('busy')
            if (mutation) writes++
            try {
              const payload = envelope.payload
              if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new LoginError('invalid-request')
              if (connectionMutations.includes(method)) {
                if (!options.connections) throw new LoginError('unavailable')
                options.connections.guard(payload)
                if (method === 'connection-create') value = await options.connections.create(payload, payload.revision)
                else if (method === 'connection-update') value = await options.connections.update(payload.connectionId, payload.patch, payload.revision)
                else if (method === 'connection-clone') value = await options.connections.clone(payload.connectionId, payload.displayName, payload.revision)
                else if (method === 'connection-cleanup') value = await options.connections.cleanupCredentials(payload.connectionId, payload.revision)
                else value = await options.connections.delete(payload.connectionId, payload.revision)
              } else if (method === 'connection-list') {
                if (!options.connections) throw new LoginError('unavailable')
                value = await options.connections.list()
              } else if (method === 'usage') {
                if (!options.connections || !options.usage) throw new LoginError('unavailable')
                options.connections.guard(payload)
                const connection = options.connections.lookup(payload.connectionId)
                const binding = options.connections.binding(connection)
                value = await options.usage.get(binding, { force: payload.refresh === true, signal: request.signal })
                if (!options.connections.isCurrent(binding)) throw new LoginError('connection-changed')
              } else value = await dispatch(broker, method, payload)
            } finally { if (mutation) writes-- }
          }
          return Response.json({ type: 'server-response', rpcId, result: { ok: true, value } }, { headers: { 'cache-control': 'no-store' } })
        } catch (error) {
          if (rpcId === undefined) return new Response('invalid request', { status: 400 })
          const code = error instanceof LoginError || error instanceof ConnectionError || error instanceof RegistryError ? error.code : 'unavailable'
          return Response.json({ type: 'server-response', rpcId, result: { ok: false, error: { code: `dsh-pi-login/${code}`, message: code, details: {} } } }, { headers: { 'cache-control': 'no-store' } })
        }
      },
    })
  }
}
