/** Pure projections of connection status, usage time, and retry availability. */

export function statusOf(entry) {
  if (entry.deletionPending) return { dot: 'warning', copy: 'deletionPendingShort' }
  // Login uses "Signing in…". Saving a key or deleting a connection is not a sign-in.
  if (entry.inFlight || entry.authStatus === 'updating') return { dot: 'ongoing', copy: entry.authStatus === 'updating' ? 'busy' : 'working' }
  if (entry.authStatus === 'expired') return { dot: 'error', copy: 'authExpired' }
  if (entry.authStatus === 'unavailable') return { dot: 'warning', copy: 'authUnavailable' }
  if (!entry.configured) return { dot: 'idle', copy: 'notConnected' }
  if (!entry.enabled) return { dot: 'idle', copy: 'statusOff' }
  // A stored key or grant is not a completed sign-in check. Green means verified.
  if (entry.authStatus === 'verified') return { dot: 'done', copy: 'connected' }
  return { dot: 'warning', copy: 'savedUnverified' }
}

export function usageLimited(snapshot, now = Date.now()) {
  if (snapshot?.status !== 'rate-limited' || snapshot.retryAt == null) return false
  const at = new Date(snapshot.retryAt).valueOf()
  return Number.isFinite(at) && at > now
}

const UPDATE_REFUSAL_REASONS = new Set([
  'busy', 'profile', 'stale-candidate', 'storage', 'interrupted',
  'manager-unavailable', 'read-only', 'source', 'incompatible', 'compatibility-unknown',
  'metadata', 'asset', 'channel', 'checksum', 'redirect', 'size', 'release-unavailable',
  'replace', 'restored', 'restore-failed', 'version-differs',
])

/** Map an update RPC rejection to a locale reason. Unknown codes stay "network". */
export function updateRefusalReason(message) {
  const code = String(message ?? '').split('/').pop()
  return UPDATE_REFUSAL_REASONS.has(code) ? code : 'network'
}

/**
 * Terminal copy for a finished sign-in.
 * Account changes are reported even when the attempt was cancelled.
 * Muse Code reasons are left to the caller, which owns those error keys.
 */
export function loginTerminalCopy(state) {
  const reason = state?.reason
  if (typeof reason === 'string' && reason.startsWith('muse-code-')) return undefined
  if (reason === 'connection-changed') return 'connectionChanged'
  if (reason === 'provider-expired') return 'providerExpired'
  if (reason === 'timeout') return 'timedOut'
  if (state?.status === 'cancelled') return 'cancelled'
  return 'failed'
}

const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/

/** Prefix a catalog status detail. ISO instants are formatted; other text is kept. */
export function statusDetail(detail, options) {
  if (typeof detail !== 'string' || detail === '') return ''
  if (!ISO_INSTANT.test(detail)) return ` · ${detail}`
  return ` · ${formatTime(detail, options) || detail}`
}

/** Pi's Meta service label is localized. Other names come from the catalog. */
export function localizedServiceName(service, translate) {
  const serviceId = service?.serviceId ?? service?.id
  if (service?.integrationId === 'pi' && serviceId === 'meta') return translate('serviceMetaViaPi')
  return service?.label ?? service?.serviceLabel ?? ''
}

/** Disambiguate two services that share a label, in the active language. */
export function serviceChoiceLabel(label, integration, duplicate, translate) {
  if (!duplicate || typeof integration !== 'string' || integration.length === 0) return label
  return translate('serviceWithIntegration').replaceAll('{service}', String(label)).replaceAll('{integration}', integration)
}

/** Copy for a package that is installed without confirming the previous version. */
export function versionDiffersLine(state, translate) {
  const installed = typeof state?.installedVersion === 'string' ? state.installedVersion : ''
  const expected = typeof state?.expectedVersion === 'string' ? state.expectedVersion : ''
  if (installed && expected && installed !== expected) {
    return translate('updateVersionDiffers').replaceAll('{installed}', installed).replaceAll('{expected}', expected)
  }
  if (installed) return translate('updateVersionInstalled').replaceAll('{installed}', installed)
  return translate('updateVersionUnconfirmed')
}

/** Milliseconds until a manual retry is allowed. Zero means the button can be used. */
export function retryWait(retryAt, now = Date.now()) {
  const at = new Date(retryAt).valueOf()
  if (!Number.isFinite(at)) return 0
  return Math.max(0, at - now)
}

function calendarDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value))
  if (!match) return undefined
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return undefined
  return date
}

/**
 * Format a provider instant in the UI language.
 * `dateOnly` is a calendar date with no time. It is not a UTC midnight instant,
 * so a negative local offset must not show the previous day.
 */
export function formatTime(value, { dateOnly = false, lang, timeZone } = {}) {
  if (!value) return undefined
  const language = lang ?? (typeof document !== 'undefined' ? document.documentElement.lang || undefined : undefined)
  if (dateOnly) {
    const date = calendarDate(value)
    if (!date) return typeof value === 'string' ? value : undefined
    try { return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeZone: 'UTC' }).format(date) }
    catch { return value }
  }
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return undefined
  try {
    return new Intl.DateTimeFormat(language, {
      dateStyle: 'medium', timeStyle: 'short', ...(timeZone ? { timeZone } : {}),
    }).format(date)
  } catch { return date.toLocaleString(language) }
}
