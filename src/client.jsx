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
        <Input id={id} data-modal-autofocus type={prompt.kind === 'secret' && !visible ? 'password' : 'text'} autoComplete="off" spellCheck={false}
          value={value} placeholder={prompt.placeholder} onChange={event => setValue(event.target.value)} />
        {prompt.kind === 'secret' ? <div className="dsh-pi-secret-actions"><Button onClick={() => setVisible(!visible)} aria-pressed={visible}>{t(visible ? 'hideSecret' : 'showSecret')}</Button>
          <Button onClick={async () => { try { setValue(await navigator.clipboard.readText()); setPasteError(false) } catch { setPasteError(true) } }}>{t('paste')}</Button></div> : null}</>}
    {pasteError ? <p role="alert">{t('pasteFailed')}</p> : null}
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
        else { controller.tickets.delete(ticket); await controller.refresh() }
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
    try { await controller.mutation(useLogin ? 'use-login' : 'enable', { connectionId: entry.connectionId }); setEnabled(true); await controller.refresh() }
    catch (error) { setEnableError(true); setKeyOverride(error.message.endsWith('/api-key-override')) } finally { setEnabling(false) }
  }
  return <Modal open onClose={onClose} title={entry.displayName} closeLabel={t('close')} className="dsh-pi-login"
    footer={<Button variant="outline" onClick={onClose}>{t(complete ? 'close' : 'cancel')}</Button>}>
    {error || state.status === 'failed' ? <p role="alert">{t(error || terminalCopy)}</p> : null}
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
      {state.prompt ? <Prompt key={state.prompt.id} prompt={state.prompt} ticket={ticket} controller={controller} t={t} onFailure={() => setError('failed')} /> : null}
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
    void controller.call('models', { connectionId: entry.connectionId }, abort.signal).then(setSnapshot, () => { if (!abort.signal.aborted) setError(true) })
    return () => { abort.abort(); refreshAbort.current?.abort(); generation.current++ }
  }, [entry.connectionId])
  async function reload() {
    const request = ++generation.current
    refreshAbort.current?.abort()
    const abort = new AbortController(); refreshAbort.current = abort
    setBusy(true); setRefreshError(''); setError(false)
    try {
      const next = await controller.call('refresh-models', { connectionId: entry.connectionId }, abort.signal)
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
      await controller.mutation('set-model', { connectionId: entry.connectionId, model, enabled, revision: snapshot.revision })
      setSnapshot(await controller.call('models', { connectionId: entry.connectionId }))
      await controller.refresh()
    } catch {
      setError(true)
      try { setSnapshot(await controller.call('models', { connectionId: entry.connectionId })) } catch {}
    } finally { setBusy(false) }
  }
  const needle = search.trim().toLowerCase()
  const models = snapshot?.models.filter(model => `${model.id} ${model.name}`.toLowerCase().includes(needle))
  return <Modal open title={`${entry.displayName} · ${t('models')}`} description={t('modelsHint')} closeLabel={t('close')} onClose={onClose}
    className="dsh-pi-login dsh-pi-models-dialog" footer={<Button variant="outline" onClick={onClose}>{t('close')}</Button>}>
    <Input icon={<IconSearchOutlineRegular size={16} />} aria-label={t('searchModels')} placeholder={t('searchModels')} data-modal-autofocus value={search} onChange={event => setSearch(event.target.value)} />
    {snapshot?.refresh?.canRefresh ? <>
      <Button variant="outline" size="sm" disabled={busy || !entry.writable} onClick={() => { void reload() }}>{t(busy ? 'loading' : 'reloadModels')}</Button>
      {snapshot.refresh.status ? <p role="status">{t(snapshot.refresh.status.message)}{snapshot.refresh.status.detail ? ` · ${snapshot.refresh.status.detail}` : ''}</p> : null}
      {(snapshot.refresh.notes ?? []).map(note => <p key={note} className="dsh-pi-muted">{t(note)}</p>)}
    </> : snapshot ? <p className="dsh-pi-muted">{t('catalogRefreshUnsupported')}</p> : null}
    {refreshError ? <p role="alert">{t(refreshError)}</p> : null}
    {error ? <p role="alert">{t(snapshot ? 'saveFailed' : 'modelsFailed')}</p> : null}
    {!snapshot && !error ? <p role="status">{t('loading')}</p> : null}
    {snapshot && !entry.enabled ? <p className="dsh-pi-muted">{t('activateFirst')}</p> : null}
    {snapshot?.models.some(model => model.fast) ? <p className="dsh-pi-muted">{t('fastWarning')}</p> : null}
    <div className="dsh-pi-model-list">
      {models?.map(model => <div className="dsh-pi-model-row" key={model.id}>
        <div className="dsh-pi-model-label"><span>{model.name} · {entry.displayName}</span><span className="dsh-pi-model-id">{model.id}</span>{model.contributor ? <span className="dsh-pi-muted">{t('metaContributorHint')}</span> : null}{model.capabilityUnverified ? <span className="dsh-pi-muted">{t('capabilitiesUnknown')}</span> : null}</div>
        <Switch label={`${t('modelEnabled')}: ${model.name}`} checked={model.enabled} disabled={busy || !entry.writable || !entry.enabled} onChange={enabled => { void toggle(model.id, enabled) }} />
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

function MuseModelsDialog({ entry, controller, t, onClose }) {
  const [snapshot, setSnapshot] = useState()
  const [selected, setSelected] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const request = useRef()
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
  const selectedModel = models.find(model => model.id === selected)
  async function save() {
    if (!selectedModel) return
    setBusy(true); setError(''); setSaved(false)
    try {
      await controller.mutation('connection-update', { connectionId: entry.connectionId, revision: snapshot.revision ?? entry.revision,
        patch: { modelId: selectedModel.modelId, contributorMode: selectedModel.contributor === true } }, request.current.signal)
      await controller.refresh(); setSaved(true)
      setSnapshot({ ...snapshot, revision: controller.getSnapshot().revision })
    } catch (error) { if (!request.current.signal.aborted) setError(connectionError(error)) }
    finally { if (!request.current.signal.aborted) setBusy(false) }
  }
  return <Modal open title={`${entry.displayName} · ${t('museModels')}`} description={t('museSessionHint')} closeLabel={t('close')} onClose={onClose} className="dsh-pi-login dsh-pi-connection-dialog" contentClassName="dsh-pi-modal-content"
    footer={<><Button variant="outline" onClick={onClose}>{t('close')}</Button><Button variant="primary" onClick={() => { void save() }} disabled={busy || !entry.writable || !entry.configured || !snapshot || !selectedModel}>{t(busy ? 'loading' : 'save')}</Button></>}>
    {!snapshot && !error ? <p role="status">{t('loading')}</p> : null}
    {error ? <p role="alert">{t(error)}</p> : null}
    {saved ? <p role="status">{t('museModelSaved')}</p> : null}
    {models.length ? <Choice label={t('museModels')} value={selected} options={models.map(model => ({ id: model.id, label: `${model.name ?? model.label} · ${entry.displayName}` }))} disabled={busy || !entry.configured || !entry.writable} onChange={value => { setSelected(value); setSaved(false) }} /> : snapshot ? <p className="dsh-pi-muted">{t('museCatalogDiagnostic')}</p> : null}
    {selectedModel?.entitlement === 'unverified' ? <p className="dsh-pi-muted">{t('museEntitlementUnverified')}</p> : null}
  </Modal>
}

export function UpdateUI({ controller, t }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  useEffect(() => { void controller.load() }, [controller])
  const active = ['checking', 'starting', 'preparing', 'installing'].includes(state.status)
  const messages = { idle: 'updateIdle', checking: 'updateChecking', current: 'updateCurrent', available: 'updateAvailable', blocked: 'updateBlocked', starting: 'updatePreparing', preparing: 'updatePreparing', installing: 'updateInstalling', 'restart-required': 'updateRestart', applied: 'updateApplied', failed: 'updateFailed', cancelled: 'updateCancelled', overridden: 'updateOverridden', unknown: 'updateUnknown' }
  return <div className="dsh-pi-updates">
    <h4>{t('updateTitle')}{state.runtimeVersion ? ` · ${state.runtimeVersion}` : ''}</h4>
    <p role={['failed', 'blocked'].includes(state.status) ? 'alert' : 'status'}>{t(messages[state.status] || 'updateUnknown')}</p>
    {state.reason ? <p className="dsh-pi-muted">{t(`updateReason_${state.reason}`) || t('updateReason_network')}</p> : null}
    {state.checkedAt ? <p className="dsh-pi-muted">{t('updateChecked')}: {new Date(state.checkedAt).toLocaleString()}</p> : null}
    {state.candidate ? <><p>{state.runtimeVersion} → {state.candidate.version} · DSH {state.candidate.compatibility}</p><p className="dsh-pi-update-notes">{state.candidate.notes}</p></> : null}
    <div className="dsh-pi-actions">
      <Button size="sm" variant="outline" disabled={active || state.status === 'unknown' || state.status === 'restart-required'} onClick={() => { void controller.check() }}>{t('updateCheck')}</Button>
      {state.status === 'available' ? <Button size="sm" variant="primary" onClick={() => { void controller.begin() }}>{t('updateInstall')}</Button> : null}
      {state.status === 'unknown' ? <Button size="sm" variant="outline" onClick={() => { void controller.load() }}>{t('updateReconcile')}</Button> : null}
      <a className="dsh-pi-link" href="https://github.com/Aero123421/dsh-pi-login/releases" target="_blank" rel="noopener noreferrer">{t('updateManual')}</a>
    </div>
    {state.result?.stage ? <p className="dsh-pi-muted">{t('updateStage')}: {state.result.stage}{state.result.error?.code ? ` · ${state.result.error.code}` : ''}</p> : null}
  </div>
}

function time(value, dateOnly = false) {
  if (!value) return undefined
  if (dateOnly) return value
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? undefined : date.toLocaleString()
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
  return <div className="dsh-pi-usage" aria-busy={busy}>
    <div className="dsh-pi-toolbar"><p role="status">{t(snapshot ? `usage_${snapshot.status}` : 'loading')}</p>
      <Button variant="outline" disabled={busy || snapshot?.status === 'rate-limited' && new Date(snapshot.retryAt).valueOf() > Date.now()} onClick={() => { void load(true) }}>{t('refreshUsage')}</Button></div>
    {failed ? <p role="alert">{t('usageFailed')}</p> : null}
    {(snapshot?.windows ?? []).map(window => <div key={window.id} className="dsh-pi-usage-window">
      <span>{usageWindow(window, t)}</span>
      {window.quotaState ? <strong>{t(`quota_${window.quotaState}`)}</strong> : typeof window.usedPercent === 'number' ? <><strong>{window.usedPercent}% {t('used')}</strong><progress max="100" value={Math.min(100, Math.max(0, window.usedPercent))} aria-label={usageWindow(window, t)} /></> : <span>{t('quota_unknown')}</span>}
      {window.quota ? <span className="dsh-pi-muted">{window.quota.estimated ? `${t('estimated')} · ` : ''}{window.quota.remaining != null ? `${t('remaining')}: ${window.quota.remaining}` : window.quota.used != null ? `${t('used')}: ${window.quota.used}` : t('quota_unknown')}{window.quota.total != null ? ` / ${window.quota.total}` : ''} {t(`unit_${window.quota.unit}`)}</span> : null}
      {window.resetsAt ? <span className="dsh-pi-muted">{t('resets')}: {time(window.resetsAt)}</span> : window.resetsOn ? <span className="dsh-pi-muted">{t('resetDate')}: {time(window.resetsOn, true)}</span> : null}
    </div>)}
    {snapshot?.retryAt ? <p className="dsh-pi-muted">{t('retryAt')}: {time(snapshot.retryAt)}</p> : null}
    {snapshot?.sourceObservedAt ? <p className="dsh-pi-muted">{t('observedAt')}: {time(snapshot.sourceObservedAt)}</p> : null}
    {snapshot?.checkedAt ? <p className="dsh-pi-muted">{t('checkedAt')}: {time(snapshot.checkedAt)}</p> : null}
    {snapshot?.source === 'last-observed' ? <p className="dsh-pi-muted">{t('lastObserved')}</p> : null}
  </div>
}

function SecretField({ value, onChange, t, disabled }) {
  const [visible, setVisible] = useState(false)
  const [pasteError, setPasteError] = useState(false)
  const id = useId()
  return <div className="dsh-pi-field"><label htmlFor={id}>{t('apiKey')}</label>
    <Input id={id} type={visible ? 'text' : 'password'} autoComplete="off" spellCheck={false} value={value} disabled={disabled} onChange={event => onChange(event.target.value)} />
    <div className="dsh-pi-secret-actions"><Button disabled={disabled} aria-pressed={visible} onClick={() => setVisible(!visible)}>{t(visible ? 'hideSecret' : 'showSecret')}</Button>
      <Button disabled={disabled} onClick={async () => { try { onChange(await navigator.clipboard.readText()); setPasteError(false) } catch { setPasteError(true) } }}>{t('paste')}</Button></div>
    {pasteError ? <p role="alert">{t('pasteFailed')}</p> : null}
  </div>
}

function ConnectionDialog({ entry, state, controller, t, onClose, onLogin, onSaved }) {
  const [integration, setIntegration] = useState(entry?.integrationId ?? state.integrations[0]?.id ?? 'pi')
  const services = state.services.filter(service => service.integrationId === integration)
  const [serviceId, setServiceId] = useState(entry?.serviceId ?? services[0]?.serviceId ?? services[0]?.id ?? '')
  const service = services.find(item => (item.serviceId ?? item.id) === serviceId) ?? services[0]
  const methods = service?.methods ?? entry?.methods ?? []
  const [authMethod, setAuthMethod] = useState(entry?.authMethod ?? methods[0]?.id ?? 'oauth')
  const effectiveMethod = methods.find(method => method.id === authMethod)?.id ?? methods[0]?.id ?? authMethod
  const [displayName, setDisplayName] = useState(entry?.displayName ?? '')
  const [enabled, setEnabled] = useState(entry?.enabled ?? false)
  const [endpointUrl, setEndpointUrl] = useState(entry?.profile?.baseURL ?? '')
  const [api, setApi] = useState(entry?.profile?.api ?? '')
  const [apiKey, setApiKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState()
  const fieldId = useId()
  const revision = state.revision
  const writable = entry?.writable ?? service?.writable !== false
  const methodChanged = entry && effectiveMethod !== entry.authMethod
  async function save() {
    if (methodChanged && confirm !== 'method') { setConfirm('method'); return }
    setBusy(true); setError('')
    try {
      const fields = { displayName: displayName.trim(), ...(!entry || methodChanged ? { authMethod: effectiveMethod } : {}), ...(entry ? { enabled } : {}), ...(apiKey ? { apiKey } : {}), ...(endpointUrl.trim() ? { endpointUrl: endpointUrl.trim() } : entry?.profile?.baseURL ? { endpointUrl: '' } : {}), ...(api ? { api } : {}) }
      const result = await controller.mutation(entry ? 'connection-update' : 'connection-create', entry ? { connectionId: entry.connectionId, patch: fields, revision } : { integrationId: integration, serviceId: service.serviceId ?? service.id, ...fields, revision })
      setApiKey(''); await controller.refresh(); onSaved()
      if (!entry && effectiveMethod === 'oauth') {
        const created = result.connection ?? result
        const next = controller.getSnapshot().entries.find(item => item.connectionId === created.connectionId)
        if (next) onLogin(next)
      }
    } catch (error) { setError(connectionError(error)) } finally { setBusy(false) }
  }
  async function destructive(action) {
    setBusy(true); setError('')
    try {
      await controller.mutation(`connection-${action}`, { connectionId: entry.connectionId, revision, ...(action === 'clone' ? { displayName: `${displayName} ${t('copySuffix')}` } : {}) })
      await controller.refresh(); onSaved()
    } catch { setError('saveFailed') } finally { setBusy(false) }
  }
  return <Modal open title={entry ? `${entry.displayName} · ${t('connectionSettings')}` : t('addConnection')} closeLabel={t('close')} onClose={onClose} className="dsh-pi-login dsh-pi-connection-dialog" contentClassName="dsh-pi-modal-content"
    footer={<><Button variant="outline" onClick={onClose} disabled={busy}>{t('cancel')}</Button><Button variant="primary" disabled={busy || !writable || !service || service.capabilities?.settings === false || confirm === 'delete' || !displayName.trim() || !entry && effectiveMethod === 'api-key' && !apiKey.trim()} onClick={() => { void save() }}>{t(busy ? 'loading' : confirm === 'method' ? 'confirmSave' : 'save')}</Button></>}>
    {!entry ? <div className="dsh-pi-fields"><Choice label={t('integration')} value={integration} options={state.integrations.map(item => ({ id: item.id ?? item.integrationId, label: item.label }))} disabled={busy} onChange={value => { setIntegration(value); setServiceId(''); setAuthMethod('oauth') }} />
      {services.length > 1 ? <Choice label={t('service')} value={service?.serviceId ?? service?.id} options={services.map(item => ({ id: item.serviceId ?? item.id, label: item.label ?? item.serviceLabel }))} disabled={busy} onChange={setServiceId} /> : null}</div> : <p className="dsh-pi-muted">{entry.integrationLabel} / {entry.serviceLabel}</p>}
    <div className="dsh-pi-field"><label htmlFor={`${fieldId}-name`}>{t('connectionName')}</label><Input id={`${fieldId}-name`} data-modal-autofocus maxLength={80} value={displayName} disabled={busy || !writable} placeholder={t('namePlaceholder')} onChange={event => setDisplayName(event.target.value)} /></div>
    {entry ? <div className="dsh-pi-provider-row"><div><span>{t('useProvider')}</span><p className="dsh-pi-muted">{t('disabledHint')}</p></div><Switch label={`${t('useProvider')}: ${entry.displayName}`} checked={enabled} disabled={busy || !writable || !entry.configured} onChange={setEnabled} /></div> : null}
    {service?.capabilities?.settings === false ? <p role="status">{t(service.unavailableReason === 'muse-code-bridge-unverified' ? `serviceUnavailable_${service.unavailableReason}` : 'serviceUnavailable')}</p> : null}
    {methods.length > 1 ? <Choice label={t('method')} value={effectiveMethod} options={methods.map(method => ({ id: method.id, label: t(method.id === 'oauth' ? 'oauth' : 'apiKey') }))} disabled={busy || !writable} onChange={value => { setAuthMethod(value); setApiKey(''); setConfirm(undefined) }} /> : null}
    {effectiveMethod === 'api-key' ? <><SecretField value={apiKey} onChange={setApiKey} t={t} disabled={busy || !writable} />{entry?.configured ? <p className="dsh-pi-muted">{t('keySaved')}</p> : null}
      <div className="dsh-pi-field"><label htmlFor={`${fieldId}-url`}>{t('endpoint')}</label><Input id={`${fieldId}-url`} type="url" value={endpointUrl} disabled={busy || !writable} placeholder="https://…" onChange={event => setEndpointUrl(event.target.value)} /></div>
      {service?.apis?.length ? <Choice label={t('protocol')} value={api || service.apis[0]} options={service.apis.map(value => ({ id: value, label: value }))} disabled={busy || !writable} onChange={setApi} /> : null}</> : <p className="dsh-pi-muted">{t('oauthHint')}</p>}
    {methodChanged ? <p role="alert">{t('methodChangeWarning')}</p> : null}
    {entry ? <div className="dsh-pi-detail-actions">
      {entry.authMethod === 'oauth' && entry.capabilities?.auth !== false ? <Button variant="outline" disabled={busy || !writable || methodChanged} onClick={() => onLogin(entry)}>{t(entry.configured ? 'signInAgain' : 'signIn')}</Button> : null}
      <Button variant="outline" disabled={busy || !writable} onClick={() => { void destructive('clone') }}>{t('cloneConnection')}</Button>
      <Button disabled={busy || !writable} onClick={() => setConfirm('delete')}>{t('deleteConnection')}</Button>
    </div> : null}
    {entry ? <p className="dsh-pi-muted">{t('cloneHint')}</p> : null}
    {confirm === 'delete' ? <div className="dsh-pi-confirm"><p role="alert">{t('deleteWarning')}</p><Button variant="outline" disabled={busy} onClick={() => setConfirm(undefined)}>{t('cancel')}</Button><Button variant="primary" disabled={busy} onClick={() => { void destructive('delete') }}>{t('confirmDelete')}</Button></div> : null}
    {error ? <p role="alert">{t(error)}</p> : null}
    {!writable ? <p className="dsh-pi-muted">{t('readOnly')}</p> : null}
  </Modal>
}

export function ConnectionUI({ controller, updates, locale }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const t = useCopy(locale)
  const [tab, setTab] = useState('connections')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [opened, setOpened] = useState()
  const [notice, setNotice] = useState(false)
  const tabId = useId()
  useEffect(() => { void controller.load() }, [controller])
  useEffect(() => { setOpened(undefined); setNotice(false) }, [state.profileKey, state.generation])
  const needle = search.trim().toLocaleLowerCase()
  const groups = new Map()
  for (const entry of state.entries) {
    if (!`${entry.displayName} ${entry.integrationLabel} ${entry.serviceLabel}`.toLocaleLowerCase().includes(needle)) continue
    if (filter === 'connected' && !entry.configured || filter === 'disconnected' && entry.configured) continue
    const key = `${entry.integrationId}/${entry.serviceId}`
    if (!groups.has(key)) groups.set(key, { label: `${entry.integrationLabel} / ${entry.serviceLabel}`, entries: [] })
    groups.get(key).entries.push(entry)
  }
  const tabs = ['connections', 'usage']
  function onLogin(entry) { setOpened({ kind: 'login', entry, method: entry.authMethod }) }
  function onSaved() { setOpened(undefined); setNotice(true) }
  return <section className="dsh-pi-login dsh-pi-footer" aria-labelledby={`${tabId}-title`}>
    <div className="dsh-pi-toolbar"><h3 id={`${tabId}-title`}>{t('title')}</h3><Button variant="outline" onClick={() => { setNotice(false); setOpened({ kind: 'settings' }) }} disabled={state.status !== 'ready' || state.services.length === 0}>{t('addConnection')}</Button></div>
    <p className="dsh-pi-muted">{t('description')}</p>
    <div className="dsh-pi-tabs" role="tablist" aria-label={t('title')}>
      {tabs.map(value => <Button key={value} id={`${tabId}-${value}`} role="tab" aria-selected={tab === value} aria-controls={`${tabId}-panel`} tabIndex={tab === value ? 0 : -1} variant={tab === value ? 'outline' : 'ghost'} onClick={() => setTab(value)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault(); const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs[1] : tabs[1 - tabs.indexOf(value)]
        setTab(next); document.getElementById(`${tabId}-${next}`)?.focus()
      }}>{t(value === 'connections' ? 'connectionsTab' : 'usageTab')}</Button>)}
    </div>
    {notice ? <p role="status">{t('saved')}</p> : null}
    {state.error ? <p role="alert">{t('loadFailed')} <Button onClick={() => { void controller.refresh() }}>{t('retry')}</Button></p> : null}
    {state.status === 'loading' && state.entries.length === 0 ? <p role="status" className="dsh-pi-loading">{t('loading')}</p> : null}
    <div className="dsh-pi-fields dsh-pi-search"><Input aria-label={t('searchConnections')} placeholder={t('searchConnections')} icon={<IconSearchOutlineRegular size={16} />} value={search} onChange={event => setSearch(event.target.value)} />
      <Choice label={t('filterStatus')} value={filter} options={['all', 'connected', 'disconnected'].map(id => ({ id, label: t(`filter_${id}`) }))} onChange={setFilter} /></div>
    <div id={`${tabId}-panel`} role="tabpanel" aria-labelledby={`${tabId}-${tab}`}>
      {[...groups].map(([key, group], index) => <details className="dsh-pi-group" key={key} open={state.entries.length <= 8 || index === 0 || needle ? true : undefined}>
        <summary><span>{group.label}</span><span className="dsh-pi-muted">{group.entries.length}</span></summary>
        {group.entries.map(entry => <div className="dsh-pi-connection-row" key={entry.connectionId}>
          <div className="dsh-pi-row-label"><span>{entry.displayName}</span><div className="dsh-pi-row-meta"><span>{t(entry.authMethod === 'owner-managed' ? 'ownerManaged' : entry.authMethod === 'oauth' ? 'oauthShort' : 'apiKey')}</span>
            {entry.authStatus === 'owner-managed' ? <span>{t(`directory_${entry.directoryState ?? 'unavailable'}`)} · {entry.source ?? t('sourceUnknown')}</span> : <span className="dsh-pi-status"><StateDot state={entry.inFlight || entry.authStatus === 'updating' ? 'ongoing' : entry.configured ? 'done' : 'pending'} size={8} />{t(entry.inFlight || entry.authStatus === 'updating' ? 'busy' : entry.authStatus === 'unavailable' ? 'authUnavailable' : entry.authStatus === 'expired' ? 'authExpired' : entry.authStatus === 'verified' ? 'authVerified' : entry.configured ? 'connected' : 'notConnected')}</span>}
            {entry.enabled ? <span>{t(entry.executionKind === 'agent-session' ? 'agentSessionEnabled' : 'availableModels')}</span> : null}
            {entry.integrationId === 'meta-muse-code' && museModelName(entry, t) ? <span>{museModelName(entry, t)}</span> : null}</div></div>
          <div className="dsh-pi-row-actions">{tab === 'usage' ? entry.capabilities?.usage !== false ? <Button variant="outline" aria-label={`${t('usageTab')}: ${entry.displayName}`} onClick={() => setOpened({ kind: 'usage', entry })}>{t('usageTab')}</Button> : <span className="dsh-pi-muted">{t('usage_unsupported')}</span> : <>
            {entry.capabilities?.models !== false ? <Button variant="outline" aria-label={`${t('manageModels')}: ${entry.displayName}`} onClick={() => setOpened({ kind: 'models', entry })}>{t('manageModels')}</Button> : null}
            {entry.capabilities?.settings !== false ? <Button aria-label={`${t('connectionSettings')}: ${entry.displayName}`} onClick={() => { setNotice(false); setOpened({ kind: 'settings', entry }) }}>{t('connectionSettings')}</Button> : entry.settingsUrl && safeUrl(entry.settingsUrl) ? <a className="dsh-pi-link" href={safeUrl(entry.settingsUrl)} target="_blank" rel="noopener noreferrer">{t('externalSettings')}</a> : null}
          </>}</div>
        </div>)}
      </details>)}
      {state.status === 'ready' && groups.size === 0 && !state.error ? <p className="dsh-pi-muted">{t(state.entries.length ? 'noResults' : 'empty')}</p> : null}
    </div>
    {updates ? <UpdateUI controller={updates} t={t} /> : null}
    {opened?.kind === 'login' ? <LoginDialog {...opened} controller={controller} t={t} onClose={() => setOpened(undefined)} /> : null}
    {opened?.kind === 'models' ? opened.entry.integrationId === 'meta-muse-code' ? <MuseModelsDialog entry={opened.entry} controller={controller} t={t} onClose={() => setOpened(undefined)} /> : <ModelsDialog entry={opened.entry} controller={controller} t={t} onClose={() => setOpened(undefined)} /> : null}
    {opened?.kind === 'settings' ? <ConnectionDialog entry={opened.entry} state={state} controller={controller} t={t} onClose={() => setOpened(undefined)} onLogin={onLogin} onSaved={onSaved} /> : null}
    {opened?.kind === 'usage' ? <Modal open title={`${opened.entry.displayName} · ${t('usageTab')}`} closeLabel={t('close')} onClose={() => setOpened(undefined)} className="dsh-pi-login dsh-pi-connection-dialog" contentClassName="dsh-pi-modal-content" footer={<Button variant="outline" onClick={() => setOpened(undefined)}>{t('close')}</Button>}><UsagePanel entry={opened.entry} controller={controller} t={t} /></Modal> : null}
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
