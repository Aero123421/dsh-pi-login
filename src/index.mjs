import { PiLoginBroker, LoginError, dispatch } from './broker.mjs'
export const inject = ['authorization', 'credentials', 'connection', 'settings']
export const name = 'dsh-pi-login'

export function apply(ctx) {
  const broker = new PiLoginBroker(ctx.authorization, ctx.credentials, ctx.settings)
  ctx.effect(() => () => broker.dispose(), 'dsh-pi-login: private attempts')
  for (const method of ['list', 'start', 'state', 'answer', 'cancel', 'enable']) {
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
          const value = await dispatch(broker, method, envelope.payload)
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
