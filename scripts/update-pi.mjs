import { readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const manifestPath = 'package.json'
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const requested = process.argv[2] ?? 'latest'
if (requested !== 'latest' && !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(requested)) throw new Error('Specify latest or a Pi SDK version')
const info = spawnSync(npm, ['view', `@earendil-works/pi-ai@${requested}`, 'version', '--json'], { encoding: 'utf8', shell: process.platform === 'win32' })
if (info.status !== 0) throw new Error('Could not read the Pi SDK version from npm')
const version = JSON.parse(info.stdout)
if (typeof version !== 'string') throw new Error('Expected one exact Pi SDK version')
if (manifest.dependencies['@earendil-works/pi-ai'] === version) {
  console.log(`Pi SDK ${version} is already pinned`)
  process.exit(0)
}
const result = spawnSync(npm, ['install', '--save-exact', `@earendil-works/pi-ai@${version}`, '--ignore-scripts'], { stdio: 'inherit', shell: process.platform === 'win32' })
if (result.status !== 0) process.exit(result.status ?? 1)
const updated = JSON.parse(await readFile(manifestPath, 'utf8'))
const [major, minor, patch] = updated.version.split('.').map(Number)
updated.version = `${major}.${minor}.${patch + 1}`
await writeFile(manifestPath, JSON.stringify(updated, null, 2) + '\n')
const lock = spawnSync(npm, ['install', '--package-lock-only', '--ignore-scripts'], { stdio: 'inherit', shell: process.platform === 'win32' })
if (lock.status !== 0) process.exit(lock.status ?? 1)
console.log(`Pi SDK ${version} pinned; plugin ${updated.version}. Run build, test, test:compat, test:runtime, test:browser, and pack:plugins before distributing.`)
