import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Button, Input, Menu, Modal, Switch, StateDot, IconChevronDownOutlineRegular, IconSearchOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import { LoginController } from './controller.mjs'
import { UpdateController } from './update-controller.mjs'
import { createModelEditor } from './model-snapshot.mjs'
import { formatTime, retryWait, statusOf, usageLimited, versionDiffersLine } from './presentation.mjs'
import { en, ja } from './locales.mjs'
import { SERVICE_GROUPS, serviceGroup } from './service-groups.mjs'
import css from './styles.css'

const NS = 'dsh.piLogin'
export const inject = ['slots', 'locale', 'connection', 'remote']

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

function LoginDialog({ entry, method, controller: sourceController, t, onClose, onModels }) {
  const [controller] = useState(() => sourceController.scoped())
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

function ModelsDialog({ entry, controller: sourceController, t, onClose }) {
  const [controller] = useState(() => sourceController.scoped(entry))
  const connectionState = useSyncExternalStore(sourceController.subscribe, sourceController.getSnapshot)
  const editorRef = useRef()
  const [snapshot, setSnapshot] = useState()
  const [search, setSearch] = useState('')
  const [pending, setPending] = useState(() => new Set())
  const [reloading, setReloading] = useState(false)
  const [error, setError] = useState(false)
  const [readError, setReadError] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [uncertain, setUncertain] = useState(false)
  const refreshAbort = useRef()
  const queue = useRef(Promise.resolve())
  const lifetime = useRef(new AbortController())
  useEffect(() => {
    const editor = createModelEditor()
    editorRef.current = editor
    return () => {
      lifetime.current.abort()
      lifetime.current = new AbortController()
      refreshAbort.current?.abort()
      editor.invalidate()
      setPending(new Set())
    }
  }, [entry.connectionId])
  useEffect(() => {
    if (reloading || pending.size > 0) return
    const editor = editorRef.current
    const abort = new AbortController()
    let timer
    // Host catalog failures need not change the LLM directory, so they do not
    // always produce a forwarded event. Read cached state only while open.
    async function read() {
      if (abort.signal.aborted || refreshAbort.current) return
      const gate = editor.beginReload()
      let delay = 15000
      try {
        const value = await controller.call('models', { connectionId: entry.connectionId }, abort.signal)
        if (abort.signal.aborted || !gate.accept(value)) return
        setSnapshot(editor.project(value)); setReadError(false)
        if (value.refresh?.status?.message === 'catalogUpdating') delay = 1000
      } catch {
        if (!abort.signal.aborted && gate.current()) setReadError(true)
      } finally {
        if (!abort.signal.aborted) timer = setTimeout(read, delay)
      }
    }
    void read()
    return () => { abort.abort(); clearTimeout(timer) }
  }, [entry.connectionId, connectionState, reloading, pending.size])
  async function reload(refresh = true) {
    const editor = editorRef.current
    const gate = editor.beginReload()
    refreshAbort.current?.abort()
    const abort = new AbortController(); refreshAbort.current = abort
    setReloading(true); setRefreshError(''); setError(false); setReadError(false)
    try {
      const next = await controller.call(refresh ? 'refresh-models' : 'models', { connectionId: entry.connectionId }, abort.signal)
      if (!abort.signal.aborted && gate.accept(next)) { setSnapshot(editor.project(next)); setUncertain(false) }
    } catch (error) {
      if (!abort.signal.aborted && gate.current()) {
        const code = String(error.code ?? error.message).split('/').pop()
        setRefreshError(snapshot?.refresh?.errors?.[code] ?? 'catalogRefreshFailed')
      }
    } finally {
      if (refreshAbort.current === abort) refreshAbort.current = undefined
      if (!abort.signal.aborted && gate.current()) setReloading(false)
    }
  }
  // Each switch saves on its own; writes are serialized so every one uses the latest revision.
  // A catalog response that started before the save, or that is older than the
  // published revision, cannot put the switch back.
  function toggle(model, enabled) {
    const editor = editorRef.current
    setError(false)
    const handle = editor.beginToggle(model, enabled)
    setPending(current => new Set(current).add(model))
    setSnapshot(current => handle.overlay(current))
    queue.current = queue.current.then(async () => {
      const signal = lifetime.current.signal
      if (signal.aborted) return
      try {
        const latest = await controller.call('models', { connectionId: entry.connectionId }, signal)
        if (signal.aborted) return
        await controller.mutation('set-model', { connectionId: entry.connectionId, model, enabled, revision: latest.revision }, signal)
        if (signal.aborted) return
        const after = await controller.call('models', { connectionId: entry.connectionId }, signal)
        if (!signal.aborted) {
          const confirmed = handle.reconcile(after)
          if (confirmed) { setSnapshot(confirmed); setUncertain(false) }
          else setUncertain(true)
        }
      } catch {
        if (!signal.aborted) {
          setError(true)
          // A rejected mutation may have committed before the reply failed.
          // Read the Host's confirmed state instead of undoing optimistically.
          try {
            const after = await controller.call('models', { connectionId: entry.connectionId }, signal)
            if (!signal.aborted) {
              const confirmed = handle.reconcile(after)
              if (confirmed) { setSnapshot(confirmed); setUncertain(false) }
              else setUncertain(true)
            }
          } catch { if (!signal.aborted) setUncertain(true) }
        }
      }
      finally {
        handle.finish()
        if (!signal.aborted) setPending(current => { const next = new Set(current); next.delete(model); return next })
      }
    })
    void queue.current.then(() => { if (!lifetime.current.signal.aborted) return controller.refresh() }).catch(() => {})
  }
  const saving = pending.size > 0
  const close = () => { if (!saving) onClose() }
  const needle = search.trim().toLowerCase()
  const models = snapshot?.models.filter(model => `${model.id} ${model.name}`.toLowerCase().includes(needle))
  const count = snapshot?.models.filter(model => model.enabled).length ?? 0
  return <Modal open title={entry.displayName} description={t('modelsHint')} closeLabel={t('close')} onClose={close}
    className="dsh-pi-login dsh-pi-dialog dsh-pi-models-dialog" contentClassName="dsh-pi-modal-content" footer={<Button variant="outline" disabled={saving} onClick={close}>{t('close')}</Button>}>
    {snapshot && snapshot.models.length > 8 ? <Input icon={<IconSearchOutlineRegular size={16} />} aria-label={t('searchModels')} placeholder={t('searchModels')} data-modal-autofocus value={search} onChange={event => setSearch(event.target.value)} /> : null}
    <div className="dsh-pi-toolbar dsh-pi-models-toolbar">
      {snapshot ? <span className="dsh-pi-muted">{t('modelsOn').replace('{count}', String(count))}</span> : <span role="status">{error || readError ? '' : t('loading')}</span>}
      {snapshot?.refresh?.canRefresh && snapshot.models.length ? <Button variant="ghost" size="sm" disabled={reloading || !entry.writable} onClick={() => { void reload() }}>{t(reloading ? 'loading' : 'reloadModels')}</Button> : null}
    </div>
    {snapshot?.refresh?.status ? <p role="status" className="dsh-pi-muted">{t(snapshot.refresh.status.message)}{snapshot.refresh.status.detail ? ` · ${snapshot.refresh.status.detail}` : ''}</p> : null}
    {refreshError ? <p role="alert">{t(refreshError)}</p> : null}
    {error || readError || uncertain ? <p role="alert">{t(uncertain ? 'modelsStateUnknown' : error && snapshot ? 'saveFailed' : 'modelsFailed')}</p> : null}
    {uncertain ? <Button variant="outline" size="sm" disabled={reloading || saving} onClick={() => { void reload(false) }}>{t('modelsReconcile')}</Button> : null}
    {snapshot && !snapshot.models.length && snapshot.refresh?.canRefresh ? <div className="dsh-pi-empty-models">
      {(snapshot.refresh.notes ?? []).map(note => <p key={note} className="dsh-pi-muted">{t(note)}</p>)}
      <Button variant="primary" disabled={reloading || !entry.writable} onClick={() => { void reload() }}>{t(reloading ? 'loading' : 'reloadModels')}</Button>
    </div> : null}
    {snapshot?.models.some(model => model.fast && model.enabled) ? <p className="dsh-pi-note">{t('fastWarning')}</p> : null}
    {snapshot?.models.some(model => model.contributor) ? <p className="dsh-pi-note">{t('museContributorNote')}</p> : null}
    <div className="dsh-pi-model-list">
      {models?.map(model => <div className="dsh-pi-model-row" key={model.id}>
        <div className="dsh-pi-model-label"><span>{model.name}</span>
          {model.effortsUnverified ? <span className="dsh-pi-muted">{t('museEffortsUnlisted')}</span> : null}
          {model.capabilityUnverified ? <span className="dsh-pi-muted">{t('capabilitiesUnknown')}</span> : null}</div>
        <Switch label={`${t('modelEnabled')}: ${model.name}`} checked={model.enabled} disabled={uncertain || pending.has(model.id) || !entry.writable} onChange={enabled => toggle(model.id, enabled)} />
      </div>)}
      {models?.length === 0 ? <p className="dsh-pi-muted">{t(snapshot.models.length ? 'noResults' : 'emptyModelCatalog')}</p> : null}
    </div>
  </Modal>
}

function connectionError(error) {
  const code = String(error.code ?? error.message).split('/').pop()
  if (code === 'endpoint-untrusted') return 'endpointUntrusted'
  if (code === 'credential-delete-failed') return 'deletionPending'
  if (code === 'credential-cleanup-failed') return 'credentialCleanupFailed'
  if (code === 'credential-save-failed') return 'credentialSaveFailed'
  if (code === 'profile-changed') return 'profileChanged'
  if (code === 'connection-changed') return 'connectionChanged'
  if (code === 'settings-changed') return 'settingsChanged'
  if (code?.startsWith('muse-code-')) return Object.hasOwn(en, `error_${code}`) ? `error_${code}` : 'error_muse-code-unavailable'
  return 'saveFailed'
}

export function UpdateUI({ controller, t }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const [checked, setChecked] = useState(false)
  useEffect(() => { void controller.load() }, [controller])
  const active = ['checking', 'starting', 'preparing', 'installing'].includes(state.status)
  const messages = { idle: 'updateIdle', checking: 'updateChecking', current: 'updateCurrent', available: 'updateAvailable', blocked: 'updateBlocked', starting: 'updatePreparing', preparing: 'updatePreparing', installing: 'updateInstalling', 'restart-required': 'updateRestart', applied: 'updateApplied', failed: 'updateFailed', cancelled: 'updateCancelled', overridden: 'updateOverridden', superseded: 'updateSuperseded', unknown: 'updateUnknown' }
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
      {state.reason === 'restored' && state.restoredVersion ? <p className="dsh-pi-muted">{t('updateRestoredVersion').replace('{version}', state.restoredVersion)}</p> : null}
      {state.reason === 'version-differs' ? <p className="dsh-pi-muted">{versionDiffersLine(state, t)}</p> : null}
      {state.candidate ? <><p>{state.runtimeVersion} → {state.candidate.version} · DSH {state.candidate.compatibility}</p><p className="dsh-pi-update-notes">{state.candidate.notes}</p></> : null}
      {state.result?.stage ? <p className="dsh-pi-muted">{t('updateStage')}: {state.result.stage}{state.result.error?.code ? ` · ${state.result.error.code}` : ''}</p> : null}
    </>}
  </div>
}

