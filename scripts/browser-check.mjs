import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'
import { compileOfficial } from './upstream.mjs'
import { getBuiltinModels } from '@earendil-works/pi-ai/providers/all'
import { modelChoices, fastModelId } from '../src/runtime/fast.ts'
async function within(promise) {
 let timer
 try {return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Delayed list fixture did not settle')),10000)})])}
 finally {clearTimeout(timer)}
}
const artifactDir = process.env.DSH_TEST_ARTIFACT_DIR ?? 'artifacts'
const artifact = name => join(artifactDir, name)
await mkdir(artifactDir,{recursive:true})
await compileOfficial('scripts/browser-fixture.jsx','.cache/browser-fixture.js','browser')
const {Context,AuthorizationService,MemoryCredentials,HostConnectionService,BrowserAuth,PiPlugin:host}=await import(pathToFileURL(resolve('.cache/official-host.mjs')).href)
const ctx=new Context()
await ctx.plugin(MemoryCredentials);await ctx.plugin(AuthorizationService)
const auth=await BrowserAuth.create(ctx,ctx.credentials,30)
await ctx.plugin(pluginCtx=>{new HostConnectionService(pluginCtx,[],auth)})
const writes=[]
let revision=7, providers={}
providers.meta = { enabled: true }
ctx.provide('settings',{describe:()=>[{ns:'dsh-pi-login',value:{providers},revision}],update:async(ns,patch,expected)=>{
 assert.equal(expected,revision);writes.push([ns,patch,expected]);revision++
 for(const [provider,changes] of Object.entries(patch.providers))providers[provider]={...providers[provider],...changes}
}})
const key='llm-pi-ai/openai-codex'
ctx.authorization.registerFlow({key,label:'ChatGPT (Codex)',methods:[{id:'oauth',label:'ChatGPT'},{id:'api-key',label:'API key'}],async run(session){
 if(session.method==='oauth')session.notify({message:'ブラウザで認証してください。',url:'https://accounts.example/authorize',code:'DSH-TEST'})
 const answer=await session.prompt({kind:session.method==='oauth'?'text':'secret',message:session.method==='oauth'?'認証コードを入力':'APIキーを入力'})
 await session.commit({kind:'grant',payload:{token:answer}})
}})
const model=getBuiltinModels('openai-codex').find(model=>model.id==='gpt-6.1-sol')
const fast=fastModelId(model.id)
ctx.authorization.registerFlow({ key: 'llm-pi-ai/meta', label: 'Meta (Muse)', methods: [{ id: 'oauth', label: 'Muse' }], async run(session) { await session.commit({ kind: 'grant', payload: { token: 'meta-fixture' } }) } })
let metaRefreshed = false, metaRefreshFails = false
const full = 'muse-wonder-full-1.0'
const catalogs = new host.ProviderCatalogs({
 meta: {
  session: { refresh: async () => {
   if (metaRefreshFails) throw Object.assign(new Error('private-error-detail'), { code: 'fixture-key-override' })
   metaRefreshed = true
  } },
  presentation: models => ({
   ...metaRefreshed ? { status: { message: 'metaSubscriptionActive', detail: 'Maximum Usage' } } : {},
   notes: ['metaReloadHint'],
  }),
  errorCodes: { 'fixture-key-override': 'catalog-key-override' },
  errors: { 'catalog-key-override': 'metaKeyOverride' },
 },
 example: {
  session: { refresh: async () => { exampleRefreshed = true } },
 },
})
let exampleRefreshed = false
providers.example = { enabled: true }
ctx.authorization.registerFlow({ key: 'llm-pi-ai/example', label: 'Example', methods: [{ id: 'api-key', label: 'API key' }], async run(session) { await session.commit({ kind: 'grant', payload: { token: 'example-fixture' } }) } })
const plugin=ctx.plugin({inject:['authorization','credentials','connection','settings'],apply:ctx=>host.applyLoginUI(ctx,{
 catalogs,
 catalog:(provider,profile)=>provider === 'meta' ? [
  { id: 'muse-spark-1.3', name: 'Muse Spark 1.3', enabled: !profile.disabledModels?.includes('muse-spark-1.3') },
  ...metaRefreshed ? [{ id: full, name: 'Muse Wonder Full', discovered: true, capabilityUnverified: true, enabled: profile.enabledDiscoveredModels?.includes(full) === true }] : [],
 ] : provider === 'example' ? [
  { id: 'example-base', name: 'Example Base', enabled: true },
  ...exampleRefreshed ? [{ id: 'example-new', name: 'Example New', discovered: true, enabled: profile.enabledDiscoveredModels?.includes('example-new') === true }] : [],
 ] : modelChoices(provider,[model],profile),
})});await plugin.await()
const handler=ctx.connection.createSharedFetchHandler('/api')
const files=new Map([
 ['/fixture.js',resolve('.cache/browser-fixture.js')],['/login.js',resolve('dist/client.js')],
 ['/base.css',resolve('.cache/upstream/packages/client/ui-theme/src/styles/base.css')],['/tokens.css',resolve('.cache/upstream/packages/client/ui-theme/src/styles/design-platform.css')],
])
const server=createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://127.0.0.1')
  if(url.pathname.startsWith('/api/')){
   const admission=ctx.connection.admit(req)
   if('rejection'in admission){res.writeHead(admission.rejection);res.end();return}
   const chunks=[];for await(const chunk of req)chunks.push(chunk)
   const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,body:Buffer.concat(chunks)})
   const result=await handler.fetch(request)
   res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));return
  }
  if(files.has(url.pathname)){res.setHeader('content-type',url.pathname.endsWith('.css')?'text/css':'text/javascript');res.end(await readFile(files.get(url.pathname)));return}
  if(!auth.authorizeIndex(req,res))return
  res.setHeader('content-type','text/html');res.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pi login test fixture</title><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/base.css"><style>body{margin:0;background:var(--dsw-alias-bg-layer-1)}</style></head><body><div id="app"></div><script src="/fixture.js"></script><script src="/login.js"></script><script>mountPlugins()</script></body></html>')
 }catch{res.writeHead(500);res.end('test fixture failed')}
})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
const base=`http://127.0.0.1:${server.address().port}/`
let browser
try {
 assert.equal((await fetch(new URL('api/dsh-pi-login/list',base),{method:'POST'})).status,401)
 assert.equal((await fetch(new URL('api/dsh-pi-login/list',base),{method:'POST',headers:{origin:'https://untrusted.example'}})).status,403)
 assert.equal((await fetch(new URL('api/dsh-pi-login/refresh-models',base),{method:'POST'})).status,401)
 assert.equal((await fetch(new URL('api/dsh-pi-login/refresh-models',base),{method:'POST',headers:{origin:'https://untrusted.example'}})).status,403)
 const options={headless:true}
 if(process.env.DSH_TEST_CHROMIUM)options.executablePath=process.env.DSH_TEST_CHROMIUM
 browser=await chromium.launch(options)
 const page=await browser.newPage({viewport:{width:1000,height:800}})
 await page.emulateMedia({reducedMotion:'reduce'})
 const errors=[],consoleErrors=[];page.on('pageerror',error=>{errors.push(error.message);console.error('Page error:',error.message)})
 page.on('console',message=>{if(message.type()==='error'){consoleErrors.push(message.text());console.error('Console error:',message.text().slice(0,500))}})
 page.setDefaultTimeout(10000)
 await page.goto(ctx.connection.authenticatedUrl(base))
 assert.ok(page.url().startsWith(base))
 assert.equal(await page.title(),'Pi login test fixture')
 assert.equal(await page.locator('vite-error-overlay, #webpack-dev-server-client-overlay').count(),0)
 try {await page.getByRole('heading',{name:'Pi接続'}).waitFor()} catch(error) {await page.screenshot({path:artifact('browser-failure.png')});console.error('Page text:',await page.locator('body').innerText());throw error}
 assert.equal(await page.getByRole('heading', { name: /^Piプラグイン/ }).count(), 1)
 await page.getByText('plugin managerまたは書き込み可能なprofileがありません。配布ページから手動更新してください。', { exact: true }).waitFor()
 await page.getByRole('button', { name: 'プラグインの更新を確認', exact: true }).click()
 await page.getByText('plugin managerまたは書き込み可能なprofileがありません。配布ページから手動更新してください。', { exact: true }).waitFor()
 assert.equal(await page.locator('.dsh-pi-card .dsh-pi-updates').count(), 0)
 await page.screenshot({path:artifact('pi-login-light.png')})
 await page.getByRole('button',{name:'ログイン',exact:true}).first().click()
 await page.getByRole('link',{name:'ブラウザで続ける'}).waitFor()
 await page.screenshot({path:artifact('pi-login-dialog.png')})
 await page.getByLabel('認証コードを入力').fill('browser-fixture-secret')
 await page.getByRole('button',{name:'続ける',exact:true}).click()
 await page.getByText('ログインしました',{exact:true}).waitFor()
 assert.equal(await page.getByText('browser-fixture-secret',{exact:true}).count(),0)
 await page.getByRole('button',{name:'プロバイダーを有効にする'}).click()
 await page.getByText('プロバイダーを有効にしました。',{exact:true}).waitFor()
 assert.deepEqual(writes,[['dsh-pi-login',{providers:{'openai-codex':{enabled:true}}},7]])
 await page.getByRole('button',{name:'閉じる',exact:true}).last().click()
 await page.evaluate(()=>document.body.setAttribute('data-ds-dark-theme',''))
 await page.screenshot({path:artifact('pi-login-dark.png')})
 await page.getByRole('button',{name:'再ログイン',exact:true}).first().click()
 await page.getByLabel('認証コードを入力').waitFor()
 await page.keyboard.press('Escape')
 await page.waitForFunction(()=>!document.querySelector('[role="dialog"]'))
 await page.getByRole('button',{name:'接続方法',exact:true}).first().click()
 await page.getByRole('menuitem',{name:'APIキー',exact:true}).click()
 await page.getByRole('button',{name:'再ログイン',exact:true}).first().click()
 const secretInput=page.getByLabel('APIキーを入力')
 await secretInput.waitFor()
 assert.equal(await secretInput.getAttribute('type'),'password')
 await secretInput.fill('masked-api-key-fixture')
 await page.getByRole('button',{name:'続ける',exact:true}).click()
 await page.getByText('ログインしました',{exact:true}).waitFor()
 assert.equal(await page.getByText('masked-api-key-fixture',{exact:true}).count(),0)
 await page.getByRole('button',{name:'閉じる',exact:true}).last().click()
 await page.getByRole('button',{name:'モデルを選ぶ',exact:true}).first().click()
 await page.getByText('このプロバイダーはモデル一覧の再取得に未対応です。新モデルはプラグインまたはSDKの更新で追加されます。', {exact:true}).waitFor()
 assert.equal(await page.getByRole('button', {name:'モデル一覧を更新',exact:true}).count(),0)
 await page.getByRole('switch',{name:'モデルを使う: GPT-6.1 Sol',exact:true}).waitFor()
 await page.evaluate(()=>document.body.removeAttribute('data-ds-dark-theme'))
 await page.screenshot({path:artifact('pi-models-light.png')})
 await page.evaluate(()=>document.body.setAttribute('data-ds-dark-theme',''))
 await page.screenshot({path:artifact('pi-models-dark.png')})
 const modelSwitch=page.getByRole('switch',{name:'モデルを使う: GPT-6.1 Sol',exact:true})
 await modelSwitch.click()
 await page.waitForFunction(()=>document.querySelector('[role="switch"][aria-label="モデルを使う: GPT-6.1 Sol"]')?.getAttribute('aria-checked')==='false')
 const fastSwitch=page.getByRole('switch',{name:'モデルを使う: GPT-6.1 Sol Fast',exact:true})
 assert.equal(await fastSwitch.getAttribute('aria-checked'),'false')
 assert.equal(await fastSwitch.isEnabled(),true)
 await fastSwitch.click()
 await page.waitForFunction(()=>document.querySelector('[role="switch"][aria-label="モデルを使う: GPT-6.1 Sol Fast"]')?.getAttribute('aria-checked')==='true')
 assert.deepEqual(providers['openai-codex'].enabledFastModels,[fast])
 await page.screenshot({path:artifact('pi-fast-models-dark.png')})
 await page.getByLabel('モデルを検索').fill('fast')
 assert.equal(await modelSwitch.count(),0)
 await page.getByRole('switch',{name:'モデルを使う: GPT-6.1 Sol Fast',exact:true}).waitFor()
 await page.getByRole('button',{name:'閉じる',exact:true}).last().click()
 const providerSwitch=page.getByRole('switch',{name:'このプロバイダーを使う: ChatGPT (Codex)',exact:true}).first()
 await providerSwitch.click()
 await page.waitForFunction(()=>document.querySelector('[role="switch"][aria-label="このプロバイダーを使う: ChatGPT (Codex)"]')?.getAttribute('aria-checked')==='false')
 assert.equal((await ctx.credentials.readRecord(key)).kind,'grant')
 assert.deepEqual(providers['openai-codex'].disabledModels,[model.id])
 assert.deepEqual(providers['openai-codex'].enabledFastModels,[fast])

 // Hold an old OFF response while a reset fetches the newly saved ON state.
 const listPath='**/api/dsh-pi-login/list'
 let capture, release, settle, listRequests=0
 const captured=new Promise(resolve=>{capture=resolve})
 const delayed=new Promise(resolve=>{release=resolve})
 const settled=new Promise(resolve=>{settle=resolve})
 const delayOldList=async route=>{
  if(++listRequests!==1){await route.continue();return}
  try {
   const response=await route.fetch()
   assert.equal((await response.json()).result.value[0].enabled,false)
   capture()
   await delayed
   try {await route.fulfill({response})} catch { /* The reset aborts the stale browser request. */ }
  }finally{settle()}
 }
 await page.route(listPath,delayOldList)
 try {
  await page.evaluate(()=>testRuntime.ctx.emit('connection/reset'))
  await within(captured)
  providers['openai-codex']={...providers['openai-codex'],enabled:true};revision++
  await page.evaluate(()=>testRuntime.ctx.emit('connection/reset'))
  await page.waitForFunction(()=>document.querySelector('[role="switch"][aria-label="このプロバイダーを使う: ChatGPT (Codex)"]')?.getAttribute('aria-checked')==='true')
  assert.equal(listRequests,2)
  release();await within(settled)
  assert.equal(await providerSwitch.getAttribute('aria-checked'),'true')
 }finally{release();await page.unroute(listPath,delayOldList)}

 // Render each terminal cause through the authenticated RPC response format.
 for(const [snapshot,message] of [
  [{status:'cancelled'},'ログインをキャンセルしました。もう一度ログインしてください。'],
  [{status:'failed',reason:'provider-expired'},'認証コードの有効期限が切れました。もう一度ログインしてください。'],
  [{status:'cancelled',reason:'timeout'},'ログインの待機時間を超えました。もう一度ログインしてください。'],
 ]) {
  const statePath='**/api/dsh-pi-login/state'
  const terminalState=route=>route.fulfill({json:{type:'server-response',rpcId:route.request().postDataJSON().rpcId,result:{ok:true,value:snapshot}}})
  await page.route(statePath,terminalState)
  try {
   await page.getByRole('button',{name:'再ログイン',exact:true}).first().click()
   await page.getByText(message,{exact:true}).waitFor()
   await page.getByRole('button',{name:'閉じる',exact:true}).last().click()
  }finally{await page.unroute(statePath,terminalState)}
 }
 await page.setViewportSize({width:390,height:760})
 await page.getByRole('button', { name: 'プラグインの更新を確認', exact: true }).scrollIntoViewIfNeeded()
 assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
 await page.screenshot({path:artifact('pi-login-mobile.png')})
 await page.getByRole('button',{name:'モデルを選ぶ',exact:true}).first().click()
 const mobileFast=page.getByRole('switch',{name:'モデルを使う: GPT-6.1 Sol Fast',exact:true})
 await mobileFast.waitFor()
 assert.equal(await mobileFast.getAttribute('aria-checked'),'true')
 assert.equal(await page.getByRole('switch',{name:'モデルを使う: GPT-6.1 Sol',exact:true}).getAttribute('aria-checked'),'false')
 await page.screenshot({path:artifact('pi-fast-models-mobile.png')})
 assert.ok(await page.evaluate(()=>document.querySelector('[role="dialog"]').scrollWidth<=innerWidth))
 await page.getByRole('button',{name:'閉じる',exact:true}).last().click()
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
 // Muse reload shows account information, adds an opt-in Full row, persists
 // the choice, and retains the last list with an actionable override error.
 await page.getByRole('button', { name: 'プロバイダー', exact: true }).click()
 await page.getByRole('menuitem', { name: 'Meta (Muse)', exact: true }).click()
 await page.getByRole('button', { name: 'モデルを選ぶ', exact: true }).last().click()
 await page.getByRole('button', { name: 'モデル一覧を更新', exact: true }).click()
 await page.getByText('Muse契約は有効です · Maximum Usage', { exact: true }).waitFor()
 const fullSwitch = page.getByRole('switch', { name: 'モデルを使う: Muse Wonder Full', exact: true })
 assert.equal(await fullSwitch.getAttribute('aria-checked'), 'false')
 await fullSwitch.click()
 await page.waitForFunction(() => document.querySelector('[aria-label="モデルを使う: Muse Wonder Full"]')?.getAttribute('aria-checked') === 'true')
 assert.deepEqual(providers.meta.enabledDiscoveredModels, [full])
 assert.ok(await page.evaluate(() => document.querySelector('[role="dialog"]').scrollWidth <= innerWidth))
 await page.screenshot({ path: artifact('pi-muse-full-mobile.png') })
 metaRefreshFails = true
 await page.getByRole('button', { name: 'モデル一覧を更新', exact: true }).click()
 await page.getByRole('alert').filter({ hasText: 'APIキー参照がMuseログインより優先されています' }).waitFor()
 assert.equal(await fullSwitch.getAttribute('aria-checked'), 'true')
 assert.equal(await page.getByText('private-error-detail', { exact: true }).count(), 0)
 await page.setViewportSize({ width: 1000, height: 800 })
 await page.screenshot({ path: artifact('pi-muse-full-desktop.png') })
 await page.getByRole('button', { name: '閉じる', exact: true }).last().click()
 // The same dialog and RPC also refresh a non-Meta provider adapter.
 await page.getByRole('button', { name: 'プロバイダー', exact: true }).click()
 await page.getByRole('menuitem', { name: 'Example', exact: true }).click()
 await page.getByRole('button', { name: 'モデルを選ぶ', exact: true }).last().click()
 await page.getByRole('button', { name: 'モデル一覧を更新', exact: true }).click()
 const exampleSwitch = page.getByRole('switch', { name: 'モデルを使う: Example New', exact: true })
 assert.equal(await exampleSwitch.getAttribute('aria-checked'), 'false')
 assert.equal(await page.getByText('Muse契約は有効です · Maximum Usage', { exact: true }).count(), 0)
 await exampleSwitch.click()
 await page.waitForFunction(() => document.querySelector('[aria-label="モデルを使う: Example New"]')?.getAttribute('aria-checked') === 'true')
 assert.deepEqual(providers.example.enabledDiscoveredModels, ['example-new'])
 await page.screenshot({ path: artifact('pi-generic-refresh-desktop.png') })
 await page.getByRole('button', { name: '閉じる', exact: true }).last().click()
 // Plugin updates use one shared footer and independent request state.
 const updateProfileKey = 'a'.repeat(64)
 let acceptedUpdateId
 await page.route('**/api/dsh-pi-login/update-status', async route => {
  await route.fulfill({ json: { type: 'server-response', rpcId: route.request().postDataJSON().rpcId, result: { ok: true, value: { status: acceptedUpdateId ? 'installing' : 'idle', profileKey: updateProfileKey, requestId: acceptedUpdateId } } } })
 })
 let releaseCheckCount = 0, finishReleaseCheck
 await page.route('**/api/dsh-pi-login/update-check', async route => {
  releaseCheckCount++
  await new Promise(resolve => { finishReleaseCheck = resolve })
  await route.fulfill({ json: { type: 'server-response', rpcId: route.request().postDataJSON().rpcId, result: { ok: true, value: { status: 'available', profileKey: updateProfileKey, runtimeVersion: '0.5.1', candidate: { id: 'fixture-release', version: '0.6.0', notes: 'Fixture release notes', compatibility: '0.2.1-alpha.2' } } } } })
 })
 await page.getByRole('button', { name: 'プラグインの更新を確認', exact: true }).click()
 await page.getByText('更新を確認中…', { exact: true }).waitFor()
 assert.equal(await page.getByRole('button', { name: 'プラグインの更新を確認', exact: true }).isDisabled(), true)
 finishReleaseCheck()
 await page.getByRole('button', { name: 'プラグインを更新する', exact: true }).waitFor()
 assert.equal(releaseCheckCount, 1)
 await page.setViewportSize({ width: 390, height: 760 })
 await page.locator('.dsh-pi-updates').scrollIntoViewIfNeeded()
 assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
 await page.screenshot({ path: artifact('pi-plugin-update-mobile.png') })
 let begins = 0
 await page.route('**/api/dsh-pi-login/update-begin', async route => {
  begins++
  assert.equal(route.request().postDataJSON().payload.profileKey, updateProfileKey)
  acceptedUpdateId = route.request().postDataJSON().payload.requestId
  await route.fulfill({ json: { type: 'server-response', rpcId: route.request().postDataJSON().rpcId, result: { ok: true, value: { status: 'installing', requestId: route.request().postDataJSON().payload.requestId, version: '0.6.0' } } } })
 })
 await page.route('**/api/dsh-pi-login/update-reconcile', async route => {
  await route.fulfill({ json: { type: 'server-response', rpcId: route.request().postDataJSON().rpcId, result: { ok: true, value: { status: 'restart-required', profileKey: updateProfileKey, requestId: acceptedUpdateId, runtimeVersion: '0.5.1', version: '0.6.0' } } } })
 })
 await page.getByRole('button', { name: 'プラグインを更新する', exact: true }).click()
 await page.getByText('導入しました。現在の作業を終えてからDSHを再起動して適用してください。', { exact: true }).waitFor()
 assert.equal(begins, 1)
 assert.equal(await page.getByRole('button', { name: 'プラグインの更新を確認', exact: true }).isDisabled(), true)
 await page.screenshot({ path: artifact('pi-plugin-update-restart-mobile.png') })
 await page.evaluate(async()=>{await testRuntime.locale.setLocale('en');document.documentElement.lang='en'})
 await page.getByRole('heading',{name:'Pi connections'}).waitFor()
 await page.evaluate(()=>testRuntime.dispose())
 assert.equal(await page.locator('style[data-dsh-pi-login]').count(),0)
 assert.deepEqual(errors,[])
 assert.deepEqual(consoleErrors,[])
 console.log('Official Client slots / locale, authenticated transport, OAuth UI, reset during pending load, terminal reasons, Muse reload/plan/Full opt-in/override errors, light/dark, narrow layout, and unload passed')
}finally{await browser?.close();await plugin.dispose();await ctx.fiber.dispose();await new Promise(resolve=>server.close(resolve))}
