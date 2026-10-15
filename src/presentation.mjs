/** Pure projections of connection status, usage time, and retry availability. */

export function statusOf(entry) {
  if (entry.deletionPending) return { dot: 'warning', copy: 'deletionPendingShort' }
  if (entry.inFlight || entry.authStatus === 'updating') return { dot: 'ongoing', copy: 'busy' }
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
