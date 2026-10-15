import { readFile, readdir, access, mkdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { build } from 'esbuild'
import ts from 'typescript'

export const upstreamRoot = resolve(process.env.DSH_UPSTREAM_ROOT ?? '.cache/upstream')
const pinned = JSON.parse(await readFile('upstream.json', 'utf8'))
const upstreamLock = resolve(upstreamRoot, '..', 'upstream.lock')
const checkoutComplete = join(upstreamRoot, '.checkout-complete')
const upstreamWaitMs = 15 * 60 * 1000
const staleLockMs = 15 * 60 * 1000
// A published lock directory already contains its owner record. This grace
// only covers a legacy empty directory or a record that has not been written.
const ownerWriteGraceMs = 5 * 1000
// `packages/llm/llm` is the @deepseek-ai/dsh-llm package in the pinned tree.
const pinnedPaths = [
  'packages/llm/llm/src/index.ts',
  'packages/client/locale/src/client/index.ts',
]

function gitAtUpstream(args) {
  return spawnSync('git', ['-C', upstreamRoot, ...args], { encoding: 'utf8' })
}

function worktreeMatchesPin() {
  const head = gitAtUpstream(['rev-parse', 'HEAD'])
  if (head.status !== 0 || head.stdout.trim() !== pinned.commit) return false
  return gitAtUpstream(['diff', '--quiet', 'HEAD']).status === 0
}

async function pinnedFilesPresent() {
  try {
    await Promise.all(pinnedPaths.map(path => access(join(upstreamRoot, path))))
    return true
  } catch { return false }
}

// `git checkout` creates packages/client/locale before it finishes writing
// packages/llm and the other workspaces. The marker is written only after
// checkout returns, and a later reader still checks HEAD and these files so
// a stale or partial tree is fetched again.
async function pinnedMarker() {
  try { return (await readFile(checkoutComplete, 'utf8')).trim() }
  catch { return undefined }
}

async function upstreamReady() {
  if (await pinnedMarker() !== pinned.commit) return false
  const [files, commit] = await Promise.all([
    pinnedFilesPresent(),
    Promise.resolve(worktreeMatchesPin()),
  ])
  return files && commit
}

function processAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error?.code === 'EPERM'
  }
}

function parseOwner(text) {
  try {
    const owner = JSON.parse(text)
    if (!owner || typeof owner !== 'object') return undefined
    if (!Number.isInteger(owner.pid) || owner.pid <= 0) return undefined
    if (!Number.isInteger(owner.startedAt)) return undefined
    if (typeof owner.token !== 'string' || owner.token.length === 0) return undefined
    return owner
  } catch {
    return undefined
  }
}

async function readOwner(directory) {
  try { return parseOwner(await readFile(join(directory, 'owner'), 'utf8')) }
  catch { return undefined }
}

async function lockReclaimable(directory) {
  let info
  try { info = await stat(directory) }
  catch { return false }
  const owner = info.isDirectory() ? await readOwner(directory) : undefined
  if (!owner) return Date.now() - info.mtimeMs >= ownerWriteGraceMs
  if (!processAlive(owner.pid)) return true
  return Date.now() - owner.startedAt >= staleLockMs
}

async function writeOwner(directory, token) {
  const record = `${JSON.stringify({ pid: process.pid, startedAt: Date.now(), token })}\n`
  const temporary = join(directory, `.owner.${token.slice(0, 8)}.tmp`)
  await writeFile(temporary, record)
  await rename(temporary, join(directory, 'owner'))
}

// Rename publishes the directory only when the destination is absent. The
// owner record is already inside, so other processes never observe a lock
// with no pid.
async function publishDirectory(directory, token) {
  const staging = `${directory}.staging.${process.pid}.${token.slice(0, 8)}`
  await rm(staging, { recursive: true, force: true })
  await mkdir(staging)
  try {
    await writeOwner(staging, token)
    await rename(staging, directory)
  } catch (error) {
    await rm(staging, { recursive: true, force: true })
    if (error?.code === 'EEXIST' || error?.code === 'ENOTEMPTY') return false
    throw error
  }
  return true
}

async function restoreDirectory(grave, directory) {
  try { await rename(grave, directory) }
  catch { /* A new lock occupies the path. Its owner rechecks the record. */ }
}

async function releaseDirectory(directory, token) {
  const grave = `${directory}.released.${process.pid}.${token.slice(0, 8)}`
  try { await rename(directory, grave) }
  catch { return }
  const owner = await readOwner(grave)
  if (owner?.token === token) {
    await rm(grave, { recursive: true, force: true })
    return
  }
  await restoreDirectory(grave, directory)
}

async function ownsLock(token) {
  const owner = await readOwner(upstreamLock)
  return owner?.token === token && owner.pid === process.pid
}

