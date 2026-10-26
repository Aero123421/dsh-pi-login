import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile, mkdir, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID, createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { PluginUpdates, REPOSITORY, PACKAGE, compareVersions, semanticVersion, releaseCandidate, checkCompatibility, checkUpdateScope, dshPeerSatisfied, installPreservingPackage, restoreIfMissing, resultState, sourceKind, boundedFetch, packageManifest } from '../src/updates.mjs'
const version = '0.6.0', tag = `v${version}`
const filename = `local-dsh-pi-login-${version}.tgz`
const download = `https://github.com/${REPOSITORY}/releases/download/${tag}/`
const release = { id: 7, tag_name: tag, html_url: `https://github.com/${REPOSITORY}/releases/tag/${tag}`, draft: false, prerelease: false, body: 'Changes', assets: [filename, 'SHA256SUMS'].map((name, i) => ({ name, id: i + 1, size: 50, browser_download_url: download + name })) }
const pkg = { name: PACKAGE, version, dsh: { bundle: { patch: './cordis.patch.yml' } }, peerDependencies: { '@deepseek-ai/dsh-llm': '0.2.1-alpha.2' } }
function tarEntry(name, content = '', type = 48) {
  content = Buffer.from(content)
  const header = Buffer.alloc(512)
  header.write(name); header.write(content.length.toString(8).padStart(11, '0'), 124); header[156] = type
  header.fill(32, 148, 156)
  header.write(header.reduce((sum, byte) => sum + byte, 0).toString(8).padStart(6, '0') + '\0 ', 148)
  return Buffer.concat([header, content, Buffer.alloc((512 - content.length % 512) % 512)])
}
function tarPackage(value = pkg, entries = []) {
  return gzipSync(Buffer.concat([...entries, tarEntry('package/package.json', JSON.stringify(value)), Buffer.alloc(1024)]))
}
const bytes = tarPackage(), hash = createHash('sha256').update(bytes).digest('hex')
function fetcher(input) {
  const url = String(input)
  if (url.endsWith('/releases/latest')) return Promise.resolve(Response.json(release))
  if (url.endsWith('/package.json')) return Promise.resolve(Response.json(pkg))
  if (url.endsWith('SHA256SUMS')) return Promise.resolve(new Response(`${hash}  ${filename}\n`))
  if (url.endsWith('.tgz')) return Promise.resolve(new Response(bytes))
  throw new Error(url)
}
function manifestFetcher(candidateManifest, archiveManifest = candidateManifest) {
  const archive = tarPackage(archiveManifest)
  const archiveHash = createHash('sha256').update(archive).digest('hex')
  return input => {
    const url = String(input)
    if (url.endsWith('/releases/latest')) return Promise.resolve(Response.json(release))
    if (url.endsWith('/package.json')) return Promise.resolve(Response.json(candidateManifest))
    if (url.endsWith('SHA256SUMS')) return Promise.resolve(new Response(`${archiveHash}  ${filename}\n`))
    if (url.endsWith('.tgz')) return Promise.resolve(new Response(archive))
    throw new Error(url)
  }
}
function mockEvaluator(calls) {
  return async (packageJson, exemptions, runtime) => {
    calls.push({ packageJson, exemptions, runtime })
    assert.deepEqual(exemptions, {})
    const range = packageJson.engines?.dsh
    return runtime === '0.2.1-rc.2' && range === '>=0.2.2 <0.3.0-0'
      ? { requirements: { 'engines.dsh': range } }
      : undefined
  }
}
async function fixture(t, overrides = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'pi-update-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const calls = []
  const bundle = { name: PACKAGE, installed: true, enabled: false, version: '0.5.0', source: `github:${REPOSITORY}` }
  const manager = { listBundles: async () => [bundle], waitForInstall: async () => null, installBundle: async (...args) => { calls.push(args); bundle.version = version; return { changed: true, application: 'restart-required', stage: 'install', target: PACKAGE, bundle: PACKAGE, version } } }
  const updater = new PluginUpdates({ manager: () => manager, profileDir: directory, runtimeVersion: async () => '0.2.1-alpha.2', fetcher, version: '0.5.0', ...overrides })
  t.after(() => updater.dispose())
  return { updater, manager, bundle, calls, directory }
}
async function settle(updater) { while (updater.running) await new Promise(resolve => setTimeout(resolve, 5)) }

