import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { parse, stringify } from 'yaml'
import { checkConnectionControls, checkContributorEffortMenu } from './connection-install-ui.mjs'
import { catalogBinding } from '../src/live-catalog.mjs'
const home = await mkdtemp(join(tmpdir(), 'pi-update-clean-'))
const env = { ...process.env, DSH_HOME: home }
const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const source = process.argv[2] ?? resolve(`artifacts/local-dsh-pi-login-${packageJson.version}.tgz`)
async function run(args) {
 const result = spawnSync('dsh', args, { env, encoding: 'utf8', timeout: 180000 })
 if (result.status !== 0) {
  await writeFile(join(home,'install.log'),(result.stdout ?? '')+(result.stderr ?? ''))
  const stage = args.includes('--dump-config') ? 'profile-bootstrap' : 'plugin-install'
  const stderr = result.stderr ?? ''
  const pnpmMissing = stderr.includes('dsh: pnpm was not found; install pnpm and make it available on PATH.')
  const code = result.error?.code ?? (pnpmMissing ? 'PNPM_NOT_FOUND' : stderr.match(/\b(?:ERR_[A-Z0-9_]+|EACCES|EPERM|ENOENT|ENOTDIR)\b/)?.[0] ?? 'CLI_FAILED')
  const errorClass = stderr.match(/^(?:Error|TypeError|SyntaxError|RangeError|ReferenceError)(?=[: \[])/m)?.[0]
  const frame = stderr.split('\n').find(line => /^\s+at\s/.test(line))?.trim().replace(/https?:\/\/[^\s)]+/g, '[remote-url]')
  console.error('DSH bootstrap diagnostic: '+JSON.stringify({ stage, status: result.status, signal: result.signal, code, errorClass, frame }))
  throw new Error('DSH '+stage+' failed; private logs: '+home)
 }
}
await run(['--profile','smoke','--from-default-profile','web','--dump-config'])
await run(['plugin','--profile','smoke','add','-w','--ignore-scripts',source])
const profile = join(home,'profiles','smoke','package.json')
const manifest = JSON.parse(await readFile(profile,'utf8'))
if (!manifest.dsh.profile.bundles.includes('@local/dsh-pi-login')) manifest.dsh.profile.bundles.push('@local/dsh-pi-login')
await writeFile(profile,JSON.stringify(manifest,null,2))
let child, done, output = ''
function startApp() {
 output = ''
 child = spawn('dsh',['--profile','smoke','--no-open','--port','0'],{env,stdio:['ignore','pipe','pipe']})
 const append=chunk=>{output+=chunk.toString()}; child.stdout.on('data',append);child.stderr.on('data',append)
 done = new Promise(resolve=>child.once('exit',resolve))
}
async function stopApp() {
 if (!child) return
 const currentChild = child
 currentChild.kill('SIGTERM')
 const shutdownTimer = setTimeout(() => { if (currentChild.exitCode === null) currentChild.kill('SIGKILL') }, 10000)
 try { await done } finally { clearTimeout(shutdownTimer); child = undefined }
}
async function appURL() {
 for (let attempt=0;attempt<300;attempt++) {
   const match=output.match(/http:\/\/(?:127\.0\.0\.1|localhost):\d+\S*/)
   if (match) return match[0].replace(/\x1b\[[0-9;]*m/g,'')
   if (child.exitCode!==null) throw new Error('DSH startup exited')
   await new Promise(resolve=>setTimeout(resolve,100))
 }
 throw new Error('No DSH URL')
}
startApp()
try {
 const url = await appURL()
 const { chromium } = await import('playwright')
 const browser=await chromium.launch({headless:true,...(process.env.DSH_TEST_CHROMIUM ? {executablePath:process.env.DSH_TEST_CHROMIUM} : {})})
 try {
  let page=await browser.newPage();await page.goto(url)
  const result=await page.evaluate(async()=>{
    const method='dsh-pi-login/update-status'
    return (await fetch('/api/'+method,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'client-request',rpcId:'smoke',method,payload:{}})})).json()
  })
  assert.equal(result.result.ok,true)
  assert.equal(result.result.value.runtimeVersion,packageJson.version)
  assert.equal(result.result.value.status,'idle')
  console.log('Clean DSH profile: tgz installation, startup, running '+packageJson.version+' and manager capability passed')
  const crud = await page.evaluate(async () => {
    async function call(name, payload = {}) {
      const method = 'dsh-pi-login/' + name
      const response = await fetch('/api/' + method, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: AbortSignal.timeout(15000), body: JSON.stringify({ type: 'client-request', rpcId: 'install-' + name, method, payload }) })
      const envelope = await response.json()
      if (envelope.result?.ok !== true) throw new Error('Installed ' + name + ': ' + envelope.result?.error?.code)
      return envelope.result.value
    }
    let view = await call('connection-list')
    const originalIds = view.connections.map(row => row.connectionId).sort()
    const token = () => ({ profileKey: view.profileKey, generation: view.generation, revision: view.revision })
    const created = await call('connection-create', { ...token(), integrationId: 'pi', serviceId: 'deepseek', authMethod: 'api-key', displayName: 'Install fixture', apiKey: 'fixture-install-only-not-a-real-key' })
    view = await call('connection-list')
    const original = view.connections.find(row => row.connectionId === created.connectionId)
    if (!original?.configured || !original.enabled || original.authMethod !== 'api-key') throw new Error('Installed API-key persistence failed')
    if (JSON.stringify(view).includes('fixture-install-only-not-a-real-key')) throw new Error('Installed public connection listing exposed a credential')
    const copied = await call('connection-clone', { ...token(), connectionId: created.connectionId, displayName: 'Install clone' })
    view = await call('connection-list')
    const clone = view.connections.find(row => row.connectionId === copied.connectionId)
    if (!clone || clone.configured || clone.enabled || clone.routeId === original.routeId) throw new Error('Installed clone did not isolate credentials and route')
    await call('connection-delete', { ...token(), connectionId: copied.connectionId })
    view = await call('connection-list')
    if (!view.connections.find(row => row.connectionId === created.connectionId)?.configured) throw new Error('Deleting clone affected original credentials')
    const muse = await call('connection-create', { ...token(), integrationId: 'meta-muse-code', serviceId: 'muse-code', authMethod: 'oauth', displayName: 'Restart Muse fixture' })
    view = await call('connection-list')
    return { originalIds, fixtureId: created.connectionId, museId: muse.connectionId,
      finalIds: view.connections.map(row => row.connectionId).sort(), profileKey: view.profileKey, generation: view.generation }
  })
  assert.equal(crud.finalIds.length, crud.originalIds.length + 2)
  console.log('Clean DSH profile: authenticated connection CRUD, actual Credentials persistence, isolated clone and deletion passed; fixtures retained for restart; no generation request was sent')
  await page.close(); await stopApp()
  // Exercise both CLI-era Muse settings and a persisted 0.7 account catalog.
  // All values are local fixtures; no Meta credential or request is involved.
  const patchPath = join(home, 'profiles', 'smoke', 'cordis.patch.yml')
  const patches = parse(await readFile(patchPath, 'utf8'))
  const entry = patches.find(entry => entry.id === 'dsh-pi-login')
  assert.ok(entry?.config?.connections?.[crud.museId])
  // New model catalogs survive the real Host schema and a process restart.
  // A fresh local fixture prevents this check from depending on a public catalog.
  const liveConnection = entry.config.connections[crud.fixtureId]
  liveConnection.modelCatalog = JSON.stringify({ version: 1, binding: catalogBinding(liveConnection), checkedAt: Date.now(), models: [{
    id: 'fixture-new:1017', name: 'Restart catalog fixture', provider: 'deepseek', api: 'openai-completions',
    baseUrl: 'https://api.deepseek.com', contextWindow: 131072, maxTokens: 8192, input: ['text'],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, reasoning: true,
    thinkingLevelMap: { off: 'none', minimal: null, low: 'low', medium: null, high: 'high', xhigh: null, max: 'max' },
    control: { toggle: false }, verified: true,
  }] })
  const nativePair = id => [
    { id: `${id}-contributor`, name: `${id}-contributor`, contextWindow: 1048576, maxTokens: 32768, input: ['text', 'image'], efforts: ['high'], contributor: false },
    { id, name: id, contextWindow: 1048576, maxTokens: 131072, input: ['text', 'image'], efforts: ['high'], contributor: true },
  ]
  // Full uses one provider ID in both modes. Its Contributor limits are stored
  // beside Standard so a restart cannot offer Standard's Max on that choice.
  const splitFull = {
    id: 'muse-wonder-full-1.0', name: 'muse-wonder-full-1.0', contextWindow: 1048576, maxTokens: 131072,
    input: ['text', 'image'], efforts: ['high', 'xhigh', 'max'], defaultEffort: 'max', contributor: true,
    contributorMode: {
      name: 'muse-wonder-full-1.0', contextWindow: 524288, maxTokens: 32768, input: ['text', 'image'],
      efforts: ['high', 'xhigh'], defaultEffort: 'high',
    },
  }
  Object.assign(entry.config.connections[crud.museId], {
    enabled: true,
    museCode: { modelId: 'muse-wonder-1.0', contributorMode: false },
    museCatalog: [splitFull, ...['muse-wonder-1.0', 'muse-spark-1.3', 'muse-spark-1.2'].flatMap(nativePair)],
    profile: { enabledContributorModels: ['muse-wonder-full-1.0::contributor'] },
  })
  const credentialKey = `llm-pi-ai/${entry.config.connections[crud.museId].credentialRecordId}`
  const fixtureModule = join(home, 'install-credential-fixture.mjs')
  await writeFile(fixtureModule, `
import { access, writeFile } from 'node:fs/promises';
export const inject = ['credentials', 'connection'];
export async function apply(ctx) {
  const marker = ${JSON.stringify(join(home, 'fixture-seeded'))};
  let seeded = false; try { await access(marker); seeded = true } catch {}
  if (!seeded) {
    await ctx.credentials.modifyRecord(${JSON.stringify(credentialKey)}, () => ({ kind: 'grant',
      payload: { type: 'oauth', refresh: 'fixture-muse-identity', access: 'fixture-muse-access', expires: Date.now() + 86400000 } }));
    await writeFile(marker, 'seeded');
  }
  ctx.connection.fetch.register({ path: '/api/install-fixture/credential-check', methods: ['POST'], requestBody: 'buffered',
    async fetch() { return Response.json({ configured: (await ctx.credentials.describeRecord(${JSON.stringify(credentialKey)})).configured }); } });
}
`)
  patches.push({ insert: [{ id: 'install-credential-fixture', name: fixtureModule }] })
  await writeFile(patchPath, stringify(patches))
  startApp()
  page=await browser.newPage(); await page.goto(await appURL())
  const restarted = await page.evaluate(async () => {
    const value = {}
    for (const name of ['update-status', 'connection-list']) {
      const method = 'dsh-pi-login/' + name
      const response = await fetch('/api/' + method, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: AbortSignal.timeout(15000), body: JSON.stringify({ type: 'client-request', rpcId: 'restart-' + name, method, payload: {} }) })
      const envelope = await response.json()
      if (envelope.result?.ok !== true) throw new Error('Restarted ' + name + ': ' + envelope.result?.error?.code)
      value[name] = envelope.result.value
    }
    return value
  })
  assert.equal(restarted['update-status'].runtimeVersion, packageJson.version)
  assert.deepEqual(restarted['connection-list'].connections.map(row => row.connectionId).sort(), crud.finalIds)
  const restored = restarted['connection-list'].connections.find(row => row.connectionId === crud.fixtureId)
  assert.equal(restored.configured, true)
  assert.equal(restored.enabled, true)
  assert.equal(restored.authMethod, 'api-key')
  assert.equal(restarted['connection-list'].profileKey, crud.profileKey)
  assert.notEqual(restarted['connection-list'].generation, crud.generation)
  const liveRestored = await page.evaluate(async connectionId => {
    const method = 'dsh-pi-login/models'
    const envelope = await (await fetch('/api/' + method, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId: 'restart-live-catalog', method, payload: { connectionId } }) })).json()
    if (!envelope.result?.ok) throw new Error('Restored live catalog unavailable')
    return envelope.result.value
  }, crud.fixtureId)
  assert.equal(liveRestored.models.find(model => model.id === 'fixture-new:1017')?.enabled, false)
  const migratedPatch = parse(await readFile(patchPath, 'utf8'))
  const migratedConnection = migratedPatch.find(entry => entry.id === 'dsh-pi-login').config.connections[crud.fixtureId]
  assert.equal(migratedConnection.modelCatalog, undefined)
  const catalogFile = JSON.parse(await readFile(join(home, 'profiles', 'smoke', '.dsh-pi-login', `catalog-${crud.fixtureId}.json`), 'utf8'))
  assert.equal(catalogFile.models[0].id, 'fixture-new:1017')
  console.log('Clean DSH profile: 0.8.0 modelCatalog copied to .dsh-pi-login and removed from settings; newly discovered model stays off')
  const restoredModels = await page.evaluate(async museId => {
    const method = 'dsh-pi-login/models'
    const response = await fetch('/api/' + method, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId: 'restart-models', method, payload: { connectionId: museId } }) })
    const envelope = await response.json()
    if (envelope.result?.ok !== true) throw new Error('Restarted models: ' + envelope.result?.error?.code)
    return envelope.result.value
  }, crud.museId)
  assert.equal(restoredModels.models.length, 8)
  assert.equal(restoredModels.models.filter(model => model.enabled).length, 5)
  assert.ok(restoredModels.models.every(model => !model.id.endsWith('-contributor')))
  console.log('Clean DSH profile: restart with saved API-key and Muse connections, Credentials, persisted catalog/Contributor selection, migration and fresh profile generation passed')
  const artifacts = process.env.DSH_TEST_ARTIFACT_DIR
  const effortArtifacts = artifacts ?? 'work/contributor-efforts'
  await mkdir(effortArtifacts, { recursive: true })
  const workspacePath = join(home, 'effort-workspace')
  await mkdir(workspacePath, { recursive: true })
  await checkContributorEffortMenu(page, { artifacts: effortArtifacts, workspacePath })
  if (artifacts) await mkdir(artifacts, { recursive: true })
  await checkConnectionControls(page, { connectionId: crud.museId, mode: 'toggle', artifacts })
  await page.close(); await stopApp(); startApp()
  page = await browser.newPage(); await page.goto(await appURL())
  await checkConnectionControls(page, { connectionId: crud.museId, mode: 'verify', artifacts })
  await page.close(); await stopApp(); startApp()
  page = await browser.newPage(); await page.goto(await appURL())
  await checkConnectionControls(page, { connectionId: crud.museId, mode: 'delete', artifacts })
  const deletedCredential = await page.evaluate(async () => (await fetch('/api/install-fixture/credential-check', { method: 'POST' })).json())
  assert.equal(deletedCredential.configured, false)
  await page.close(); await stopApp(); startApp()
  page = await browser.newPage(); await page.goto(await appURL())
  const afterDelete = await page.evaluate(async () => {
    const method = 'dsh-pi-login/connection-list'
    const envelope = await (await fetch('/api/' + method, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId: 'after-delete', method, payload: {} }) })).json()
    if (!envelope.result?.ok) throw new Error('Listing after deleted connection restart failed')
    return envelope.result.value
  })
  assert.ok(!afterDelete.connections.some(row => row.connectionId === crud.museId))
  assert.equal(afterDelete.connections.find(row => row.connectionId === crud.fixtureId)?.configured, true)
  console.log('Real DSH Settings UI: no duplicate native editor, eight Muse choices, durable off switches, confirmed connection/Credentials deletion and restart without resurrection passed')
  const update=await page.evaluate(async()=>{
    const method='dsh-pi-login/update-check'
    return (await fetch('/api/'+method,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'client-request',rpcId:'smoke-check',method,payload:{}})})).json()
  })
  assert.equal(update.result.ok,true)
  if (process.env.DSH_TEST_OFFLINE_RELEASE === '1' && update.result.value.status === 'blocked' && update.result.value.reason === 'network') {
    console.log('Release lookup correctly reports blocked/network (explicit offline mode); live Release verification was not performed; evidence '+home)
  } else {
    assert.ok(['current', 'available'].includes(update.result.value.status), 'Live release check: ' + update.result.value.reason)
    console.log('Clean DSH profile: installation, bundle startup, connection CRUD, running '+packageJson.version+', manager capability and live release check passed; evidence '+home)
  }
 } finally {await browser.close()}
} catch(error) {await writeFile(join(home,'startup.log'),output);console.error(error.message+'; logs '+home);process.exitCode=1}
finally { await stopApp() }
