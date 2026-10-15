import { readFile, readdir, access, mkdir, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'
import ts from 'typescript'

export const upstreamRoot = resolve(process.env.DSH_UPSTREAM_ROOT ?? '.cache/upstream')
const pinned = JSON.parse(await readFile('upstream.json', 'utf8'))
const upstreamLock = resolve(upstreamRoot, '..', 'upstream.lock')
const checkoutComplete = join(upstreamRoot, '.checkout-complete')
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
// packages/llm and the other workspaces. A locale file is not a finished
// checkout. Parallel test processes wait for this marker, which is written
// only after checkout returns and the worktree matches the pinned commit.
async function upstreamReady() {
  try { return (await readFile(checkoutComplete, 'utf8')).trim() === pinned.commit }
  catch { return false }
}

// Test files are separate processes and all call this on a cold cache.
async function withUpstreamLock(fetchSource) {
  await mkdir(resolve(upstreamLock, '..'), { recursive: true })
  const deadline = Date.now() + 15 * 60 * 1000
  for (;;) {
    try {
      await mkdir(upstreamLock)
      break
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error
      if (await upstreamReady()) return
      if (Date.now() > deadline) throw new Error('Timed out waiting for the pinned official Harness source')
      await new Promise(resolveWait => setTimeout(resolveWait, 250))
    }
  }
  try {
    if (!(await upstreamReady())) await fetchSource()
  } finally {
    await rm(upstreamLock, { recursive: true, force: true })
  }
}

async function fetchPinnedSource() {
  if (worktreeMatchesPin() && await pinnedFilesPresent()) return
  await rm(upstreamRoot, { recursive: true, force: true })
  await mkdir(resolve(upstreamRoot, '..'), { recursive: true })
  for (const args of [['init', upstreamRoot], ['-C', upstreamRoot, 'fetch', '--depth=1', pinned.repository, pinned.commit], ['-C', upstreamRoot, 'checkout', '--detach', 'FETCH_HEAD']]) {
    const result = spawnSync('git', args, { stdio: 'inherit' })
    if (result.status !== 0) throw new Error('Could not fetch the pinned official Harness source')
  }
  if (!worktreeMatchesPin() || !(await pinnedFilesPresent())) throw new Error('Could not fetch the pinned official Harness source')
}

export async function ensureUpstream() {
  if (await upstreamReady()) return
  await withUpstreamLock(async () => {
    if (await upstreamReady()) return
    await fetchPinnedSource()
    await writeAtomic(checkoutComplete, `${pinned.commit}\n`)
  })
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
  await writeAtomic(errors, `import { HarnessError, INVALID_CREDENTIAL_CODE } from './upstream/packages/llm/llm/src/error.ts';\nimport { normalizeApiKey } from './upstream/packages/llm/llm/src/api-key.ts';\nexport * from './upstream/packages/llm/llm/src/error.ts';\nexport * from './upstream/packages/llm/llm/src/api-key.ts';\nexport * from './upstream/packages/llm/llm/src/attribution.ts';\nexport * from './upstream/packages/llm/llm/src/brand.ts';\nexport * from './upstream/packages/llm/llm/src/content.ts';\nexport * from './upstream/packages/llm/llm/src/retry-policy.ts';\n${contract}\n`)
  const primitiveEntry=resolve('.cache/official-locale-primitives.ts')
  await writeAtomic(primitiveEntry, `export { Menu } from './upstream/packages/client/ui-primitives/src/Menu.tsx';\nexport { IconChevronDownOutlineRegular } from './upstream/packages/client/ui-primitives/src/icons/index.tsx';\n`)
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
