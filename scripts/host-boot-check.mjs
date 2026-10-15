import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawn, spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

/** Ensure the profile lists the package. A missing `bundles` array is created; it is not read as a method. */
export function includeProfileBundle(manifest, packageName) {
  if (!manifest || typeof manifest !== 'object') throw new Error('profile')
  if (!manifest.dsh || typeof manifest.dsh !== 'object' || Array.isArray(manifest.dsh)) manifest.dsh = {}
  if (!manifest.dsh.profile || typeof manifest.dsh.profile !== 'object' || Array.isArray(manifest.dsh.profile)) manifest.dsh.profile = {}
  if (!Array.isArray(manifest.dsh.profile.bundles)) manifest.dsh.profile.bundles = []
  if (!manifest.dsh.profile.bundles.includes(packageName)) manifest.dsh.profile.bundles.push(packageName)
  return manifest
}

async function boot() {
const home = await mkdtemp(join(tmpdir(), 'pi-boot-'))
const env = { ...process.env, DSH_HOME: home }
const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const source = process.argv[2] ?? resolve(`artifacts/local-dsh-pi-login-${packageJson.version}.tgz`)

function run(args) {
  const result = spawnSync('dsh', args, { env, encoding: 'utf8', timeout: 180000 })
  if (result.status !== 0) {
    const stderr = result.stderr ?? ''
    const code = result.error?.code ?? (stderr.match(/\b(?:ERR_[A-Z0-9_]+|EACCES|EPERM|ENOENT|ENOTDIR)\b/)?.[0] ?? 'CLI_FAILED')
    console.error('DSH bootstrap diagnostic: ' + JSON.stringify({
      stage: args.includes('--dump-config') ? 'profile-bootstrap' : 'plugin-install',
      status: result.status, signal: result.signal, code,
    }))
    throw new Error('DSH command failed; private logs: ' + home)
  }
}

await run(['--profile', 'boot', '--from-default-profile', 'web', '--dump-config'])
await run(['plugin', '--profile', 'boot', 'add', '-w', '--ignore-scripts', source])
const profile = join(home, 'profiles', 'boot', 'package.json')
const manifest = JSON.parse(await readFile(profile, 'utf8'))
includeProfileBundle(manifest, '@local/dsh-pi-login')
await writeFile(profile, JSON.stringify(manifest, null, 2))

let output = ''
const child = spawn('dsh', ['--profile', 'boot', '--no-open', '--port', '0'], { env, stdio: ['ignore', 'pipe', 'pipe'] })
const append = chunk => { output += chunk.toString() }
child.stdout.on('data', append)
child.stderr.on('data', append)
const done = new Promise(resolveExit => child.once('exit', resolveExit))
try {
  let url
  for (let attempt = 0; attempt < 300; attempt++) {
    const match = output.match(/http:\/\/(?:127\.0\.0\.1|localhost):\d+\S*/)
    if (match) { url = match[0].replace(/\x1b\[[0-9;]*m/g, ''); break }
    if (child.exitCode !== null) throw new Error('DSH startup exited; private logs: ' + home)
    await new Promise(resolveWait => setTimeout(resolveWait, 100))
  }
  if (!url) throw new Error('No DSH URL; private logs: ' + home)
  if (/disabling profile plugin[^\n]*dsh-pi-login/.test(output)) {
    throw new Error('Boot disabled dsh-pi-login; private logs: ' + home)
  }
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true, ...(process.env.DSH_TEST_CHROMIUM ? { executablePath: process.env.DSH_TEST_CHROMIUM } : {}) })
  try {
    const page = await browser.newPage()
    await page.goto(url)
    const envelope = await page.evaluate(async () => {
      const method = 'dsh-pi-login/update-status'
      const response = await fetch('/api/' + method, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'client-request', rpcId: 'boot', method, payload: {} }),
      })
      return response.json()
    })
    assert.equal(envelope.result?.ok, true)
    assert.equal(envelope.result.value.runtimeVersion, packageJson.version)
    console.log('DSH boot: plugin loaded, update-status reports ' + packageJson.version)
  } finally {
    await browser.close()
  }
} finally {
  child.kill('SIGTERM')
  const timer = setTimeout(() => { if (child.exitCode === null) child.kill('SIGKILL') }, 10000)
  try { await done } finally { clearTimeout(timer) }
}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await boot()
