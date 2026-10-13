import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Button, Input, Menu, Modal, Switch, StateDot, IconChevronDownOutlineRegular, IconSearchOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import { LoginController } from './controller.mjs'
import { UpdateController } from './update-controller.mjs'
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

/** Dates follow the UI language, not the browser default. */
function time(value, dateOnly = false) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return dateOnly ? value : undefined
  const lang = document.documentElement.lang || undefined
  try { return new Intl.DateTimeFormat(lang, dateOnly ? { dateStyle: 'medium' } : { dateStyle: 'medium', timeStyle: 'short' }).format(date) }
  catch { return date.toLocaleString() }
}

// A password-type field makes browsers treat the input before it as a username
// and offer saved passwords. Mask with CSS instead where the engine supports it.
const CSS_MASK = typeof CSS !== 'undefined' && CSS.supports?.('-webkit-text-security', 'disc') === true
const noAutofill = { autoComplete: 'off', autoCapitalize: 'off', autoCorrect: 'off', spellCheck: false, 'data-1p-ignore': '', 'data-lpignore': 'true', 'data-form-type': 'other' }
function secretProps(hidden) {
  return { ...noAutofill, type: hidden && !CSS_MASK ? 'password' : 'text', className: hidden && CSS_MASK ? 'dsh-pi-masked' : undefined }
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
  const [visible, setVisible] = useState(false)
  const [pasteError, setPasteError] = useState(false)
  const id = useId()
  async function submit(event) {
    event.preventDefault()
    const answer = value
    setValue(''); setBusy(true)
    try { await controller.mutation('answer', { ticket, id: prompt.id, value: answer }) }
    catch { onFailure() } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="dsh-pi-prompt">
    {prompt.kind === 'select'
      ? <Choice label={prompt.message || t('selection')} value={value} options={prompt.options} onChange={setValue} disabled={busy} />
      : <><label htmlFor={id}>{prompt.message || t(prompt.kind === 'secret' ? 'secret' : 'answer')}</label>
        <Input id={id} data-modal-autofocus {...(prompt.kind === 'secret' ? secretProps(!visible) : noAutofill)}
          value={value} placeholder={prompt.placeholder} onChange={event => setValue(event.target.value)} />
        {prompt.kind === 'secret' ? <div className="dsh-pi-inline-actions"><Button size="sm" onClick={() => setVisible(!visible)} aria-pressed={visible}>{t(visible ? 'hideSecret' : 'showSecret')}</Button>
          <Button size="sm" onClick={async () => { try { setValue(await navigator.clipboard.readText()); setPasteError(false) } catch { setPasteError(true) } }}>{t('paste')}</Button></div> : null}</>}
    {pasteError ? <p role="alert">{t('pasteFailed')}</p> : null}
    <div className="dsh-pi-actions"><Button type="submit" variant="primary" disabled={busy || (prompt.kind === 'select' && !value)}>{t('submit')}</Button></div>
  </form>
}

function LoginDialog({ entry, method, controller, t, onClose, onModels }) {
  const ticketRef = useRef()
  const [ticket, setTicket] = useState()
  const [state, setState] = useState({ status: 'running' })
  const [error, setError] = useState(false)
  const [enabling, setEnabling] = useState(false)
  const [enabled, setEnabled] = useState(entry.enabled === true)
  const [enableError, setEnableError] = useState(false)
  const [keyOverride, setKeyOverride] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    let alive = true
    void controller.start(entry.connectionId, method).then(value => {
      ticketRef.current = value
      if (alive) setTicket(value)
      else void controller.cancel(value).catch(() => {})
    }, error => { if (alive) setError(connectionError(error)) })
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
        else {
          controller.tickets.delete(ticket)
          // Signing in is the user's intent to use this connection.
          if (snapshot.status === 'authorized' && entry.enabled !== true) await enable()
          else await controller.refresh()
        }
      } catch (error) { if (alive) setError(connectionError(error)) }
    }
    void poll()
    return () => { alive = false; abort.abort(); clearTimeout(timer) }
  }, [ticket])
  const link = safeUrl(state.notice?.url)
  const complete = state.status !== 'running' || error
  const terminalCopy = state.reason?.startsWith('muse-code-') ? connectionError(new Error(state.reason)) : state.reason === 'provider-expired' ? 'providerExpired' : state.reason === 'timeout' ? 'timedOut' : state.status === 'cancelled' ? 'cancelled' : 'failed'
  async function enable(useLogin = false) {
    setEnabling(true); setEnableError(false)
    try { await controller.mutation(useLogin ? 'use-login' : 'enable', { connectionId: entry.connectionId }); setEnabled(true); setKeyOverride(false) }
    catch (error) { setEnableError(true); setKeyOverride(error.message.endsWith('/api-key-override')) }
    finally { setEnabling(false); await controller.refresh().catch(() => {}) }
  }
  const authorized = state.status === 'authorized'
  return <Modal open onClose={onClose} title={entry.displayName} closeLabel={t('close')} className="dsh-pi-login dsh-pi-dialog"
    footer={<>{authorized && enabled && onModels && entry.capabilities?.models !== false ? <Button variant="primary" onClick={() => onModels(entry)}>{t('chooseModels')}</Button> : null}
      <Button variant="outline" onClick={onClose}>{t(complete ? 'close' : 'cancel')}</Button></>}>
    {error || state.status === 'failed' ? <p role="alert">{t(error || terminalCopy)}</p> : null}
    {authorized ? <>
      <p role="status" className="dsh-pi-success">{t(enabled ? 'signedInReady' : enabling ? 'loading' : 'success')}</p>
      {enableError ? <p role="alert">{t(keyOverride ? 'keyOverride' : 'enableFailed')}</p> : null}
      {enableError && !keyOverride ? <Button variant="outline" onClick={() => { void enable() }} disabled={enabling}>{t('enable')}</Button> : null}
      {keyOverride && !enabled ? <Button variant="outline" onClick={() => { void enable(true) }} disabled={enabling}>{t('useLogin')}</Button> : null}
    </> : null}
    {state.status === 'cancelled' ? <p role={state.reason === 'timeout' ? 'alert' : 'status'}>{t(terminalCopy)}</p> : null}
    {!complete ? <>
      <p role="status">{state.notice?.message || t(link ? 'waiting' : 'busy')}</p>
      {state.notice?.code ? <div className="dsh-pi-verification"><span className="dsh-pi-muted">{t('code')}</span>
        <div className="dsh-pi-verification-row"><code>{state.notice.code}</code>
          <Button size="sm" variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(state.notice.code); setCopied(true) } catch { setCopied(false) } }}>{t(copied ? 'copied' : 'copy')}</Button></div></div> : null}
      {link ? <a className="dsh-pi-button-link" href={link} target="_blank" rel="noopener noreferrer">{t('openBrowser')}</a> : null}
      {state.prompt ? <Prompt key={state.prompt.id} prompt={state.prompt} ticket={ticket} controller={controller} t={t} onFailure={() => setError('failed')} /> : null}
    </> : null}
  </Modal>
}

