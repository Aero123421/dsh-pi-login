import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
const home = await mkdtemp(join(tmpdir(), 'pi-update-clean-'))
const env = { ...process.env, DSH_HOME: home }
const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const source = process.argv[2] ?? resolve(`artifacts/local-dsh-pi-login-${packageJson.version}.tgz`)
function run(args) {
 const result = spawnSync('dsh', args, { env, encoding: 'utf8', timeout: 180000 })
 if (result.status !== 0) { writeFile(join(home,'install.log'),result.stdout+result.stderr); throw new Error('DSH clean install failed: '+home) }
}
run(['--profile','smoke','--from-default-profile','web','--dump-config'])
run(['plugin','--profile','smoke','add','-w','--ignore-scripts',source])
const profile = join(home,'profiles','smoke','package.json')
const manifest = JSON.parse(await readFile(profile,'utf8'))
manifest.dsh.profile.bundles.push('@local/dsh-pi-login')
await writeFile(profile,JSON.stringify(manifest,null,2))
const child = spawn('dsh',['--profile','smoke','--no-open','--port','0'],{env,stdio:['ignore','pipe','pipe']})
let output='';const append=chunk=>{output+=chunk.toString()}; child.stdout.on('data',append);child.stderr.on('data',append)
const done = new Promise(resolve=>child.once('exit',resolve))
try {
 let url
 for (let attempt=0;attempt<300;attempt++) {
   const match=output.match(/http:\/\/(?:127\.0\.0\.1|localhost):\d+\S*/)
   if (match) { url=match[0].replace(/\x1b\[[0-9;]*m/g,''); break }
   if (child.exitCode!==null) throw new Error('DSH startup exited')
   await new Promise(resolve=>setTimeout(resolve,100))
 }
 if (!url) throw new Error('No DSH URL')
 const { chromium } = await import('playwright')
 const browser=await chromium.launch({headless:true,...(process.env.DSH_TEST_CHROMIUM ? {executablePath:process.env.DSH_TEST_CHROMIUM} : {})})
 try {
  const page=await browser.newPage();await page.goto(url)
  const result=await page.evaluate(async()=>{
    const method='dsh-pi-login/update-status'
    return (await fetch('/api/'+method,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'client-request',rpcId:'smoke',method,payload:{}})})).json()
  })
  assert.equal(result.result.ok,true)
  assert.equal(result.result.value.runtimeVersion,packageJson.version)
  assert.equal(result.result.value.status,'idle')
  const update=await page.evaluate(async()=>{
    const method='dsh-pi-login/update-check'
    return (await fetch('/api/'+method,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'client-request',rpcId:'smoke-check',method,payload:{}})})).json()
  })
  assert.equal(update.result.ok,true)
  assert.ok(['current', 'available'].includes(update.result.value.status), 'Live release check: ' + update.result.value.reason)
  console.log('Clean DSH profile: installation, bundle startup, running '+packageJson.version+', manager capability and live release check passed; evidence '+home)
 } finally {await browser.close()}
} catch(error) {await writeFile(join(home,'startup.log'),output);console.error(error.message+'; logs '+home);process.exitCode=1}
finally {child.kill('SIGTERM');await done}