// One waiter renames the stale directory aside. It deletes that directory
// only when the moved record is still the abandoned owner; a live lock is
// put back. The reclaim ticket stops a second waiter from renaming the
// replacement.
async function discardIfReclaimable(directory) {
  if (!(await lockReclaimable(directory))) return false
  const grave = `${directory}.abandoned.${process.pid}.${randomBytes(4).toString('hex')}`
  try { await rename(directory, grave) }
  catch { return false }
  if (!(await lockReclaimable(grave))) {
    await restoreDirectory(grave, directory)
    return false
  }
  await rm(grave, { recursive: true, force: true })
  return true
}

async function claimStale(directory) {
  const observed = await readOwner(directory)
  if (!(await lockReclaimable(directory))) return false
  const ticket = `${directory}.reclaim`
  const ticketToken = randomBytes(16).toString('hex')
  if (!(await publishDirectory(ticket, ticketToken))) {
    await discardIfReclaimable(ticket)
    return false
  }
  try {
    const current = await readOwner(directory)
    if (observed?.token !== current?.token || observed?.pid !== current?.pid || observed?.startedAt !== current?.startedAt) return false
    if (!(await lockReclaimable(directory))) return false
    const grave = `${directory}.stale.${process.pid}.${ticketToken.slice(0, 8)}`
    try { await rename(directory, grave) }
    catch { return false }
    const taken = await readOwner(grave)
    if (taken?.token !== current?.token || taken?.pid !== current?.pid || !(await lockReclaimable(grave))) {
      await restoreDirectory(grave, directory)
      return false
    }
    await rm(grave, { recursive: true, force: true })
    return true
  } finally {
    await releaseDirectory(ticket, ticketToken)
  }
}

// Test files are separate processes and all call this on a cold cache.
// The lock directory stores the owner's pid and start time. A dead pid is
// reclaimed immediately. A live owner is reclaimed after staleLockMs, and
// only by the waiter that wins the rename.
async function withUpstreamLock(deadline, task) {
  await mkdir(dirname(upstreamLock), { recursive: true })
  const token = randomBytes(16).toString('hex')
  let owned = false
  try {
    while (!owned) {
      if (await upstreamReady()) return
      if (await publishDirectory(upstreamLock, token) && await ownsLock(token)) {
        owned = true
        break
      }
      if (await upstreamReady()) return
      if (await claimStale(upstreamLock)) continue
      if (Date.now() > deadline) throw new Error('Timed out waiting for the pinned official Harness source')
      await new Promise(resolveWait => setTimeout(resolveWait, 250))
    }
    await task(token)
  } finally {
    if (owned) await releaseDirectory(upstreamLock, token)
  }
}

async function fetchPinnedSource(token) {
  const marker = await pinnedMarker()
  // A missing marker can be rewritten when the tree is already the pin.
  // A marker for a different commit is not trusted, even if the files are present.
  if ((marker === undefined || marker === pinned.commit) && worktreeMatchesPin() && await pinnedFilesPresent()) return
  if (!(await ownsLock(token))) return
  await rm(upstreamRoot, { recursive: true, force: true })
  if (!(await ownsLock(token))) return
  await mkdir(dirname(upstreamRoot), { recursive: true })
  for (const args of [['init', upstreamRoot], ['-C', upstreamRoot, 'fetch', '--depth=1', pinned.repository, pinned.commit], ['-C', upstreamRoot, 'checkout', '--detach', 'FETCH_HEAD']]) {
    if (!(await ownsLock(token))) return
    const result = spawnSync('git', args, { stdio: 'inherit' })
    if (result.status !== 0) throw new Error('Could not fetch the pinned official Harness source')
  }
  if (!worktreeMatchesPin() || !(await pinnedFilesPresent())) throw new Error('Could not fetch the pinned official Harness source')
}

export async function ensureUpstream() {
  const deadline = Date.now() + upstreamWaitMs
  while (!(await upstreamReady())) {
    if (Date.now() > deadline) throw new Error('Timed out waiting for the pinned official Harness source')
    await withUpstreamLock(deadline, async token => {
      if (await upstreamReady()) return
      await fetchPinnedSource(token)
      if (!(await ownsLock(token))) return
      if (!worktreeMatchesPin() || !(await pinnedFilesPresent())) return
      await writeAtomic(checkoutComplete, `${pinned.commit}\n`)
    })
  }
}

// Generated modules live under `.cache` and import the pinned tree. The
// specifier has to follow DSH_UPSTREAM_ROOT; a fixed `./upstream/...` path
// resolves the default cache even when the checkout is somewhere else.
export function officialSourceSpecifier(generatedFile, sourcePath) {
  let spec = relative(dirname(resolve(generatedFile)), join(upstreamRoot, sourcePath)).replaceAll('\\', '/')
  if (spec === '') return '.'
  if (!spec.startsWith('.') && !spec.startsWith('/')) spec = `./${spec}`
  return spec
}