function ModelsDialog({ entry, controller, t, onClose }) {
  const [snapshot, setSnapshot] = useState()
  const [search, setSearch] = useState('')
  const [pending, setPending] = useState(() => new Set())
  const [reloading, setReloading] = useState(false)
  const [error, setError] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const refreshAbort = useRef()
  const generation = useRef(0)
  const queue = useRef(Promise.resolve())
  useEffect(() => {
    const abort = new AbortController()
    void controller.call('models', { connectionId: entry.connectionId }, abort.signal).then(setSnapshot, () => { if (!abort.signal.aborted) setError(true) })
    return () => { abort.abort(); refreshAbort.current?.abort(); generation.current++ }
  }, [entry.connectionId])
  async function reload() {
    const request = ++generation.current
    refreshAbort.current?.abort()
    const abort = new AbortController(); refreshAbort.current = abort
    setReloading(true); setRefreshError(''); setError(false)
    try {
      const next = await controller.call('refresh-models', { connectionId: entry.connectionId }, abort.signal)
      if (!abort.signal.aborted && request === generation.current) setSnapshot(next)
    } catch (error) {
      if (!abort.signal.aborted && request === generation.current) {
        const code = error.message.split('/').pop()
        setRefreshError(snapshot?.refresh?.errors?.[code] ?? 'catalogRefreshFailed')
      }
    } finally { if (!abort.signal.aborted && request === generation.current) setReloading(false) }
  }
  // Each switch saves on its own; writes are serialized so every one uses the latest revision.
  function toggle(model, enabled) {
    setError(false)
    setPending(current => new Set(current).add(model))
    setSnapshot(current => ({ ...current, models: current.models.map(row => row.id === model ? { ...row, enabled } : row) }))
    queue.current = queue.current.then(async () => {
      try {
        const latest = await controller.call('models', { connectionId: entry.connectionId })
        await controller.mutation('set-model', { connectionId: entry.connectionId, model, enabled, revision: latest.revision })
      } catch { setError(true) }
      try { setSnapshot(await controller.call('models', { connectionId: entry.connectionId })) } catch {}
      setPending(current => { const next = new Set(current); next.delete(model); return next })
    })
    void queue.current.then(() => controller.refresh()).catch(() => {})
  }
  const needle = search.trim().toLowerCase()
  const models = snapshot?.models.filter(model => `${model.id} ${model.name}`.toLowerCase().includes(needle))
  const count = snapshot?.models.filter(model => model.enabled).length ?? 0
  return <Modal open title={entry.displayName} description={t('modelsHint')} closeLabel={t('close')} onClose={onClose}
    className="dsh-pi-login dsh-pi-dialog dsh-pi-models-dialog" contentClassName="dsh-pi-modal-content" footer={<Button variant="outline" onClick={onClose}>{t('close')}</Button>}>
    {snapshot && snapshot.models.length > 8 ? <Input icon={<IconSearchOutlineRegular size={16} />} aria-label={t('searchModels')} placeholder={t('searchModels')} data-modal-autofocus value={search} onChange={event => setSearch(event.target.value)} /> : null}
    <div className="dsh-pi-toolbar dsh-pi-models-toolbar">
      {snapshot ? <span className="dsh-pi-muted">{t('modelsOn').replace('{count}', String(count))}</span> : <span role="status">{error ? '' : t('loading')}</span>}
      {snapshot?.refresh?.canRefresh ? <Button variant="ghost" size="sm" disabled={reloading || !entry.writable} onClick={() => { void reload() }}>{t(reloading ? 'loading' : 'reloadModels')}</Button> : null}
    </div>
    {snapshot?.refresh?.status ? <p role="status" className="dsh-pi-muted">{t(snapshot.refresh.status.message)}{snapshot.refresh.status.detail ? ` · ${snapshot.refresh.status.detail}` : ''}</p> : null}
    {refreshError ? <p role="alert">{t(refreshError)}</p> : null}
    {error ? <p role="alert">{t(snapshot ? 'saveFailed' : 'modelsFailed')}</p> : null}
    {snapshot?.models.some(model => model.fast && model.enabled) ? <p className="dsh-pi-note">{t('fastWarning')}</p> : null}
    <div className="dsh-pi-model-list">
      {models?.map(model => <div className="dsh-pi-model-row" key={model.id}>
        <div className="dsh-pi-model-label"><span>{model.name}</span>
          {model.contributor ? <span className="dsh-pi-muted">{t('metaContributorHint')}</span> : null}
          {model.capabilityUnverified ? <span className="dsh-pi-muted">{t('capabilitiesUnknown')}</span> : null}</div>
        <Switch label={`${t('modelEnabled')}: ${model.name}`} checked={model.enabled} disabled={pending.has(model.id) || !entry.writable} onChange={enabled => toggle(model.id, enabled)} />
      </div>)}
      {models?.length === 0 ? <p className="dsh-pi-muted">{t('noResults')}</p> : null}
    </div>
  </Modal>
}

