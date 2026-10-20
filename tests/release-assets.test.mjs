import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { attachReleaseAssets } from '../scripts/release-assets.mjs'

const packagePath = 'artifacts/local-dsh-pi-login-0.8.1.tgz'
const checksumPath = 'artifacts/SHA256SUMS'
const assetNames = ['local-dsh-pi-login-0.8.1.tgz', 'SHA256SUMS']

function capture(respond) {
  const calls = []
  const gh = args => {
    calls.push([...args])
    return respond(args, calls)
  }
  return { calls, gh }
}

function forbidden(calls) {
  const flat = calls.map(args => args.join(' '))
  assert.equal(flat.some(line => line.includes('--clobber')), false)
  assert.equal(flat.some(line => line.includes('--latest')), false)
  assert.equal(flat.some(line => line.includes('draft=false')), false)
  assert.equal(flat.some(line => /\brelease edit\b/.test(line) || line.startsWith('release edit')), false)
  assert.equal(calls.some(args => args[0] === 'release' && args[1] === 'edit'), false)
}

function releaseList(tag, isDraft) {
  return JSON.stringify([{ tagName: tag, isDraft }])
}

test('a missing release is created as a draft and is not published', () => {
  const { calls, gh } = capture(args => {
    if (args[1] === 'list') return { status: 0, stdout: '[]', stderr: '' }
    if (args[1] === 'create') return { status: 0, stdout: '', stderr: '' }
    return { status: 0, stdout: '{"url":"https://example.test/v0.8.1","isDraft":true,"assets":[]}', stderr: '' }
  })
  const result = attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, gh })
  assert.equal(result.status, 0)
  const create = calls.find(args => args[1] === 'create')
  assert.ok(create)
  assert.equal(create.includes('--draft'), true)
  assert.equal(create.includes('--verify-tag'), true)
  assert.equal(create.includes('--generate-notes'), true)
  assert.equal(create.includes(packagePath), true)
  assert.equal(create.includes(checksumPath), true)
  assert.equal(calls.some(args => args[1] === 'upload'), false)
  assert.deepEqual(calls[0], ['release', 'list', '--limit', '1000', '--json', 'tagName,isDraft'])
  forbidden(calls)
})

test('a new draft uses the notes file without editing an existing release', () => {
  const notes = join(mkdtempSync(join(tmpdir(), 'pi-notes-')), 'notes.md')
  writeFileSync(notes, 'draft notes\n')
  const { calls, gh } = capture(args => args[1] === 'list'
    ? { status: 0, stdout: '[]', stderr: '' }
    : { status: 0, stdout: '', stderr: '' })
  assert.equal(attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, notesFile: notes, gh }).status, 0)
  const create = calls.find(args => args[1] === 'create')
  assert.equal(create.includes('--notes-file'), true)
  assert.equal(create.includes(notes), true)
  assert.equal(create.includes('--generate-notes'), false)
  forbidden(calls)
})

test('a published release exits 1 and uploads nothing', () => {
  const { calls, gh } = capture(args => args[1] === 'list'
    ? { status: 0, stdout: releaseList('v0.8.1', false), stderr: '' }
    : { status: 0, stdout: JSON.stringify({ isDraft: false, assets: [{ name: 'other.txt' }] }), stderr: '' })
  const result = attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, gh })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /not a draft/)
  assert.equal(calls.some(args => args[1] === 'upload'), false)
  assert.equal(calls.some(args => args[1] === 'create'), false)
  forbidden(calls)
})

test('an existing draft receives assets that are not already present', () => {
  const { calls, gh } = capture(args => {
    if (args[1] === 'list') return { status: 0, stdout: releaseList('v0.8.1', true), stderr: '' }
    if (args[1] === 'view' && args.at(-1) === 'isDraft,assets') {
      return { status: 0, stdout: JSON.stringify({ isDraft: true, assets: [{ name: 'other.txt' }] }), stderr: '' }
    }
    return { status: 0, stdout: JSON.stringify({ url: 'https://example.test', isDraft: true, assets: [] }), stderr: '' }
  })
  const result = attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, gh })
  assert.equal(result.status, 0)
  const uploads = calls.filter(args => args[1] === 'upload')
  assert.deepEqual(uploads, [
    ['release', 'upload', 'v0.8.1', packagePath],
    ['release', 'upload', 'v0.8.1', checksumPath],
  ])
  assert.equal(calls.some(args => args[1] === 'create'), false)
  forbidden(calls)
})

test('a create failure tells the operator to delete the package asset and does not delete it', () => {
  const { calls, gh } = capture(args => {
    if (args[1] === 'list') return { status: 0, stdout: '[]', stderr: '' }
    if (args[1] === 'create') return { status: 1, stdout: '', stderr: 'failed to upload SHA256SUMS\n' }
    return { status: 0, stdout: '', stderr: '' }
  })
  const result = attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, gh })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /failed to upload SHA256SUMS/)
  assert.match(result.stderr, new RegExp(`gh release delete-asset v0\\.8\\.1 ${assetNames[0]}`))
  assert.equal(calls.some(args => args[1] === 'upload' || args[1] === 'delete-asset'), false)
  assert.deepEqual(calls.map(args => args[1]), ['list', 'create'])
  forbidden(calls)
})

