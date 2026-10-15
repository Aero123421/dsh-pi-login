import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { access, chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'

const pinned = JSON.parse(await readFile(new URL('../upstream.json', import.meta.url), 'utf8')).commit
const staleLockMs = 15 * 60 * 1000

function runNode(code, env, timeoutMs = 12_000) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', code], { cwd: process.cwd(), env })
    let stdout = ''
    let stderr = ''
    let settled = false
    const finish = (settle, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      settle(value)
    }
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      finish(reject, new Error(`timed out after ${timeoutMs}ms\n${stdout}\n${stderr}`))
    }, timeoutMs)
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', error => finish(reject, error))
    child.on('close', status => finish(resolveRun, { status, stdout, stderr }))
  })
}

const ensureCode = `
  import { ensureUpstream } from './scripts/upstream.mjs'
  const started = Date.now()
  await ensureUpstream()
  console.log('ready', Date.now() - started)
`

async function installGit(bin) {
  await mkdir(bin, { recursive: true })
  const git = join(bin, 'git')
  await writeFile(git, `#!/bin/bash
set -euo pipefail
commit="\${UPSTREAM_PIN:?}"
log="\${GIT_LOG:?}"
if [[ "\${1:-}" == "init" ]]; then
  mkdir -p "$2/.git"
  exit 0
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "fetch" ]]; then
  printf 'fetch\\n' >> "$log"
  if [[ "\${GIT_FAIL:-}" == "fetch" ]]; then exit 1; fi
  exit 0
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "rev-parse" ]]; then
  if [[ -f "$2/.git/HEAD_COMMIT" ]]; then
    cat "$2/.git/HEAD_COMMIT"
    exit 0
  fi
  exit 1
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "diff" ]]; then
  if [[ -f "$2/.git/DIRTY" ]]; then exit 1; fi
  exit 0
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "checkout" ]]; then
  printf 'checkout\\n' >> "$log"
  if [[ "\${GIT_FAIL:-}" == "checkout" ]]; then exit 1; fi
  repo="$2"
  mkdir -p "$repo/packages/client/locale/src/client" "$repo/packages/llm/llm/src" "$repo/.git"
  printf 'locale\\n' > "$repo/packages/client/locale/src/client/index.ts"
  printf 'export {}\\n' > "$repo/packages/llm/llm/src/index.ts"
  printf '%s\\n' "$commit" > "$repo/.git/HEAD_COMMIT"
  exit 0
fi
echo "unexpected git: $*" >&2
exit 1
`)
  await chmod(git, 0o755)
}

function gitEnv(root, tree, extra = {}) {
  return {
    ...process.env,
    PATH: `${join(root, 'bin')}:${process.env.PATH}`,
    DSH_UPSTREAM_ROOT: tree,
    UPSTREAM_PIN: pinned,
    GIT_LOG: join(root, 'checkouts'),
    ...extra,
  }
}

async function operations(root) {
  try { return (await readFile(join(root, 'checkouts'), 'utf8')).split('\n').filter(Boolean) }
  catch (error) {
    if (error?.code === 'ENOENT') return []
    throw error
  }
}

async function absent(path) {
  await assert.rejects(access(path), { code: 'ENOENT' })
}

async function exitedPid() {
  const child = spawn(process.execPath, ['-e', 'process.exit(0)'])
  const pid = child.pid
  await new Promise((resolveExit, reject) => {
    child.once('exit', () => resolveExit())
    child.once('error', reject)
  })
  assert.throws(() => process.kill(pid, 0))
  return pid
}

async function writeLock(root, owner) {
  const directory = join(root, 'upstream.lock')
  await mkdir(directory)
  await writeFile(join(directory, 'owner'), `${JSON.stringify(owner)}\n`)
}

async function seedTree(tree, { marker, head, llm = true }) {
  await mkdir(join(tree, 'packages/client/locale/src/client'), { recursive: true })
  await mkdir(join(tree, 'packages/llm/llm/src'), { recursive: true })
  await mkdir(join(tree, '.git'), { recursive: true })
  await writeFile(join(tree, 'packages/client/locale/src/client/index.ts'), 'locale\n')
  if (llm) await writeFile(join(tree, 'packages/llm/llm/src/index.ts'), 'export {}\n')
  if (head !== undefined) await writeFile(join(tree, '.git/HEAD_COMMIT'), `${head}\n`)
  if (marker !== undefined) await writeFile(join(tree, '.checkout-complete'), `${marker}\n`)
}