function connectionError(error) {
  const code = error.message.split('/').pop()
  if (code === 'endpoint-untrusted') return 'endpointUntrusted'
  if (code?.startsWith('muse-code-')) return Object.hasOwn(en, `error_${code}`) ? `error_${code}` : 'error_muse-code-unavailable'
  return 'saveFailed'
}

function museModelName(entry, t) {
  const id = entry.museCode?.modelId
  const name = id === 'muse-wonder-1.0' ? t('museWonderOne') : id === 'muse-wonder-full-1.0' ? t('museWonderFull') : id
  return name ? `${name}${entry.museCode?.contributorMode === true ? ' Contributor' : ''}` : undefined
}

/** Muse Code runs one model per connection, so the choice is a single-select list saved on pick. */
function MuseModelsDialog({ entry, controller, t, onClose }) {
  const [snapshot, setSnapshot] = useState()
  const [selected, setSelected] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const request = useRef()
  const name = useId()
  useEffect(() => {
    const abort = new AbortController(); request.current = abort
    void controller.mutation('models', { connectionId: entry.connectionId }, abort.signal).then(result => {
      if (abort.signal.aborted) return
      setSnapshot(result)
      const model = result.models?.find(model => model.selected) ?? result.models?.find(model => model.modelId === entry.museCode?.modelId && model.contributor === (entry.museCode?.contributorMode === true))
      setSelected(model?.id ?? '')
    }, error => { if (!abort.signal.aborted) setError(connectionError(error)) })
    return () => { abort.abort() }
  }, [entry.connectionId])
  const models = (snapshot?.models ?? []).filter(model => model.sessionSupported === true)
  async function choose(id) {
    const model = models.find(model => model.id === id)
    if (!model || busy) return
    const previous = selected
    setSelected(id); setBusy(true); setError(''); setSaved(false)
    try {
      await controller.mutation('connection-update', { connectionId: entry.connectionId, revision: snapshot.revision ?? entry.revision,
        patch: { modelId: model.modelId, contributorMode: model.contributor === true } }, request.current.signal)
      await controller.refresh(); setSaved(true)
      setSnapshot({ ...snapshot, revision: controller.getSnapshot().revision })
    } catch (error) { if (!request.current.signal.aborted) { setSelected(previous); setError(connectionError(error)) } }
    finally { if (!request.current.signal.aborted) setBusy(false) }
  }
  const selectedModel = models.find(model => model.id === selected)
  const disabled = busy || !entry.writable || !entry.configured
  return <Modal open title={entry.displayName} description={t('museSessionHint')} closeLabel={t('close')} onClose={onClose} className="dsh-pi-login dsh-pi-dialog" contentClassName="dsh-pi-modal-content"
    footer={<Button variant="outline" onClick={onClose}>{t('close')}</Button>}>
    {!snapshot && !error ? <p role="status">{t('loading')}</p> : null}
    {error ? <p role="alert">{t(error)}</p> : null}
    {models.length ? <fieldset className="dsh-pi-radio-list" disabled={disabled}>
      <legend className="dsh-pi-caption">{t('museModels')}</legend>
      {models.map(model => <label key={model.id} className="dsh-pi-radio-row">
        <input type="radio" name={name} value={model.id} checked={selected === model.id} onChange={() => { void choose(model.id) }} />
        <span>{model.name ?? model.label}</span>
      </label>)}
    </fieldset> : snapshot ? <p className="dsh-pi-muted">{t('museCatalogDiagnostic')}</p> : null}
    {busy ? <p role="status" className="dsh-pi-muted">{t('loading')}</p> : saved ? <p role="status" className="dsh-pi-success">{t('museModelSaved')}</p> : null}
    {selectedModel?.contributor ? <p className="dsh-pi-note">{t('metaContributorHint')}</p> : null}
    {selectedModel?.entitlement === 'unverified' ? <p className="dsh-pi-muted">{t('museEntitlementUnverified')}</p> : null}
  </Modal>
}