test('strict SemVer ordering, numeric prereleases, build metadata and invalid metadata', () => {
  assert.equal(compareVersions('0.10.0', '0.9.0'), 1)
  assert.equal(compareVersions('1.0.0-alpha.10', '1.0.0-alpha.2'), 1)
  assert.equal(compareVersions('1.0.0', '1.0.0-rc.1'), 1)
  assert.equal(compareVersions('1.0.0+x', '1.0.0+y'), 0)
  for (const invalid of ['01.0.0', '1.0', '1.0.0-01', '', null]) assert.throws(() => semanticVersion(invalid))
})
test('release metadata and DSH compatibility follow the official evaluator', () => {
  const candidate = releaseCandidate(release, '0.5.0')
  assert.equal(releaseCandidate(release, version), null)
  assert.equal(checkCompatibility(pkg, candidate, '0.2.1-alpha.2'), '0.2.1-alpha.2')
  assert.throws(() => checkCompatibility(pkg, candidate, '0.2.1'), /incompatible/)
  assert.equal(checkCompatibility({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': '^0.2.1' } }, candidate, '0.2.1'), '0.2.1')
  assert.throws(() => checkCompatibility({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': '^0.2.1' } }, candidate, '0.2.1-alpha.3'), /incompatible/)
  const runtime = '0.2.1-rc.2'
  const peerLower = { '@deepseek-ai/dsh-llm': '>=0.2.1-alpha.2 <0.3.0-0' }
  const peerLater = { '@deepseek-ai/dsh-llm': '>=0.2.2 <0.3.0-0' }
  const engineLater = { ...pkg, engines: { dsh: '>=0.2.2 <0.3.0-0' }, peerDependencies: peerLower }
  const engineEarlier = { ...pkg, engines: { dsh: '>=0.2.1-alpha.2 <0.3.0-0' }, peerDependencies: peerLater }
  assert.throws(() => checkCompatibility(engineLater, candidate, runtime), error =>
    error.message === 'incompatible' && error.requiredDshVersion === '>=0.2.2 <0.3.0-0',
  )
  assert.equal(checkCompatibility(engineEarlier, candidate, runtime), runtime)
  assert.equal(checkUpdateScope(engineEarlier, runtime), runtime)
  assert.throws(() => checkCompatibility({ ...pkg, peerDependencies: peerLater }, candidate, runtime), error =>
    error.message === 'incompatible' && error.requiredDshVersion === '@deepseek-ai/dsh-llm >=0.2.2 <0.3.0-0',
  )
  assert.equal(checkCompatibility({ ...pkg, peerDependencies: peerLower }, candidate, runtime), runtime)
  assert.throws(() => checkCompatibility({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': '>=0.2.1-alpha.2 <0.3.0-0' } }, candidate, '0.3.0-alpha.1'), /incompatible/)
  assert.throws(() => checkCompatibility({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': 'not a range' } }, candidate, '0.2.1-alpha.2'), /incompatible/)
  const engineOnly = { ...pkg, engines: { dsh: peerLower['@deepseek-ai/dsh-llm'] } }
  delete engineOnly.peerDependencies
  assert.equal(checkCompatibility(engineOnly, candidate, runtime), runtime)
  assert.equal(checkUpdateScope(engineOnly, runtime), runtime)
  assert.equal(checkCompatibility({ ...engineEarlier, peerDependencies: null }, candidate, runtime), runtime)
  assert.throws(() => checkCompatibility({ ...pkg, engines: { dsh: 3 }, peerDependencies: peerLower }, candidate, runtime), /compatibility-unknown/)
  assert.throws(() => checkCompatibility({ ...pkg, engines: { dsh: 'not a range' }, peerDependencies: peerLower }, candidate, runtime), /incompatible/)
  assert.throws(() => checkCompatibility({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': 3 } }, candidate, runtime), /compatibility-unknown/)
  assert.equal(checkCompatibility({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': 'workspace:*' } }, candidate, runtime), runtime)
  assert.equal(checkUpdateScope({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': 'workspace:*' } }, runtime), runtime)
  const noDshPeer = { ...pkg, peerDependencies: { react: '^18.0.0' } }
  assert.equal(checkCompatibility(noDshPeer, candidate, runtime), runtime)
  assert.throws(() => checkUpdateScope(noDshPeer, runtime), /compatibility-unknown/)
  for (const range of ['*', '>=0', '>=0.2.1-alpha.2', '<99.0.0', '^0', '>=0.0.0 <1.0.0-0', '<0.3.0-0', '>=0.2.1-alpha.2 <0.3.0', '>=0.2.1-alpha.1 <0.3.0-0', '>0.2.1-alpha.1 <0.3.0-0']) {
    assert.equal(dshPeerSatisfied(range, '0.2.1-alpha.3'), true, range)
    assert.throws(() => checkUpdateScope({ ...pkg, peerDependencies: { '@deepseek-ai/dsh-llm': range } }, '0.2.1-alpha.3'), /compatibility-unknown/)
  }
  assert.equal(dshPeerSatisfied('>=0.2.5 <0.3.0-0', '0.2.5'), true)
  assert.equal(dshPeerSatisfied('>=0.2.5 <0.3.0-0', '0.2.1-alpha.3'), false)
  assert.equal(dshPeerSatisfied('^0.2.1-alpha.2', '0.2.1-alpha.3'), true)
  assert.throws(() => checkUpdateScope({ ...pkg, peerDependencies: {} }, runtime), /compatibility-unknown/)
  for (const value of [{ ...release, prerelease: true }, { ...release, draft: true }, { ...release, assets: [...release.assets, release.assets[0]] }, { ...release, assets: [] }, { ...release, tag_name: 'garbage' }]) assert.throws(() => releaseCandidate(value, '0.5.0'))
  assert.deepEqual(packageManifest(bytes), pkg)
})

test('candidate and verified archive share engines.dsh precedence; peer-only fallback still rejects mismatches', async t => {
  const runtimeVersion = async () => '0.2.1-rc.2'
  const peerLower = { '@deepseek-ai/dsh-llm': '>=0.2.1-alpha.2 <0.3.0-0' }
  const peerLater = { '@deepseek-ai/dsh-llm': '>=0.2.2 <0.3.0-0' }
  const deniedEvaluations = []
  const deniedManifest = { ...pkg, engines: { dsh: '>=0.2.2 <0.3.0-0' }, peerDependencies: peerLower }
  const denied = await fixture(t, { runtimeVersion, fetcher: manifestFetcher(deniedManifest), compatibilityEvaluator: mockEvaluator(deniedEvaluations) })
  const deniedStatus = await denied.updater.check()
  assert.equal(deniedStatus.status, 'blocked')
  assert.equal(deniedStatus.reason, 'incompatible')
  assert.equal(deniedStatus.requiredDshVersion, '>=0.2.2 <0.3.0-0')
  assert.equal(denied.calls.length, 0)
  assert.equal(deniedEvaluations.length, 1)

  const acceptedManifest = { ...pkg, engines: { dsh: '>=0.2.1-alpha.2 <0.3.0-0' }, peerDependencies: peerLater }
  const acceptedEvaluations = []
  const accepted = await fixture(t, { runtimeVersion, fetcher: manifestFetcher(acceptedManifest), compatibilityEvaluator: mockEvaluator(acceptedEvaluations) })
  const available = await accepted.updater.check()
  assert.equal(available.status, 'available')
  await accepted.updater.begin(available.candidate.id, randomUUID(), accepted.updater.base().profileKey)
  await settle(accepted.updater)
  assert.equal(accepted.calls.length, 1)
  assert.equal(acceptedEvaluations.length, 3)

  const incompatibleArchive = { ...acceptedManifest, engines: { dsh: '>=0.2.2 <0.3.0-0' }, peerDependencies: peerLower }
  const archiveEvaluations = []
  const archiveCheck = await fixture(t, { runtimeVersion, fetcher: manifestFetcher(acceptedManifest, incompatibleArchive), compatibilityEvaluator: mockEvaluator(archiveEvaluations) })
  const archiveCandidate = await archiveCheck.updater.check()
  assert.equal(archiveCandidate.status, 'available')
  const id = randomUUID()
  await archiveCheck.updater.begin(archiveCandidate.candidate.id, id, archiveCheck.updater.base().profileKey)
  await settle(archiveCheck.updater)
  assert.equal(archiveCheck.calls.length, 0)
  const archiveResult = await archiveCheck.updater.reconcile(id)
  assert.equal(archiveResult.reason, 'incompatible')
  assert.equal(archiveResult.requiredDshVersion, '>=0.2.2 <0.3.0-0')
  const reloaded = new PluginUpdates({ manager: () => archiveCheck.manager, profileDir: archiveCheck.directory, runtimeVersion, version: '0.5.0' })
  t.after(() => reloaded.dispose())
  const reloadedResult = await reloaded.reconcile(id)
  assert.equal(reloadedResult.requestId, id)
  assert.equal(reloadedResult.requiredDshVersion, '>=0.2.2 <0.3.0-0')
  assert.equal(archiveEvaluations.length, 3)
})
test('archive validation refuses traversal, links, rewriting headers, duplicates and corrupt records', () => {
  for (const path of ['../outside', '/package/outside', 'package/../outside', 'package/./file', 'package//file', 'package\\outside']) {
    assert.throws(() => packageManifest(tarPackage(pkg, [tarEntry(path)])), /metadata/)
  }
  for (const type of [49, 50, 120, 103, 76, 75]) {
    assert.throws(() => packageManifest(tarPackage(pkg, [tarEntry('package/file', '', type)])), /metadata/)
  }
  assert.throws(() => packageManifest(tarPackage(pkg, [tarEntry('package/file'), tarEntry('package/file')])), /metadata/)
  const corrupt = tarEntry('package/file'); corrupt[0] = 88
  assert.throws(() => packageManifest(tarPackage(pkg, [corrupt])), /metadata/)
  const missingEnd = Buffer.concat([tarEntry('package/package.json', JSON.stringify(pkg))])
  assert.throws(() => packageManifest(gzipSync(missingEnd)), /metadata/)
  assert.throws(() => packageManifest(gzipSync(Buffer.concat([missingEnd, Buffer.alloc(1023)]))), /metadata/)
  assert.throws(() => packageManifest(Buffer.from('not gzip')), /metadata/)
  assert.deepEqual(packageManifest(tarPackage(pkg, [tarEntry('package/', '', 53), tarEntry('package/docs/', '', 53)])), pkg)
})
test('source provenance preserves Github and tarball family and refuses arbitrary local/registry', () => {
  for (const source of [`github:${REPOSITORY}#v0.5.0`, `git+https://github.com/${REPOSITORY}.git#abc`]) assert.equal(sourceKind(source), 'github')
  assert.equal(sourceKind(download + filename), 'tarball')
  assert.equal(sourceKind('file:/tmp/profile/.dsh-pi-login-updates/verified-a/a.tgz', '/tmp/profile/.dsh-pi-login-updates'), 'tarball')
  assert.equal(sourceKind('file:/downloads/local-dsh-pi-login-0.5.0.tgz', undefined, '0.5.0'), 'tarball')
  assert.equal(sourceKind('file:C:\\Downloads\\local-dsh-pi-login-0.5.0.tgz', undefined, '0.5.0'), 'tarball')
  assert.throws(() => sourceKind('file:/downloads/local-dsh-pi-login-0.4.1.tgz', undefined, '0.5.0'))
  for (const source of ['/tmp/a.tgz', 'file:/tmp/a.tgz', '@local/dsh-pi-login', 'github:evil/repo']) assert.throws(() => sourceKind(source))
})
test('bounded retrieval refuses hostile redirects, streaming oversize and network failure', async () => {
  const url = `https://api.github.com/repos/${REPOSITORY}/releases/latest`
  await assert.rejects(boundedFetch(url, 5, { fetcher: async () => new Response(null, { status: 302, headers: { location: 'https://evil.example/payload' } }) }), /redirect/)
  await assert.rejects(boundedFetch(url, 5, { fetcher: async () => new Response('123456') }), /size/)
  await assert.rejects(boundedFetch(url, 5, { fetcher: async () => new Response('', { status: 500 }) }), /network/)
  await assert.rejects(boundedFetch(url, 5, { signal: AbortSignal.abort(), fetcher: async () => new Response('123') }))
})
test('manager results distinguish application, failure, cancellation, override and unknown', () => {
  const result = { bundle: PACKAGE, version, application: 'applied', changed: true }
  const installed = { name: PACKAGE, installed: true, version }
  assert.equal(resultState(result, version, version, installed), 'applied')
  assert.equal(resultState(result, version, '0.5.0', installed), 'unknown')
  for (const application of ['failed', 'cancelled', 'overridden', 'restart-required']) assert.equal(resultState({ ...result, application }, version, version, installed), application)
  assert.equal(resultState({ ...result, packageResult: { exitCode: 0, timedOut: true } }, version, version), 'failed')
  assert.equal(resultState(null, version, version), 'unknown')
})
test('single pinned install preserves disabled selection; journal supports reconnection and runtime verification', async t => {
  const { updater, manager, calls, directory, bundle } = await fixture(t)
  const checked = await updater.check(), requestId = randomUUID()
  assert.equal(checked.status, 'available')
  await updater.begin(checked.candidate.id, requestId, updater.base().profileKey)
  await updater.begin(checked.candidate.id, requestId, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], `github:${REPOSITORY}#${tag}`)
  assert.deepEqual(calls[0][1], { enabled: false, requestId, saveExact: true })
  assert.equal((await updater.reconcile(requestId)).status, 'restart-required')
  const restarted = new PluginUpdates({ manager: () => manager, profileDir: directory, version, runtimeVersion: async () => '0.2.1-alpha.2' })
  bundle.version = '0.5.0'
  assert.equal((await restarted.reconcile(requestId)).status, 'unknown')
  bundle.version = version
  assert.equal((await restarted.reconcile(requestId)).status, 'applied')
})
test('missing manager/read-only/source reject before networking; login or save busy rejects begin', async t => {
  const { updater, bundle } = await fixture(t, { fetcher: async () => { throw new Error('unexpected fetch') } })
  bundle.readOnlyReason = 'management-required'
  assert.equal((await updater.check()).reason, 'read-only')
  delete bundle.readOnlyReason; bundle.source = 'file:/tmp/untrusted.tgz'
  assert.equal((await updater.check()).reason, 'source')
  const missing = await fixture(t, { manager: () => undefined })
  assert.equal((await missing.updater.status()).reason, 'manager-unavailable')
  const busy = await fixture(t, { isBusy: () => true })
  await busy.updater.check()
  await assert.rejects(busy.updater.begin('7', randomUUID(), busy.updater.base().profileKey), /busy/)
})
test('external installation without a receipt reports restart before offering another update', async t => {
  const { updater, bundle, calls } = await fixture(t, { fetcher: async () => { throw new Error('unexpected fetch') } })
  bundle.version = version
  const status = await updater.status()
  assert.equal(status.status, 'restart-required')
  assert.equal(status.runtimeVersion, '0.5.0')
  assert.equal(status.installedVersion, version)
  assert.equal((await updater.check()).status, 'restart-required')
  assert.equal(updater.candidate, null)
  assert.equal(calls.length, 0)
  updater.version = version
  assert.equal((await updater.status()).status, 'idle')
})
test('later external installation supersedes a completed receipt and remains restart-required until running it', async t => {
  const { updater, bundle } = await fixture(t)
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  bundle.version = '0.7.0'
  assert.equal((await updater.status()).status, 'restart-required')
  assert.equal((await updater.reconcile(id)).installedVersion, '0.7.0')
  updater.version = '0.7.0'
  assert.equal((await updater.status()).status, 'superseded')
  assert.equal((await updater.reconcile(id)).requestId, id)
})
test('matching checksum cannot admit an unsafe archive to the manager', async t => {
  const unsafe = tarPackage(pkg, [tarEntry('package/../../outside', 'fixture')])
  const unsafeHash = createHash('sha256').update(unsafe).digest('hex')
  const { updater, calls } = await fixture(t, { fetcher: async url => String(url).endsWith('SHA256SUMS') ? new Response(`${unsafeHash}  ${filename}`) : String(url).endsWith('.tgz') ? new Response(unsafe) : fetcher(url) })
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 0)
  assert.equal((await updater.reconcile(id)).reason, 'metadata')
})
test('checksum or manifest mismatch prevents manager call; tgz stages a persistent verified file', async t => {
  const bad = await fixture(t, { fetcher: async url => String(url).endsWith('SHA256SUMS') ? new Response(`${'0'.repeat(64)}  ${filename}`) : fetcher(url) })
  await bad.updater.check(); const id = randomUUID(); await bad.updater.begin('7', id, bad.updater.base().profileKey); await settle(bad.updater)
  assert.equal(bad.calls.length, 0); assert.equal((await bad.updater.reconcile(id)).reason, 'checksum')
  const good = await fixture(t); good.bundle.source = download + filename
  await good.updater.check(); await good.updater.begin('7', randomUUID(), good.updater.base().profileKey); await settle(good.updater)
  assert.ok(good.calls[0][0].startsWith(join(good.directory, '.dsh-pi-login-updates', 'verified-')))
})
test('forgotten request is unknown, never successful or automatically resubmitted', async t => {
  const { updater, calls, directory } = await fixture(t)
  const id = randomUUID()
  await updater.privateDir()
  await writeFile(join(directory, '.dsh-pi-login-updates', `${id}.json`), JSON.stringify({ requestId: id, version, status: 'installing' }))
  assert.equal((await updater.reconcile(id)).status, 'unknown')
  assert.equal(calls.length, 0)
  await writeFile(join(directory, '.dsh-pi-login-updates', `${id}.json`), JSON.stringify({ requestId: id, version, status: 'preparing' }))
  assert.equal((await updater.reconcile(id)).status, 'failed')
})

test('verified archive with wrong package metadata is refused and disposal aborts preparation', async t => {
  const wrong = tarPackage({ ...pkg, name: 'foreign-package' })
  const wrongHash = createHash('sha256').update(wrong).digest('hex')
  const bad = await fixture(t, { fetcher: async url => String(url).endsWith('SHA256SUMS') ? new Response(`${wrongHash}  ${filename}`) : String(url).endsWith('.tgz') ? new Response(wrong) : fetcher(url) })
  await bad.updater.check(); const id = randomUUID(); await bad.updater.begin('7', id, bad.updater.base().profileKey); await settle(bad.updater)
  assert.equal(bad.calls.length, 0); assert.equal((await bad.updater.reconcile(id)).reason, 'metadata')
  const stopped = await fixture(t)
  await stopped.updater.check()
  stopped.updater.fetcher = async (_url, { signal }) => { signal.throwIfAborted(); return Response.json(release) }
  await stopped.updater.begin('7', randomUUID(), stopped.updater.base().profileKey); stopped.updater.dispose(); await settle(stopped.updater)
  assert.equal(stopped.calls.length, 0)
})

test('post-invocation transport failure remains unknown and reconciles the original manager request', async t => {
  const { updater, manager, bundle, directory, calls } = await fixture(t)
  let waited = 0
  manager.installBundle = async (...args) => { calls.push(args); bundle.version = version; throw new Error('response lost after manager admission') }
  manager.waitForInstall = async () => { waited++; return { changed: true, application: 'restart-required', stage: 'install', target: PACKAGE, bundle: PACKAGE, version } }
  await updater.check(); const id = randomUUID(); await updater.begin('7', id, updater.base().profileKey); await settle(updater)
  assert.equal((await updater.reconcile(id)).status, 'restart-required')
  assert.equal(waited, 1); assert.equal(calls.length, 1)
  const restarted = new PluginUpdates({ manager: () => manager, profileDir: directory, version, runtimeVersion: async () => '0.2.1-alpha.2' })
  assert.equal((await restarted.reconcile(id)).status, 'applied')
  assert.equal(calls.length, 1)
})

test('release-named local directories and links remain manual sources', async t => {
  const { updater, bundle, directory } = await fixture(t)
  const source = join(directory, 'local-dsh-pi-login-0.5.0.tgz')
  bundle.source = `file:${source}`
  await mkdir(source)
  assert.equal((await updater.status()).reason, 'source')
  await rm(source, { recursive: true }); const target = join(directory, 'original.tgz'); await writeFile(target, 'fixture')
  await symlink(target, source)
  assert.equal((await updater.status()).reason, 'source')
})

test('disposal or active login during the awaited journal save cannot start manager installation', async t => {
  for (const action of ['dispose', 'login']) {
    let busy = false, reached, release
    const waiting = new Promise(resolve => { reached = resolve })
    const gate = new Promise(resolve => { release = resolve })
    const { updater, calls } = await fixture(t, { isBusy: () => busy })
    const save = updater.save.bind(updater)
    updater.save = async (operation, claim) => { await save(operation, claim); if (operation.status === 'installing') { reached(); await gate } }
    await updater.check(); await updater.begin('7', randomUUID(), updater.base().profileKey); await waiting
    if (action === 'dispose') updater.dispose(); else busy = true
    release(); await settle(updater)
    assert.equal(calls.length, 0)
  }
})

test('external upgrade during final receipt save cannot be downgraded', async t => {
  const { updater, bundle, calls } = await fixture(t)
  const save = updater.save.bind(updater)
  updater.save = async (operation, claim) => {
    await save(operation, claim)
    if (operation.status === 'installing') bundle.version = '0.7.0'
  }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 0)
  assert.equal((await updater.reconcile(id)).reason, 'stale-candidate')
})
test('nominal success requires actual installed version before restart instruction', async t => {
  const { updater, manager, bundle } = await fixture(t)
  manager.installBundle = async () => ({ bundle: PACKAGE, version, application: 'restart-required' })
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal((await updater.reconcile(id)).status, 'unknown')
  bundle.version = version
  assert.equal((await updater.reconcile(id)).status, 'restart-required')
  bundle.error = { code: 'not-bundle' }
  assert.equal((await updater.reconcile(id)).status, 'unknown')
})
test('updating old receipt cannot take ownership of latest operation', async t => {
  const { updater } = await fixture(t)
  const first = { requestId: randomUUID(), version, status: 'failed' }
  const second = { requestId: randomUUID(), version, status: 'unknown' }
  await updater.save(first, true)
  await updater.save(second, true)
  await updater.save(first)
  assert.equal(await updater.lastOperation(), second.requestId)
})
test('cancellation outcome survives nonzero package exit', () => {
  assert.equal(
    resultState({ application: 'cancelled', packageResult: { exitCode: 130 } }, version, version),
    'cancelled',
  )
})

test('profile mismatch refuses delayed request before any admission', async t => {
 const first = await fixture(t), second = await fixture(t)
 await second.updater.check()
 await assert.rejects(second.updater.begin('7', randomUUID(), first.updater.base().profileKey), /profile/)
 assert.equal(second.calls.length,0)
 assert.equal(await second.updater.lastOperation(),undefined)
})

test('HMR already-installed removes the package and then installs the same request', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  const removed = []
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' }, bundle: PACKAGE }
    bundle.version = version
    return { changed: true, application: 'applied', stage: 'install', target: PACKAGE, bundle: PACKAGE, version }
  }
  manager.removeBundle = async name => { removed.push(name); return { application: 'applied', changed: true, bundle: name } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.deepEqual(removed, [PACKAGE])
  assert.equal(calls.length, 2)
  assert.equal(calls[0][0], calls[1][0])
  assert.deepEqual(calls[1][1], { enabled: false, requestId: id, saveExact: true })
  assert.equal((await updater.reconcile(id)).status, 'unknown')
  updater.version = version
  assert.equal((await updater.reconcile(id)).status, 'applied')
})

test('stop-profile keeps the package and installs over it; a failed removal does not install again', async t => {
  const stopped = await fixture(t)
  stopped.manager.installBundle = async (spec, options) => {
    stopped.calls.push([spec, options])
    if (stopped.calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    stopped.bundle.version = version
    return { changed: true, application: 'restart-required', stage: 'install', target: PACKAGE, bundle: PACKAGE, version }
  }
  stopped.manager.removeBundle = async () => ({ application: 'failed', error: { code: 'stop-profile' }, changed: false })
  await stopped.updater.check()
  const stoppedId = randomUUID()
  await stopped.updater.begin('7', stoppedId, stopped.updater.base().profileKey)
  await settle(stopped.updater)
  assert.equal(stopped.calls.length, 2)
  assert.equal((await stopped.updater.reconcile(stoppedId)).status, 'restart-required')
  assert.equal((await stopped.updater.reconcile(stoppedId)).reason, undefined)

  const refused = await fixture(t)
  refused.manager.installBundle = async (...args) => { refused.calls.push(args); return { application: 'failed', error: { code: 'already-installed' } } }
  refused.manager.removeBundle = async () => ({ application: 'failed', error: { code: 'not-removable' }, changed: false })
  await refused.updater.check()
  const refusedId = randomUUID()
  await refused.updater.begin('7', refusedId, refused.updater.base().profileKey)
  await settle(refused.updater)
  assert.equal(refused.calls.length, 1)
  const outcome = await refused.updater.reconcile(refusedId)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'replace')
})

test('replacement install stays on the manager promise after removal returns', async () => {
  const calls = []
  const manager = {
    async installBundle(spec) {
      calls.push(spec)
      return calls.length === 1
        ? { application: 'failed', error: { code: 'already-installed' } }
        : { application: 'applied', bundle: PACKAGE, version }
    },
    removeBundle() {
      calls.push('remove')
      return Promise.resolve({ application: 'applied', changed: true })
    },
  }
  const admission = await installPreservingPackage(manager, PACKAGE, 'spec', { enabled: true, saveExact: true })
  assert.equal(admission.replaced, true)
  assert.equal(admission.result.application, 'applied')
  assert.deepEqual(calls, ['spec', 'remove', 'spec'])
})

test('a failed replacement reinstalls the previous package when it is gone', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  let restoreLists = 0
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    if (calls.length === 2) {
      bundle.installed = false
      return { application: 'failed', error: { code: 'install-failed' } }
    }
    bundle.installed = true
    bundle.version = '0.5.0'
    return { application: 'applied', changed: true, bundle: PACKAGE, version: '0.5.0' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  manager.listBundles = async () => {
    if (calls.length >= 3) restoreLists++
    return [bundle]
  }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 3)
  assert.equal(restoreLists, 1)
  assert.equal(calls[2][0], `github:${REPOSITORY}`)
  assert.equal(calls[2][1].enabled, false)
  assert.equal(calls[2][1].saveExact, true)
  assert.notEqual(calls[2][1].requestId, id)
  assert.match(calls[2][1].requestId, /^[0-9a-f-]{36}$/)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restored')
  assert.equal(outcome.restoredVersion, '0.5.0')
  assert.equal(bundle.version, '0.5.0')
  assert.equal(bundle.installed, true)
})

test('a failed restore tells the user and does not claim the new release installed', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    bundle.installed = false
    return { application: 'failed', error: { code: 'install-failed' } }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 3)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restore-failed')
  assert.equal(bundle.installed, false)
})

test('a failed replacement that leaves the package installed does not install the previous spec again', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    bundle.installed = true
    return { application: 'failed', error: { code: 'install-failed' } }
  }
  manager.removeBundle = async () => ({ application: 'applied', changed: true })
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 2)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'replace')
})

test('a thrown replacement restores the missing package and the next check is not busy', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    if (calls.length === 2) {
      bundle.installed = false
      throw new Error('replacement install rejected')
    }
    bundle.installed = true
    bundle.version = '0.5.0'
    return { application: 'applied', bundle: PACKAGE, version: '0.5.0' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(updater.running, null)
  assert.equal(calls.length, 3)
  assert.equal(calls[2][0], `github:${REPOSITORY}`)
  assert.notEqual(calls[2][1].requestId, id)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restored')
  assert.equal(outcome.restoredVersion, '0.5.0')
  const again = await updater.check()
  assert.notEqual(again.reason, 'busy')
  assert.equal(again.status === 'blocked' && again.reason === 'busy', false)
})

test('a thrown replacement still restores when the first bundle list fails', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  let phase = 'ready'
  manager.listBundles = async () => {
    if (phase === 'after-throw') { phase = 'visible'; throw new Error('list failed') }
    return [bundle]
  }
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    if (calls.length === 2) {
      bundle.installed = false
      phase = 'after-throw'
      throw new Error('replacement install rejected')
    }
    bundle.installed = true
    bundle.version = '0.5.0'
    return { application: 'applied', bundle: PACKAGE, version: '0.5.0' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 3)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restored')
  assert.equal(updater.running, null)
  assert.notEqual((await updater.check()).reason, 'busy')
})

test('a thrown restore settles as restore-failed and does not stay unknown', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    bundle.installed = false
    throw new Error('install rejected')
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 3)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restore-failed')
  assert.equal(bundle.installed, false)
  assert.notEqual((await updater.check()).reason, 'busy')
})

test('cancellation and a bad package exit restore a missing package', async t => {
  for (const failure of [{ application: 'cancelled' }, { application: 'applied', packageResult: { exitCode: 2, timedOut: false } }, { application: 'restart-required', packageResult: { exitCode: 0, timedOut: true } }]) {
    const { updater, manager, bundle, calls } = await fixture(t)
    manager.installBundle = async (spec, options) => {
      calls.push([spec, options])
      if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
      if (calls.length === 2) { bundle.installed = false; return failure }
      bundle.installed = true
      bundle.version = '0.5.0'
      return { application: 'applied', bundle: PACKAGE, version: '0.5.0' }
    }
    manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
    await updater.check()
    const id = randomUUID()
    await updater.begin('7', id, updater.base().profileKey)
    await settle(updater)
    assert.equal(calls.length, 3, JSON.stringify(failure))
    const outcome = await updater.reconcile(id)
    assert.equal(outcome.status, 'failed')
    assert.equal(outcome.reason, 'restored')
  }
})

test('stop-profile that actually removes the package restores it and does not install the release', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    bundle.installed = true
    bundle.version = '0.5.0'
    return { application: 'applied', bundle: PACKAGE, version: '0.5.0' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'failed', error: { code: 'stop-profile' }, changed: false } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 2)
  assert.equal(calls[1][0], `github:${REPOSITORY}`)
  assert.notEqual(calls[1][0], calls[0][0])
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restored')
  assert.equal(outcome.restoredVersion, '0.5.0')

  const stayed = await fixture(t)
  stayed.manager.installBundle = async (spec, options) => {
    stayed.calls.push([spec, options])
    if (stayed.calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    stayed.bundle.installed = true
    return { application: 'failed', error: { code: 'install-failed' } }
  }
  stayed.manager.removeBundle = async () => ({ application: 'failed', error: { code: 'stop-profile' }, changed: false })
  await stayed.updater.check()
  await stayed.updater.begin('7', randomUUID(), stayed.updater.base().profileKey)
  await settle(stayed.updater)
  assert.equal(stayed.calls.length, 2)
  assert.equal(stayed.calls[1][0], stayed.calls[0][0])
})

test('an unpinned restore that installs a newer version is pinned back to the previous version', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    if (calls.length === 2) { bundle.installed = false; return { application: 'failed', error: { code: 'install-failed' } } }
    if (calls.length === 3) {
      bundle.installed = true
      bundle.version = '9.9.9'
      return { application: 'applied', bundle: PACKAGE, version: '9.9.9' }
    }
    assert.equal(spec, `github:${REPOSITORY}#v0.5.0`)
    bundle.installed = true
    bundle.version = '0.5.0'
    return { application: 'applied', bundle: PACKAGE, version: '0.5.0' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 4)
  assert.equal(calls[3][0], `github:${REPOSITORY}#v0.5.0`)
  assert.notEqual(calls[3][1].requestId, calls[2][1].requestId)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restored')
  assert.equal(outcome.restoredVersion, '0.5.0')
  assert.notEqual((await updater.check()).reason, 'busy')
})

test('a pin that still installs another version is shown as installed at a different version', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    if (calls.length === 2) { bundle.installed = false; return { application: 'failed', error: { code: 'install-failed' } } }
    bundle.installed = true
    bundle.version = '9.9.9'
    return { application: 'applied', bundle: PACKAGE, version: '9.9.9' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 4)
  assert.equal(calls[3][0], `github:${REPOSITORY}#v0.5.0`)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'version-differs')
  assert.equal(outcome.restoredVersion, undefined)
  assert.equal(outcome.installedVersion, '9.9.9')
  assert.equal(outcome.expectedVersion, '0.5.0')
  assert.equal(outcome.status === 'superseded', false)
  assert.notEqual((await updater.check()).reason, 'busy')
})

test('an already pinned source that restores a different version is not pinned again', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  bundle.source = `github:${REPOSITORY}#v0.5.0`
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    if (calls.length === 2) { bundle.installed = false; return { application: 'failed', error: { code: 'install-failed' } } }
    bundle.installed = true
    bundle.version = '9.9.9'
    return { application: 'applied', bundle: PACKAGE, version: '9.9.9' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'applied', changed: true } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 3)
  assert.equal(calls[2][0], `github:${REPOSITORY}#v0.5.0`)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'version-differs')
  assert.equal(outcome.installedVersion, '9.9.9')
  assert.equal(outcome.expectedVersion, '0.5.0')
})