function usageWindow(window, t) {
  if (['included', 'purchased', 'balance'].includes(window.id)) return t(`usageBalance_${window.id}`)
  const seconds = window.windowSeconds
  if (seconds && seconds % 86400 === 0) return `${seconds / 86400} ${t('days')}`
  if (seconds && seconds % 3600 === 0) return `${seconds / 3600} ${t('hours')}`
  if (seconds && seconds % 60 === 0) return `${seconds / 60} ${t('minutes')}`
  return window.scope === 'account' ? t('accountQuota') : Object.hasOwn(en, `usageScope_${window.scope}`) ? t(`usageScope_${window.scope}`) : window.scope
}

const MAX_TIMER = 2 ** 31 - 1
function UsagePanel({ entry, controller: sourceController, t }) {
  const [controller] = useState(() => sourceController.scoped())
  const [snapshot, setSnapshot] = useState()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const request = useRef()
  const generation = useRef(0)
  async function load(refresh = false) {
    const current = ++generation.current
    request.current?.abort()
    const abort = new AbortController(); request.current = abort
    setBusy(true); setFailed(false)
    try {
      const result = await controller.mutation('usage', { connectionId: entry.connectionId, credentialGeneration: entry.credentialGeneration, refresh }, abort.signal)
      if (!abort.signal.aborted && current === generation.current) setSnapshot(result)
    } catch { if (!abort.signal.aborted && current === generation.current) setFailed(true) }
    finally { if (!abort.signal.aborted && current === generation.current) setBusy(false) }
  }
  useEffect(() => { void load(); return () => { generation.current++; request.current?.abort() } }, [entry.connectionId])
  const limited = usageLimited(snapshot, now)
  useEffect(() => {
    if (!limited) return
    const delay = Math.min(retryWait(snapshot.retryAt, Date.now()), MAX_TIMER)
    const timer = setTimeout(() => setNow(Date.now()), delay)
    const onVisible = () => { if (document.visibilityState === 'visible') setNow(Date.now()) }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', onVisible) }
  }, [limited, snapshot?.retryAt])
  const windows = snapshot?.windows ?? []
  return <section className="dsh-pi-section dsh-pi-usage" aria-busy={busy} aria-label={t('usageTab')}>
    <div className="dsh-pi-toolbar"><h4>{t('usageTab')}</h4>
      <Button variant="ghost" size="sm" disabled={busy || limited} onClick={() => { void load(true) }}>{t(busy ? 'loading' : 'refreshUsage')}</Button></div>
    {failed ? <p role="alert">{t(snapshot ? 'usageRefreshFailed' : 'usageFailed')}</p> : null}
    {failed && snapshot ? <p role="status" className="dsh-pi-muted">{t('usageRetained')}</p> : null}
    {snapshot && !failed && (!windows.length || snapshot.status !== 'available') ? <p role="status" className="dsh-pi-muted">{t(`usage_${snapshot.status}`)}</p> : null}
    {limited && snapshot.retryAt ? <p className="dsh-pi-muted dsh-pi-small">{t('retryAt')}: {formatTime(snapshot.retryAt)}</p> : null}
    {windows.map(window => <div key={window.id} className="dsh-pi-usage-window">
      <div className="dsh-pi-toolbar"><span>{usageWindow(window, t)}</span>
        {window.quotaState ? <strong>{t(`quota_${window.quotaState}`)}</strong> : typeof window.usedPercent === 'number' ? <strong>{window.usedPercent}% {t('used')}</strong> : <span className="dsh-pi-muted">{t('quota_unknown')}</span>}</div>
      {!window.quotaState && typeof window.usedPercent === 'number' ? <progress max="100" value={Math.min(100, Math.max(0, window.usedPercent))} aria-label={usageWindow(window, t)} /> : null}
      {window.quota ? <span className="dsh-pi-muted">{window.quota.estimated ? `${t('estimated')} · ` : ''}{window.quota.remaining != null ? `${t('remaining')}: ${window.quota.remaining}` : window.quota.used != null ? `${t('used')}: ${window.quota.used}` : t('quota_unknown')}{window.quota.total != null ? ` / ${window.quota.total}` : ''} {t(`unit_${window.quota.unit}`)}</span> : null}
      {window.resetsAt ? <span className="dsh-pi-muted">{t('resets')}: {formatTime(window.resetsAt)}</span> : window.resetsOn ? <span className="dsh-pi-muted">{t('resetDate')}: {formatTime(window.resetsOn, { dateOnly: true })}</span> : null}
    </div>)}
    {snapshot?.checkedAt || snapshot?.sourceObservedAt ? <p className="dsh-pi-muted dsh-pi-small">
      {snapshot.source === 'last-observed' ? `${t('lastObservedShort')} · ` : ''}{t(snapshot.sourceObservedAt ? 'observedAt' : 'checkedAt')}: {formatTime(snapshot.sourceObservedAt ?? snapshot.checkedAt)}</p> : null}
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
function AddDialog({ state, controller: sourceController, t, onClose, onLogin, onSaved }) {
  const [controller] = useState(() => sourceController.scoped())
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
    } catch (error) {
      setError(connectionError(error) === 'credentialSaveFailed' ? 'createdCredentialFailed' : connectionError(error))
      await controller.refresh().catch(() => {})
    } finally { setBusy(false) }
  }
  return <Modal open title={t('addConnection')} closeLabel={t('close')} onClose={() => { if (!busy) onClose() }} className="dsh-pi-login dsh-pi-dialog" contentClassName="dsh-pi-modal-content"
    footer={<><Button variant="outline" onClick={onClose} disabled={busy}>{t('cancel')}</Button>
      <Button variant="primary" disabled={busy || error === 'createdCredentialFailed' || !service || unavailable || service.writable === false || !name || method === 'api-key' && !apiKey.trim()} onClick={() => { void save() }}>{t(busy ? 'loading' : method === 'oauth' ? 'addAndSignIn' : 'add')}</Button></>}>
    <Choice label={t('service')} value={service ? serviceKey(service) : ''} options={services.map(item => ({ id: serviceKey(item), label: serviceLabel(item) }))} disabled={busy}
      onChange={value => { setKey(value); setAuthMethod(services.find(item => serviceKey(item) === value)?.methods?.[0]?.id ?? 'oauth'); setApiKey(''); setEndpointUrl(''); setApi('') }} />
    {unavailable ? <p role="status">{t(service.unavailableReason === 'muse-code-bridge-unverified' ? `serviceUnavailable_${service.unavailableReason}` : 'serviceUnavailable')}</p> : null}
    {methods.length > 1 ? <Choice label={t('method')} value={method} options={methods.map(item => ({ id: item.id, label: t(item.id === 'oauth' ? 'oauth' : 'apiKey') }))} disabled={busy} onChange={value => { setAuthMethod(value); setApiKey('') }} /> : null}
    <div className="dsh-pi-field"><label htmlFor={`${fieldId}-name`}>{t('connectionName')}</label>
      <Input id={`${fieldId}-name`} {...noAutofill} data-modal-autofocus maxLength={80} value={displayName} disabled={busy} placeholder={serviceLabel(service ?? {}) ?? t('namePlaceholder')} onChange={event => setDisplayName(event.target.value)} /></div>
    {method === 'api-key' ? <>
      <SecretField value={apiKey} onChange={setApiKey} t={t} disabled={busy} />
      <details className="dsh-pi-advanced"><summary>{t('advanced')}</summary>
        <div className="dsh-pi-field"><label htmlFor={`${fieldId}-url`}>{t('endpoint')}</label><Input id={`${fieldId}-url`} {...noAutofill} type="url" value={endpointUrl} disabled={busy} placeholder="https://…" onChange={event => setEndpointUrl(event.target.value)} /></div>
        {service?.apis?.length ? <Choice label={t('protocol')} value={api} options={[{ id: '', label: t('providerDefault') }, ...service.apis.map(value => ({ id: value, label: value }))]} disabled={busy} onChange={setApi} /> : null}
      </details></> : <p className="dsh-pi-muted">{t('oauthHint')}</p>}
    {error ? <p role="alert">{t(error)}</p> : null}
  </Modal>
}