test('a checksum upload failure tells the operator to delete the package asset', () => {
  const { calls, gh } = capture(args => {
    if (args[1] === 'list') return { status: 0, stdout: releaseList('v0.8.1', true), stderr: '' }
    if (args[1] === 'view') return { status: 0, stdout: JSON.stringify({ isDraft: true, assets: [] }), stderr: '' }
    if (args.at(-1) === packagePath) return { status: 0, stdout: '', stderr: '' }
    return { status: 1, stdout: '', stderr: 'failed to upload SHA256SUMS\n' }
  })
  const result = attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, gh })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /failed to upload SHA256SUMS/)
  assert.match(result.stderr, new RegExp(`gh release delete-asset v0\\.8\\.1 ${assetNames[0]}`))
  assert.deepEqual(calls.filter(args => args[1] === 'upload'), [
    ['release', 'upload', 'v0.8.1', packagePath],
    ['release', 'upload', 'v0.8.1', checksumPath],
  ])
  forbidden(calls)
})

test('an existing asset of the same name is left in place and the command fails', () => {
  for (const assets of [[{ name: assetNames[0] }], [{ name: assetNames[1] }], assetNames.map(name => ({ name }))]) {
    const { calls, gh } = capture(args => args[1] === 'list'
      ? { status: 0, stdout: releaseList('v0.8.1', true), stderr: '' }
      : { status: 0, stdout: JSON.stringify({ isDraft: true, assets }), stderr: '' })
    const result = attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, gh })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /leaving those assets unchanged/)
    assert.deepEqual(calls.map(args => args[1]), ['list', 'view'])
    forbidden(calls)
  }
})

test('a release list failure does not create or upload', () => {
  const { calls, gh } = capture(() => ({ status: 1, stdout: '', stderr: 'authentication required\n' }))
  const result = attachReleaseAssets({ tag: 'v0.8.1', packagePath, checksumPath, gh })
  assert.equal(result.status, 1)
  assert.equal(calls.length, 1)
  assert.equal(calls[0][1], 'list')
  forbidden(calls)
})

test('the workflow and script do not publish, edit notes, or overwrite assets', () => {
  const sources = ['.github/workflows/release.yml', 'scripts/release-assets.mjs'].map(path => readFileSync(path, 'utf8'))
  assert.match(sources[0], /node scripts\/release-assets\.mjs/)
  for (const source of sources) {
    assert.doesNotMatch(source, /--clobber/)
    assert.doesNotMatch(source, /draft=false/)
    assert.doesNotMatch(source, /--latest\b/)
    assert.doesNotMatch(source, /release edit/)
  }
  assert.match(sources[1], /'--draft'/)
  assert.doesNotMatch(sources[1], /not found/i)
  assert.match(sources[1], /'release', 'list', '--limit', '1000', '--json', 'tagName,isDraft'/)
  assert.match(sources[1], /gh release delete-asset/)
  assert.equal(sources[1].includes("'delete-asset'"), false)
})

test('the command exits 1 when the release already has the package or checksum', () => {
  const root = mkdtempSync(join(tmpdir(), 'pi-release-gh-'))
  const log = join(root, 'calls.log')
  writeFileSync(join(root, 'gh'), `#!/usr/bin/env node
const { appendFileSync } = require('node:fs')
const args = process.argv.slice(2)
appendFileSync(${JSON.stringify(log)}, JSON.stringify(args) + '\\n')
if (args.includes('--clobber') || args[1] === 'edit' || args.includes('--latest') || args.includes('--draft=false')) process.exit(99)
if (args[1] === 'list') {
  console.log(JSON.stringify([{ tagName: 'v0.8.1', isDraft: true }]))
}
if (args[1] === 'view') {
  console.log(JSON.stringify({ isDraft: true, assets: [{ name: 'local-dsh-pi-login-0.8.1.tgz' }, { name: 'SHA256SUMS' }] }))
}
`)
  chmodSync(join(root, 'gh'), 0o755)
  const result = spawnSync(process.execPath, ['scripts/release-assets.mjs', packagePath, checksumPath], {
    env: { ...process.env, PATH: `${root}:${process.env.PATH}`, RELEASE_TAG: 'v0.8.1' },
    encoding: 'utf8',
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /leaving those assets unchanged/)
  const calls = readFileSync(log, 'utf8').trim().split('\n').map(line => JSON.parse(line))
  assert.deepEqual(calls, [
    ['release', 'list', '--limit', '1000', '--json', 'tagName,isDraft'],
    ['release', 'view', 'v0.8.1', '--json', 'isDraft,assets'],
  ])
})
