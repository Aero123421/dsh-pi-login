import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile, readFile, rm, access, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { MuseCodeHostManager, museCodeEnvironment, museCodeCredentialKey, museCodeAuthDocument, resolveMuseBin } from '../src/muse-code-host.mjs'

const binding = (id = 'c-a') => ({ connectionId: id, credentialRecordId: id, credentialGeneration: 1,
  integrationId: 'meta-muse-code', serviceId: 'muse-code', routeId: `muse-${id}`, authMethod: 'oauth',
  profileKey: 'profile-A', generation: 1, profile: {}, displayName: id })
// CLI serialization observed in aonia's Muse 1.3.0 fixtures. Opaque fields
// stay in Host Credentials, never in our AccountState or connection RPC.
const document = id => ({ schema_version: 2, providers: { meta: { mechanism: 'oauth',
  access_token: `identity-${id}`, api_key: `key-${id}`, api_base_url: 'https://api.meta.ai/v1', user_email: `${id}@private.test` } } })
const code = expected => error => error?.code === expected

async function fixture(t, options = {}) {
  const work = join(process.cwd(), 'work')
  await mkdir(work, { recursive: true })
  const privateRoot = await mkdtemp(join(work, 'muse-host-tests-'))
  const records = new Map(), hosts = [], requests = [], sessionStores = new Map()
  let current = true
  const credentials = {
    async readRecord(key) { return structuredClone(records.get(key)) },
    async modifyRecord(key, mutate) { const next = await mutate(structuredClone(records.get(key))); records.set(key, next); return next },
  }
  // Shape served by the official Muse Code 1.4.7 CLI: hidden, absent until written.
  const modePath = 'contributor_mode_enabled'
  const openHost = async spec => {
    const config = join(spec.home, '.config', 'muse')
    let account = { state: 'loggedOut', credentialRequired: true }, mode, closed = false
    try { JSON.parse(await readFile(join(config, 'auth.json'), 'utf8')); account = { state: 'accountLogin', credentialRequired: true, label: 'Account' } } catch {}
    const listeners = new Set()
    const sessions = sessionStores.get(spec.dataRoot) ?? new Map()
    sessionStores.set(spec.dataRoot, sessions)
    const emit = (method, params) => { for (const listener of listeners) listener({ method, params }) }
    const sessionId = '0198f0aa-1111-7000-8000-000000000001'
    let turnCounter = 0
    const host = { spec, get closed() { return closed },
      onNotification(fn) { listeners.add(fn); return () => listeners.delete(fn) },
      async request(method, params) {
        requests.push({ method, params, home: spec.home })
        if (options.onRequest) await options.onRequest(method, params, spec)
        switch (method) {
          case 'settings/readSchema': return { schemaVersion: 1, keys: options.noMode ? {} : { [modePath]: { hidden: true, type: 'boolean' }, model: { type: 'string' } } }
          case 'settings/read': return { schemaVersion: 1, values: { 'tools.artifact.enabled': true, ...mode === undefined ? {} : { [modePath]: mode } } }
          case 'settings/writeValue':
            mode = options.refuseContributor && params.value ? false : params.value
            return { keyPath: params.keyPath, effectiveValue: mode }
          case 'account/read': return { ...account, access_token: 'must-not-return' }
          case 'account/loginStart': {
            if (!options.pendingLogin) queueMicrotask(async () => {
              await writeFile(join(config, 'auth.json'), JSON.stringify(document(spec.home)), { mode: 0o600 })
              account = { state: 'accountLogin', credentialRequired: true, label: 'Account' }
              mode = true // subscriber default must be reset after login
              for (const fn of listeners) fn({ method: 'account/loginCompleted', params: { outcome: 'granted' } })
            })
            return { verificationUrl: 'https://auth.meta.com/device?code=ABCD-EFGH', userCode: 'ABCD-EFGH' }
          }
          case 'account/loginCancel': return { cancelled: true }
          case 'model/list': return options.rawModels ?? { providerId: 'meta', profileId: null, source: 'providerCatalog', models: [
            { providerId: 'meta', profileId: null, modelId: 'muse-wonder-1.0', displayLabel: 'Muse Wonder',
              contextLimit: 1048576, outputLimit: null, variants: ['minimal', 'high', 'max'], isActive: false, isDefault: true },
            { providerId: 'meta', profileId: null, modelId: 'muse-wonder-full-1.0', displayLabel: 'Muse Wonder Full',
              contextLimit: 1048576, outputLimit: null, variants: ['minimal', 'high', 'max'], isActive: false, isDefault: false },
          ] }
          case 'usage/read': return options.rawUsage ?? { usage: { tier: 'fixture-tier', observedAtMs: 1_700_000_000_000,
            window: { usedPercent: 31, resetsAtMs: 1_700_001_000_000, windowDurationMins: 300 },
            weekly: { usedPercent: 52, resetsAtMs: 1_700_007_000_000 } } }
          case 'session/read': {
            const session = sessions.get(params.sessionId)
            assert.ok(session)
            return { session: session.value, history: params.excludeItems === false
              ? { mode: 'inline', items: session.items } : { mode: 'none', items: null } }
          }
          default: throw Object.assign(new Error('raw SDK secret error'), { code: -32601, kind: 'methodNotFound' })
        }
      },
      async command(method, params) {
        requests.push({ method, params, home: spec.home, contributor: mode })
        // Pin the actual official closed parameter vocabulary. A permissive
        // fake once accepted `ifBusy: reject`; this fixture must catch that.
        const fields = {
          'session/start': ['modelId', 'providerId', 'workspaceRoot', 'approvalMode'],
          'session/resume': ['sessionId', 'excludeItems'],
          'turn/start': ['sessionId', 'input', 'reasoningEffort', 'ifBusy'],
          'turn/cancel': ['sessionId', 'turnId'], 'turn/unqueue': ['sessionId', 'turnId'],
        }[method]
        assert.ok(fields)
        assert.ok(Object.keys(params).every(key => fields.includes(key)))
        if (params.ifBusy !== undefined) assert.ok(['queue', 'steer', 'replace'].includes(params.ifBusy))
        if (method === 'session/start') {
          assert.equal(params.approvalMode, 'denyUnmatched')
          assert.ok(['muse-wonder-1.0', 'muse-wonder-full-1.0'].includes(params.modelId))
          const value = { sessionId, modelId: params.modelId, providerId: params.providerId, activeTurnId: null }
          sessions.set(sessionId, { value, items: [] })
          return { session: value, viewCursor: 'opaque-cursor' }
        }
        if (method === 'session/resume') {
          assert.equal(params.excludeItems, false)
          const saved = sessions.get(params.sessionId)
          assert.ok(saved)
          return { session: saved.value, history: { mode: 'inline', items: saved.items }, viewCursor: 'opaque-cursor', pendingRequests: [] }
        }
        const saved = sessions.get(params.sessionId)
        assert.ok(saved)
        if (method === 'turn/start') {
          assert.ok(Array.isArray(params.input) && params.input.length === 1 && params.input[0].type === 'text')
          turnCounter++
          const turnId = `0198f0ab-1111-7000-8000-${String(turnCounter).padStart(12, '0')}`
          if (options.queuedTurn) {
            saved.value.activeTurnId = turnId
            return { commandId: turnId, turnId, status: 'accepted', disposition: 'queued', startedNewTurn: false }
          }
          const item = { itemId: `reply-${turnCounter}`, kind: 'agentMessage', turnId, status: 'completed', text: 'Fixture response' }
          const tool = { itemId: `tool-${turnCounter}`, kind: 'toolCall', turnId, status: 'completed', tool: 'fixture-tool', visibleOutput: 'Owned by Muse', api_key: 'must-not-return' }
          saved.items.push({ itemId: `user-${turnCounter}`, kind: 'userMessage', turnId, text: params.input[0].text }, tool, item)
          saved.value.activeTurnId = options.pendingTurn ? turnId : null
          queueMicrotask(() => {
            emit('item/started', { sessionId, item })
            emit('item/delta', { sessionId, itemId: item.itemId, delta: 'Fixture response', field: 'text' })
            if (!options.pendingTurn) {
              emit('item/completed', { sessionId, item: tool })
              emit('item/completed', { sessionId, item })
              emit('turn/completed', { sessionId, turnId, terminal: 'completed' })
            }
          })
          return { commandId: turnId, turnId, status: 'accepted', disposition: 'started', startedNewTurn: true }
        }
        saved.value.activeTurnId = null
        emit('turn/completed', { sessionId, turnId: params.turnId, terminal: 'cancelled' })
        return { turnId: params.turnId, status: 'accepted' }
      },
      async close() { closed = true; listeners.clear() },
    }
    hosts.push(host)
    return host
  }
  const manager = new MuseCodeHostManager({ credentials, privateRoot, openHost, isCurrent: () => current,
    environment: { PATH: '/usr/bin', META_API_KEY: 'ambient-wrong-key', HOME: '/ambient-wrong-home', MUSE_AUTH_PATH: '/wrong-auth.json', OPENAI_API_KEY: 'wrong-openai-key' } })
  t.after(async () => { await manager.dispose(); await rm(privateRoot, { recursive: true, force: true }) })
  return { manager, records, hosts, requests, privateRoot, credentials, set current(value) { current = value } }
}