function quotedSource(generatedFile, sourcePath) {
  return `'${officialSourceSpecifier(generatedFile, sourcePath).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`
}

async function packageRoots(folder, result = new Map()) {
  for (const item of await readdir(folder, { withFileTypes:true })) {
    if (!item.isDirectory() || ['node_modules','lib','.git'].includes(item.name)) continue
    const path = join(folder,item.name)
    try { const manifest=JSON.parse(await readFile(join(path,'package.json'),'utf8')); result.set(manifest.name,path) } catch {}
    await packageRoots(path,result)
  }
  return result
}

// Test files compile in parallel and share these generated inputs. A plain
// writeFile truncates first, so a concurrent build could read an empty module.
async function writeAtomic(path, text) {
  const { writeFile, rename } = await import('node:fs/promises')
  const temporary = `${path}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`
  await writeFile(temporary, text)
  await rename(temporary, path)
}

export async function compileOfficial(entry, outfile, platform='node') {
  await ensureUpstream()
  const roots=await packageRoots(upstreamRoot)
  // Compile public LLM classes without RPC services or Typert-generated code.
  const llmSource=await readFile(join(upstreamRoot,'packages/llm/llm/src/index.ts'),'utf8')
  const llmAst=ts.createSourceFile('llm.ts',llmSource,ts.ScriptTarget.Latest,true)
  const contract=llmAst.statements.filter(node=>['LlmError','LlmAdapter','assertUsableApiKey'].includes(node.name?.text)).map(node=>node.getText(llmAst)).join('\n')
  const errors=resolve('.cache/official-llm-contract.ts')
  await writeAtomic(errors, `import { HarnessError, INVALID_CREDENTIAL_CODE } from ${quotedSource(errors, 'packages/llm/llm/src/error.ts')};\nimport { normalizeApiKey } from ${quotedSource(errors, 'packages/llm/llm/src/api-key.ts')};\nexport * from ${quotedSource(errors, 'packages/llm/llm/src/error.ts')};\nexport * from ${quotedSource(errors, 'packages/llm/llm/src/api-key.ts')};\nexport * from ${quotedSource(errors, 'packages/llm/llm/src/attribution.ts')};\nexport * from ${quotedSource(errors, 'packages/llm/llm/src/brand.ts')};\nexport * from ${quotedSource(errors, 'packages/llm/llm/src/content.ts')};\nexport * from ${quotedSource(errors, 'packages/llm/llm/src/retry-policy.ts')};\n${contract}\n`)
  const primitiveEntry=resolve('.cache/official-locale-primitives.ts')
  await writeAtomic(primitiveEntry, `export { Menu } from ${quotedSource(primitiveEntry, 'packages/client/ui-primitives/src/Menu.tsx')};\nexport { IconChevronDownOutlineRegular } from ${quotedSource(primitiveEntry, 'packages/client/ui-primitives/src/icons/index.tsx')};\n`)
  const aliases={name:'official-source-packages',setup(builder){
    builder.onResolve({filter:/^@deepseek-ai\//},async args=>{
      if(args.path==='@deepseek-ai/dsh-llm')return {path:errors}
      if(args.path==='@deepseek-ai/dsh-client-ui-primitives')return {path:primitiveEntry}
      const [,scope,tail]=args.path.match(/^(@deepseek-ai\/[^/]+)(.*)$/)
      const root=roots.get(scope)
      if (!root) return
      const sub=tail.replace(/^\//,'')
      const candidates=sub.startsWith('src/')?[join(root,sub)]:sub?[join(root,'src',`${sub}.ts`),join(root,'src',sub,'index.ts')]:[join(root,'src/index.ts')]
      for(const path of candidates)try{await access(path);return {path}}catch{}
      throw new Error(`No official source entry for ${args.path}`)
    })
  }}
  // Resolve Harness imports from the pinned source; use node_modules for third-party dependencies.
  const nodePaths=[resolve('node_modules'),...(process.env.DSH_TEST_NODE_MODULES?[resolve(process.env.DSH_TEST_NODE_MODULES)]:[])]
  await build({entryPoints:[entry],outfile,bundle:true,platform,format:platform==='node'?'esm':'iife',target:'es2022',jsx:'automatic',nodePaths,plugins:[aliases],loader:{'.css':'text'},external:platform==='node'?['@earendil-works/pi-ai','@earendil-works/pi-ai/*']:[],logLevel:'silent',tsconfigRaw:{compilerOptions:{experimentalDecorators:true}},...platform==='node'?{banner:{js:"import {createRequire as pluginCheckRequireFactory} from 'node:module'; const require=pluginCheckRequireFactory(import.meta.url);"}}:{}})
}