test('a failed removal restores the package when the list shows it is gone', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  manager.installBundle = async (spec, options) => {
    calls.push([spec, options])
    if (calls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    bundle.installed = true
    bundle.version = '0.5.0'
    return { application: 'applied', bundle: PACKAGE, version: '0.5.0' }
  }
  manager.removeBundle = async () => { bundle.installed = false; return { application: 'failed', error: { code: 'not-removable' }, changed: false } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 2)
  assert.equal(calls[1][0], `github:${REPOSITORY}`)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restored')
  assert.equal(outcome.restoredVersion, '0.5.0')
  assert.equal(bundle.installed, true)
})

test('a failed removal whose bundle list cannot be read does not restore', async t => {
  const { updater, manager, bundle, calls } = await fixture(t)
  let failNext = false
  manager.listBundles = async () => {
    if (failNext) { failNext = false; throw new Error('list failed') }
    return [bundle]
  }
  manager.installBundle = async (...args) => { calls.push(args); return { application: 'failed', error: { code: 'already-installed' } } }
  manager.removeBundle = async () => { failNext = true; return { application: 'failed', error: { code: 'not-removable' }, changed: false } }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(calls.length, 1)
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'replace')
})

test('an installed restore with neither captured nor receipt version is not a missing package', async () => {
  let installed = false
  const calls = []
  const manager = {
    listBundles: async () => [{ name: PACKAGE, installed, version: installed ? '1.2.3' : undefined }],
    installBundle: async (spec, options) => {
      calls.push([spec, options])
      installed = true
      return { application: 'applied' }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed', error: { code: 'install-failed' } }, { spec: `github:${REPOSITORY}`, enabled: false })
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], `github:${REPOSITORY}`)
  assert.equal(restored.restored, false)
  assert.equal(restored.restoreFailed, undefined)
  assert.equal(restored.versionDiffers, true)
  assert.equal(restored.installedVersion, '1.2.3')
  assert.equal(restored.expectedVersion, undefined)

  calls.length = 0
  installed = false
  const fileManager = {
    listBundles: async () => [{ name: PACKAGE, installed: calls.length > 0, version: calls.length > 0 ? '9.9.9' : undefined }],
    installBundle: async (spec) => { calls.push(spec); return { application: 'applied', version: '9.9.9' } },
  }
  const file = await restoreIfMissing(fileManager, PACKAGE, { application: 'failed' }, { spec: 'file:/tmp/local-dsh-pi-login-0.5.0.tgz', enabled: true, version: '0.5.0' })
  assert.deepEqual(calls, ['file:/tmp/local-dsh-pi-login-0.5.0.tgz'])
  assert.equal(file.versionDiffers, true)
  assert.equal(file.restoreFailed, undefined)
  assert.equal(file.installedVersion, '9.9.9')
  assert.equal(file.expectedVersion, '0.5.0')
})

