import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

const pinned = JSON.parse(await readFile(new URL('../upstream.json', import.meta.url), 'utf8')).commit

test('parallel readers wait until the pinned checkout finishes writing packages/llm/llm', async () => {
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
  const run = () => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', code], { cwd: process.cwd(), env })
    let stdout = '', stderr = ''
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', reject)
    child.on('close', status => resolve({ status, stdout, stderr }))
  })
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