test('the official CLI is found on PATH or in the installer default when the app has no shell PATH', async t => {
  const root = await mkdtemp(join(process.cwd(), 'work', 'muse-bin-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const onPath = join(root, 'path'), home = join(root, 'home')
  await mkdir(onPath, { recursive: true }); await mkdir(join(home, '.local', 'bin'), { recursive: true })
  await writeFile(join(home, '.local', 'bin', 'muse'), '#!/bin/sh\n', { mode: 0o755 })
  assert.equal(resolveMuseBin({ PATH: '/usr/bin:/bin' }, home, 'darwin'), join(home, '.local', 'bin', 'muse'))
  await writeFile(join(onPath, 'muse'), '#!/bin/sh\n', { mode: 0o755 })
  assert.equal(resolveMuseBin({ PATH: onPath }, home, 'linux'), join(onPath, 'muse'))
  assert.equal(resolveMuseBin({ PATH: '' }, join(root, 'nobody'), 'darwin'), 'muse')
  assert.equal(resolveMuseBin({ PATH: onPath }, home, 'win32'), 'muse')
})

test('Muse child homes, data roots and ambient credentials are isolated on every platform', () => {
  const env = museCodeEnvironment('/owned/temp', '/owned/data', { PATH: '/bin', META_API_KEY: 'wrong',
    MUSE_AUTH_PATH: '/wrong', XDG_CONFIG_HOME: '/wrong', HOME: '/wrong', AWS_ACCESS_KEY_ID: 'wrong' }, 'win32')
  assert.equal(env.HOME, '/owned/temp')
  assert.equal(env.XDG_DATA_HOME, '/owned/data')
  assert.equal(env.TBH_CREDENTIAL_BACKEND, 'file')
  assert.equal(env.TBH_DISABLE_TELEMETRY, '1')
  assert.ok(env.APPDATA.startsWith('/owned/temp'))
  assert.doesNotMatch(JSON.stringify(env), /wrong|META_API_KEY|MUSE_AUTH_PATH|AWS_ACCESS/)
})

test('official host-owned device OAuth commits only to independent Host Credentials and removes auth copies', async t => {
  const f = await fixture(t), notice = []
  const result = await f.manager.login(binding(), { notify: value => notice.push(value) })
  assert.equal(result.authorized, true)
  assert.equal(result.contributor, false)
  assert.equal(result.liveVerified, false)
  assert.equal(f.records.size, 1)
  assert.equal(f.records.get('dsh-muse-code/c-a').kind, 'grant')
  assert.equal(f.records.get('dsh-muse-code/c-a').payload.authDocument.providers.meta.mechanism, 'oauth')
  assert.equal(f.records.get('dsh-muse-code/c-a').payload.mode.enabled, false)
  assert.equal(notice[0].code, 'ABCD-EFGH')
  assert.ok(f.hosts[0].closed)
  await assert.rejects(access(f.hosts[0].spec.home))
  assert.doesNotMatch(JSON.stringify(result), /identity-|key-|access_token|user_email|private.test|must-not-return/)
  assert.deepEqual(f.requests.filter(request => request.method === 'account/loginStart').map(request => request.params), [{ type: 'deviceCode' }])
  assert.ok(f.requests.filter(request => request.method === 'settings/writeValue').every(request => request.params.value === false))
  assert.ok(!f.requests.some(request => request.method === 'turn/start'))
})

test('four model choices preserve native base ids and select Contributor without a separate switch or consent API', async t => {
  const f = await fixture(t)
  const connection = { ...binding(), museCode: { modelId: 'muse-wonder-1.0', contributorMode: false } }
  await f.manager.login(connection)
  const rows = (await f.manager.readModels(connection)).models
  assert.deepEqual(rows.map(row => row.id), ['muse-wonder-1.0', 'muse-wonder-1.0::contributor', 'muse-wonder-full-1.0', 'muse-wonder-full-1.0::contributor'])
  assert.deepEqual(rows.map(row => row.name), ['Wonder1', 'Wonder1 Contributor', 'Wonder Full', 'Wonder Full Contributor'])
  assert.deepEqual(rows.map(row => row.modelId), ['muse-wonder-1.0', 'muse-wonder-1.0', 'muse-wonder-full-1.0', 'muse-wonder-full-1.0'])
  assert.deepEqual(rows.map(row => row.contributor), [false, true, false, true])
  assert.equal(f.manager.setContributor, undefined)
  const choice = rows[3]
  const changed = await f.manager.configure(connection, { modelId: choice.modelId, contributorMode: choice.contributor })
  assert.deepEqual(changed, { museCode: { modelId: 'muse-wonder-full-1.0', contributorMode: true } })
  // Persistent choice only takes effect when root's settings CAS succeeds.
  assert.equal(f.records.get('dsh-muse-code/c-a').payload.mode.enabled, false)
  Object.assign(connection, changed)
  const view = await f.manager.read(connection)
  assert.equal(view.contributor, true)
  assert.equal(view.models.length, 4)
  assert.ok(view.models.every(model => model.runnable === false && model.sessionSupported === true && model.entitlement === 'unverified'))
  assert.equal(view.usage.sourceObservedAt, new Date(1_700_000_000_000).toISOString())
  assert.doesNotMatch(JSON.stringify(view), /identity-|api_key|user_email|must-not-return/)
  assert.ok(f.requests.filter(request => request.method === 'settings/writeValue').every(request => request.params.keyPath === 'contributor_mode_enabled'))
  Object.assign(connection, await f.manager.configure(connection, { modelId: rows[0].modelId, contributorMode: rows[0].contributor }))
  assert.equal((await f.manager.readModels(connection)).contributor, false)
  assert.doesNotMatch(JSON.stringify(f.records.get('dsh-muse-code/c-a').payload), /consent|Consent|timestamp|termsUrl/)
})

test('an unknown Contributor key or host refusal cannot silently enable a mode', async t => {
  const unknown = await fixture(t, { noMode: true })
  await assert.rejects(unknown.manager.login(binding()), code('muse-code-mode-unavailable'))
  assert.equal(unknown.records.size, 0)
  assert.ok(unknown.hosts[0].closed)
  const refused = await fixture(t, { refuseContributor: true })
  await refused.manager.login(binding())
  await assert.rejects(refused.manager.configure(binding(), { modelId: 'muse-wonder-1.0', contributorMode: true }), code('muse-code-mode-unavailable'))
  assert.equal(refused.records.get('dsh-muse-code/c-a').payload.mode.enabled, false)
})

test('host errors are reported as missing protocol only when the CLI lacks the method', async t => {
  const missing = await fixture(t, { onRequest: method => { if (method === 'settings/readSchema') throw Object.assign(new Error('raw'), { code: -32601, kind: 'experimentalRequired' }) } })
  await assert.rejects(missing.manager.login(binding()), code('muse-code-protocol-unsupported'))
  const failing = await fixture(t, { onRequest: method => { if (method === 'account/read') throw Object.assign(new Error('raw'), { code: -32603, kind: 'internal' }) } })
  await assert.rejects(failing.manager.login(binding()), code('muse-code-unavailable'))
})

test('missing Full and unknown native catalog rows cannot create local Full choices or alter the native catalog', async t => {
  const rawModels = { providerId: 'meta', profileId: null, source: 'providerCatalog', models: [
    { providerId: 'meta', profileId: null, modelId: 'muse-wonder-1.0', displayLabel: 'Native Wonder',
      contextLimit: 1048576, outputLimit: null, variants: ['minimal', 'max'], isActive: false, isDefault: true },
    { providerId: 'meta', profileId: null, modelId: 'fixture-unsupported', displayLabel: 'Native Other',
      contextLimit: null, outputLimit: null, isActive: false, isDefault: false },
  ] }
  const native = structuredClone(rawModels)
  const f = await fixture(t, { rawModels }), connection = binding()
  await f.manager.login(connection)
  const value = await f.manager.readModels(connection)
  assert.deepEqual(value.models.map(model => model.id), ['muse-wonder-1.0', 'muse-wonder-1.0::contributor'])
  assert.deepEqual(value.models.map(model => model.modelId), ['muse-wonder-1.0', 'muse-wonder-1.0'])
  assert.equal(value.diagnostics.length, 1)
  assert.equal(value.diagnostics[0].sessionSupported, false)
  assert.deepEqual(rawModels, native)
  await assert.rejects(f.manager.configure(connection, { modelId: 'muse-wonder-full-1.0', contributorMode: true }), code('muse-code-model-unavailable'))
  await assert.rejects(f.manager.configure(connection, { modelId: 'muse-wonder-1.0::contributor', contributorMode: true }), code('muse-code-model-unavailable'))
})

test('saved Contributor model selection survives restart and re-login without consent metadata or hidden Standard reset', async t => {
  const f = await fixture(t)
  const connection = { ...binding(), museCode: { modelId: 'muse-wonder-1.0', contributorMode: false } }
  await f.manager.login(connection)
  Object.assign(connection, await f.manager.configure(connection, { modelId: 'muse-wonder-full-1.0', contributorMode: true }))
  // The setting is authoritative even when a read has not copied its new
  // mode into the opaque credential snapshot before the host restarts.
  assert.equal(f.records.get(museCodeCredentialKey(connection)).payload.mode.enabled, false)
  await f.manager.dispose()
  const restarted = new MuseCodeHostManager({ credentials: f.credentials, privateRoot: f.privateRoot,
    openHost: f.manager.openHost, isCurrent: () => true, environment: {} })
  t.after(() => restarted.dispose())
  const current = { ...connection, generation: 99 }
  const models = await restarted.readModels(current)
  assert.equal(models.contributor, true)
  assert.deepEqual(current.museCode, { modelId: 'muse-wonder-full-1.0', contributorMode: true })
  const relogin = await restarted.login(current)
  assert.equal(relogin.contributor, true)
  assert.equal(f.records.get(museCodeCredentialKey(current)).payload.mode.enabled, true)
  assert.doesNotMatch(JSON.stringify(f.records.get(museCodeCredentialKey(current)).payload), /consent|Consent|timestamp|termsUrl/)
  const agent = await restarted.startAgentSession(current, { workspaceRoot: f.privateRoot })
  assert.equal(agent.state().modelId, 'muse-wonder-full-1.0')
  assert.equal(agent.state().contributor, true)
  const events = []
  for await (const event of agent.send('Full Contributor after restart')) events.push(event)
  assert.equal(events.at(-1).terminal, 'completed')
  const start = f.requests.filter(call => call.method === 'session/start').at(-1)
  assert.equal(start.params.modelId, 'muse-wonder-full-1.0')
  assert.equal(start.contributor, true)
  await agent.close()
})

test('two simultaneous Muse account logins have separate homes, data, scopes and credentials', async t => {
  const f = await fixture(t)
  await Promise.all([f.manager.login(binding('c-a')), f.manager.login(binding('c-b'))])
  assert.equal(f.records.size, 2)
  assert.notEqual(f.hosts[0].spec.home, f.hosts[1].spec.home)
  assert.notEqual(f.hosts[0].spec.dataRoot, f.hosts[1].spec.dataRoot)
  assert.notEqual(f.records.get('dsh-muse-code/c-a').payload.authDocument.providers.meta.access_token,
    f.records.get('dsh-muse-code/c-b').payload.authDocument.providers.meta.access_token)
  assert.ok(f.hosts.every(host => !Object.hasOwn(host.spec.env, 'META_API_KEY')))
})

test('cancellation ends login and removes temporary credentials without committing', async t => {
  const f = await fixture(t, { pendingLogin: true }), controller = new AbortController()
  let notified
  const notification = new Promise(resolve => { notified = resolve })
  const pending = f.manager.login(binding(), { signal: controller.signal, notify: notified })
  await notification
  controller.abort()
  await assert.rejects(pending, code('muse-code-connection-changed'))
  assert.equal(f.records.size, 0)
  assert.ok(f.hosts[0].closed)
  await assert.rejects(access(f.hosts[0].spec.home))
})

test('profile or account generation changes refuse a delayed CLI credential commit', async t => {
  const f = await fixture(t)
  f.credentials.modifyRecord = async (_key, mutate) => { f.current = false; return mutate(undefined) }
  await assert.rejects(f.manager.login(binding()), code('muse-code-connection-changed'))
  assert.equal(f.records.size, 0)
  assert.ok(f.hosts[0].closed)
})

test('keychain pointers, non-OAuth records, foreign endpoints and wrong integration never enter Muse', async t => {
  const f = await fixture(t)
  for (const value of [
    { ...document('fixture'), providers: { meta: { ...document('fixture').providers.meta, storage: 'keychain' } } },
    { ...document('fixture'), providers: { meta: { ...document('fixture').providers.meta, mechanism: 'api-key' } } },
    { ...document('fixture'), providers: { meta: { ...document('fixture').providers.meta, api_base_url: 'https://other.invalid/v1' } } },
  ]) assert.throws(() => museCodeAuthDocument(value), code('muse-code-login-failed'))
  await assert.rejects(f.manager.login({ ...binding(), integrationId: 'pi' }), code('muse-code-connection-changed'))
  await assert.rejects(f.manager.login({ ...binding(), profile: { baseURL: 'https://other.invalid' } }), code('muse-code-connection-changed'))
  assert.equal(f.hosts.length, 0)
  assert.equal(museCodeCredentialKey(binding()), 'dsh-muse-code/c-a')
})

test('both Contributor choices, Standard, and Full Contributor apply the selected mode to native session streams', async t => {
  const f = await fixture(t)
  const connection = { ...binding(), museCode: { modelId: 'muse-wonder-1.0', contributorMode: false } }
  await f.manager.login(connection)
  const rows = (await f.manager.readModels(connection)).models
  const selections = [rows[1], rows[3], rows[0], rows[3]]
  for (const row of selections) {
    const changes = await f.manager.configure(connection, { modelId: row.modelId, contributorMode: row.contributor })
    Object.assign(connection, changes) // Root persists this only after settings CAS.
    const modelId = row.modelId
    const agent = await f.manager.startAgentSession(connection, { workspaceRoot: f.privateRoot })
    assert.equal(agent.state().contributor, row.contributor)
    assert.equal(agent.state().modelId, modelId)
    assert.equal(agent.state().llmCompatible, false)
    const events = []
    for await (const event of agent.send('Fixture prompt', { reasoningEffort: 'max' })) events.push(event)
    assert.equal(events[0].type, 'started')
    assert.equal(events.find(event => event.type === 'text-delta').text, 'Fixture response')
    assert.equal(events.find(event => event.type === 'item' && event.item.kind === 'toolCall').item.tool, 'fixture-tool')
    assert.equal(events.at(-1).terminal, 'completed')
    assert.doesNotMatch(JSON.stringify(events), /api_key|must-not-return/)
    const history = await agent.history()
    assert.equal(history[0].text, 'Fixture prompt')
    assert.equal(history.at(-1).text, 'Fixture response')
    await assert.rejects(async () => { for await (const event of agent.send('No DSH tools', { tools: [] })) void event }, code('muse-code-llm-unsupported'))
    await agent.close()
  }
  assert.deepEqual(f.requests.filter(call => call.method === 'turn/start').map(call => call.contributor), [true, true, false, true])
  assert.deepEqual(f.requests.filter(call => call.method === 'session/start').map(call => call.params.modelId), ['muse-wonder-1.0', 'muse-wonder-full-1.0', 'muse-wonder-1.0', 'muse-wonder-full-1.0'])
  assert.ok(f.requests.filter(call => call.method === 'session/start').every(call => !call.params.modelId.includes('::contributor')))
  assert.ok(!f.requests.some(call => Object.hasOwn(call.params ?? {}, 'apiKey')))
})

test('native Muse sessions cancel the exact turn and resume their own history across a host restart', async t => {
  const f = await fixture(t, { pendingTurn: true })
  const connection = binding()
  await f.manager.login(connection)
  const agent = await f.manager.startAgentSession(connection, { modelId: 'muse-wonder-full-1.0', workspaceRoot: f.privateRoot })
  const stream = agent.send('Long fixture prompt')
  const first = await stream.next()
  assert.equal(first.value.type, 'started')
  const delta = await stream.next()
  assert.equal(delta.value.type, 'text-delta')
  const cancelled = await agent.cancel()
  assert.equal(cancelled.cancelled, true)
  assert.equal((await stream.next()).value.terminal, 'cancelled')
  assert.equal((await stream.next()).done, true)
  const id = agent.sessionId
  const dataRoot = f.hosts.at(-1).spec.dataRoot
  await agent.close()
  // Runtime lifecycle nonce changes on re-mount; persistent account identity
  // excludes that nonce while every active operation still checks it.
  const resumed = await f.manager.resumeAgentSession({ ...connection, generation: 2 }, { sessionId: id })
  assert.equal(f.hosts.at(-1).spec.dataRoot, dataRoot)
  assert.equal(resumed.state().modelId, 'muse-wonder-full-1.0')
  assert.equal((await resumed.history())[0].text, 'Long fixture prompt')
  const cancelCall = f.requests.find(call => call.method === 'turn/cancel')
  assert.equal(cancelCall.params.turnId, first.value.turnId)
  await resumed.close()
  assert.ok(f.hosts.every(host => host.closed))
})

test('Usage 429 and malformed observations cannot block independent model reads or agent setup', async t => {
  for (const options of [
    { onRequest: method => { if (method === 'usage/read') throw Object.assign(new Error('private quota response'), { status: 429 }) } },
    { rawUsage: { usage: { observedAtMs: 0, window: { usedPercent: -5 } } } },
  ]) {
    const f = await fixture(t, options), connection = binding()
    await f.manager.login(connection)
    const models = await f.manager.readModels(connection)
    assert.equal(models.models.length, 4)
    assert.ok(!f.requests.some(call => call.method === 'usage/read'))
    const both = await f.manager.read(connection)
    assert.equal(both.models.length, 4)
    assert.equal(both.usage.status, 'error')
    assert.deepEqual(both.usage.windows, [])
    assert.ok(both.usageError)
    assert.doesNotMatch(JSON.stringify(both), /private quota/)
    await assert.rejects(f.manager.readUsage(connection))
    const agent = await f.manager.startAgentSession(connection, { modelId: 'muse-wonder-full-1.0', workspaceRoot: f.privateRoot })
    assert.equal(agent.modelId, 'muse-wonder-full-1.0')
    await agent.close()
  }
})

test('malformed catalog cannot block independent Account Usage or fabricate selectable models', async t => {
  const f = await fixture(t, { rawModels: { models: [{ modelId: 'muse-wonder-full-1.0' }] } }), connection = binding()
  await f.manager.login(connection)
  const usage = await f.manager.readUsage(connection)
  assert.equal(usage.status, 'available')
  assert.equal(usage.windows[0].usedPercent, 31)
  assert.ok(!f.requests.some(call => call.method === 'model/list'))
  const both = await f.manager.read(connection)
  assert.deepEqual(both.models, [])
  assert.ok(both.modelsError)
  assert.equal(both.usage.status, 'available')
  await assert.rejects(f.manager.readModels(connection), code('muse-code-observation-invalid'))
})

test('disabled Muse connections retain login/read access, stop new turns, and preserve a turn already in flight', async t => {
  const f = await fixture(t), connection = { ...binding(), enabled: false }
  await f.manager.login(connection)
  assert.equal((await f.manager.readModels(connection)).models.length, 4)
  await assert.rejects(f.manager.startAgentSession(connection, { modelId: 'muse-wonder-1.0', workspaceRoot: f.privateRoot }), code('muse-code-connection-disabled'))
  let enabled = true
  f.manager.canExecute = () => enabled
  const agent = await f.manager.startAgentSession({ ...connection, enabled: true }, { modelId: 'muse-wonder-1.0', workspaceRoot: f.privateRoot })
  const stream = agent.send('Already submitted')
  assert.equal((await stream.next()).value.type, 'started')
  enabled = false
  const remainder = []
  for await (const event of stream) remainder.push(event)
  assert.equal(remainder.at(-1).terminal, 'completed')
  await assert.rejects(async () => { for await (const event of agent.send('New turn')) void event }, code('muse-code-connection-disabled'))
  assert.equal(f.requests.filter(call => call.method === 'turn/start').length, 1)
  await agent.close()
})

test('ten concurrent native model and Usage readers share one Muse process and one query of each kind', async t => {
  let release, started, readCount = 0
  const gate = new Promise(resolve => { release = resolve })
  const reading = new Promise(resolve => { started = resolve })
  const f = await fixture(t, { onRequest: async method => {
    if (['model/list', 'usage/read'].includes(method)) {
      if (++readCount === 2) started()
      await gate
    }
  } })
  await f.manager.login(binding())
  const before = f.hosts.length
  const tasks = Array.from({ length: 10 }, (_, index) => index % 2 ? f.manager.readUsage(binding()) : f.manager.readModels(binding()))
  await reading
  assert.equal(f.hosts.length - before, 1)
  assert.equal(readCount, 2)
  release()
  const values = await Promise.all(tasks)
  assert.ok(values.filter((_, index) => index % 2).every(value => value.status === 'available'))
  assert.ok(values.filter((_, index) => !(index % 2)).every(value => value.models.length === 4))
  assert.ok(f.hosts.at(-1).closed)
  await assert.rejects(access(f.hosts.at(-1).spec.home))
})

test('one read consumer can abort without closing another consumer or its shared host', async t => {
  let release, started
  const gate = new Promise(resolve => { release = resolve })
  const reading = new Promise(resolve => { started = resolve })
  const f = await fixture(t, { onRequest: async method => { if (method === 'model/list') { started(); await gate } } })
  await f.manager.login(binding())
  const controller = new AbortController()
  const first = f.manager.readModels(binding(), { signal: controller.signal })
  const second = f.manager.readModels(binding())
  await reading
  controller.abort()
  await assert.rejects(first, code('muse-code-connection-changed'))
  assert.equal(f.hosts.at(-1).closed, false)
  release()
  assert.equal((await second).models.length, 4)
  assert.equal(f.hosts.at(-1).closed, true)
})

test('Usage reads on a native agent reuse its host, tolerate failures, and cannot alter its mode or execution', async t => {
  let failUsage = false
  const f = await fixture(t, { onRequest: method => { if (method === 'usage/read' && failUsage) throw new Error('fixture usage failure') } })
  const connection = binding()
  await f.manager.login(connection)
  const agent = await f.manager.startAgentSession(connection, { modelId: 'muse-wonder-full-1.0', workspaceRoot: f.privateRoot })
  const hosts = f.hosts.length
  assert.equal((await f.manager.readUsage(connection)).status, 'available')
  failUsage = true
  await assert.rejects(f.manager.readUsage(connection))
  assert.equal((await f.manager.readModels(connection)).models.length, 4)
  assert.equal(f.hosts.length, hosts)
  assert.equal(f.hosts.at(-1).closed, false)
  await assert.rejects(f.manager.configure(connection, { contributorMode: true }), code('muse-code-busy'))
  const events = []
  for await (const event of agent.send('Independent agent turn')) events.push(event)
  assert.equal(events.at(-1).terminal, 'completed')
  assert.equal(agent.state().contributor, false)
  await agent.close()
  assert.equal(f.hosts.at(-1).closed, true)
})

test('an accepted queued native turn is cancelled exactly once before busy is returned, with no retry or later model call', async t => {
  const f = await fixture(t, { queuedTurn: true }), connection = binding()
  await f.manager.login(connection)
  const agent = await f.manager.startAgentSession(connection, { modelId: 'muse-wonder-full-1.0', workspaceRoot: f.privateRoot })
  await assert.rejects(async () => { for await (const event of agent.send('Queued prompt')) void event }, code('muse-code-busy'))
  const starts = f.requests.filter(call => call.method === 'turn/start')
  const cancels = f.requests.filter(call => call.method === 'turn/cancel')
  assert.equal(starts.length, 1)
  assert.equal(cancels.length, 1)
  assert.equal(cancels[0].params.sessionId, agent.sessionId)
  assert.equal(cancels[0].params.turnId, '0198f0ab-1111-7000-8000-000000000001')
  assert.equal(agent.state().activeTurnId, undefined)
  assert.deepEqual(await agent.history(), [])
  await agent.close()
  assert.equal(f.requests.filter(call => call.method === 'turn/cancel').length, 1)
  assert.equal(f.requests.filter(call => call.method === 'turn/start').length, 1)
})