test('an unpinned git URL that restores a newer version is pinned to the previous tag', async () => {
  const calls = []
  const spec = `git+https://github.com/${REPOSITORY}.git`
  let installed = false
  let version
  const manager = {
    listBundles: async () => [{ name: PACKAGE, installed, version }],
    removeBundle: async () => { installed = false; version = undefined; return { application: 'applied', changed: true } },
    installBundle: async (next) => {
      calls.push(next)
      installed = true
      version = next.endsWith('#v0.5.0') ? '0.5.0' : '9.9.9'
      return { application: 'applied', version }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: false, version: '0.5.0' })
  assert.deepEqual(calls, [spec, `${spec}#v0.5.0`])
  assert.equal(restored.restored, true)
  assert.equal(restored.restoredVersion, '0.5.0')
})

test('a pin waits until the other version is gone, because an installed package is already-installed', async () => {
  const calls = []
  const spec = `github:${REPOSITORY}`
  const pin = `${spec}#v0.5.0`
  let installed = false
  let version
  const manager = {
    listBundles: async () => [{ name: PACKAGE, installed, version }],
    removeBundle: async () => { installed = false; version = undefined; return { application: 'applied', changed: true } },
    installBundle: async (next) => {
      calls.push({ spec: next, installedBefore: installed })
      if (installed) return { application: 'failed', error: { code: 'already-installed' } }
      installed = true
      version = next === pin ? '0.5.0' : '9.9.9'
      return { application: 'applied', version }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: false, version: '0.5.0' })
  assert.deepEqual(calls.map(call => call.spec), [spec, pin])
  assert.equal(calls[1].installedBefore, false)
  assert.equal(restored.restored, true)
  assert.equal(restored.restoredVersion, '0.5.0')
  assert.equal(installed, true)
  assert.equal(version, '0.5.0')
})