export function UpdateUI({ controller, t }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const [checked, setChecked] = useState(false)
  useEffect(() => { void controller.load() }, [controller])
  const active = ['checking', 'starting', 'preparing', 'installing'].includes(state.status)
  const messages = { idle: 'updateIdle', checking: 'updateChecking', current: 'updateCurrent', available: 'updateAvailable', blocked: 'updateBlocked', starting: 'updatePreparing', preparing: 'updatePreparing', installing: 'updateInstalling', 'restart-required': 'updateRestart', applied: 'updateApplied', failed: 'updateFailed', cancelled: 'updateCancelled', overridden: 'updateOverridden', unknown: 'updateUnknown' }
  // Before the user asks, only states that need attention are shown.
  const quiet = !checked && ['idle', 'blocked', 'current'].includes(state.status)
  return <div className="dsh-pi-updates">
    <div className="dsh-pi-toolbar">
      <span className="dsh-pi-muted">{t('updateTitle')}{state.runtimeVersion ? ` ${state.runtimeVersion}` : ''}</span>
      <div className="dsh-pi-inline-actions">
        {state.status === 'available' ? <Button size="sm" variant="primary" onClick={() => { void controller.begin() }}>{t('updateInstall')}</Button> : null}
        {state.status === 'unknown' ? <Button size="sm" variant="outline" onClick={() => { void controller.load() }}>{t('updateReconcile')}</Button> : null}
        <Button size="sm" variant="ghost" disabled={active || state.status === 'unknown' || state.status === 'restart-required'} onClick={() => { setChecked(true); void controller.check() }}>{t('updateCheck')}</Button>
      </div>
    </div>
    {quiet ? null : <>
      <p role={['failed', 'blocked'].includes(state.status) ? 'alert' : 'status'}>{t(messages[state.status] || 'updateUnknown')}</p>
      {state.reason ? <p className="dsh-pi-muted">{t(`updateReason_${state.reason}`) || t('updateReason_network')} <a className="dsh-pi-link" href="https://github.com/Aero123421/dsh-pi-login/releases" target="_blank" rel="noopener noreferrer">{t('updateManual')}</a></p> : null}
      {state.candidate ? <><p>{state.runtimeVersion} → {state.candidate.version} · DSH {state.candidate.compatibility}</p><p className="dsh-pi-update-notes">{state.candidate.notes}</p></> : null}
      {state.result?.stage ? <p className="dsh-pi-muted">{t('updateStage')}: {state.result.stage}{state.result.error?.code ? ` · ${state.result.error.code}` : ''}</p> : null}
    </>}
  </div>
}

function usageWindow(window, t) {
  const seconds = window.windowSeconds
  if (seconds && seconds % 86400 === 0) return `${seconds / 86400} ${t('days')}`
  if (seconds && seconds % 3600 === 0) return `${seconds / 3600} ${t('hours')}`
  if (seconds && seconds % 60 === 0) return `${seconds / 60} ${t('minutes')}`
  return window.scope === 'account' ? t('accountQuota') : Object.hasOwn(en, `usageScope_${window.scope}`) ? t(`usageScope_${window.scope}`) : window.scope
}

function UsagePanel({ entry, controller, t }) {
  const [snapshot, setSnapshot] = useState()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const request = useRef()
  const generation = useRef(0)
  async function load(refresh = false) {
    const current = ++generation.current
    request.current?.abort()
    const abort = new AbortController(); request.current = abort
    setBusy(true); setFailed(false)
    try {
      const result = await controller.mutation('usage', { connectionId: entry.connectionId, refresh }, abort.signal)
      if (!abort.signal.aborted && current === generation.current) setSnapshot(result)
    } catch { if (!abort.signal.aborted && current === generation.current) setFailed(true) }
    finally { if (!abort.signal.aborted && current === generation.current) setBusy(false) }
  }
  useEffect(() => { void load(); return () => { generation.current++; request.current?.abort() } }, [entry.connectionId])
  const limited = snapshot?.status === 'rate-limited' && new Date(snapshot.retryAt).valueOf() > Date.now()
  const windows = snapshot?.windows ?? []
  return <section className="dsh-pi-section dsh-pi-usage" aria-busy={busy} aria-label={t('usageTab')}>
    <div className="dsh-pi-toolbar"><h4>{t('usageTab')}</h4>
      <Button variant="ghost" size="sm" disabled={busy || limited} onClick={() => { void load(true) }}>{t(busy ? 'loading' : 'refreshUsage')}</Button></div>
    {failed ? <p role="alert">{t('usageFailed')}</p> : null}
    {snapshot && (!windows.length || snapshot.status !== 'available') ? <p role="status" className="dsh-pi-muted">{t(`usage_${snapshot.status}`)}</p> : null}
    {limited && snapshot.retryAt ? <p className="dsh-pi-muted dsh-pi-small">{t('retryAt')}: {time(snapshot.retryAt)}</p> : null}
    {windows.map(window => <div key={window.id} className="dsh-pi-usage-window">
      <div className="dsh-pi-toolbar"><span>{usageWindow(window, t)}</span>
        {window.quotaState ? <strong>{t(`quota_${window.quotaState}`)}</strong> : typeof window.usedPercent === 'number' ? <strong>{window.usedPercent}% {t('used')}</strong> : <span className="dsh-pi-muted">{t('quota_unknown')}</span>}</div>
      {!window.quotaState && typeof window.usedPercent === 'number' ? <progress max="100" value={Math.min(100, Math.max(0, window.usedPercent))} aria-label={usageWindow(window, t)} /> : null}
      {window.quota ? <span className="dsh-pi-muted">{window.quota.estimated ? `${t('estimated')} · ` : ''}{window.quota.remaining != null ? `${t('remaining')}: ${window.quota.remaining}` : window.quota.used != null ? `${t('used')}: ${window.quota.used}` : t('quota_unknown')}{window.quota.total != null ? ` / ${window.quota.total}` : ''} {t(`unit_${window.quota.unit}`)}</span> : null}
      {window.resetsAt ? <span className="dsh-pi-muted">{t('resets')}: {time(window.resetsAt)}</span> : window.resetsOn ? <span className="dsh-pi-muted">{t('resetDate')}: {time(window.resetsOn, true)}</span> : null}
    </div>)}
    {snapshot?.checkedAt || snapshot?.sourceObservedAt ? <p className="dsh-pi-muted dsh-pi-small">
      {snapshot.source === 'last-observed' ? `${t('lastObservedShort')} · ` : ''}{t(snapshot.sourceObservedAt ? 'observedAt' : 'checkedAt')}: {time(snapshot.sourceObservedAt ?? snapshot.checkedAt)}</p> : null}
  </section>
}

