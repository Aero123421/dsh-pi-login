import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Button, Input, Menu, Modal, Switch, StateDot, IconChevronDownOutlineRegular, IconSearchOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import { LoginController } from './controller.mjs'
import { en, ja } from './locales.mjs'
import css from './styles.css'
import controlsCss from '../.cache/native-controls.css'

const NS = 'dsh.piLogin'
export const inject = ['slots', 'locale', 'connection']

function useCopy(locale) {
  useSyncExternalStore(listener => locale.subscribe(listener), () => locale.getSnapshot().revision)
  return locale.bind(NS)
}

function safeUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) return url.href
  } catch {}
}

function Choice({ label, value, options, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return <div className="dsh-pi-choice">
    <span id={id} className="dsh-pi-caption">{label}</span>
    <Menu open={open} onClose={() => setOpen(false)} portal selectedId={value} items={options}
      onSelect={id => { onChange(id); setOpen(false) }}
      anchor={<Button variant="outline" disabled={disabled} aria-labelledby={id} aria-haspopup="menu" aria-expanded={open}
        onClick={() => setOpen(!open)} className="dsh-pi-choice-button">
        <span>{options.find(option => option.id === value)?.label}</span><IconChevronDownOutlineRegular size={14} />
      </Button>} />
  </div>
}

function Prompt({ prompt, ticket, controller, t, onFailure }) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const id = useId()
  async function submit(event) {
    event.preventDefault()
    const answer = value
    setValue(''); setBusy(true)
    try { await controller.call('answer', { ticket, id: prompt.id, value: answer }) }
    catch { onFailure() } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="dsh-pi-prompt">
    {prompt.kind === 'select'
      ? <Choice label={prompt.message || t('selection')} value={value} options={prompt.options} onChange={setValue} disabled={busy} />
      : <><label htmlFor={id}>{prompt.message || t(prompt.kind === 'secret' ? 'secret' : 'answer')}</label>
        <Input id={id} data-modal-autofocus type={prompt.kind === 'secret' ? 'password' : 'text'} autoComplete="off" spellCheck={false}
          value={value} placeholder={prompt.placeholder} onChange={event => setValue(event.target.value)} /></>}
    <div className="dsh-pi-actions"><Button type="submit" variant="primary" disabled={busy || (prompt.kind === 'select' && !value)}>{t('submit')}</Button></div>
  </form>
}

function LoginDialog({ entry, method, controller, t, onClose }) {
  const ticketRef = useRef()
  const [ticket, setTicket] = useState()
  const [state, setState] = useState({ status: 'running' })
  const [error, setError] = useState(false)
  const [enabling, setEnabling] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [enableError, setEnableError] = useState(false)
  const [keyOverride, setKeyOverride] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
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
    let alive = true, timer
    const abort = new AbortController()
    async function poll() {
      try {
        const snapshot = await controller.call('state', { ticket }, abort.signal)
        if (!alive) return
        setState(snapshot)
        if (snapshot.status === 'running') timer = setTimeout(poll, 800)
        else { controller.tickets.delete(ticket); await controller.refresh() }
      } catch { if (alive) setError(true) }
    }
    void poll()
    return () => { alive = false; abort.abort(); clearTimeout(timer) }
  }, [ticket])
  const link = safeUrl(state.notice?.url)
  const complete = state.status !== 'running' || error
  const terminalCopy = state.reason === 'provider-expired' ? 'providerExpired' : state.reason === 'timeout' ? 'timedOut' : state.status === 'cancelled' ? 'cancelled' : 'failed'
  async function enable(useLogin = false) {
    setEnabling(true); setEnableError(false)
    try { await controller.call(useLogin ? 'use-login' : 'enable', { key: entry.key }); setEnabled(true); await controller.refresh() }
    catch (error) { setEnableError(true); setKeyOverride(error.message.endsWith('/api-key-override')) } finally { setEnabling(false) }
  }
  return <Modal open onClose={onClose} title={entry.label} closeLabel={t('close')} className="dsh-pi-login"
    footer={<Button variant="outline" onClick={onClose}>{t(complete ? 'close' : 'cancel')}</Button>}>
    {error || state.status === 'failed' ? <p role="alert">{t(error ? 'failed' : terminalCopy)}</p> : null}
    {state.status === 'authorized' ? <><p role="status">{t('success')}</p><p className="dsh-pi-muted">{t('successDescription')}</p>
      {enabled ? <p role="status">{t('enabled')}</p> : <Button variant="primary" onClick={() => { void enable() }} disabled={enabling}>{t('enable')}</Button>}
      {enableError ? <p role="alert">{t(keyOverride ? 'keyOverride' : 'enableFailed')}</p> : null}
      {keyOverride && !enabled ? <Button variant="outline" onClick={() => { void enable(true) }} disabled={enabling}>{t('useLogin')}</Button> : null}</> : null}
    {state.status === 'cancelled' ? <p role={state.reason === 'timeout' ? 'alert' : 'status'}>{t(terminalCopy)}</p> : null}
    {!complete ? <>
      <p role="status">{state.notice?.message || t(link ? 'waiting' : 'busy')}</p>
      {link ? <a className="dsh-pi-link" href={link} target="_blank" rel="noopener noreferrer">{t('openBrowser')}</a> : null}
      {state.notice?.code ? <div className="dsh-pi-verification"><span className="dsh-pi-muted">{t('code')}</span>
        <div className="dsh-pi-verification-row"><code>{state.notice.code}</code>
          <Button size="sm" variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(state.notice.code); setCopied(true) } catch { setCopied(false) } }}>{t(copied ? 'copied' : 'copy')}</Button></div></div> : null}
      {state.prompt ? <Prompt key={state.prompt.id} prompt={state.prompt} ticket={ticket} controller={controller} t={t} onFailure={() => setError(true)} /> : null}
    </> : null}
  </Modal>
}