test('already-installed from the pin reinstalls the original source and leaves the package installed', async () => {
  const calls = []
  const spec = `github:${REPOSITORY}`
  const pin = `${spec}#v0.5.0`
  let installed = false
  let version
  const manager = {
    listBundles: async () => [{ name: PACKAGE, installed, version }],
    removeBundle: async () => { installed = false; version = undefined; return { application: 'applied', changed: true } },
    installBundle: async (next) => {
      calls.push({ spec: next, installedBefore: installed })
      if (next === pin || installed) return { application: 'failed', error: { code: 'already-installed' } }
      installed = true
      version = '9.9.9'
      return { application: 'applied', version }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: true, version: '0.5.0' })
  assert.deepEqual(calls.map(call => call.spec), [spec, pin, spec])
  assert.equal(calls[1].installedBefore, false)
  assert.equal(calls[2].installedBefore, false)
  assert.equal(restored.restored, false)
  assert.equal(restored.restoreFailed, undefined)
  assert.equal(restored.versionDiffers, true)
  assert.equal(restored.installedVersion, '9.9.9')
  assert.equal(restored.expectedVersion, '0.5.0')
  assert.equal(installed, true)
})

test('a bundle list that fails after removal does not treat the pre-removal record as still installed', async t => {
  const calls = []
  const spec = `github:${REPOSITORY}`
  let installed = false
  let version = '9.9.9'
  let lists = 0
  const manager = {
    listBundles: async () => {
      lists += 1
      if (lists >= 3) throw new Error('list failed')
      return [{ name: PACKAGE, installed, version }]
    },
    removeBundle: async () => { installed = false; version = undefined; return { application: 'applied', changed: true } },
    installBundle: async (next) => {
      calls.push(next)
      if (calls.length > 1) throw new Error('reinstall failed')
      installed = true
      version = '9.9.9'
      return { application: 'applied', version: '9.9.9' }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: true, version: '0.5.0' })
  assert.deepEqual(calls, [spec, spec])
  assert.equal(restored.versionDiffers, undefined)
  assert.equal(restored.installedVersion, undefined)
  assert.equal(restored.restored, false)
  assert.equal(restored.restoreFailed, true)
  assert.equal(installed, false)

  const { updater, manager: hosted, bundle, calls: hostedCalls } = await fixture(t)
  let removes = 0
  let failLists = false
  hosted.listBundles = async () => {
    if (failLists) throw new Error('list failed')
    return [bundle]
  }
  hosted.removeBundle = async () => {
    removes += 1
    bundle.installed = false
    if (removes >= 2) failLists = true
    return { application: 'applied', changed: true }
  }
  hosted.installBundle = async (next, options) => {
    hostedCalls.push([next, options])
    if (hostedCalls.length === 1) return { application: 'failed', error: { code: 'already-installed' } }
    if (hostedCalls.length === 2) { bundle.installed = false; return { application: 'failed', error: { code: 'install-failed' } } }
    if (hostedCalls.length === 3) {
      bundle.installed = true
      bundle.version = '9.9.9'
      return { application: 'applied', version: '9.9.9' }
    }
    throw new Error('reinstall failed')
  }
  await updater.check()
  const id = randomUUID()
  await updater.begin('7', id, updater.base().profileKey)
  await settle(updater)
  assert.equal(hostedCalls.length, 4)
  assert.equal(hostedCalls[3][0], spec)
  failLists = false
  bundle.installed = false
  bundle.version = '9.9.9'
  const outcome = await updater.reconcile(id)
  assert.equal(outcome.status, 'failed')
  assert.equal(outcome.reason, 'restore-failed')
  assert.notEqual((await updater.check()).reason, 'busy')
  const again = await updater.reconcile(id)
  assert.equal(again.reason, 'restore-failed')
  assert.equal(again.status, 'failed')
})