function SecretField({ value, onChange, t, disabled, saved }) {
  const [visible, setVisible] = useState(false)
  const [pasteError, setPasteError] = useState(false)
  const id = useId()
  return <div className="dsh-pi-field"><label htmlFor={id}>{t('apiKey')}</label>
    <div className="dsh-pi-secret">
      <Input id={id} {...secretProps(!visible)} value={value} disabled={disabled} placeholder={saved ? t('keySavedPlaceholder') : ''} onChange={event => onChange(event.target.value)} />
      <Button size="sm" disabled={disabled} aria-pressed={visible} onClick={() => setVisible(!visible)}>{t(visible ? 'hideSecret' : 'showSecret')}</Button>
      <Button size="sm" disabled={disabled} onClick={async () => { try { onChange(await navigator.clipboard.readText()); setPasteError(false) } catch { setPasteError(true) } }}>{t('paste')}</Button>
    </div>
    {pasteError ? <p role="alert">{t('pasteFailed')}</p> : null}
  </div>
}

function serviceKey(service) { return `${service.integrationId}/${service.serviceId ?? service.id}` }

/** Adding is one form: pick a service, name it, then sign in or paste a key. */
function AddDialog({ state, controller, t, onClose, onLogin, onSaved }) {
  const services = state.services
  const labels = new Map()
  for (const service of services) {
    const label = service.label ?? service.serviceLabel
    labels.set(label, (labels.get(label) ?? 0) + 1)
  }
  const integrationLabel = id => state.integrations.find(item => (item.id ?? item.integrationId) === id)?.label
  const serviceLabel = service => {
    const label = service.label ?? service.serviceLabel
    return labels.get(label) > 1 ? `${label}（${integrationLabel(service.integrationId)}）` : label
  }
  const [key, setKey] = useState(services[0] ? serviceKey(services[0]) : '')
  const service = services.find(item => serviceKey(item) === key) ?? services[0]
  const methods = service?.methods ?? []
  const [authMethod, setAuthMethod] = useState(methods[0]?.id ?? 'oauth')
  const method = methods.find(item => item.id === authMethod)?.id ?? methods[0]?.id ?? authMethod
  const [displayName, setDisplayName] = useState('')
  const [endpointUrl, setEndpointUrl] = useState('')
  const [api, setApi] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fieldId = useId()
  const unavailable = service?.capabilities?.settings === false
  const name = displayName.trim() || serviceLabel(service ?? {}) || ''
  async function save() {
    setBusy(true); setError('')
    try {
      const fields = { displayName: name, authMethod: method, ...(apiKey ? { apiKey } : {}), ...(endpointUrl.trim() ? { endpointUrl: endpointUrl.trim() } : {}), ...(api ? { api } : {}) }
      const result = await controller.mutation('connection-create', { integrationId: service.integrationId, serviceId: service.serviceId ?? service.id, ...fields, revision: state.revision })
      setApiKey(''); await controller.refresh(); onSaved()
      if (method === 'oauth') {
        const created = result.connection ?? result
        const next = controller.getSnapshot().entries.find(item => item.connectionId === created.connectionId)
        if (next) onLogin(next)
      }
    } catch (error) { setError(connectionError(error)) } finally { setBusy(false) }
  }
  return <Modal open title={t('addConnection')} closeLabel={t('close')} onClose={onClose} className="dsh-pi-login dsh-pi-dialog" contentClassName="dsh-pi-modal-content"
    footer={<><Button variant="outline" onClick={onClose} disabled={busy}>{t('cancel')}</Button>
      <Button variant="primary" disabled={busy || !service || unavailable || service.writable === false || !name || method === 'api-key' && !apiKey.trim()} onClick={() => { void save() }}>{t(busy ? 'loading' : method === 'oauth' ? 'addAndSignIn' : 'add')}</Button></>}>
    <Choice label={t('service')} value={service ? serviceKey(service) : ''} options={services.map(item => ({ id: serviceKey(item), label: serviceLabel(item) }))} disabled={busy}
      onChange={value => { setKey(value); setAuthMethod(services.find(item => serviceKey(item) === value)?.methods?.[0]?.id ?? 'oauth'); setApiKey('') }} />
    {unavailable ? <p role="status">{t(service.unavailableReason === 'muse-code-bridge-unverified' ? `serviceUnavailable_${service.unavailableReason}` : 'serviceUnavailable')}</p> : null}
    {methods.length > 1 ? <Choice label={t('method')} value={method} options={methods.map(item => ({ id: item.id, label: t(item.id === 'oauth' ? 'oauth' : 'apiKey') }))} disabled={busy} onChange={value => { setAuthMethod(value); setApiKey('') }} /> : null}
    <div className="dsh-pi-field"><label htmlFor={`${fieldId}-name`}>{t('connectionName')}</label>
      <Input id={`${fieldId}-name`} {...noAutofill} data-modal-autofocus maxLength={80} value={displayName} disabled={busy} placeholder={serviceLabel(service ?? {}) ?? t('namePlaceholder')} onChange={event => setDisplayName(event.target.value)} /></div>
    {method === 'api-key' ? <>
      <SecretField value={apiKey} onChange={setApiKey} t={t} disabled={busy} />
      <details className="dsh-pi-advanced"><summary>{t('advanced')}</summary>
        <div className="dsh-pi-field"><label htmlFor={`${fieldId}-url`}>{t('endpoint')}</label><Input id={`${fieldId}-url`} {...noAutofill} type="url" value={endpointUrl} disabled={busy} placeholder="https://…" onChange={event => setEndpointUrl(event.target.value)} /></div>
        {service?.apis?.length ? <Choice label={t('protocol')} value={api || service.apis[0]} options={service.apis.map(value => ({ id: value, label: value }))} disabled={busy} onChange={setApi} /> : null}
      </details></> : <p className="dsh-pi-muted">{t('oauthHint')}</p>}
    {error ? <p role="alert">{t(error)}</p> : null}
  </Modal>
}

