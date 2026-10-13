import { PiLoginBroker, LoginError, dispatch } from './broker.mjs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { PluginUpdates } from './updates.mjs'
export function applyLoginUI(ctx, options = {}) {
  const broker = new PiLoginBroker(ctx.authorization, ctx.credentials, ctx.settings, options)
  let writes = 0
  const updates = new PluginUpdates({
    manager: () => ctx.get('pluginManager'), profileDir: ctx.get('profileContext')?.dir,
    runtimeVersion: async () => {
      const moduleName = '@deepseek-ai/dsh-app-boot'
      const anchor = ctx.get('profileContext')?.installAnchor
      const resolved = anchor ? pathToFileURL(createRequire(anchor).resolve(moduleName)).href : moduleName
      return (await import(resolved)).getDshRuntimeVersion()
    },
    isBusy: () => writes > 0 || ctx.authorization.list().some(entry => entry.key.startsWith('llm-pi-ai/') && entry.inFlight),
    ...options.updates,
  })
  ctx.effect(() => () => { updates.dispose(); broker.dispose() }, 'dsh-pi-login: private attempts and update retrieval')
  for (const method of ['list', 'start', 'state', 'answer', 'cancel', 'enable', 'models', 'refresh-models', 'set-model', 'set-provider', 'use-login', 'update-status', 'update-check', 'update-begin', 'update-reconcile']) {
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
          let value
          if (method.startsWith('update-')) {
            const payload = envelope.payload
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new LoginError('invalid-request')
            try {
              if (method === 'update-status') value = await updates.status()
              else if (method === 'update-check') value = await updates.check()
              else if (method === 'update-begin') value = await updates.begin(payload.candidateId, payload.requestId)
              else value = await updates.reconcile(payload.requestId)
            } catch (error) { throw new LoginError(error.message === 'busy' ? 'busy' : 'update-failed') }
          } else {
            const mutation = ['start', 'answer', 'enable', 'set-model', 'set-provider', 'use-login'].includes(method)
            if (mutation && updates.running) throw new LoginError('busy')
            if (mutation) writes++
            try { value = await dispatch(broker, method, envelope.payload) } finally { if (mutation) writes-- }
          }
          return Response.json({ type: 'server-response', rpcId, result: { ok: true, value } }, { headers: { 'cache-control': 'no-store' } })
        } catch (error) {
          if (rpcId === undefined) return new Response('invalid request', { status: 400 })
          const code = error instanceof LoginError ? error.code : 'unavailable'
          return Response.json({ type: 'server-response', rpcId, result: { ok: false, error: { code: `dsh-pi-login/${code}`, message: code, details: {} } } }, { headers: { 'cache-control': 'no-store' } })
        }
      },
    })
  }
}
