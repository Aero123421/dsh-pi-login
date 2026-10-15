import { createHash, randomUUID } from 'node:crypto'
import { mkdir, mkdtemp, writeFile, readFile, rename, lstat } from 'node:fs/promises'
import { join, resolve, sep, basename, win32 } from 'node:path'
import { gunzipSync } from 'node:zlib'
import semver from 'semver'
import { updateRequestId } from './update-request-id.ts'
import manifest from '../package.json' with { type: 'json' }

export const REPOSITORY = 'Aero123421/dsh-pi-login'
export const PACKAGE = '@local/dsh-pi-login'
export const RELEASES = `https://github.com/${REPOSITORY}/releases`
const ROOT = `https://api.github.com/repos/${REPOSITORY}`
const MAX_PACKAGE = 32 * 1024 * 1024
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/

function reasonOf(error) {
  const allowed = ['manager-unavailable', 'read-only', 'source', 'metadata', 'asset', 'channel', 'incompatible', 'compatibility-unknown', 'busy', 'checksum', 'redirect', 'size', 'stale-candidate', 'release-unavailable', 'storage', 'interrupted']
  return allowed.includes(error?.message) ? error.message : 'network'
}

export function semanticVersion(value) {
  if (typeof value !== 'string') throw new Error('metadata')
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(value)
  if (!match || match[4]?.split('.').some(part => /^\d+$/.test(part) && part.length > 1 && part.startsWith('0'))) throw new Error('metadata')
  return { numbers: match.slice(1, 4).map(BigInt), pre: match[4]?.split('.') }
}
export function compareVersions(left, right) {
  const a = semanticVersion(left), b = semanticVersion(right)
  for (let i = 0; i < 3; i++) if (a.numbers[i] !== b.numbers[i]) return a.numbers[i] > b.numbers[i] ? 1 : -1
  if (!a.pre || !b.pre) return a.pre ? -1 : b.pre ? 1 : 0
  for (let i = 0; i < Math.max(a.pre.length, b.pre.length); i++) {
    const x = a.pre[i], y = b.pre[i]
    if (x === y) continue
    if (x === undefined || y === undefined) return x === undefined ? -1 : 1
    const nx = /^\d+$/.test(x), ny = /^\d+$/.test(y)
    if (nx && ny) return BigInt(x) > BigInt(y) ? 1 : -1
    if (nx !== ny) return nx ? -1 : 1
    return x > y ? 1 : -1
  }
  return 0
}

function allowedUrl(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash) throw new Error('redirect')
  if (url.hostname === 'api.github.com' && url.pathname.startsWith(`/repos/${REPOSITORY}/`)) return url
  if (url.hostname === 'github.com' && url.pathname.startsWith(`/${REPOSITORY}/releases/download/`)) return url
  if (url.hostname === 'raw.githubusercontent.com' && url.pathname.startsWith(`/${REPOSITORY}/`)) return url
  if (['release-assets.githubusercontent.com', 'objects.githubusercontent.com'].includes(url.hostname)) return url
  throw new Error('redirect')
}
export async function boundedFetch(url, limit, { fetcher = fetch, signal } = {}) {
  const timeout = AbortSignal.timeout(20000)
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout
  for (let redirects = 0; redirects <= 4; redirects++) {
    const response = await fetcher(allowedUrl(url), { redirect: 'manual', signal: combined, headers: { accept: 'application/vnd.github+json' } })
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = response.headers.get('location'); await response.body?.cancel()
      if (!next) throw new Error('redirect')
      url = new URL(next, url).href; continue
    }
    if (!response.ok) { await response.body?.cancel(); throw new Error(response.status === 404 ? 'release-unavailable' : 'network') }
    if (Number(response.headers.get('content-length')) > limit) { await response.body?.cancel(); throw new Error('size') }
    const chunks = []; let bytes = 0
    const reader = response.body?.getReader()
    if (!reader) throw new Error('network')
    try {
      for (;;) {
        combined.throwIfAborted()
        const { done, value } = await reader.read()
        if (done) return Buffer.concat(chunks, bytes)
        bytes += value.byteLength
        if (bytes > limit) throw new Error('size')
        chunks.push(Buffer.from(value))
      }
    } finally { await reader.cancel().catch(() => {}); reader.releaseLock() }
  }
  throw new Error('redirect')
}