function readyElapsed(result) {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  const elapsed = Number(result.stdout.match(/ready (\d+)/)?.[1])
  assert.ok(Number.isFinite(elapsed), result.stdout)
  return elapsed
}

test('parallel readers wait until the pinned checkout finishes writing packages/llm/llm', { timeout: 30_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'upstream-pin-'))
  const bin = join(root, 'bin')
  const tree = join(root, 'upstream')
  await mkdir(bin)
  const git = join(bin, 'git')
  await writeFile(git, `#!/bin/bash
set -euo pipefail
commit="\${UPSTREAM_PIN:?}"
if [[ "\${1:-}" == "init" ]]; then
  mkdir -p "$2/.git"
  exit 0
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "fetch" ]]; then
  exit 0
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "rev-parse" ]]; then
  cat "$2/.git/HEAD_COMMIT"
  exit 0
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "diff" ]]; then
  exit 0
fi
if [[ "\${1:-}" == "-C" && "\${3:-}" == "checkout" ]]; then
  repo="$2"
  mkdir -p "$repo/packages/client/locale/src/client" "$repo/.git"
  printf 'locale\\n' > "$repo/packages/client/locale/src/client/index.ts"
  printf 'checkout\\n' >> "$repo/../checkouts"
  sleep 2
  mkdir -p "$repo/packages/llm/llm/src"
  printf 'export {}\\n' > "$repo/packages/llm/llm/src/index.ts"
  printf '%s\\n' "$commit" > "$repo/.git/HEAD_COMMIT"
  exit 0
fi
echo "unexpected git: $*" >&2
exit 1
`)
  await chmod(git, 0o755)
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, DSH_UPSTREAM_ROOT: tree, UPSTREAM_PIN: pinned }
  const code = `
    import { access } from 'node:fs/promises'
    import { join } from 'node:path'
    import { ensureUpstream, upstreamRoot } from './scripts/upstream.mjs'
    const started = Date.now()
    await ensureUpstream()
    await access(join(upstreamRoot, 'packages/llm/llm/src/index.ts'))
    console.log('ready', Date.now() - started)
  `
  const run = () => runNode(code, env, 20_000)
  try {
    const results = await Promise.all([run(), run()])
    for (const result of results) {
      assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
      const elapsed = Number(result.stdout.match(/ready (\d+)/)?.[1])
      assert.ok(elapsed >= 1500, `reader continued during checkout after ${elapsed}ms\n${result.stdout}`)
    }
    assert.equal((await readFile(join(root, 'checkouts'), 'utf8')).trim(), 'checkout')
    assert.equal((await readFile(join(tree, '.checkout-complete'), 'utf8')).trim(), pinned)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

for (const stage of ['fetch', 'checkout']) {
  test(`a failed ${stage} does not write the checkout marker`, { timeout: 20_000 }, async () => {
    const root = await mkdtemp(join(tmpdir(), 'upstream-fail-'))
    const tree = join(root, 'upstream')
    try {
      await installGit(join(root, 'bin'))
      await seedTree(tree, { marker: pinned, head: 'not-the-pin' })
      const result = await runNode(ensureCode, gitEnv(root, tree, { GIT_FAIL: stage }))
      assert.notEqual(result.status, 0, result.stdout)
      assert.match(`${result.stderr}`, /Could not fetch the pinned official Harness source/)
      assert.doesNotMatch(`${result.stderr}`, /Timed out waiting/)
      await absent(join(tree, '.checkout-complete'))
      await absent(join(root, 'upstream.lock'))
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
}

test('a lock whose owner has exited is reclaimed without waiting out the timeout', { timeout: 20_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'upstream-dead-'))
  const tree = join(root, 'upstream')
  try {
    await installGit(join(root, 'bin'))
    await writeLock(root, { pid: await exitedPid(), startedAt: Date.now(), token: 'dead-owner' })
    const env = gitEnv(root, tree)
    const started = Date.now()
    const results = await Promise.all([runNode(ensureCode, env), runNode(ensureCode, env)])
    for (const result of results) assert.ok(readyElapsed(result) < 5000, result.stdout)
    assert.ok(Date.now() - started < 8000, 'reclaim waited on the lock timeout')
    const ops = await operations(root)
    assert.equal(ops.filter(item => item === 'checkout').length, 1, ops.join(','))
    assert.equal((await readFile(join(tree, '.checkout-complete'), 'utf8')).trim(), pinned)
    await absent(join(root, 'upstream.lock'))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a stale lock is reclaimed while its owner pid is still alive', { timeout: 20_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'upstream-stale-'))
  const tree = join(root, 'upstream')
  try {
    await installGit(join(root, 'bin'))
    await writeLock(root, { pid: process.pid, startedAt: Date.now() - staleLockMs - 1000, token: 'old-owner' })
    const result = await runNode(ensureCode, gitEnv(root, tree))
    assert.ok(readyElapsed(result) < 5000, result.stdout)
    const ops = await operations(root)
    assert.equal(ops.filter(item => item === 'checkout').length, 1, ops.join(','))
    assert.equal((await readFile(join(tree, '.checkout-complete'), 'utf8')).trim(), pinned)
    await absent(join(root, 'upstream.lock'))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('an outdated checkout marker is fetched again', { timeout: 20_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'upstream-marker-'))
  const tree = join(root, 'upstream')
  try {
    await installGit(join(root, 'bin'))
    await seedTree(tree, { marker: 'outdated', head: pinned })
    const result = await runNode(ensureCode, gitEnv(root, tree))
    assert.equal(readyElapsed(result) >= 0, true)
    const ops = await operations(root)
    assert.equal(ops.filter(item => item === 'checkout').length, 1, ops.join(','))
    assert.equal((await readFile(join(tree, '.checkout-complete'), 'utf8')).trim(), pinned)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a matching marker is fetched again when the worktree does not match the pin', { timeout: 20_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'upstream-broken-'))
  const missingLlm = join(root, 'missing-llm')
  const wrongHead = join(root, 'wrong-head')
  try {
    await installGit(join(root, 'bin'))
    await seedTree(missingLlm, { marker: pinned, head: pinned, llm: false })
    await seedTree(wrongHead, { marker: pinned, head: 'other-commit' })
    const missing = await runNode(ensureCode, gitEnv(root, missingLlm, { GIT_LOG: join(root, 'missing.log') }))
    const wrong = await runNode(ensureCode, gitEnv(root, wrongHead, { GIT_LOG: join(root, 'wrong.log') }))
    assert.equal(readyElapsed(missing) >= 0, true)
    assert.equal(readyElapsed(wrong) >= 0, true)
    assert.equal((await readFile(join(root, 'missing.log'), 'utf8')).trim(), 'fetch\ncheckout')
    assert.equal((await readFile(join(root, 'wrong.log'), 'utf8')).trim(), 'fetch\ncheckout')
    assert.equal((await readFile(join(missingLlm, '.checkout-complete'), 'utf8')).trim(), pinned)
    assert.equal((await readFile(join(wrongHead, '.git/HEAD_COMMIT'), 'utf8')).trim(), pinned)
    await access(join(missingLlm, 'packages/llm/llm/src/index.ts'))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('generated imports follow DSH_UPSTREAM_ROOT', { timeout: 20_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'upstream-spec-'))
  const tree = join(root, 'custom upstream')
  const code = `
    import { officialSourceSpecifier } from './scripts/upstream.mjs'
    console.log(officialSourceSpecifier('.cache/official-llm-contract.ts', 'packages/llm/llm/src/error.ts'))
    console.log(officialSourceSpecifier('.cache/official-locale-primitives.ts', 'packages/client/ui-primitives/src/Menu.tsx'))
  `
  try {
    const customEnv = { ...process.env, DSH_UPSTREAM_ROOT: tree }
    const custom = await runNode(code, customEnv)
    assert.equal(custom.status, 0, custom.stderr)
    const [llm, menu] = custom.stdout.trim().split('\n')
    const expected = (generated, source) => {
      let spec = relative(dirname(resolve(generated)), join(tree, source)).replaceAll('\\', '/')
      if (!spec.startsWith('.') && !spec.startsWith('/')) spec = `./${spec}`
      return spec
    }
    assert.equal(llm, expected('.cache/official-llm-contract.ts', 'packages/llm/llm/src/error.ts'))
    assert.equal(menu, expected('.cache/official-locale-primitives.ts', 'packages/client/ui-primitives/src/Menu.tsx'))
    assert.ok(llm.includes('custom upstream/packages/llm/llm/src/error.ts'), llm)
    assert.notEqual(llm, './upstream/packages/llm/llm/src/error.ts')
    const plainEnv = { ...process.env }
    delete plainEnv.DSH_UPSTREAM_ROOT
    const plain = await runNode(code, plainEnv)
    assert.equal(plain.status, 0, plain.stderr)
    assert.equal(plain.stdout.trim().split('\n')[0], './upstream/packages/llm/llm/src/error.ts')
    assert.equal(plain.stdout.trim().split('\n')[1], './upstream/packages/client/ui-primitives/src/Menu.tsx')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
