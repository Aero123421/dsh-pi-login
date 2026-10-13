/**
 * Maps Pi login events and prompts to Harness Authorization flows.
 *
 * @module dsh-pi-login/runtime/login
 */

import type { AuthEvent, AuthPrompt, AuthType, Provider } from '@earendil-works/pi-ai'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import type { AuthorizationMethod, AuthorizationPrompt, AuthorizationSession } from '@deepseek-ai/dsh-authorization'
import { isCredentialKeySegment } from '@deepseek-ai/dsh-credentials'
import { catalogProvider, catalogProviderIds } from './catalog.ts'
import { recordKeyFor } from './auth.ts'
import type { PiAiAuthInjection } from './adapter.ts'
import { createModels } from './models.ts'

/**
 * The login methods one catalog provider offers.
 *
 * OAuth uses the SDK's flow; OpenAI receives a stable installation ID below.
 * API-key methods appear when the SDK collects the key interactively.
 * @param provider - the installed catalog provider, if pi-ai ships one.
 * @returns its methods, most preferred first; empty when it offers no login.
 */
function loginMethods(provider: Provider | undefined): AuthorizationMethod[] {
  const methods: AuthorizationMethod[] = []
  const oauth = provider?.auth.oauth
  if (oauth !== undefined) methods.push({ id: 'oauth', label: oauth.loginLabel ?? oauth.name })
  const apiKey = provider?.auth.apiKey
  if (apiKey?.login !== undefined) methods.push({ id: 'api-key', label: apiKey.name })
  return methods
}

/**
 * Convert a Pi login event to an Authorization notice.
 * Device-code notices retain both the verification URL and the code.
 * @param event - what pi-ai reported.
 * @param session - the attempt to report it to.
 */
function relay(event: AuthEvent, session: AuthorizationSession): void {
  switch (event.type) {
    case 'info': {
      const link = event.links?.[0]
      session.notify({ message: event.message, ...link === undefined ? {} : { url: link.url } })
      return
    }
    case 'auth_url':
      session.notify({
        message: event.instructions ?? 'Open this page to continue signing in.',
        url: event.url,
      })
      return
    case 'device_code': {
      const notice = {
        message: 'Enter this code on the verification page to finish signing in.',
        url: event.verificationUri,
        code: event.userCode,
        expiresInSeconds: event.expiresInSeconds,
      }
      session.notify(notice)
      return
    }
    case 'progress':
      session.notify({ message: event.message })
      return
    default:
      // Keep showing progress for event types added by a newer SDK.
      session.notify({ message: 'Signing in…' })
  }
}

/**
 * Convert a Pi prompt to an Authorization prompt.
 * Manual codes use a text input. Preserve the abort signal so a browser
 * callback can cancel a pending code prompt.
 * @param prompt - what pi-ai asked.
 * @returns the prompt shown by the login UI.
 */
function restate(prompt: AuthPrompt): AuthorizationPrompt {
  const signal = prompt.signal === undefined ? {} : { signal: prompt.signal }
  switch (prompt.type) {
    case 'select':
      return { ...signal, kind: 'select', message: prompt.message, options: prompt.options }
    case 'secret':
      return {
        ...signal,
        kind: 'secret',
        message: prompt.message,
        ...prompt.placeholder === undefined ? {} : { placeholder: prompt.placeholder },
      }
    default:
      return {
        ...signal,
        kind: 'text',
        message: prompt.message,
        ...prompt.placeholder === undefined ? {} : { placeholder: prompt.placeholder },
      }
  }
}

/**
 * Register one authorization flow per installed provider that ships a login.
 *
 * Register flows on mount so login is available before configuring a provider.
 * @param ctx - the plugin context carrying `ctx.authorization`.
 * @param auth - the injectables every collection here is built with.
 */
export function registerPiAiFlows(ctx: Context, auth: PiAiAuthInjection, onLogin?: (provider: string) => void): void {
  for (const providerId of catalogProviderIds()) {
    const provider = catalogProvider(providerId)
    const [first, ...rest] = loginMethods(provider)
    /* v8 ignore next 3 -- every id here names an installed provider and every
       installed provider ships a login, so no entry is skipped; the guard
       is what keeps that from becoming a crash if either stops being true. */
    if (provider === undefined || first === undefined) continue
    /* v8 ignore next 7 -- every installed catalog id is a lowercase
       hyphenated identifier; the guard keeps a future upstream id outside the
       record grammar (dotted or uppercase, as vendor ids elsewhere already
       are) from throwing in `recordKeyFor` and failing the whole mount. */
    if (!isCredentialKeySegment(providerId)) {
      ctx.logger.warn(
        'llm-pi-ai: catalog provider "%s" cannot address a credential record; its sign-in is not offered',
        providerId)
      continue
    }
    ctx.authorization.registerFlow({
      key: recordKeyFor(providerId),
      label: provider.name,
      methods: [first, ...rest],
      async run(session) {
        // Login uses a separate Models collection with the shared credential store.
        const models = createModels(auth)
        models.setProvider(provider)
        // Authorization accepts only methods declared by this flow.
        const type: AuthType = session.method === 'oauth' ? 'oauth' : 'api_key'
        let deviceId: string | undefined
        if (providerId === 'openai' && type === 'oauth') {
          const record = await ctx.credentials.modifyRecord('dsh-pi-login/installation', current => {
            if (current?.kind === 'grant' && typeof current.payload?.deviceId === 'string') return current
            return { kind: 'grant', payload: { deviceId: randomUUID() } }
          })
          deviceId = (record?.kind === 'grant' ? record.payload.deviceId : undefined) as string | undefined
        }
        // The SDK writes login credentials through the shared store.
        await models.login(providerId, type, {
          signal: session.signal,
          notify: (event) => { relay(event, session) },
          prompt: prompt => session.prompt(restate(prompt)),
        }, deviceId === undefined ? undefined : { getDeviceId: () => deviceId! })
        onLogin?.(providerId)
      },
    })
  }
}