export function sourceKind(source, cacheDir, installedVersion) {
  if (typeof source !== 'string') throw new Error('source')
  if (/^github:Aero123421\/dsh-pi-login(?:#[A-Za-z0-9._/-]+)?$/.test(source)) return 'github'
  if (/^(?:git\+)?https:\/\/github\.com\/Aero123421\/dsh-pi-login(?:\.git)?(?:#[A-Za-z0-9._/-]+)?$/.test(source)) return 'github'
  if (/^https:\/\/github\.com\/Aero123421\/dsh-pi-login\/releases\/download\/v[^/]+\/local-dsh-pi-login-[^/]+\.tgz$/.test(source)) return 'tarball'
  if (cacheDir && source.startsWith('file:') && resolve(source.slice(5)).startsWith(resolve(cacheDir) + sep)) return 'tarball'
  if (installedVersion && source.startsWith('file:')) {
    semanticVersion(installedVersion)
    const file = source.slice(5)
    if ([basename(file), win32.basename(file)].includes(`local-dsh-pi-login-${installedVersion}.tgz`)) return 'tarball'
  }
  // Arbitrary local files and registry packages have no verified update provenance.
  throw new Error('source')
}
export function releaseCandidate(release, current) {
  if (!release || !Number.isSafeInteger(release.id) || release.id <= 0 || release.draft !== false || release.prerelease !== false || typeof release.tag_name !== 'string' || !release.tag_name.startsWith('v')) throw new Error('metadata')
  const version = release.tag_name.slice(1)
  if (semanticVersion(version).pre) throw new Error('channel')
  const expectedLink = `${RELEASES}/tag/${release.tag_name}`
  if (release.html_url !== expectedLink || typeof release.body !== 'string' || !Array.isArray(release.assets)) throw new Error('metadata')
  const filename = `local-dsh-pi-login-${version}.tgz`
  function asset(name) {
    const matches = release.assets.filter(asset => asset?.name === name)
    if (matches.length !== 1) throw new Error('asset')
    const item = matches[0]
    if (!Number.isSafeInteger(item.id) || item.id <= 0 || !Number.isSafeInteger(item.size) || item.size <= 0 || item.browser_download_url !== `https://github.com/${REPOSITORY}/releases/download/${release.tag_name}/${name}`) throw new Error('asset')
    return item.browser_download_url
  }
  const candidate = { id: String(release.id), version, tag: release.tag_name, url: expectedLink, notes: release.body.slice(0, 6000), filename, tarball: asset(filename), checksum: asset('SHA256SUMS') }
  return compareVersions(version, current) > 0 ? candidate : null
}
/** A comparator set has an upper bound when every alternative is capped.
 * An exact version is a cap. `*`, `>=0`, and `>=1.2.3` are not.
 */
function rangeHasUpperBound(range) {
  let parsed
  try { parsed = new semver.Range(range, { includePrerelease: true }) }
  catch { return false }
  if (!parsed.set?.length) return false
  return parsed.set.every(comparators => comparators.some(item => {
    if (item.operator === '<' || item.operator === '<=') return true
    return (item.operator === '' || item.operator === '=') && typeof item.semver?.version === 'string'
  }))
}

/** Whether one DSH peer range accepts the running host.
 * `semver.satisfies` includes prereleases. A range with no upper bound, and
 * any `workspace:` spec, is rejected: the former keeps accepting the next
 * major, and the latter means whatever happens to be running.
 */
export function dshPeerSatisfied(range, runtime) {
  semanticVersion(runtime)
  if (typeof range !== 'string') return false
  const text = range.trim()
  if (text === '' || text.startsWith('workspace:') || !rangeHasUpperBound(text)) return false
  try { return semver.satisfies(runtime, text, { includePrerelease: true }) }
  catch { return false }
}

export function checkCompatibility(packageJson, candidate, runtime) {
  semanticVersion(runtime)
  if (!packageJson || packageJson.name !== PACKAGE || packageJson.version !== candidate.version || typeof packageJson.dsh?.bundle?.patch !== 'string') throw new Error('metadata')
  const peers = Object.entries(packageJson.peerDependencies ?? {}).filter(([name]) => name === '@deepseek-ai/dsh' || name.startsWith('@deepseek-ai/dsh-'))
  if (!peers.length || peers.some(([, range]) => typeof range !== 'string')) throw new Error('compatibility-unknown')
  if (peers.some(([, range]) => !dshPeerSatisfied(range, runtime))) throw new Error('incompatible')
  return runtime
}

function bundleRecord(list, name) {
  return list?.find(item => item?.name === name)
}

/** Same unsuccessful outcomes as `resultState`: cancellation, override, failure, and a bad package exit.
 * A missing result is unsuccessful too. `applied` and `restart-required` with a clean exit are not.
 */
function installNeedsRestore(result) {
  if (!result) return true
  if (result.application === 'cancelled' || result.application === 'overridden') return true
  if (result.error || result.application === 'failed') return true
  if (result.packageResult && (result.packageResult.exitCode !== 0 || result.packageResult.timedOut)) return true
  return result.application !== 'applied' && result.application !== 'restart-required'
}

/** The package is back only when the listed version is the one we asked to reinstall. */
function sameRestoredVersion(previous, restored, item) {
  if (!item?.installed || typeof item.version !== 'string' || installNeedsRestore(restored)) return false
  const expected = typeof previous?.version === 'string' ? previous.version : restored?.version
  if (typeof expected !== 'string' || item.version !== expected) return false
  return typeof restored?.version !== 'string' || restored.version === item.version
}

/** Reinstall the package captured before removal when the replacement is absent. */
export async function restoreIfMissing(manager, name, installed, previous) {
  if (!installNeedsRestore(installed)) return { result: installed, replaced: true, restored: false }
  if (typeof previous?.spec !== 'string' || typeof manager.listBundles !== 'function' || typeof manager.installBundle !== 'function') {
    return { result: installed, replaced: true, restored: false, restoreFailed: true }
  }
  let list
  try { list = await manager.listBundles() }
  catch { return { result: installed, replaced: true, restored: false, restoreFailed: true } }
  if (bundleRecord(list, name)?.installed) return { result: installed, replaced: true, restored: false }
  const requestId = typeof previous.requestId === 'function' ? previous.requestId() : previous.requestId
  let restored
  try {
    restored = await manager.installBundle(previous.spec, {
      enabled: previous.enabled,
      requestId,
      saveExact: true,
    })
  } catch {
    return { result: installed, replaced: true, restored: false, restoreFailed: true }
  }
  let after
  try { after = await manager.listBundles() }
  catch { return { result: installed, replaced: true, restored: false, restoreFailed: true } }
  const item = bundleRecord(after, name)
  if (!sameRestoredVersion(previous, restored, item)) {
    return { result: installed, replaced: true, restored: false, restoreFailed: true }
  }
  return { result: restored, replaced: true, restored: true, restoredVersion: item.version }
}

/** When an install or removal rejects, restore only after the list shows the package is gone.
 * A package that is still installed, or a list that itself fails, stays unresolved so the
 * original manager request can be reconciled. Returning a receipt means the operation is finished.
 */
async function recoverThrownInstall(manager, name, previous) {
  if (typeof manager?.listBundles !== 'function') return undefined
  let list
  try { list = await manager.listBundles() }
  catch { return undefined }
  if (bundleRecord(list, name)?.installed) return undefined
  return restoreIfMissing(manager, name, { application: 'failed', error: { code: 'install-failed' } }, previous)
}

/** Install a package, and when HMR refuses an installed package, remove it first.
 * The follow-up install is the continuation of `removeBundle`'s promise. Removal
 * disposes the bundle that called it, so this function must not read that
 * bundle's closed flag or abort signal. `stop-profile` means HMR is off and the
 * package stayed installed; installing over it is still the supported path.
 * A failed removal is returned as-is and is not followed by another install.
 * If the replacement install fails and the package is gone, `previous` is
 * installed again under a new request id.
 */
export async function installPreservingPackage(manager, name, spec, options, previous) {
  let result
  try {
    result = await manager.installBundle(spec, options)
  } catch (error) {
    const recovered = await recoverThrownInstall(manager, name, previous)
    if (recovered) return recovered
    throw error
  }
  if (result?.error?.code !== 'already-installed' || typeof manager.removeBundle !== 'function') {
    return { result, replaced: false, restored: false }
  }
  let removed
  try {
    removed = await manager.removeBundle(name)
  } catch (error) {
    const recovered = await recoverThrownInstall(manager, name, previous)
    if (recovered) return recovered
    throw error
  }
  const stopped = removed?.error?.code === 'stop-profile'
  if (!stopped && (!removed || removed.application === 'failed' || removed.error)) {
    return { result: removed ?? { application: 'failed' }, replaced: true, restored: false }
  }
  let installed
  try {
    installed = await manager.installBundle(spec, options)
  } catch (error) {
    const recovered = await recoverThrownInstall(manager, name, previous)
    if (recovered) return recovered
    throw error
  }
  if (!installNeedsRestore(installed)) return { result: installed, replaced: true, restored: false }
  return restoreIfMissing(manager, name, installed, previous)
}
export function packageManifest(bytes) {
  let tar
  try { tar = gunzipSync(bytes, { maxOutputLength: 128 * 1024 * 1024 }) }
  catch { throw new Error('metadata') }
  if (tar.length % 512 !== 0) throw new Error('metadata')
  let manifest, ended = false
  const paths = new Set()
  for (let offset = 0; offset + 512 <= tar.length;) {
    const header = tar.subarray(offset, offset + 512)
    if (header.every(byte => byte === 0)) {
      // A package ends with two zero records, followed only by padding.
      if (offset + 1024 > tar.length || !tar.subarray(offset).every(byte => byte === 0)) throw new Error('metadata')
      ended = true
      break
    }
    const checksumText = header.subarray(148, 156).toString().replace(/\0.*$/, '').trim()
    const checksum = header.reduce((sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte), 0)
    if (!/^[0-7]+$/.test(checksumText) || checksum !== Number.parseInt(checksumText, 8)) throw new Error('metadata')
    const name = header.subarray(0, 100).toString().replace(/\0.*$/, '')
    const prefix = header.subarray(345, 500).toString().replace(/\0.*$/, '')
    const sizeText = header.subarray(124, 136).toString().replace(/\0.*$/, '').trim()
    if (!/^[0-7]+$/.test(sizeText)) throw new Error('metadata')
    const size = Number.parseInt(sizeText, 8)
    const next = offset + 512 + Math.ceil(size / 512) * 512
    if (!Number.isSafeInteger(size) || next > tar.length) throw new Error('metadata')
    const path = prefix ? `${prefix}/${name}` : name
    // Our npm release assets contain regular files and directories only.
    // Reject links and path-rewriting extensions rather than inspecting one
    // manifest while the package manager interprets a different archive.
    const directory = header[156] === 53
    if (![0, 48, 53].includes(header[156]) || (directory && size !== 0)) throw new Error('metadata')
    const entry = directory && path.endsWith('/') ? path.slice(0, -1) : path
    const parts = entry.split('/')
    if (parts[0] !== 'package' || (!directory && parts.length < 2) || parts.some(part => !part || part === '.' || part === '..' || part.includes('\\')) || paths.has(entry)) throw new Error('metadata')
    paths.add(entry)
    if (path === 'package/package.json') {
      if (manifest || directory || size > 65536) throw new Error('metadata')
      try { manifest = JSON.parse(tar.subarray(offset + 512, offset + 512 + size).toString()) }
      catch { throw new Error('metadata') }
    }
    offset = next
  }
  if (!manifest || !ended) throw new Error('metadata')
  return manifest
}
function safeResult(result) {
  if (!result) return null
  return { changed: result.changed, application: result.application, stage: result.stage,
    target: PACKAGE, bundle: result.bundle, version: result.version, enabled: result.enabled,
    ...(result.error ? { error: { code: result.error.code } } : {}),
    ...(result.packageResult ? { packageResult: { exitCode: result.packageResult.exitCode, timedOut: result.packageResult.timedOut, kind: result.packageResult.kind } } : {}),
  }
}

export function resultState(result, expected, runtime, installed) {
  if (!result) return 'unknown'
  if (['cancelled', 'overridden'].includes(result.application)) return result.application
  if (
    result.error ||
    result.application === 'failed' ||
    (result.packageResult && (result.packageResult.exitCode !== 0 || result.packageResult.timedOut))
  )
    return 'failed'
  if (
    result.bundle !== PACKAGE ||
    result.version !== expected ||
    !installed?.installed ||
    installed.version !== expected ||
    installed.error ||
    installed.readOnlyReason
  )
    return 'unknown'
  if (result.application === 'restart-required') return 'restart-required'
  return result.application === 'applied' && runtime === expected ? 'applied' : 'unknown'
}

/** Optional manager is resolved for every operation; login never depends on it. */
export class PluginUpdates {
  constructor({ manager, profileDir, runtimeVersion, isBusy = () => false, fetcher = fetch, version = manifest.version }) {
    Object.assign(this, { manager, profileDir, runtimeVersion, isBusy, fetcher, version })
    this.candidate = null; this.checking = null; this.running = null; this.closed = false; this.abort = new AbortController()
  }
  get cacheDir() { return this.profileDir && join(this.profileDir, '.dsh-pi-login-updates') }
  async capability() {
    const manager = this.manager()
    if (!manager || typeof manager.listBundles !== 'function' || typeof manager.installBundle !== 'function' || typeof manager.waitForInstall !== 'function' || !this.profileDir) throw new Error('manager-unavailable')
    const bundle = (await manager.listBundles()).find(item => item.name === PACKAGE)
    if (!bundle?.installed || bundle.readOnlyReason || bundle.error) throw new Error('read-only')
    semanticVersion(bundle.version)
    const source = sourceKind(bundle.source, this.cacheDir, bundle.version)
    if (bundle.source.startsWith('file:')) {
      try { if (!(await lstat(bundle.source.slice(5))).isFile()) throw new Error('source') } catch { throw new Error('source') }
    }
    const dshVersion = await this.runtimeVersion(); semanticVersion(dshVersion)
    return { manager, bundle, source, dshVersion }
  }
  base() {
    return {
      runtimeVersion: this.version,
      releases: RELEASES,
      profileKey: this.profileDir
        ? createHash('sha256')
            .update(PACKAGE + '\0' + resolve(this.profileDir))
            .digest('hex')
        : undefined,
    }
  }
  async lastOperation() {
    try {
      const value = JSON.parse(await readFile(join(this.cacheDir, 'latest.json'), 'utf8'))
      return typeof value.requestId === 'string' && UUID.test(value.requestId) ? value.requestId : undefined
    } catch { return undefined }
  }
  async status() { try {
    const { dshVersion, bundle } = await this.capability()
    const requestId = this.running?.requestId ?? await this.lastOperation()
    if (requestId) return { ...(await this.reconcile(requestId)), dshVersion }
    return { ...this.base(), dshVersion, installedVersion: bundle.version,
      status: bundle.version !== this.version ? 'restart-required' : 'idle' }
  } catch (error) { return { ...this.base(), status: 'blocked', reason: reasonOf(error) } } }
  async privateDir() {
    await mkdir(this.cacheDir, { recursive: true, mode: 0o700 })
    if (!(await lstat(this.cacheDir)).isDirectory() || (await lstat(this.cacheDir)).isSymbolicLink()) throw new Error('storage')
    return this.cacheDir
  }
  async getCandidate(current) {
    const options = { fetcher: this.fetcher, signal: this.abort.signal }
    const release = JSON.parse((await boundedFetch(`${ROOT}/releases/latest`, 256 * 1024, options)).toString())
    const candidate = releaseCandidate(release, current)
    if (!candidate) return null
    const packageJson = JSON.parse((await boundedFetch(`https://raw.githubusercontent.com/${REPOSITORY}/${candidate.tag}/package.json`, 64 * 1024, options)).toString())
    candidate.compatibility = checkCompatibility(packageJson, candidate, await this.runtimeVersion())
    return candidate
  }
  check() {
    if (this.checking) return this.checking
    this.checking = (async () => {
      try {
        if (this.closed || this.running) throw new Error('busy')
        const { bundle } = await this.capability()
        const last = await this.lastOperation()
        if (last && ['installing', 'unknown', 'restart-required'].includes((await this.reconcile(last)).status)) throw new Error('busy')
        // A manual/other-client installation has no journal of ours. The
        // current Host still needs restarting before we offer another update.
        if (bundle.version !== this.version) {
          this.candidate = null
          return { ...this.base(), installedVersion: bundle.version, status: 'restart-required' }
        }
        this.candidate = await this.getCandidate(bundle.version ?? this.version)
        return { ...this.base(), status: this.candidate ? 'available' : 'current', candidate: this.candidate && this.publicCandidate(this.candidate), checkedAt: new Date().toISOString() }
      } catch (error) { this.candidate = null; return { ...this.base(), status: 'blocked', reason: reasonOf(error) } }
    })().finally(() => { this.checking = null })
    return this.checking
  }
  publicCandidate(candidate) { const { id, version, url, notes, compatibility } = candidate; return { id, version, url, notes, compatibility } }
  async begin(id, operationId, profileKey) {
    if (!profileKey || profileKey !== this.base().profileKey) throw new Error('profile')
    if (typeof operationId !== 'string') throw new Error('invalid-request')
    const requestId = updateRequestId(operationId)
    await this.capability()
    if (this.running?.requestId === requestId) return { ...this.base(), ...this.running }
    try {
      await readFile(join(this.cacheDir, `${requestId}.json`))
      return this.reconcile(requestId)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    const last = await this.lastOperation()
    if (last && ['installing', 'unknown', 'restart-required'].includes((await this.reconcile(last)).status))
      throw new Error('busy')
    if (this.closed || this.running || this.checking || this.isBusy()) throw new Error('busy')
    if (typeof id !== 'string' || !this.candidate || id !== this.candidate.id) throw new Error('stale-candidate')
    const candidate = this.candidate
    this.running = { requestId, version: candidate.version, status: 'preparing' }
    try {
      await this.privateDir()
      await this.save(this.running, true)
    } catch (error) {
      this.running = null
      throw error
    }
    // Do not await install in an RPC owned by the plugin being replaced.
    void this.execute(candidate, this.running).finally(() => {
      this.running = null
    })
    return { ...this.base(), ...this.running }
  }
  async save(operation, claim = false) {
    const directory = await this.privateDir(),
      file = join(directory, `${operation.requestId}.json`)
    const temp = join(directory, `${operation.requestId}.${randomUUID()}.tmp`)
    await writeFile(temp, JSON.stringify(operation), { flag: 'wx', mode: 0o600 })
    await rename(temp, file)
    if (!claim) return
    const index = join(directory, `${randomUUID()}.tmp`)
    await writeFile(index, JSON.stringify({ requestId: operation.requestId }), { flag: 'wx', mode: 0o600 })
    await rename(index, join(directory, 'latest.json'))
  }
  async execute(candidate, operation) {
    let managerInvoked = false
    let activeManager
    let previous
    try {
      const before = await this.capability()
      const fresh = await this.getCandidate(before.bundle.version ?? this.version)
      if (
        !fresh ||
        fresh.id !== candidate.id ||
        fresh.version !== candidate.version ||
        fresh.tarball !== candidate.tarball
      )
        throw new Error('stale-candidate')
      const options = { fetcher: this.fetcher, signal: this.abort.signal }
      const checksum = (await boundedFetch(candidate.checksum, 8192, options)).toString()
      const lines = checksum.trim().split(/\r?\n/)
      if (lines.length !== 1) throw new Error('checksum')
      const match = /^([a-fA-F0-9]{64}) {2}(\S+)$/.exec(lines[0])
      if (!match || match[2] !== candidate.filename) throw new Error('checksum')
      const bytes = await boundedFetch(candidate.tarball, MAX_PACKAGE, options)
      if (createHash('sha256').update(bytes).digest('hex') !== match[1].toLowerCase()) throw new Error('checksum')
      checkCompatibility(packageManifest(bytes), candidate, await this.runtimeVersion())
      const dir = await mkdtemp(join(await this.privateDir(), 'verified-'))
      const path = join(dir, candidate.filename)
      await writeFile(path, bytes, { flag: 'wx', mode: 0o600 })
      const latest = await this.capability()
      if (
        latest.bundle.source !== before.bundle.source ||
        latest.bundle.enabled !== before.bundle.enabled ||
        this.isBusy() ||
        this.closed
      )
        throw new Error('busy')
      const spec = latest.source === 'github' ? `github:${REPOSITORY}#${candidate.tag}` : path
      operation.status = 'installing'
      await this.save(operation)
      if (this.closed || this.isBusy()) throw new Error('busy')
      const final = await this.capability()
      if (this.closed || this.isBusy() || final.bundle.source !== before.bundle.source) throw new Error('busy')
      if (compareVersions(candidate.version, final.bundle.version) <= 0) throw new Error('stale-candidate')
      managerInvoked = true
      activeManager = final.manager
      // Capture the manager, the ON/OFF bit, the version, and the installed spec before removal.
      // removeBundle disposes this plugin; installPreservingPackage continues on the manager.
      previous = {
        spec: final.bundle.source,
        enabled: final.bundle.enabled,
        version: final.bundle.version,
        requestId: () => updateRequestId(),
      }
      const admission = await installPreservingPackage(final.manager, PACKAGE, spec, {
        enabled: final.bundle.enabled,
        requestId: operation.requestId,
        saveExact: true,
      }, previous)
      const result = admission.result
      if (admission.restored) {
        operation.reason = 'restored'
        operation.restoredVersion = admission.restoredVersion
        operation.status = 'failed'
      } else if (admission.restoreFailed) {
        operation.reason = 'restore-failed'
        operation.status = 'failed'
      } else if (result?.error?.code === 'already-installed' || (admission.replaced && (result?.application === 'failed' || result?.error))) {
        operation.reason = 'replace'
      }
      operation.result = safeResult(result)
      // A later listBundles failure must not replace a completed restore with
      // `unknown`. Unknown blocks the next check. The restored receipt is already
      // failed, and reconcile keeps that failure.
      if (operation.reason !== 'restored' && operation.reason !== 'restore-failed') {
        const installed = (await final.manager.listBundles()).find(item => item.name === PACKAGE)
        operation.status = resultState(result, operation.version, this.version, installed)
      }
    } catch (error) {
      // A rejection after the manager was called must not stay `unknown` once the
      // package is confirmed absent. Unknown blocks the next check. If the list
      // still shows the package, or the list itself fails, keep unknown so
      // reconcile can ask the manager about the original request.
      let recovered
      if (managerInvoked && activeManager && previous) {
        try {
          const list = await activeManager.listBundles()
          if (!bundleRecord(list, PACKAGE)?.installed) {
            recovered = await restoreIfMissing(activeManager, PACKAGE, { application: 'failed', error: { code: 'install-failed' } }, previous)
          }
        } catch { recovered = undefined }
      }
      if (recovered?.restored || recovered?.restoreFailed) {
        operation.reason = recovered.restored ? 'restored' : 'restore-failed'
        if (recovered.restored) operation.restoredVersion = recovered.restoredVersion
        operation.status = 'failed'
        operation.result = safeResult(recovered.result)
      } else {
        operation.status = managerInvoked ? 'unknown' : 'failed'
        operation.reason = reasonOf(error)
      }
    }
    try {
      await this.save(operation)
    } catch {
      /* Manager retains its running operation; reconcile still checks it. */
    }
  }
  async reconcile(requestId) {
    if (typeof requestId !== 'string' || !UUID.test(requestId)) throw new Error('invalid-request')
    let operation
    try {
      operation = JSON.parse(await readFile(join(this.cacheDir, `${requestId}.json`), 'utf8'))
    } catch {
      return { ...this.base(), status: 'unknown', requestId }
    }
    if (operation.requestId !== requestId || typeof operation.version !== 'string')
      return { ...this.base(), status: 'unknown', requestId }
    semanticVersion(operation.version)
    if (this.running?.requestId === requestId) return { ...this.base(), ...this.running }
    if (operation.status === 'preparing') {
      operation.status = 'failed'
      operation.reason = 'interrupted'
      await this.save(operation)
    }
    if (['installing', 'unknown'].includes(operation.status) && !operation.result) {
      const manager = this.manager()
      const result = manager && (await manager.waitForInstall(requestId))
      if (result) {
        operation.result = safeResult(result)
        // Verify the actual installed bundle below before reporting success.
      } else operation.status = 'unknown'
    }
    const bundle = (await this.manager()?.listBundles())?.find(item => item.name === PACKAGE)
    const installed = bundle?.version
    const recovery = operation.reason === 'restored' || operation.reason === 'restore-failed'
    if (operation.result && !recovery) operation.status = resultState(operation.result, operation.version, this.version, bundle)
    if (recovery) operation.status = 'failed'
    // A completed receipt cannot describe a later installation made by the
    // normal manager UI/CLI. Keep the old request, but report the actual need
    // for restart instead of leaving that completed request unknown forever.
    if (!recovery && operation.result && bundle?.installed && !bundle.error && !bundle.readOnlyReason &&
      compareVersions(installed, operation.version) > 0) {
      return { ...this.base(), ...operation, installedVersion: installed,
        // The recorded operation is older than the bundle now running. That is
        // not a settings override of this operation's own install.
        status: this.version === installed ? 'superseded' : 'restart-required' }
    }
    if (
      ['installing', 'restart-required', 'unknown', 'applied'].includes(operation.status) &&
      this.version === operation.version
    ) {
      operation.status =
        bundle?.installed && !bundle.error && !bundle.readOnlyReason && installed === operation.version
          ? 'applied'
          : 'unknown'
    }
    return { ...this.base(), ...operation, installedVersion: installed }
  }
  dispose() {
    this.closed = true
    this.abort.abort()
  }
}
