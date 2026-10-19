import { ProviderReadError } from './provider-cache.mjs'
import { readProviderJson } from './account-usage-providers.mjs'

const finite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0
const reset = value => {
  if (value == null) return null
  const date = new Date(typeof value === 'number' && value < 100000000000 ? value * 1000 : value)
  return Number.isFinite(date.getTime()) ? date.toISOString() : null
}
const quota = (id, remaining, total, until, unit = 'USD') => ({
  id, scope: 'account', usedPercent: finite(total) && total > 0 ? Math.max(0, 100 * (total - remaining) / total) : null,
  resetsAt: reset(until), windowSeconds: null,
  quota: { unit, remaining, total: finite(total) ? total : null, used: finite(total) ? Math.max(0, total - remaining) : null },
})

export function parseOllamaBalance(body) {
  const windows = [], included = body?.included
  if (finite(included?.balance_usd)) windows.push(quota('included', included.balance_usd, included.allowance_usd, included.period?.until))
  for (const id of ['session', 'weekly']) {
    const entry = included?.[id]
    if (finite(entry?.remaining_percent) && entry.remaining_percent <= 100) windows.push({ id, scope: 'account',
      usedPercent: 100 - entry.remaining_percent, resetsAt: reset(entry.resets_at), windowSeconds: id === 'weekly' ? 604800 : null })
  }
  if (finite(body?.purchased?.balance_usd)) windows.push(quota('purchased', body.purchased.balance_usd))
  if (!windows.length) throw new ProviderReadError('error')
  return windows
}

/** CommandCode's internal credits endpoint is optional; failure never affects inference. */
export function parseCommandCredits(body) {
  const credits = body?.credits
  const amounts = ['monthlyCredits', 'purchasedCredits', 'freeCredits'].map(key => credits?.[key]).filter(finite)
  if (!amounts.length) throw new ProviderReadError('error')
  const windows = [quota('balance', amounts.reduce((sum, value) => sum + value, 0), undefined, undefined, 'credits')]
  for (const [key, id, seconds] of [['fiveHour', 'rolling', 18000], ['weekly', 'weekly', 604800]]) {
    const entry = body.windowLimits?.[key]
    if (!finite(entry?.used)) continue
    windows.push({ id, scope: 'account', usedPercent: finite(entry.cap) && entry.cap > 0 ? 100 * entry.used / entry.cap : null,
      resetsAt: reset(entry.resetAt), windowSeconds: seconds,
      quota: { unit: 'credits', used: entry.used, total: finite(entry.cap) ? entry.cap : null,
        remaining: finite(entry.cap) ? Math.max(0, entry.cap - entry.used) : null } })
  }
  return windows
}

export function gatewayUsageProviders({ fetch: request = (...args) => globalThis.fetch(...args), now = Date.now } = {}) {
  return Object.fromEntries(['commandcode', 'ollama-cloud'].map(provider => {
    const base = provider === 'commandcode' ? 'https://api.commandcode.ai/provider/v1' : 'https://ollama.com/v1'
    const validate = connection => {
      if (connection.authMethod !== 'api-key' || connection.credentialRef || connection.profile?.apiKeyEnv
        || connection.profile?.baseURL && connection.profile.baseURL.replace(/\/+$/, '') !== base
        || Object.keys(connection.headerRefs ?? {}).length || Object.keys(connection.profile?.headers ?? {}).length) throw new ProviderReadError('unsupported')
    }
    return [provider, { source: 'internal-http', validate, async read({ connection, credential, signal }) {
      validate(connection)
      if (credential?.type !== 'api_key' || credential.env || typeof credential.key !== 'string' || !/^[\x21-\x7e]+$/.test(credential.key)) throw new ProviderReadError('auth-required')
      const get = async url => readProviderJson(await request(url, { redirect: 'error', signal,
        headers: { accept: 'application/json', authorization: `Bearer ${credential.key}` } }), { now: now() })
      let windows
      if (provider === 'ollama-cloud') windows = parseOllamaBalance(await get('https://ollama.com/api/balance'))
      else {
        const identity = await get('https://api.commandcode.ai/alpha/whoami')
        const org = typeof identity?.org?.id === 'string' ? `?orgId=${encodeURIComponent(identity.org.id)}` : ''
        windows = parseCommandCredits(await get(`https://api.commandcode.ai/alpha/billing/credits${org}`))
      }
      return { source: 'internal-http', sourceObservedAt: new Date(now()).toISOString(), windows }
    } }]
  }))
}