test('a completed reinstall keeps its receipt version when the bundle list fails', async () => {
  const spec = `github:${REPOSITORY}`
  const pin = `${spec}#v0.5.0`
  async function run(receiptVersion) {
    const calls = []
    let installed = false
    let version
    let lists = 0
    const manager = {
      listBundles: async () => {
        lists += 1
        if (lists >= 4) throw new Error('list failed')
        return [{ name: PACKAGE, installed, version }]
      },
      removeBundle: async () => { installed = false; version = undefined; return { application: 'applied', changed: true } },
      installBundle: async (next) => {
        calls.push(next)
        if (next === pin) throw new Error('pin failed')
        installed = true
        version = calls.length === 1 ? '9.9.9' : receiptVersion
        return { application: 'applied', version }
      },
    }
    const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: false, version: '0.5.0' })
    assert.deepEqual(calls, [spec, pin, spec])
    return restored
  }
  const matched = await run('0.5.0')
  assert.equal(matched.restored, true)
  assert.equal(matched.restoredVersion, '0.5.0')
  assert.equal(matched.restoreFailed, undefined)
  assert.equal(matched.versionDiffers, undefined)
  const drifted = await run('9.9.9')
  assert.equal(drifted.restored, false)
  assert.equal(drifted.restoreFailed, undefined)
  assert.equal(drifted.versionDiffers, true)
  assert.equal(drifted.installedVersion, '9.9.9')
  assert.equal(drifted.expectedVersion, '0.5.0')
})