function ModelsDialog({ entry, controller, t, onClose }) {
  const [snapshot, setSnapshot] = useState()
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const refreshAbort = useRef()
  const generation = useRef(0)
  useEffect(() => {
    const abort = new AbortController()
    void controller.call('models', { key: entry.key }, abort.signal).then(setSnapshot, () => { if (!abort.signal.aborted) setError(true) })
    return () => { abort.abort(); refreshAbort.current?.abort(); generation.current++ }
  }, [entry.key])
  async function reload() {
    const request = ++generation.current
    refreshAbort.current?.abort()
    const abort = new AbortController(); refreshAbort.current = abort
    setBusy(true); setRefreshError(''); setError(false)
    try {
      const next = await controller.call('refresh-models', { key: entry.key }, abort.signal)
      if (!abort.signal.aborted && request === generation.current) setSnapshot(next)
    } catch (error) {
      if (!abort.signal.aborted && request === generation.current) {
        const code = error.message.split('/').pop()
        setRefreshError(snapshot?.refresh?.errors?.[code] ?? 'catalogRefreshFailed')
      }
    } finally { if (!abort.signal.aborted && request === generation.current) setBusy(false) }
  }
  async function toggle(model, enabled) {
    setBusy(true); setError(false)
    try {
      await controller.call('set-model', { key: entry.key, model, enabled, revision: snapshot.revision })
      setSnapshot(await controller.call('models', { key: entry.key }))
    } catch {
      setError(true)
      try { setSnapshot(await controller.call('models', { key: entry.key })) } catch {}
    } finally { setBusy(false) }
  }
  const needle = search.trim().toLowerCase()
  const models = snapshot?.models.filter(model => `${model.id} ${model.name}`.toLowerCase().includes(needle))
  return <Modal open title={`${entry.label} · ${t('models')}`} description={t('modelsHint')} closeLabel={t('close')} onClose={onClose}
    className="dsh-pi-login dsh-pi-models-dialog" footer={<Button variant="outline" onClick={onClose}>{t('close')}</Button>}>
    <Input icon={<IconSearchOutlineRegular size={16} />} aria-label={t('searchModels')} placeholder={t('searchModels')} data-modal-autofocus value={search} onChange={event => setSearch(event.target.value)} />
    {snapshot?.refresh?.canRefresh ? <>
      <Button variant="outline" size="sm" disabled={busy || !entry.writable} onClick={() => { void reload() }}>{t(busy ? 'loading' : 'reloadModels')}</Button>
      {snapshot.refresh.status ? <p role="status">{t(snapshot.refresh.status.message)}{snapshot.refresh.status.detail ? ` · ${snapshot.refresh.status.detail}` : ''}</p> : null}
      {snapshot.refresh.notes.map(note => <p key={note} className="dsh-pi-muted">{t(note)}</p>)}
    </> : snapshot ? <p className="dsh-pi-muted">{t('catalogRefreshUnsupported')}</p> : null}
    {refreshError ? <p role="alert">{t(refreshError)}</p> : null}
    {error ? <p role="alert">{t(snapshot ? 'saveFailed' : 'modelsFailed')}</p> : null}
    {!snapshot && !error ? <p role="status">{t('loading')}</p> : null}
    {snapshot && !entry.managed ? <p className="dsh-pi-muted">{t('activateFirst')}</p> : null}
    {snapshot?.models.some(model => model.fast) ? <p className="dsh-pi-muted">{t('fastWarning')}</p> : null}
    <div className="dsh-pi-model-list">
      {models?.map(model => <div className="dsh-pi-model-row" key={model.id}>
        <div className="dsh-pi-model-label"><span>{model.name}</span><span className="dsh-pi-model-id">{model.id}</span>{model.capabilityUnverified ? <span className="dsh-pi-muted">{t('capabilitiesUnknown')}</span> : null}</div>
        <Switch label={`${t('modelEnabled')}: ${model.name}`} checked={model.enabled} disabled={busy || !entry.writable || !entry.managed} onChange={enabled => { void toggle(model.id, enabled) }} />
      </div>)}
      {models?.length === 0 ? <p className="dsh-pi-muted">{t('noResults')}</p> : null}
    </div>
  </Modal>
}