/** One place for an account: status, usage, settings and removal. */
function ConnectionDialog({ entry, state, controller: sourceController, t, onClose, onLogin, onSaved }) {
  const [controller] = useState(() => sourceController.scoped())
  const [editRevision] = useState(entry.revision ?? state.revision)
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
  const cleanupPending = state.entries.find(item => item.connectionId === entry.connectionId)?.credentialCleanupPending ?? entry.credentialCleanupPending
  const deletionPending = state.entries.find(item => item.connectionId === entry.connectionId)?.deletionPending ?? entry.deletionPending
  const writable = entry.writable !== false
  const editable = writable && !deletionPending
  const methodChanged = authMethod !== entry.authMethod
  const dirty = displayName.trim() !== entry.displayName || methodChanged || !!apiKey || endpointUrl.trim() !== (entry.profile?.baseURL ?? '') || api !== (entry.profile?.api ?? '')
  const status = statusOf({ ...entry, deletionPending })
  async function recover(error) {
    const copy = connectionError(error)
    setError(copy)
    try {
      await controller.refresh()
      const current = controller.getSnapshot().entries.find(item => item.connectionId === entry.connectionId)
      // A committed tombstone/key swap changes the authority captured by this
      // dialog. Close with persistent feedback; retry only from a fresh entry.
      if (current && current.credentialGeneration !== entry.credentialGeneration) onSaved(copy)
    } catch {}
  }
  async function save() {
    if (methodChanged && confirm !== 'method') { setConfirm('method'); return }
    setBusy(true); setError('')
    try {
      const fields = { displayName: displayName.trim(), ...(methodChanged ? { authMethod } : {}), ...(apiKey ? { apiKey } : {}),
        ...(endpointUrl.trim() ? { endpointUrl: endpointUrl.trim() } : entry.profile?.baseURL ? { endpointUrl: '' } : {}), ...(api !== (entry.profile?.api ?? '') ? { api } : {}) }
      await controller.mutation('connection-update', { connectionId: entry.connectionId, patch: fields, revision: editRevision, credentialGeneration: entry.credentialGeneration })
      setApiKey(''); await controller.refresh(); onSaved()
    } catch (error) { await recover(error) } finally { setBusy(false) }
  }
  async function destructive(action) {
    setBusy(true); setError('')
    try {
      const retry = action === 'delete' && entry.deletionPending || action === 'cleanup' && entry.credentialCleanupPending
      await controller.mutation(`connection-${action}`, { connectionId: entry.connectionId, revision: retry ? state.revision : editRevision, credentialGeneration: entry.credentialGeneration, ...(action === 'clone' ? { displayName: `${displayName} ${t('copySuffix')}` } : {}) })
      await controller.refresh(); onSaved(action)
    } catch (error) { await recover(error) } finally { setBusy(false) }
  }
  const canSignIn = !deletionPending && entry.authMethod === 'oauth' && entry.capabilities?.auth !== false
  return <Modal open title={entry.displayName} description={`${entry.serviceLabel} · ${t(entry.authMethod === 'oauth' ? 'oauthShort' : 'apiKey')}`} closeLabel={t('close')} onClose={() => { if (!busy) onClose() }} className="dsh-pi-login dsh-pi-dialog" contentClassName="dsh-pi-modal-content"
    footer={<><Button variant="outline" onClick={onClose} disabled={busy}>{t('close')}</Button>
      <Button variant="primary" disabled={busy || !editable || !dirty || service?.capabilities?.settings === false || confirm === 'delete' || !displayName.trim()} onClick={() => { void save() }}>{t(busy ? 'loading' : confirm === 'method' ? 'confirmSave' : 'save')}</Button></>}>
    <div className="dsh-pi-status-card">
      <span className="dsh-pi-status"><StateDot state={status.dot} size={8} />{t(status.copy)}</span>
      {canSignIn ? <Button size="sm" variant={entry.configured && entry.authStatus !== 'expired' ? 'outline' : 'primary'} disabled={busy || !writable || methodChanged} onClick={() => onLogin(entry)}>{t(entry.configured ? 'signInAgain' : 'signIn')}</Button> : null}
    </div>
    {cleanupPending && !deletionPending ? <div className="dsh-pi-confirm"><p role="alert">{t('credentialCleanupPending')}</p>
      <Button size="sm" variant="outline" disabled={busy || !writable} onClick={() => { void destructive('cleanup') }}>{t('retryCredentialCleanup')}</Button></div> : null}
    {deletionPending ? <p role="alert">{t('deletionPending')}</p> : null}
    {!deletionPending && entry.configured && entry.capabilities?.usage !== false ? <UsagePanel entry={entry} controller={controller} t={t} /> : null}
    <section className="dsh-pi-section" aria-label={t('connectionSettings')}>
      <h4>{t('connectionSettings')}</h4>
      <div className="dsh-pi-field"><label htmlFor={`${fieldId}-name`}>{t('connectionName')}</label><Input id={`${fieldId}-name`} {...noAutofill} maxLength={80} value={displayName} disabled={busy || !editable} placeholder={t('namePlaceholder')} onChange={event => setDisplayName(event.target.value)} /></div>
      {methods.length > 1 ? <Choice label={t('method')} value={authMethod} options={methods.map(method => ({ id: method.id, label: t(method.id === 'oauth' ? 'oauth' : 'apiKey') }))} disabled={busy || !editable} onChange={value => { setAuthMethod(value); setApiKey(''); setConfirm(undefined) }} /> : null}
      {methodChanged ? <p role="alert">{t('methodChangeWarning')}</p> : null}
      {authMethod === 'api-key' ? <>
        <SecretField value={apiKey} onChange={setApiKey} t={t} disabled={busy || !editable} saved={entry.configured && !methodChanged} />
        <details className="dsh-pi-advanced" open={entry.profile?.baseURL ? true : undefined}><summary>{t('advanced')}</summary>
          <div className="dsh-pi-field"><label htmlFor={`${fieldId}-url`}>{t('endpoint')}</label><Input id={`${fieldId}-url`} {...noAutofill} type="url" value={endpointUrl} disabled={busy || !editable} placeholder="https://…" onChange={event => setEndpointUrl(event.target.value)} /></div>
          {service?.apis?.length ? <Choice label={t('protocol')} value={api} options={[{ id: '', label: t('providerDefault') }, ...service.apis.map(value => ({ id: value, label: value }))]} disabled={busy || !editable} onChange={setApi} /> : null}
        </details></> : null}
    </section>
    {error ? <p role="alert">{t(error)}</p> : null}
    {!writable ? <p className="dsh-pi-muted">{t('readOnly')}</p> : null}
    <section className="dsh-pi-section dsh-pi-danger" aria-label={t('deleteConnection')}>
      {confirm === 'delete' ? <div className="dsh-pi-confirm"><p role="alert">{t('deleteWarning')}</p>
        <div className="dsh-pi-inline-actions"><Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirm(undefined)}>{t('cancel')}</Button>
          <Button size="sm" variant="primary" disabled={busy} onClick={() => { void destructive('delete') }}>{t('confirmDelete')}</Button></div></div>
        : <div className="dsh-pi-inline-actions">
          <Button size="sm" disabled={busy || !editable} title={t('cloneHint')} onClick={() => { void destructive('clone') }}>{t('cloneConnection')}</Button>
          <Button size="sm" className="dsh-pi-danger-button" disabled={busy || !writable} onClick={() => setConfirm('delete')}>{t(deletionPending ? 'retryDelete' : 'deleteConnection')}</Button>
        </div>}
    </section>
  </Modal>
}