function statusOf(entry) {
  if (entry.inFlight || entry.authStatus === 'updating') return { dot: 'ongoing', copy: 'busy' }
  if (entry.authStatus === 'expired') return { dot: 'error', copy: 'authExpired' }
  if (entry.authStatus === 'unavailable') return { dot: 'warning', copy: 'authUnavailable' }
  if (!entry.configured) return { dot: 'idle', copy: 'notConnected' }
  if (!entry.enabled) return { dot: 'idle', copy: 'statusOff' }
  return { dot: 'done', copy: 'connected' }
}

/** One place for an account: status, usage, settings and removal. */
function ConnectionDialog({ entry, state, controller, t, onClose, onLogin, onSaved }) {
  const methods = state.services.find(item => item.integrationId === entry.integrationId && (item.serviceId ?? item.id) === entry.serviceId)?.methods ?? entry.methods ?? []
  const [authMethod, setAuthMethod] = useState(entry.authMethod)
  const [displayName, setDisplayName] = useState(entry.displayName ?? '')
  const [endpointUrl, setEndpointUrl] = useState(entry.profile?.baseURL ?? '')
  const [api, setApi] = useState(entry.profile?.api ?? '')
  const [apiKey, setApiKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState()
  const fieldId = useId()
  const service = state.services.find(item => item.integrationId === entry.integrationId && (item.serviceId ?? item.id) === entry.serviceId)
  const writable = entry.writable !== false
  const methodChanged = authMethod !== entry.authMethod
  const dirty = displayName.trim() !== entry.displayName || methodChanged || !!apiKey || endpointUrl.trim() !== (entry.profile?.baseURL ?? '') || api !== (entry.profile?.api ?? '')
  const status = statusOf(entry)
  async function save() {
    if (methodChanged && confirm !== 'method') { setConfirm('method'); return }
    setBusy(true); setError('')
    try {
      const fields = { displayName: displayName.trim(), ...(methodChanged ? { authMethod } : {}), ...(apiKey ? { apiKey } : {}),
        ...(endpointUrl.trim() ? { endpointUrl: endpointUrl.trim() } : entry.profile?.baseURL ? { endpointUrl: '' } : {}), ...(api ? { api } : {}) }
      await controller.mutation('connection-update', { connectionId: entry.connectionId, patch: fields, revision: state.revision })
      setApiKey(''); await controller.refresh(); onSaved()
    } catch (error) { setError(connectionError(error)) } finally { setBusy(false) }
  }
  async function destructive(action) {
    setBusy(true); setError('')
    try {
      await controller.mutation(`connection-${action}`, { connectionId: entry.connectionId, revision: state.revision, ...(action === 'clone' ? { displayName: `${displayName} ${t('copySuffix')}` } : {}) })
      await controller.refresh(); onSaved(action)
    } catch { setError('saveFailed') } finally { setBusy(false) }
  }
  const canSignIn = entry.authMethod === 'oauth' && entry.capabilities?.auth !== false
  return <Modal open title={entry.displayName} description={`${entry.serviceLabel} · ${t(entry.authMethod === 'oauth' ? 'oauthShort' : 'apiKey')}`} closeLabel={t('close')} onClose={onClose} className="dsh-pi-login dsh-pi-dialog" contentClassName="dsh-pi-modal-content"
    footer={<><Button variant="outline" onClick={onClose} disabled={busy}>{t('close')}</Button>
      <Button variant="primary" disabled={busy || !writable || !dirty || service?.capabilities?.settings === false || confirm === 'delete' || !displayName.trim()} onClick={() => { void save() }}>{t(busy ? 'loading' : confirm === 'method' ? 'confirmSave' : 'save')}</Button></>}>
    <div className="dsh-pi-status-card">
      <span className="dsh-pi-status"><StateDot state={status.dot} size={8} />{t(status.copy)}</span>
      {canSignIn ? <Button size="sm" variant={entry.configured && entry.authStatus !== 'expired' ? 'outline' : 'primary'} disabled={busy || !writable || methodChanged} onClick={() => onLogin(entry)}>{t(entry.configured ? 'signInAgain' : 'signIn')}</Button> : null}
    </div>
    {entry.configured && entry.capabilities?.usage !== false ? <UsagePanel entry={entry} controller={controller} t={t} /> : null}
    <section className="dsh-pi-section" aria-label={t('connectionSettings')}>
      <h4>{t('connectionSettings')}</h4>
      <div className="dsh-pi-field"><label htmlFor={`${fieldId}-name`}>{t('connectionName')}</label><Input id={`${fieldId}-name`} {...noAutofill} maxLength={80} value={displayName} disabled={busy || !writable} placeholder={t('namePlaceholder')} onChange={event => setDisplayName(event.target.value)} /></div>
      {methods.length > 1 ? <Choice label={t('method')} value={authMethod} options={methods.map(method => ({ id: method.id, label: t(method.id === 'oauth' ? 'oauth' : 'apiKey') }))} disabled={busy || !writable} onChange={value => { setAuthMethod(value); setApiKey(''); setConfirm(undefined) }} /> : null}
      {methodChanged ? <p role="alert">{t('methodChangeWarning')}</p> : null}
      {authMethod === 'api-key' ? <>
        <SecretField value={apiKey} onChange={setApiKey} t={t} disabled={busy || !writable} saved={entry.configured && !methodChanged} />
        <details className="dsh-pi-advanced" open={entry.profile?.baseURL ? true : undefined}><summary>{t('advanced')}</summary>
          <div className="dsh-pi-field"><label htmlFor={`${fieldId}-url`}>{t('endpoint')}</label><Input id={`${fieldId}-url`} {...noAutofill} type="url" value={endpointUrl} disabled={busy || !writable} placeholder="https://…" onChange={event => setEndpointUrl(event.target.value)} /></div>
          {service?.apis?.length ? <Choice label={t('protocol')} value={api || service.apis[0]} options={service.apis.map(value => ({ id: value, label: value }))} disabled={busy || !writable} onChange={setApi} /> : null}
        </details></> : null}
    </section>
    {error ? <p role="alert">{t(error)}</p> : null}
    {!writable ? <p className="dsh-pi-muted">{t('readOnly')}</p> : null}
    <section className="dsh-pi-section dsh-pi-danger" aria-label={t('deleteConnection')}>
      {confirm === 'delete' ? <div className="dsh-pi-confirm"><p role="alert">{t('deleteWarning')}</p>
        <div className="dsh-pi-inline-actions"><Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirm(undefined)}>{t('cancel')}</Button>
          <Button size="sm" variant="primary" disabled={busy} onClick={() => { void destructive('delete') }}>{t('confirmDelete')}</Button></div></div>
        : <div className="dsh-pi-inline-actions">
          <Button size="sm" disabled={busy || !writable} title={t('cloneHint')} onClick={() => { void destructive('clone') }}>{t('cloneConnection')}</Button>
          <Button size="sm" className="dsh-pi-danger-button" disabled={busy || !writable} onClick={() => setConfirm('delete')}>{t('deleteConnection')}</Button>
        </div>}
    </section>
  </Modal>
}