export function ConnectionUI({ controller, locale, provider }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const t = useCopy(locale)
  const [selected, setSelected] = useState('llm-pi-ai/openai')
  const [preferredMethod, setPreferredMethod] = useState('oauth')
  const [opened, setOpened] = useState()
  const [choosingModels, setChoosingModels] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => { void controller.load() }, [controller])
  const entries = provider ? state.entries.filter(entry => entry.provider === provider.provider) : state.entries
  const entry = entries.find(entry => entry.key === selected) || entries[0]
  const method = entry?.methods.find(item => item.id === preferredMethod) || entry?.methods[0]
  async function toggleProvider(enabled) {
    setBusy(true); setError(false)
    try {
      const snapshot = await controller.call('models', { key: entry.key })
      await controller.call('set-provider', { key: entry.key, enabled, revision: snapshot.revision })
      await controller.refresh()
    } catch { setError(true); await controller.refresh() } finally { setBusy(false) }
  }
  if (provider && !entry && !state.error) return null
  return <section className={`dsh-pi-login ${provider ? 'dsh-pi-card' : 'dsh-pi-footer'}`}>
    {!provider ? <><h3>{t('title')}</h3><p className="dsh-pi-muted">{t('description')}</p></> : null}
    {state.error ? <p role="alert">{t('loadFailed')} <Button size="sm" onClick={() => { void controller.refresh() }}>{t('retry')}</Button></p> : null}
    {state.status === 'ready' && !state.error && entries.length === 0 && !provider ? <p>{t('empty')}</p> : null}
    {entry ? <>
      <div className="dsh-pi-fields">
        {!provider ? <Choice label={t('provider')} value={entry.key} options={entries.map(item => ({ id: item.key, label: item.label }))}
          onChange={setSelected} disabled={busy} /> : null}
        {entry.methods.length > 1 ? <Choice label={t('method')} value={method.id} options={entry.methods.map(item => ({ id: item.id, label: item.id === 'oauth' ? t('oauth') : item.id === 'api-key' ? t('apiKey') : item.label }))}
          onChange={setPreferredMethod} disabled={busy} /> : null}
      </div>
      <div className="dsh-pi-account-row"><span className="dsh-pi-status"><StateDot state={entry.inFlight ? 'ongoing' : entry.configured ? 'done' : 'pending'} size={10} />{t(entry.inFlight ? 'busy' : entry.configured ? 'connected' : 'notConnected')}</span>
        <Button variant={entry.configured ? 'outline' : 'primary'} size="sm" disabled={entry.inFlight || !entry.writable || !method} onClick={() => setOpened({ entry, method: method.id })}>{t(entry.configured ? 'signInAgain' : 'signIn')}</Button></div>
      <div className="dsh-pi-provider-row"><div><span>{t('useProvider')}</span><p className="dsh-pi-muted">{t('disabledHint')}</p></div>
        <Switch label={`${t('useProvider')}: ${entry.label}`} checked={entry.enabled} disabled={busy || !entry.writable || (!entry.configured && !entry.managed)} onChange={enabled => { void toggleProvider(enabled) }} /></div>
      <Button variant="outline" size="sm" disabled={busy} onClick={() => setChoosingModels(true)}>{t('manageModels')}</Button>
      {error ? <p role="alert">{t('saveFailed')}</p> : null}
      {!entry.writable ? <p className="dsh-pi-muted">{t('readOnly')}</p> : null}
    </> : null}
    {opened ? <LoginDialog {...opened} controller={controller} t={t} onClose={() => setOpened(undefined)} /> : null}
    {choosingModels && entry ? <ModelsDialog entry={entry} controller={controller} t={t} onClose={() => setChoosingModels(false)} /> : null}
  </section>
}

export function apply(ctx) {
  const controller = new LoginController(ctx.connection)
  ctx.effect(() => () => controller.dispose(), 'dsh-pi-login: UI requests')
  ctx.effect(() => ctx.locale.register(NS, { en, ja }), 'dsh-pi-login: copy')
  ctx.effect(() => {
    const style = document.createElement('style'); style.dataset.dshPiLogin = ''; style.textContent = controlsCss + css; document.head.append(style)
    return () => style.remove()
  }, 'dsh-pi-login: official controls')
  ctx.on('connection/reset', () => { void controller.refresh() })
  const inject = () => ({ controller, locale: ctx.locale })
  ctx.slots.inject('settings.models.footer', () => ctx.slots.register({ name: 'settings.models.footer', id: 'dsh-pi-login', order: 10, inject }, ConnectionUI))
  ctx.slots.inject('settings.models.provider-card', () => ctx.slots.register({ name: 'settings.models.provider-card', id: 'dsh-pi-login', key: 'dsh-pi-login', inject }, ConnectionUI))
}
