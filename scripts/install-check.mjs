import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
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
    await call('connection-delete', { ...token(), connectionId: created.connectionId })
    view = await call('connection-list')
    return { originalIds, finalIds: view.connections.map(row => row.connectionId).sort(), profileKey: view.profileKey, generation: view.generation }
  })
  assert.deepEqual(crud.finalIds, crud.originalIds)
  console.log('Clean DSH profile: authenticated connection CRUD, actual Credentials persistence, isolated clone and deletion passed; no generation request was sent')
  await page.close(); await stopApp(); startApp()
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
  assert.deepEqual(restarted['connection-list'].connections.map(row => row.connectionId).sort(), crud.originalIds)
  assert.equal(restarted['connection-list'].profileKey, crud.profileKey)
  assert.notEqual(restarted['connection-list'].generation, crud.generation)
  console.log('Clean DSH profile: restart after deleting all fixture connections, persisted migration and fresh profile generation passed')
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