function ConnectionRow({ entry, controller, t, writableRevision, onOpen, onLogin, onModels }) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const status = statusOf(entry)
  const ownerManaged = entry.authStatus === 'owner-managed'
  const settings = entry.capabilities?.settings !== false
  const external = !settings && entry.settingsUrl ? safeUrl(entry.settingsUrl) : undefined
  async function setEnabled(enabled) {
    setBusy(true); setFailed(false)
    try { await controller.mutation('connection-update', { connectionId: entry.connectionId, patch: { enabled }, revision: writableRevision }); await controller.refresh() }
    catch { setFailed(true) } finally { setBusy(false) }
  }
  const meta = [
    ownerManaged ? `${t(`directory_${entry.directoryState ?? 'unavailable'}`)} · ${entry.source ?? t('sourceUnknown')}` : `${t(entry.authMethod === 'oauth' ? 'oauthShort' : 'apiKey')} · ${t(status.copy)}`,
    entry.integrationId === 'meta-muse-code' ? museModelName(entry, t) : undefined,
  ].filter(Boolean).join(' · ')
  const main = <><span className="dsh-pi-row-name">{ownerManaged ? null : <StateDot state={status.dot} size={8} />}{entry.displayName}</span>
    <span className={`dsh-pi-row-meta${status.dot === 'error' ? ' dsh-pi-row-meta-alert' : ''}`}>{meta}</span></>
  return <li className="dsh-pi-connection-row">
    {settings ? <button type="button" className="dsh-pi-row-main" aria-label={`${t('connectionSettings')}: ${entry.displayName}`} onClick={() => onOpen(entry)}>{main}</button>
      : <div className="dsh-pi-row-main">{main}{external ? <a className="dsh-pi-link" href={external} target="_blank" rel="noopener noreferrer">{t('externalSettings')}</a> : null}</div>}
    <div className="dsh-pi-row-actions">
      {failed ? <span role="alert" className="dsh-pi-row-meta-alert">{t('saveFailed')}</span> : null}
      {!entry.configured && entry.authMethod === 'oauth' && entry.capabilities?.auth !== false && entry.writable !== false
        ? <Button size="sm" variant="primary" onClick={() => onLogin(entry)}>{t('signIn')}</Button>
        : entry.authStatus === 'expired' && entry.authMethod === 'oauth' && entry.writable !== false
          ? <Button size="sm" variant="primary" onClick={() => onLogin(entry)}>{t('signInAgain')}</Button>
          : <>
            {entry.capabilities?.models !== false && entry.configured ? <Button size="sm" variant="outline" aria-label={`${t('manageModels')}: ${entry.displayName}`} onClick={() => onModels(entry)}>{t('modelsShort')}</Button> : null}
            {settings && entry.configured ? <Switch label={`${t('useProvider')}: ${entry.displayName}`} checked={entry.enabled === true} disabled={busy || entry.writable === false} onChange={enabled => { void setEnabled(enabled) }} /> : null}
          </>}
    </div>
  </li>
}