function ConnectionRow({ entry, controller, t, writableRevision, onOpen, onLogin, onModels }) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const status = statusOf(entry)
  const ownerManaged = entry.authStatus === 'owner-managed'
  const settings = entry.deletionPending || entry.capabilities?.settings !== false
  const external = !settings && entry.settingsUrl ? safeUrl(entry.settingsUrl) : undefined
  async function setEnabled(enabled) {
    setBusy(true); setFailed(false)
    try { await controller.mutation('connection-update', { connectionId: entry.connectionId, patch: { enabled }, revision: writableRevision }); await controller.refresh() }
    catch { setFailed(true) } finally { setBusy(false) }
  }
  const meta = [
    ownerManaged ? `${t(`directory_${entry.directoryState ?? 'unavailable'}`)} · ${entry.source ?? t('sourceUnknown')}` : `${t(entry.authMethod === 'oauth' ? 'oauthShort' : 'apiKey')} · ${t(status.copy)}`,
  ].filter(Boolean).join(' · ')
  const main = <><span className="dsh-pi-row-name">{ownerManaged ? null : <StateDot state={status.dot} size={8} />}{entry.displayName}</span>
    <span className={`dsh-pi-row-meta${status.dot === 'error' ? ' dsh-pi-row-meta-alert' : ''}`}>{meta}</span></>
  return <li className="dsh-pi-connection-row">
    {settings ? <button type="button" className="dsh-pi-row-main" aria-label={`${t('connectionSettings')}: ${entry.displayName}`} onClick={() => onOpen(entry)}>{main}</button>
      : <div className="dsh-pi-row-main">{main}{external ? <a className="dsh-pi-link" href={external} target="_blank" rel="noopener noreferrer">{t('externalSettings')}</a> : null}</div>}
    <div className="dsh-pi-row-actions">
      {settings ? <Button size="sm" variant="outline" aria-label={`${t('manageConnection')}: ${entry.displayName}`} onClick={() => onOpen(entry)}>{t('settingsShort')}</Button> : null}
      {entry.credentialCleanupPending && !entry.deletionPending ? <span role="alert" className="dsh-pi-row-meta-alert">{t('credentialCleanupShort')}</span> : null}
      {failed ? <span role="alert" className="dsh-pi-row-meta-alert">{t('saveFailed')}</span> : null}
      {entry.deletionPending ? <span role="alert" className="dsh-pi-row-meta-alert">{t('deletionPendingShort')}</span> : !entry.configured && entry.authMethod === 'oauth' && entry.capabilities?.auth !== false && entry.writable !== false
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
  const [category, setCategory] = useState('pi')
  const titleId = useId()
  useEffect(() => { const release = controller.retain(); void controller.load(); return release }, [controller])
  useEffect(() => { setOpened(undefined); setNotice('') }, [state.profileKey, state.generation])
  const needle = search.trim().toLocaleLowerCase()
  const groups = new Map()
  for (const entry of state.entries) {
    if (serviceGroup(entry) !== category) continue
    if (!`${entry.displayName} ${entry.integrationLabel} ${entry.serviceLabel}`.toLocaleLowerCase().includes(needle)) continue
    const key = `${entry.integrationId}/${entry.serviceId}`
    if (!groups.has(key)) groups.set(key, { label: entry.serviceLabel ?? entry.integrationLabel, entries: [] })
    groups.get(key).entries.push(entry)
  }
  const close = () => setOpened(undefined)
  function onLogin(entry) { setNotice(''); setOpened({ kind: 'login', entry, method: entry.authMethod }) }
  function onModels(entry) { setOpened({ kind: 'models', entry: controller.getSnapshot().entries.find(item => item.connectionId === entry.connectionId) ?? entry }) }
  function onSaved(action) { setOpened(undefined); setNotice(action === 'delete' ? 'deleted' : action === 'clone' ? 'cloned' : action && action !== 'cleanup' ? action : 'saved') }
  const availableServices = state.services.filter(service => serviceGroup(service) === category)
  const categories = [...SERVICE_GROUPS, ...state.entries.some(entry => serviceGroup(entry) === 'external') ? [{ id: 'external', label: t('externalGroup') }] : []]
  return <section className="dsh-pi-login dsh-pi-footer" aria-labelledby={titleId}>
    <div className="dsh-pi-toolbar"><h3 id={titleId}>{t('title')}</h3>
      <Button variant="outline" size="sm" onClick={() => { setNotice(''); setOpened({ kind: 'add' }) }} disabled={state.status !== 'ready' || availableServices.length === 0}>{t('addConnection')}</Button></div>
    <nav className="dsh-pi-categories" aria-label={t('serviceGroups')}>
      {categories.map(item => <Button key={item.id} size="sm" variant={category === item.id ? 'primary' : 'outline'} aria-pressed={category === item.id}
        onClick={() => { setCategory(item.id); setSearch(''); setNotice(''); setOpened(undefined) }}>{item.label}</Button>)}
    </nav>
    {notice ? <p role={['saved', 'deleted', 'cloned'].includes(notice) ? 'status' : 'alert'} className={['saved', 'deleted', 'cloned'].includes(notice) ? 'dsh-pi-success' : undefined}>{t(notice)}</p> : null}
    {state.error ? <p role="alert">{t('loadFailed')} <Button size="sm" onClick={() => { void controller.refresh() }}>{t('retry')}</Button></p> : null}
    {state.status === 'loading' && state.entries.length === 0 ? <p role="status" className="dsh-pi-loading">{t('loading')}</p> : null}
    {state.entries.length > 8 ? <div className="dsh-pi-search"><Input aria-label={t('searchConnections')} placeholder={t('searchConnections')} icon={<IconSearchOutlineRegular size={16} />} value={search} onChange={event => setSearch(event.target.value)} /></div> : null}
    {[...groups].map(([key, group]) => <div className="dsh-pi-group" key={key}>
      <h4 className="dsh-pi-group-label">{group.label}</h4>
      <ul className="dsh-pi-connection-list">{group.entries.map(entry => <ConnectionRow key={entry.connectionId} entry={entry} controller={controller} t={t} writableRevision={state.revision}
        onOpen={entry => { setNotice(''); setOpened({ kind: 'settings', entry }) }} onLogin={onLogin} onModels={onModels} />)}</ul>
    </div>)}
    {state.status === 'ready' && groups.size === 0 && !state.error ? <p className="dsh-pi-muted">{t(needle ? 'noMatchingConnections' : 'emptyCategoryConnections')}</p> : null}
    {updates ? <UpdateUI controller={updates} t={t} /> : null}
    {opened?.kind === 'login' ? <LoginDialog {...opened} controller={controller} t={t} onClose={close} onModels={onModels} /> : null}
    {opened?.kind === 'models' ? <ModelsDialog key={opened.entry.connectionId} entry={opened.entry} controller={controller} t={t} onClose={close} /> : null}
    {opened?.kind === 'add' ? <AddDialog state={{ ...state, services: availableServices }} controller={controller} t={t} onClose={close} onLogin={onLogin} onSaved={onSaved} /> : null}
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
    const style = document.createElement('style'); style.dataset.dshPiLogin = ''; style.textContent = css; document.head.append(style)
    return () => style.remove()
  }, 'dsh-pi-login: styles')
  ctx.effect(() => {
    let timer
    const refreshMounted = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        void controller.refreshIfMounted()
        if (controller.mounts > 0) void updates.load()
      }, 50)
    }
    const disposers = [
      ctx.remote.$on('settings/document-updated', refreshMounted),
      ctx.remote.$on('credentials/record-updated', refreshMounted),
      ctx.remote.$on('credentials/reference-updated', refreshMounted),
      ctx.remote.$on('llm/adapters-updated', refreshMounted),
      ctx.on('connection/reset', () => { void controller.refresh(); void updates.load() }),
    ]
    return () => { clearTimeout(timer); for (const dispose of disposers) dispose() }
  }, 'dsh-pi-login: connection events')
  const inject = () => ({ controller, updates, locale: ctx.locale })
  ctx.slots.inject('settings.models.footer', () => ctx.slots.register({ name: 'settings.models.footer', id: 'dsh-pi-login', order: 10, inject }, ConnectionUI))
}