test('a completed pin keeps its receipt version when the bundle list fails and does not reinstall the original source', async () => {
  const spec = `github:${REPOSITORY}`
  const pin = `${spec}#v0.5.0`
  async function run(receiptVersion) {
    const calls = []
    let installed = false
    let version
    let lists = 0
    const manager = {
      listBundles: async () => {
        lists += 1
        if (lists >= 4) throw new Error('list failed')
        return [{ name: PACKAGE, installed, version }]
      },
      removeBundle: async () => { installed = false; version = undefined; return { application: 'applied', changed: true } },
      installBundle: async (next) => {
        calls.push(next)
        installed = true
        version = next === pin ? receiptVersion : '9.9.9'
        return { application: 'applied', version }
      },
    }
    const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: true, version: '0.5.0' })
    assert.deepEqual(calls, [spec, pin])
    return restored
  }
  const matched = await run('0.5.0')
  assert.equal(matched.restored, true)
  assert.equal(matched.restoredVersion, '0.5.0')
  assert.equal(matched.restoreFailed, undefined)
  assert.equal(matched.versionDiffers, undefined)
  const drifted = await run('9.9.9')
  assert.equal(drifted.restored, false)
  assert.equal(drifted.restoreFailed, undefined)
  assert.equal(drifted.versionDiffers, true)
  assert.equal(drifted.installedVersion, '9.9.9')
  assert.equal(drifted.expectedVersion, '0.5.0')
})

