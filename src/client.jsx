import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { LoginController } from './controller.mjs'
import { en, ja } from './locales.mjs'
import css from './styles.css'
const NS = 'dsh.piLogin'
export const inject = ['slots', 'locale', 'connection']

function useCopy(locale) {
  useSyncExternalStore(listener => locale.subscribe(listener), () => locale.getSnapshot().revision)
  return locale.bind(NS)
}

function safeUrl(value) {
  try { const url = new URL(value); if (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) return url.href } catch {}
  return undefined
}

function Prompt({ prompt, ticket, controller, t, onFailure }) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const id = useId()
  async function submit(event) {
    event.preventDefault()
    const answer = value
    setValue(''); setBusy(true)
    try { await controller.call('answer', { ticket, id: prompt.id, value: answer }) } catch { onFailure() } finally { setBusy(false) }
  }
  return <form onSubmit={submit}>
    <label htmlFor={id}>{prompt.message || t(prompt.kind === 'secret' ? 'secret' : 'answer')}</label>
    {prompt.kind === 'select'
      ? <select id={id} value={value} onChange={event => setValue(event.target.value)} required><option value="">{t('selection')}</option>{prompt.options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select>
      : <input id={id} autoFocus type={prompt.kind === 'secret' ? 'password' : 'text'} autoComplete="off" spellCheck={false} value={value} placeholder={prompt.placeholder} onChange={event => setValue(event.target.value)} />}
    <div className="dsh-pi-actions"><button data-primary disabled={busy}>{t('submit')}</button></div>
  </form>
}

function LoginDialog({ entry, method, controller, t, onClose }) {
  const dialog = useRef(null)
  const ticketRef = useRef(undefined)
  const [ticket, setTicket] = useState(undefined)
  const [state, setState] = useState({ status: 'running' })
  const [error, setError] = useState(false)
  const [enabling, setEnabling] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [enableError, setEnableError] = useState(false)
  const [copied, setCopied] = useState(false)
  const titleId = useId()
  useEffect(() => {
    dialog.current.showModal()
    let alive = true
    void controller.start(entry.key, method).then(value => {
      ticketRef.current = value
      if (alive) setTicket(value)
      else void controller.cancel(value).catch(() => {})
    }, () => { if (alive) setError(true) })
    return () => { alive = false; if (ticketRef.current) void controller.cancel(ticketRef.current).catch(() => {}) }
  }, [])
  useEffect(() => {
    if (!ticket) return
    let alive = true
    const abort = new AbortController()
    let timer
    async function poll() {
      try {
        const snapshot = await controller.call('state', { ticket }, abort.signal)
        if (!alive) return
        setState(snapshot)
        if (snapshot.status === 'running') timer = setTimeout(poll, 800)
        else { controller.tickets.delete(ticket); await controller.load() }
      } catch { if (alive) setError(true) }
    }
    void poll()
    return () => { alive = false; abort.abort(); clearTimeout(timer) }
  }, [ticket])
  const link = safeUrl(state.notice?.url)
  const complete = state.status !== 'running' || error
  async function enable() {
    setEnabling(true); setEnableError(false)
    try { await controller.call('enable', { key: entry.key }); setEnabled(true) } catch { setEnableError(true) } finally { setEnabling(false) }
  }
  return <dialog ref={dialog} className="dsh-pi-login dsh-pi-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target !== dialog.current) return
    const rect = dialog.current.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
  }}>
    <h2 id={titleId}>{entry.label}</h2>
    {error || state.status === 'failed' ? <p role="alert">{t('failed')}</p> : null}
    {state.status === 'authorized' ? <><p role="status">{t('success')}</p><p>{t('successDescription')}</p>{enabled ? <p role="status">{t('enabled')}</p> : <button onClick={enable} disabled={enabling}>{t('enable')}</button>}{enableError ? <p role="alert">{t('enableFailed')}</p> : null}</> : null}
    {state.status === 'cancelled' ? <p>{t('expired')}</p> : null}
    {!complete ? <>
      <p role="status">{state.notice?.message || t(link ? 'waiting' : 'busy')}</p>
      {link ? <a className="dsh-pi-link" href={link} target="_blank" rel="noopener noreferrer">{t('openBrowser')}</a> : null}
      {state.notice?.code ? <><p>{t('code')}</p><code className="dsh-pi-code">{state.notice.code}</code><button onClick={async () => { try { await navigator.clipboard.writeText(state.notice.code); setCopied(true) } catch { setCopied(false) } }}>{t(copied ? 'copied' : 'copy')}</button></> : null}
      {state.prompt ? <Prompt key={state.prompt.id} prompt={state.prompt} ticket={ticket} controller={controller} t={t} onFailure={() => setError(true)} /> : null}
    </> : null}
    <div className="dsh-pi-actions"><button onClick={onClose}>{t(complete ? 'close' : 'cancel')}</button></div>
  </dialog>
}

