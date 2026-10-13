import { chromium, webkit } from 'playwright'
import { createServer } from 'node:http'
import { readFile, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'
import { compileOfficial } from './upstream.mjs'
import { getBuiltinModels } from '@earendil-works/pi-ai/providers/all'
import { modelChoices, fastModelId } from '../src/runtime/fast.ts'

const artifactDir = process.env.DSH_TEST_ARTIFACT_DIR ?? 'work/contributor-model-review'
const artifact = name => join(artifactDir, name)
await mkdir(artifactDir, { recursive: true })
await compileOfficial('scripts/browser-fixture.jsx', '.cache/browser-fixture.js', 'browser')
await compileOfficial('.cache/host-entry.ts', '.cache/official-host.mjs')
const { Context, AuthorizationService, MemoryCredentials, HostConnectionService, BrowserAuth, PiPlugin: host } = await import(pathToFileURL(resolve('.cache/official-host.mjs')).href)
const { IntegrationRegistry, ConnectionManager } = host
const ctx = new Context()
await ctx.plugin(MemoryCredentials); await ctx.plugin(AuthorizationService)
const auth = await BrowserAuth.create(ctx, ctx.credentials, 30)
await ctx.plugin(pluginCtx => { new HostConnectionService(pluginCtx, [], auth) })
const capabilities = { auth: true, models: true, usage: true, settings: true }
const services = [
 { serviceId: 'openai-codex', label: 'OpenAI Codex', methods: [{ id: 'oauth', label: 'OAuth' }, { id: 'api-key', label: 'API key' }], capabilities },
 { serviceId: 'meta', label: 'Meta Model API（Pi経由）', methods: [{ id: 'oauth', label: 'OAuth' }], capabilities },
 { serviceId: 'example', label: 'Example API', methods: [{ id: 'api-key', label: 'API key' }], capabilities },
]
const registry = new IntegrationRegistry('browser-profile')
registry.register({ integrationId: 'pi', label: 'Pi', source: 'internal', listServices: () => services, listConnections: () => [] })
const fixture = (serviceId, displayName, method, record, enabled = false) => ({ integrationId: 'pi', serviceId, routeId: `pi-${record}`, displayName, authMethod: method, credentialRecordId: record, credentialGeneration: 0, enabled, profile: {} })
let revision = 7
let settingsValue = { connections: {
 'c-personal': fixture('openai-codex', '個人Pro', 'oauth', 'openai-codex'),
 'c-company': fixture('openai-codex', '会社API', 'api-key', 'company-key', true),
 'c-meta': fixture('meta', 'Muse個人', 'oauth', 'meta', true),
 'c-example': fixture('example', '検証API', 'api-key', 'example', true),
 'c-muse-code': { integrationId: 'meta-muse-code', serviceId: 'muse-code', routeId: 'muse-c-muse-code', displayName: 'Muse Code個人', authMethod: 'oauth', credentialRecordId: 'c-muse-code', credentialGeneration: 0, enabled: false, profile: {}, museCode: { contributorMode: false, modelId: 'muse-wonder-1.0' } },
}, connectionMigrationVersion: 1 }
const writes = []
const settings = {
 describe: () => [{ ns: 'dsh-pi-login', value: structuredClone(settingsValue), revision, writable: true }],
 mutate: async (ns, operations, expected) => {
  assert.equal(ns, 'dsh-pi-login'); assert.equal(expected, revision); writes.push(operations); revision++
  for (const operation of operations) {
   let parent = settingsValue
   for (const key of operation.path.slice(0, -1)) parent = parent[key] ??= {}
   const key = operation.path.at(-1)
   if (operation.op === 'unset') delete parent[key]
   else parent[key] = structuredClone(operation.value)
  }
 },
}
ctx.provide('settings', settings)
await ctx.credentials.modifyRecord('llm-pi-ai/company-key', () => ({ kind: 'api-key', key: 'fixture-private-company' }))
await ctx.credentials.modifyRecord('llm-pi-ai/meta', () => ({ kind: 'grant', payload: { token: 'fixture-meta' } }))
await ctx.credentials.modifyRecord('llm-pi-ai/example', () => ({ kind: 'api-key', key: 'fixture-example' }))
const manager = new ConnectionManager({ settings, credentials: ctx.credentials, registry })
const museFlows = new Map()
let museLoginCounter = 0
const museOwner = host.createMuseCodeOwner({ ctx, connections: manager })
registry.register(museOwner)
// Muse Code signs in through Pi's Meta device flow; this fixture stands in for the SDK.
function syncMuseFlows() {
 for (const [id, flow] of museFlows) {
  const current = manager.raw()[id]
  if (!current || flow.identity !== JSON.stringify([current.credentialRecordId, current.credentialGeneration, current.displayName])) { flow.dispose(); museFlows.delete(id) }
 }
 for (const [id, connection] of Object.entries(manager.raw())) {
  if (connection.integrationId !== 'meta-muse-code' || museFlows.has(id)) continue
  const dispose = ctx.authorization.registerFlow({ key: `llm-pi-ai/${connection.credentialRecordId}`, label: connection.displayName,
   methods: [{ id: 'oauth', label: 'Sign in with Meta' }], async run(session) {
    session.notify({ message: 'Enter this code on the verification page to finish signing in.', url: 'https://auth.meta.com/oauth/device/?code=ABCD-EFGH', code: 'ABCD-EFGH' })
    await new Promise(resolve => setTimeout(resolve, 1100))
    museLoginCounter++
    await session.commit({ kind: 'grant', payload: { type: 'oauth', refresh: `private-muse-identity-${museLoginCounter}`, access: `private-muse-key-${museLoginCounter}`, expires: Date.now() + 3600000 } })
   } })
  museFlows.set(id, { identity: JSON.stringify([connection.credentialRecordId, connection.credentialGeneration, connection.displayName]), dispose })
 }
}
manager.onChange = syncMuseFlows
manager.changed()

ctx.authorization.registerFlow({ key: 'llm-pi-ai/openai-codex', label: 'OpenAI Codex', methods: [{ id: 'oauth', label: 'OAuth' }], async run(session) {
 session.notify({ message: 'ブラウザで認証してください。', url: 'https://accounts.example/authorize', code: 'DSH-TEST' })
 const token = await session.prompt({ kind: 'text', message: '認証コードを入力' })
 await session.commit({ kind: 'grant', payload: { token } })
} })
const model = getBuiltinModels('openai-codex').find(model => model.id === 'gpt-6.1-sol')
const fast = fastModelId(model.id)
let metaRefreshed = false, metaRefreshFails = false, exampleRefreshed = false, museLoaded = false, usageCalls = 0, usageStatus = 'available'
const full = 'muse-wonder-full-1.0'
const catalogs = new host.ProviderCatalogs({
 meta: {
  session: { refresh: async () => { if (metaRefreshFails) throw Object.assign(new Error('private-provider-detail'), { code: 'fixture-key-override' }); metaRefreshed = true } },
  presentation: () => ({ ...(metaRefreshed ? { status: { message: 'metaSubscriptionActive', detail: 'Maximum Usage' } } : {}), notes: ['metaReloadHint'] }),
  errorCodes: { 'fixture-key-override': 'catalog-key-override' }, errors: { 'catalog-key-override': 'metaKeyOverride' },
 },
 example: { session: { refresh: async () => { exampleRefreshed = true } } },
 'muse-code': { session: { refresh: async () => { museLoaded = true } }, presentation: () => ({ notes: museLoaded ? [] : ['museCatalogEmpty'] }) },
})
const plugin = ctx.plugin({ inject: ['authorization', 'credentials', 'connection', 'settings'], apply: ctx => host.applyLoginUI(ctx, {
 connections: manager, registry, syncFlows: syncMuseFlows, catalogsFor: () => catalogs,
 usage: { get: async connection => {
  usageCalls++
  return { integrationId: connection.integrationId, serviceId: connection.serviceId, connectionId: connection.connectionId, source: 'internal-http', sourceObservedAt: '2026-10-13T12:00:00.000Z', checkedAt: '2026-10-13T12:01:00.000Z', status: usageStatus, ...(usageStatus === 'rate-limited' ? { retryAt: '2099-01-01T00:00:00.000Z' } : {}), windows: [
   { id: 'primary', scope: 'account', usedPercent: 42, resetsAt: '2026-10-13T17:00:00.000Z', windowSeconds: 18000 },
   { id: 'secondary', scope: 'account', usedPercent: null, quotaState: 'unlimited', resetsAt: null, windowSeconds: null },
  ] }
 } },
 catalog: (provider, profile) => provider === 'meta' ? [
  { id: 'muse-spark-1.3', name: 'Muse Spark 1.3', enabled: !profile.disabledModels?.includes('muse-spark-1.3') },
  ...(metaRefreshed ? [{ id: full, name: 'Muse Wonder Full', discovered: true, capabilityUnverified: true, enabled: profile.enabledDiscoveredModels?.includes(full) === true }] : []),
 ] : provider === 'muse-code' ? (museLoaded ? [['muse-wonder-1.0', 'Muse Wonder'], [full, 'Muse Wonder Full']] : []).flatMap(([id, name]) => [
  { id, name, enabled: !profile.disabledModels?.includes(id) },
  { id: `${id}::contributor`, name: `${name} Contributor`, contributor: true, enabled: profile.enabledContributorModels?.includes(`${id}::contributor`) === true },
 ]) : provider === 'example' ? [
  { id: 'example-base', name: 'Example Base', enabled: true },
  ...(exampleRefreshed ? [{ id: 'example-new', name: 'Example New', discovered: true, enabled: profile.enabledDiscoveredModels?.includes('example-new') === true }] : []),
 ] : modelChoices(provider, [model], profile),
}) })
await plugin.await()
const handler = ctx.connection.createSharedFetchHandler('/api')
const files = new Map([
 ['/fixture.js', resolve('.cache/browser-fixture.js')], ['/login.js', resolve('dist/client.js')],
 ['/base.css', resolve('.cache/upstream/packages/client/ui-theme/src/styles/base.css')], ['/tokens.css', resolve('.cache/upstream/packages/client/ui-theme/src/styles/design-platform.css')],
 ['/effects.css', resolve('.cache/upstream/packages/client/ui-theme/src/styles/gradient-shadow-text.css')],
])
const server = createServer(async (req, res) => {
 try {
  const url = new URL(req.url, 'http://127.0.0.1')
  if (url.pathname.startsWith('/api/')) {
   const admission = ctx.connection.admit(req)
   if ('rejection' in admission) { res.writeHead(admission.rejection); res.end(); return }
   const chunks = []; for await (const chunk of req) chunks.push(chunk)
   const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, body: Buffer.concat(chunks) })
   const result = await handler.fetch(request)
   res.writeHead(result.status, Object.fromEntries(result.headers)); res.end(Buffer.from(await result.arrayBuffer())); return
  }
  if (files.has(url.pathname)) { res.setHeader('content-type', url.pathname.endsWith('.css') ? 'text/css' : 'text/javascript'); res.end(await readFile(files.get(url.pathname))); return }
  if (!auth.authorizeIndex(req, res)) return
  res.setHeader('content-type', 'text/html'); res.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pi login test fixture</title><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/base.css"><link rel="stylesheet" href="/effects.css"><style>body{margin:0;background:var(--dsw-alias-bg-layer-1)}</style></head><body><div id="app"></div><script src="/fixture.js"></script><script src="/login.js"></script><script>mountPlugins()</script></body></html>')
 } catch { res.writeHead(500); res.end('test fixture failed') }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}/`
let browser
try {
 for (const method of ['connection-list', 'connection-create', 'usage', 'refresh-models']) {
  assert.equal((await fetch(new URL(`api/dsh-pi-login/${method}`, base), { method: 'POST' })).status, 401)
  assert.equal((await fetch(new URL(`api/dsh-pi-login/${method}`, base), { method: 'POST', headers: { origin: 'https://untrusted.example' } })).status, 403)
 }
 const options = { headless: true }
 if (process.env.DSH_TEST_BROWSER !== 'webkit' && process.env.DSH_TEST_CHROMIUM) options.executablePath = process.env.DSH_TEST_CHROMIUM
 browser = await (process.env.DSH_TEST_BROWSER === 'webkit' ? webkit : chromium).launch(options)
 const page = await browser.newPage({ viewport: { width: 1000, height: 900 } })
 await page.emulateMedia({ reducedMotion: 'reduce' })
 const errors = [], consoleErrors = []
 page.on('pageerror', error => errors.push(error.message))
 page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
 page.setDefaultTimeout(10000)
 await page.goto(ctx.connection.authenticatedUrl(base))
 assert.ok(page.url().startsWith(base)); assert.equal(await page.title(), 'Pi login test fixture')
 await page.getByRole('heading', { name: 'AI接続', exact: true }).waitFor()
 await page.getByText('個人Pro', { exact: true }).waitFor()
 assert.equal(await page.locator('vite-error-overlay, #webpack-dev-server-client-overlay').count(), 0)
 assert.equal(await page.locator('.dsh-pi-card').count(), 0)
 assert.equal(await page.getByText(/^Piプラグイン/).count(), 1)
 assert.equal(await page.getByRole('tab').count(), 0)
 assert.equal(usageCalls, 0)
 for (const width of [390, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  for (const theme of ['light', 'dark']) {
   await page.evaluate(dark => document.body.toggleAttribute('data-ds-dark-theme', dark), theme === 'dark')
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
   const contrast = await page.evaluate(() => {
    const luminance = color => {
     const channels = color.match(/[\d.]+/g).slice(0, 3).map(value => {
      const channel = Number(value) / 255
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
     })
     return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
    }
    const background = luminance(getComputedStyle(document.body).backgroundColor)
    return ['.dsh-pi-footer h3', '.dsh-pi-footer .dsh-pi-muted'].map(selector => {
     const foreground = luminance(getComputedStyle(document.querySelector(selector)).color)
     return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
    })
   })
   assert.ok(contrast.every(value => value >= 4.5), `Text contrast below AA at ${width}/${theme}: ${contrast}`)
   const addTarget = await page.getByRole('button', { name: '接続を追加', exact: true }).boundingBox()
   // WCAG 2.2 target size; touch screens get 44px via pointer: coarse.
   assert.ok(addTarget.width >= 24 && addTarget.height >= 24)
   await page.screenshot({ path: artifact(`connections-${width}-${theme}.png`), fullPage: true })
  }
 }
 await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))
 await page.setViewportSize({ width: 1000, height: 900 })
 const settingsButton = name => page.getByRole('button', { name: `接続設定: ${name}`, exact: true })
 const modelsButton = name => page.getByRole('button', { name: `モデルを管理: ${name}`, exact: true })
 const row = name => page.locator('.dsh-pi-connection-row').filter({ has: settingsButton(name) })
 // A signed-out OAuth row offers sign-in directly; signing in turns the connection on.
 await row('個人Pro').getByRole('button', { name: 'ログイン', exact: true }).click()
 await page.getByRole('link', { name: 'ブラウザで続ける' }).waitFor()
 await page.getByLabel('認証コードを入力').fill('browser-fixture-secret')
 await page.getByRole('button', { name: '続ける', exact: true }).click()
 assert.equal(await page.getByText('browser-fixture-secret', { exact: true }).count(), 0)
 await page.getByText('ログインしました。この接続を使えます。', { exact: true }).waitFor()
 await page.getByRole('button', { name: 'モデルを選ぶ', exact: true }).waitFor()
 await page.keyboard.press('Escape')
 await page.getByRole('dialog').waitFor({ state: 'hidden' })
 assert.equal(settingsValue.connections['c-personal'].enabled, true)
 // Model selection is scoped to one connection and preserves the other account.
 await modelsButton('個人Pro').click()
 const modelSwitch = page.getByRole('switch', { name: 'モデルを使う: GPT-6.1 Sol', exact: true })
 await modelSwitch.waitFor(); await modelSwitch.click()
 await page.waitForFunction(() => (element => element?.getAttribute('aria-checked') === 'false' && !element.disabled)(document.querySelector('[aria-label="モデルを使う: GPT-6.1 Sol"]')))
 await page.getByRole('switch', { name: 'モデルを使う: GPT-6.1 Sol Fast', exact: true }).click()
 await page.waitForFunction(() => (element => element?.getAttribute('aria-checked') === 'true' && !element.disabled)(document.querySelector('[aria-label="モデルを使う: GPT-6.1 Sol Fast"]')))
 assert.deepEqual(settingsValue.connections['c-personal'].profile.disabledModels, [model.id])
 assert.deepEqual(settingsValue.connections['c-personal'].profile.enabledFastModels, [fast])
 assert.equal(settingsValue.connections['c-company'].profile.disabledModels, undefined)
 await page.screenshot({ path: artifact('models-desktop.png') })
 await page.keyboard.press('Escape')
 await page.getByRole('dialog').waitFor({ state: 'hidden' })
 assert.equal(await modelsButton('個人Pro').evaluate(element => element === document.activeElement), true)
 await page.screenshot({ path: artifact('keyboard-return-focus.png') })
 // Refresh retains a prior catalog on a provider failure.
 await modelsButton('Muse個人').click()
 await page.getByRole('button', { name: 'モデル一覧を更新', exact: true }).click()
 await page.getByText('Muse契約は有効です · Maximum Usage', { exact: true }).waitFor()
 const fullSwitch = page.getByRole('switch', { name: 'モデルを使う: Muse Wonder Full', exact: true })
 assert.equal(await fullSwitch.getAttribute('aria-checked'), 'false')
 await fullSwitch.click()
 await page.waitForFunction(() => (element => element?.getAttribute('aria-checked') === 'true' && !element.disabled)(document.querySelector('[aria-label="モデルを使う: Muse Wonder Full"]')))
 assert.deepEqual(settingsValue.connections['c-meta'].profile.enabledDiscoveredModels, [full])
 metaRefreshFails = true
 await page.getByRole('button', { name: 'モデル一覧を更新', exact: true }).click()
 await page.getByRole('alert').filter({ hasText: 'APIキー参照がMuseログインより優先されています' }).waitFor()
 assert.equal(await fullSwitch.getAttribute('aria-checked'), 'true')
 assert.equal(await page.getByText('private-provider-detail', { exact: true }).count(), 0)
 await page.keyboard.press('Escape')
 // API credentials are write-only; create, rename, duplicate and confirm deletion.
 await page.getByRole('button', { name: '接続を追加', exact: true }).click()
 await page.getByRole('button', { name: 'サービス', exact: true }).click()
 await page.getByRole('menuitem', { name: 'Example API', exact: true }).click()
 await page.getByLabel('接続名', { exact: true }).fill('追加API')
 const keyInput = page.getByLabel('APIキー', { exact: true })
 const masked = () => keyInput.evaluate(element => element.type === 'password' || getComputedStyle(element).webkitTextSecurity === 'disc')
 assert.equal(await masked(), true)
 // No password-type field, so browsers do not offer saved passwords for the connection name.
 assert.equal(await page.getByRole('dialog').locator('input[type="password"]').count(), 0)
 await keyInput.fill('new-private-fixture-key')
 await page.getByRole('button', { name: '入力を表示', exact: true }).click()
 assert.equal(await masked(), false)
 await page.getByRole('button', { name: '入力を隠す', exact: true }).click()
 await page.getByRole('button', { name: '追加', exact: true }).click()
 await page.getByText('接続設定を保存しました。', { exact: true }).waitFor()
 // The row switch turns a connection off and on without opening settings.
 const addedSwitch = page.getByRole('switch', { name: 'この接続を使う: 追加API', exact: true })
 assert.equal(await addedSwitch.getAttribute('aria-checked'), 'true')
 await addedSwitch.click()
 await page.waitForFunction(() => document.querySelector('[aria-label="この接続を使う: 追加API"]')?.getAttribute('aria-checked') === 'false')
 assert.equal(Object.values(settingsValue.connections).find(entry => entry.displayName === '追加API').enabled, false)
 await addedSwitch.click()
 await page.waitForFunction(() => document.querySelector('[aria-label="この接続を使う: 追加API"]')?.getAttribute('aria-checked') === 'true')
 await settingsButton('追加API').click()
 assert.equal(await page.getByLabel('APIキー', { exact: true }).inputValue(), '')
 await page.getByLabel('接続名', { exact: true }).fill('追加API改')
 await page.getByRole('button', { name: '保存', exact: true }).click()
 await settingsButton('追加API改').click()
 await page.getByRole('button', { name: '設定を複製', exact: true }).click()
 await settingsButton('追加API改 コピー').click()
 const copied = Object.values(settingsValue.connections).find(entry => entry.displayName === '追加API改 コピー')
 assert.equal(copied.enabled, false)
 assert.equal((await ctx.credentials.describeRecord(`llm-pi-ai/${copied.credentialRecordId}`)).configured, false)
 await page.getByRole('button', { name: '接続を削除', exact: true }).click()
 await page.getByText('この接続と保存済みの認証情報を削除しますか？この接続のモデルは利用できなくなります。', { exact: true }).waitFor()
 await page.getByRole('button', { name: 'この接続を削除する', exact: true }).click()
 await settingsButton('追加API改 コピー').waitFor({ state: 'hidden' })
 assert.equal(await page.getByText('new-private-fixture-key', { exact: true }).count(), 0)
 // A custom origin requires Host trust and gives a specific actionable error.
 await settingsButton('追加API改').click()
 await page.getByText('詳細設定', { exact: true }).click()
 await page.getByLabel('接続先URL（任意）', { exact: true }).fill('https://untrusted.example/v1')
 await page.getByRole('button', { name: '保存', exact: true }).click()
 await page.getByText('この接続先はホストで許可されていません。ホストの許可リストに追加してから保存してください。', { exact: true }).waitFor()
 await page.keyboard.press('Escape')
 // Muse Code signs in with Meta's device code and lists its own catalog.
 assert.equal(await modelsButton('Muse Code個人').count(), 0)
 await row('Muse Code個人').getByRole('button', { name: 'ログイン', exact: true }).click()
 await page.getByRole('link', { name: 'ブラウザで続ける', exact: true }).waitFor()
 await page.getByText('ABCD-EFGH', { exact: true }).waitFor()
 await page.getByText('ログインしました。この接続を使えます。', { exact: true }).waitFor()
 await page.keyboard.press('Escape')
 assert.equal(settingsValue.connections['c-muse-code'].enabled, true)
 assert.equal((await ctx.credentials.describeRecord('llm-pi-ai/c-muse-code')).configured, true)
 await modelsButton('Muse Code個人').click()
 await page.getByText('このアカウントのMuse Codeのモデルを読み込みます。Contributor版は最初はオフです。', { exact: true }).waitFor()
 await page.getByRole('button', { name: 'モデル一覧を更新', exact: true }).click()
 const contributorSwitch = page.getByRole('switch', { name: 'モデルを使う: Muse Wonder Full Contributor', exact: true })
 await contributorSwitch.waitFor()
 assert.equal(await page.getByRole('dialog').getByRole('switch').count(), 4)
 assert.equal(await page.getByRole('switch', { name: 'モデルを使う: Muse Wonder', exact: true }).getAttribute('aria-checked'), 'true')
 assert.equal(await contributorSwitch.getAttribute('aria-checked'), 'false')
 await page.getByText(/^Contributor版は、利用枠が増える代わりに/).waitFor()
 await contributorSwitch.click()
 await page.waitForFunction(() => (element => element?.getAttribute('aria-checked') === 'true' && !element.disabled)(document.querySelector('[aria-label="モデルを使う: Muse Wonder Full Contributor"]')))
 assert.deepEqual(settingsValue.connections['c-muse-code'].profile.enabledContributorModels, [`${full}::contributor`])
 for (const width of [390, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  for (const theme of ['light', 'dark']) {
   await page.evaluate(dark => document.body.toggleAttribute('data-ds-dark-theme', dark), theme === 'dark')
   await page.screenshot({ path: artifact(`muse-models-${width}-${theme}.png`), fullPage: false })
  }
 }
 await page.setViewportSize({ width: 390, height: 760 })
 const museDialog = await page.getByRole('dialog').boundingBox()
 assert.ok(museDialog.y >= 24 && museDialog.y + museDialog.height <= 736)
 await page.screenshot({ path: artifact('muse-models-mobile.png') })
 assert.doesNotMatch(await page.locator('body').innerText(), /private-muse-/)
 await page.keyboard.press('Escape')
 await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))
 await page.setViewportSize({ width: 1000, height: 900 })
 await page.getByRole('button', { name: '接続を追加', exact: true }).click()
 await page.getByRole('button', { name: 'サービス', exact: true }).click()
 await page.getByRole('menuitem', { name: 'Muse Code', exact: true }).click()
 assert.equal(await page.getByLabel('APIキー', { exact: true }).count(), 0)
 await page.getByLabel('接続名', { exact: true }).fill('Muse Code会社')
 await page.getByRole('button', { name: '追加してログイン', exact: true }).click()
 await page.getByRole('link', { name: 'ブラウザで続ける', exact: true }).waitFor()
 await page.getByText('ログインしました。この接続を使えます。', { exact: true }).waitFor()
 await page.keyboard.press('Escape')
 const secondMuse = Object.values(settingsValue.connections).find(connection => connection.displayName === 'Muse Code会社')
 assert.equal(secondMuse.enabled, true)
 const firstMuseRecord = await ctx.credentials.readRecord('llm-pi-ai/c-muse-code')
 const secondMuseRecord = await ctx.credentials.readRecord(`llm-pi-ai/${secondMuse.credentialRecordId}`)
 assert.notEqual(firstMuseRecord.payload.refresh, secondMuseRecord.payload.refresh)
 assert.equal(secondMuse.profile.enabledContributorModels, undefined)
 for (const width of [390, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  for (const theme of ['light', 'dark']) {
   await page.evaluate(dark => document.body.toggleAttribute('data-ds-dark-theme', dark), theme === 'dark')
   await page.screenshot({ path: artifact(`connections-final-${width}-${theme}.png`), fullPage: true })
  }
 }
 await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))
 await page.setViewportSize({ width: 1000, height: 900 })
 // Usage loads inside an account's settings only, without rebuilding model choices.
 const usageBefore = usageCalls
 await settingsButton('個人Pro').click()
 await page.getByText('42% 使用', { exact: true }).waitFor()
 await page.getByText('無制限', { exact: true }).waitFor()
 assert.equal(usageCalls, usageBefore + 1)
 const beforeUsage = structuredClone(settingsValue.connections)
 for (const status of ['stale', 'auth-required', 'unobserved', 'error', 'rate-limited']) {
  usageStatus = status
  await page.getByRole('button', { name: '利用状況を更新', exact: true }).click()
  const expected = { stale: '前回の情報です。更新してください', 'auth-required': '利用状況の確認にはログインが必要です', unobserved: 'まだ観測していません', error: '利用状況を確認できませんでした', 'rate-limited': '取得回数の制限中です。再試行可能時刻を確認してください。' }[status]
  await page.getByText(expected, { exact: true }).waitFor()
 }
 assert.equal(await page.getByRole('button', { name: '利用状況を更新', exact: true }).isDisabled(), true)
 assert.deepEqual(settingsValue.connections, beforeUsage)
 await page.setViewportSize({ width: 390, height: 900 })
 await page.screenshot({ path: artifact('usage-mobile.png') })
 await page.keyboard.press('Escape')
 // Search and 50 connections remain responsive.
 for (let index = 0; index < 43; index++) settingsValue.connections[`c-bulk-${index}`] = fixture('example', `大量接続${index}`, 'api-key', `bulk-${index}`)
 assert.equal(Object.keys(settingsValue.connections).length, 50)
 revision++
 await page.evaluate(() => testRuntime.ctx.emit('connection/reset'))
 await page.getByText('大量接続42', { exact: true }).waitFor()
 const searchStarted = Date.now()
 await page.getByRole('textbox', { name: '接続を検索', exact: true }).fill('大量接続42')
 assert.equal(await page.locator('.dsh-pi-connection-row').count(), 1)
 assert.ok(Date.now() - searchStarted < 1000, 'Searching 50 connections exceeded one second')
 await page.screenshot({ path: artifact('connections-50-filtered-mobile.png') })
 await page.getByRole('textbox', { name: '接続を検索', exact: true }).fill('')
 await page.screenshot({ path: artifact('connections-50-mobile.png'), fullPage: true })
 assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
 // Plugin updates have independent request state and one shared footer.
 const updateProfileKey = 'a'.repeat(64)
 let acceptedUpdateId, begins = 0
 const rpcReply = (route, value) => route.fulfill({ json: { type: 'server-response', rpcId: route.request().postDataJSON().rpcId, result: { ok: true, value } } })
 await page.route('**/api/dsh-pi-login/update-status', route => rpcReply(route, { status: acceptedUpdateId ? 'installing' : 'idle', profileKey: updateProfileKey, ...(acceptedUpdateId ? { requestId: acceptedUpdateId } : {}) }))
 await page.route('**/api/dsh-pi-login/update-check', route => rpcReply(route, { status: 'available', profileKey: updateProfileKey, runtimeVersion: '0.6.0', candidate: { id: 'fixture-release', version: '0.6.1', notes: 'Fixture release notes', compatibility: '0.2.1-alpha.2' } }))
 await page.route('**/api/dsh-pi-login/update-begin', route => {
  begins++; acceptedUpdateId = route.request().postDataJSON().payload.requestId
  assert.equal(route.request().postDataJSON().payload.profileKey, updateProfileKey)
  return rpcReply(route, { status: 'installing', requestId: acceptedUpdateId, version: '0.6.1' })
 })
 await page.route('**/api/dsh-pi-login/update-reconcile', route => rpcReply(route, { status: 'restart-required', profileKey: updateProfileKey, requestId: acceptedUpdateId, runtimeVersion: '0.6.0', version: '0.6.1' }))
 await page.getByRole('button', { name: 'プラグインの更新を確認', exact: true }).click()
 await page.getByRole('button', { name: 'プラグインを更新する', exact: true }).waitFor()
 await page.getByRole('button', { name: 'プラグインを更新する', exact: true }).click()
 await page.getByText('導入しました。現在の作業を終えてからDSHを再起動して適用してください。', { exact: true }).waitFor()
 assert.equal(begins, 1)
 assert.equal(await page.getByRole('button', { name: 'プラグインの更新を確認', exact: true }).isDisabled(), true)
 await page.screenshot({ path: artifact('plugin-update-restart-mobile.png') })
 await page.evaluate(async () => { await testRuntime.locale.setLocale('en'); document.documentElement.lang = 'en' })
 await page.getByRole('heading', { name: 'AI connections', exact: true }).waitFor()
 await page.evaluate(() => testRuntime.dispose())
 assert.equal(await page.locator('style[data-dsh-pi-login]').count(), 0)
 assert.deepEqual(errors, []); assert.deepEqual(consoleErrors, [])
 console.log('Official primitives/slots, authenticated CRUD/OAuth/model isolation, lazy usage states, keyboard focus, 50 connections, 390/768/1440 light/dark, locale and unload passed')
} catch (error) {
 if (browser) for (const page of browser.contexts().flatMap(context => context.pages())) {
  await page.screenshot({ path: artifact('browser-failure.png'), fullPage: true })
  console.error('Rendered text:', (await page.locator('body').innerText()).slice(0, 6000))
 }
 throw error
} finally {
 await browser?.close(); await plugin.dispose(); for (const flow of museFlows.values()) flow.dispose(); catalogs.dispose(); manager.dispose(); registry.dispose(); await ctx.fiber.dispose(); await new Promise(resolve => server.close(resolve))
}