export function ConnectionUI({ controller, updates, locale }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const t = useCopy(locale)
  const [search, setSearch] = useState('')
  const [opened, setOpened] = useState()
  const [notice, setNotice] = useState('')
  const titleId = useId()
  useEffect(() => { void controller.load() }, [controller])
  useEffect(() => { setOpened(undefined); setNotice('') }, [state.profileKey, state.generation])
  const needle = search.trim().toLocaleLowerCase()
  const groups = new Map()
  for (const entry of state.entries) {
    if (!`${entry.displayName} ${entry.integrationLabel} ${entry.serviceLabel}`.toLocaleLowerCase().includes(needle)) continue
    const key = `${entry.integrationId}/${entry.serviceId}`
    if (!groups.has(key)) groups.set(key, { label: entry.serviceLabel ?? entry.integrationLabel, entries: [] })
    groups.get(key).entries.push(entry)
  }
  const close = () => setOpened(undefined)
  function onLogin(entry) { setNotice(''); setOpened({ kind: 'login', entry, method: entry.authMethod }) }
  function onModels(entry) { setOpened({ kind: 'models', entry: controller.getSnapshot().entries.find(item => item.connectionId === entry.connectionId) ?? entry }) }
  function onSaved(action) { setOpened(undefined); setNotice(action === 'delete' ? 'deleted' : action === 'clone' ? 'cloned' : 'saved') }
  return <section className="dsh-pi-login dsh-pi-footer" aria-labelledby={titleId}>
    <div className="dsh-pi-toolbar"><h3 id={titleId}>{t('title')}</h3>
      <Button variant="outline" size="sm" onClick={() => { setNotice(''); setOpened({ kind: 'add' }) }} disabled={state.status !== 'ready' || state.services.length === 0}>{t('addConnection')}</Button></div>
    {notice ? <p role="status" className="dsh-pi-success">{t(notice)}</p> : null}
    {state.error ? <p role="alert">{t('loadFailed')} <Button size="sm" onClick={() => { void controller.refresh() }}>{t('retry')}</Button></p> : null}
    {state.status === 'loading' && state.entries.length === 0 ? <p role="status" className="dsh-pi-loading">{t('loading')}</p> : null}
    {state.entries.length > 8 ? <div className="dsh-pi-search"><Input aria-label={t('searchConnections')} placeholder={t('searchConnections')} icon={<IconSearchOutlineRegular size={16} />} value={search} onChange={event => setSearch(event.target.value)} /></div> : null}
    {[...groups].map(([key, group]) => <div className="dsh-pi-group" key={key}>
      <h4 className="dsh-pi-group-label">{group.label}</h4>
      <ul className="dsh-pi-connection-list">{group.entries.map(entry => <ConnectionRow key={entry.connectionId} entry={entry} controller={controller} t={t} writableRevision={state.revision}
        onOpen={entry => { setNotice(''); setOpened({ kind: 'settings', entry }) }} onLogin={onLogin} onModels={onModels} />)}</ul>
    </div>)}
    {state.status === 'ready' && groups.size === 0 && !state.error ? <p className="dsh-pi-muted">{t(state.entries.length ? 'noResults' : 'emptyConnections')}</p> : null}
    {updates ? <UpdateUI controller={updates} t={t} /> : null}
    {opened?.kind === 'login' ? <LoginDialog {...opened} controller={controller} t={t} onClose={close} onModels={onModels} /> : null}
    {opened?.kind === 'models' ? opened.entry.integrationId === 'meta-muse-code' ? <MuseModelsDialog entry={opened.entry} controller={controller} t={t} onClose={close} /> : <ModelsDialog entry={opened.entry} controller={controller} t={t} onClose={close} /> : null}
    {opened?.kind === 'add' ? <AddDialog state={state} controller={controller} t={t} onClose={close} onLogin={onLogin} onSaved={onSaved} /> : null}
    {opened?.kind === 'settings' ? <ConnectionDialog key={opened.entry.connectionId} entry={opened.entry} state={state} controller={controller} t={t} onClose={close} onLogin={onLogin} onSaved={onSaved} /> : null}
  </section>
}

export function apply(ctx) {
  const controller = new LoginController(ctx.connection)
  const updates = new UpdateController(ctx.connection)
  ctx.effect(() => () => updates.dispose(), 'dsh-pi-login: update requests')
  ctx.effect(() => () => controller.dispose(), 'dsh-pi-login: UI requests')
  ctx.effect(() => ctx.locale.register(NS, { en, ja }), 'dsh-pi-login: copy')
  ctx.effect(() => {
    const style = document.createElement('style'); style.dataset.dshPiLogin = ''; style.textContent = controlsCss + css; document.head.append(style)
    return () => style.remove()
  }, 'dsh-pi-login: official controls')
  ctx.on('connection/reset', () => { void controller.refresh(); void updates.load() })
  const inject = () => ({ controller, updates, locale: ctx.locale })
  ctx.slots.inject('settings.models.footer', () => ctx.slots.register({ name: 'settings.models.footer', id: 'dsh-pi-login', order: 10, inject }, ConnectionUI))
}