export function ConnectionUI({ controller, locale, provider }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const t = useCopy(locale)
  const [selected, setSelected] = useState('llm-pi-ai/openai-codex')
  const [preferredMethod, setPreferredMethod] = useState('oauth')
  const [opened, setOpened] = useState(undefined)
  const id = useId()
  useEffect(() => { void controller.load() }, [controller])
  const entries = provider ? state.entries.filter(entry => entry.provider === provider.provider) : state.entries
  const entry = entries.find(entry => entry.key === selected) || entries[0]
  const method = entry?.methods.find(item => item.id === preferredMethod) || entry?.methods[0]
  if (provider && !entry && !state.error) return null
  return <section className={`dsh-pi-login ${provider ? 'dsh-pi-card' : 'dsh-pi-footer'}`}>
    {!provider ? <><h3>{t('title')}</h3><p className="dsh-pi-status">{t('description')}</p></> : null}
    {state.error ? <p role="alert">{t('loadFailed')} <button onClick={() => { void controller.load() }}>{t('retry')}</button></p> : null}
    {state.status === 'ready' && !state.error && entries.length === 0 && !provider ? <p>{t('empty')}</p> : null}
    {entry ? <>
      <div className="dsh-pi-fields">
        {!provider ? <label htmlFor={`${id}-provider`}>{t('provider')}<select id={`${id}-provider`} value={entry.key} onChange={event => setSelected(event.target.value)}>{entries.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label> : null}
        {entry.methods.length > 1 ? <label htmlFor={`${id}-method`}>{t('method')}<select id={`${id}-method`} value={method.id} onChange={event => setPreferredMethod(event.target.value)}>{entry.methods.map(item => <option key={item.id} value={item.id}>{item.id === 'oauth' ? t('oauth') : item.id === 'api-key' ? t('apiKey') : item.label}</option>)}</select></label> : null}
      </div>
      <div className="dsh-pi-row"><span className="dsh-pi-status">{t(entry.inFlight ? 'busy' : entry.configured ? 'connected' : 'notConnected')}</span><button data-primary disabled={entry.inFlight || !entry.writable || !method} onClick={() => setOpened({ entry, method: method.id })}>{t(entry.configured ? 'signInAgain' : 'signIn')}</button></div>
      {!entry.writable ? <p>{t('readOnly')}</p> : null}
    </> : null}
    {opened ? <LoginDialog {...opened} controller={controller} t={t} onClose={() => setOpened(undefined)} /> : null}
  </section>
}

export function apply(ctx) {
  const controller = new LoginController(ctx.connection)
  ctx.effect(() => () => controller.dispose(), 'dsh-pi-login: UI requests')
  ctx.effect(() => ctx.locale.register(NS, { en, ja }), 'dsh-pi-login: copy')
  ctx.effect(() => {
    const style = document.createElement('style'); style.dataset.dshPiLogin = ''; style.textContent = css; document.head.append(style)
    return () => style.remove()
  }, 'dsh-pi-login: styles')
  ctx.on('connection/reset', () => { void controller.load() })
  const inject = () => ({ controller, locale: ctx.locale })
  ctx.slots.inject('settings.models.footer', () => ctx.slots.register({ name: 'settings.models.footer', id: 'dsh-pi-login', order: 10, inject }, ConnectionUI))
  ctx.slots.inject('settings.models.provider-card', () => ctx.slots.register({ name: 'settings.models.provider-card', id: 'dsh-pi-login', key: 'llm-pi-ai', inject }, ConnectionUI))
}