test('a completed pin with no receipt version is a failed restore when the bundle list fails', async () => {
  const calls = []
  const spec = `github:${REPOSITORY}`
  const pin = `${spec}#v0.5.0`
  let installed = false
  let version
  let lists = 0
  const manager = {
    listBundles: async () => {
      lists += 1
      if (lists >= 4) throw new Error('list failed')
      return [{ name: PACKAGE, installed, version }]
    },
    removeBundle: async () => { installed = false; version = undefined; return { application: 'applied', changed: true } },
    installBundle: async (next) => {
      calls.push(next)
      installed = true
      if (next === pin) return { application: 'applied' }
      version = '9.9.9'
      return { application: 'applied', version: '9.9.9' }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: true, version: '0.5.0' })
  assert.deepEqual(calls, [spec, pin])
  assert.equal(restored.restored, false)
  assert.equal(restored.versionDiffers, undefined)
  assert.equal(restored.installedVersion, undefined)
  assert.equal(restored.restoreFailed, true)
  assert.equal(restored.result?.application, 'applied')
  assert.equal(restored.result?.version, undefined)
})

test('a restore install whose bundle list fails keeps the receipt', async () => {
  const spec = `github:${REPOSITORY}`
  async function run(receipt) {
    let lists = 0
    const calls = []
    const manager = {
      listBundles: async () => {
        lists += 1
        if (lists >= 2) throw new Error('list failed')
        return [{ name: PACKAGE, installed: false }]
      },
      installBundle: async (next) => {
        calls.push(next)
        return receipt
      },
    }
    const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed', error: { code: 'install-failed' } }, { spec, enabled: false, version: '0.5.0' })
    assert.deepEqual(calls, [spec])
    return restored
  }
  const matched = await run({ application: 'applied', version: '0.5.0' })
  assert.equal(matched.restored, true)
  assert.equal(matched.restoredVersion, '0.5.0')
  assert.equal(matched.restoreFailed, undefined)
  assert.equal(matched.versionDiffers, undefined)
  const pin = `${spec}#v0.5.0`
  let installed = false
  let version
  let lists = 0
  const pinCalls = []
  const manager = {
    listBundles: async () => {
      lists += 1
      if (lists === 2) throw new Error('list failed')
      return [{ name: PACKAGE, installed, version }]
    },
    removeBundle: async () => {
      installed = false
      version = undefined
      return { application: 'applied', changed: true }
    },
    installBundle: async (next) => {
      pinCalls.push(next)
      installed = true
      version = next === pin ? '0.5.0' : '9.9.9'
      return { application: 'applied', version }
    },
  }
  const drifted = await restoreIfMissing(manager, PACKAGE, { application: 'failed', error: { code: 'install-failed' } }, { spec, enabled: false, version: '0.5.0' })
  assert.deepEqual(pinCalls, [spec, pin])
  assert.equal(drifted.restored, true)
  assert.equal(drifted.restoredVersion, '0.5.0')
  assert.equal(drifted.restoreFailed, undefined)
  assert.equal(drifted.versionDiffers, undefined)
  const unnamed = await run({ application: 'applied' })
  assert.equal(unnamed.restored, false)
  assert.equal(unnamed.versionDiffers, undefined)
  assert.equal(unnamed.restoreFailed, true)
  assert.equal(unnamed.result?.application, 'applied')
  assert.equal(unnamed.result?.version, undefined)
})

test('a different restore receipt stays a version mismatch when removal leaves the package installed', async () => {
  const spec = `github:${REPOSITORY}`
  const calls = []
  let installed = false
  let version
  let lists = 0
  const manager = {
    listBundles: async () => {
      lists += 1
      if (lists === 2) throw new Error('list failed')
      return [{ name: PACKAGE, installed, version }]
    },
    removeBundle: async () => ({ application: 'applied', changed: true }),
    installBundle: async (next) => {
      calls.push(next)
      installed = true
      version = '9.9.9'
      return { application: 'applied', version: '9.9.9' }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: true, version: '0.5.0' })
  assert.deepEqual(calls, [spec])
  assert.equal(installed, true)
  assert.equal(restored.restored, false)
  assert.equal(restored.restoreFailed, undefined)
  assert.equal(restored.versionDiffers, true)
  assert.equal(restored.installedVersion, '9.9.9')
  assert.equal(restored.expectedVersion, '0.5.0')
})

test('a removal that clears the package reinstalls it when the following list fails', async () => {
  const spec = `github:${REPOSITORY}`
  const calls = []
  let installed = false
  let version
  let lists = 0
  const manager = {
    listBundles: async () => {
      lists += 1
      if (lists === 2 || lists === 3) throw new Error('list failed')
      return [{ name: PACKAGE, installed, version }]
    },
    removeBundle: async () => {
      installed = false
      version = undefined
      return { application: 'applied', changed: true }
    },
    installBundle: async (next) => {
      calls.push(next)
      installed = true
      version = '9.9.9'
      return { application: 'applied', version: '9.9.9' }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: true, version: '0.5.0' })
  assert.deepEqual(calls, [spec, spec])
  assert.equal(installed, true)
  assert.equal(version, '9.9.9')
  assert.equal(restored.restored, false)
  assert.equal(restored.restoreFailed, undefined)
  assert.equal(restored.versionDiffers, true)
  assert.equal(restored.installedVersion, '9.9.9')
  assert.equal(restored.expectedVersion, '0.5.0')
})

test('a receipt version without a captured version is a failed restore when the list fails', async () => {
  const spec = `github:${REPOSITORY}`
  let lists = 0
  const manager = {
    listBundles: async () => {
      lists += 1
      if (lists >= 2) throw new Error('list failed')
      return [{ name: PACKAGE, installed: false }]
    },
    installBundle: async () => ({ application: 'applied', version: '9.9.9' }),
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: true })
  assert.equal(restored.restored, false)
  assert.equal(restored.versionDiffers, undefined)
  assert.equal(restored.restoreFailed, true)
  assert.equal(restored.result?.version, '9.9.9')
})

test('a removal that leaves the other version installed does not pin and does not drop the package', async () => {
  const calls = []
  const spec = `github:${REPOSITORY}`
  let installed = false
  let version
  const manager = {
    listBundles: async () => [{ name: PACKAGE, installed, version }],
    removeBundle: async () => ({ application: 'failed', error: { code: 'not-removable' }, changed: false }),
    installBundle: async (next) => {
      calls.push({ spec: next, installedBefore: installed })
      if (installed) return { application: 'failed', error: { code: 'already-installed' } }
      installed = true
      version = '9.9.9'
      return { application: 'applied', version: '9.9.9' }
    },
  }
  const restored = await restoreIfMissing(manager, PACKAGE, { application: 'failed' }, { spec, enabled: false, version: '0.5.0' })
  assert.deepEqual(calls.map(call => call.spec), [spec, spec])
  assert.equal(calls[1].installedBefore, true)
  assert.equal(restored.versionDiffers, true)
  assert.equal(restored.restoreFailed, undefined)
  assert.equal(restored.installedVersion, '9.9.9')
  assert.equal(installed, true)
})

test('published DSH peers accept 0.2.x through the boot checker and reject 0.3 prereleases', () => {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/dsh-peer-check.mjs'], {
    env: { ...process.env, DSH_PEER_CHECK_OFFLINE: '1' },
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}\n${result.error ?? ''}`)
})
