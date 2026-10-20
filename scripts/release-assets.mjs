import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { basename } from 'node:path'
import { pathToFileURL } from 'node:url'

function assetLeftBehind(tag, name, result) {
  const detail = result.stderr && !result.stderr.endsWith('\n') ? `${result.stderr}\n` : result.stderr
  return {
    status: result.status || 1,
    stdout: result.stdout ?? '',
    stderr: `${detail}Release ${tag} still has ${name}. Delete that asset, then run this again:\ngh release delete-asset ${tag} ${name}\n`,
  }
}

/** Attach a package to a draft GitHub Release without publishing it or replacing assets. */
export function attachReleaseAssets({ tag, packagePath, checksumPath, notesFile, gh }) {
  const names = [basename(packagePath), basename(checksumPath)]
  const listed = gh(['release', 'list', '--limit', '1000', '--json', 'tagName,isDraft'])
  if (listed.status !== 0) return listed
  const known = JSON.parse(listed.stdout).find(item => item.tagName === tag)
  if (!known) {
    const args = ['release', 'create', tag, packagePath, checksumPath, '--verify-tag', '--draft', '--title', tag]
    if (notesFile && existsSync(notesFile)) args.push('--notes-file', notesFile)
    else args.push('--generate-notes')
    const created = gh(args)
    if (created.status !== 0) return assetLeftBehind(tag, names[0], created)
  } else {
    const view = gh(['release', 'view', tag, '--json', 'isDraft,assets'])
    if (view.status !== 0) return view
    const release = JSON.parse(view.stdout)
    if (release.isDraft !== true) {
      return { status: 1, stdout: '', stderr: `Release ${tag} is not a draft; leaving it unchanged and uploading nothing.\n` }
    }
    const present = new Set((release.assets ?? []).map(asset => asset.name))
    const conflict = names.filter(name => present.has(name))
    if (conflict.length > 0) {
      return { status: 1, stdout: '', stderr: `Release ${tag} already has ${conflict.join(', ')}; leaving those assets unchanged.\n` }
    }
    const uploaded = gh(['release', 'upload', tag, packagePath])
    if (uploaded.status !== 0) return uploaded
    const checksum = gh(['release', 'upload', tag, checksumPath])
    if (checksum.status !== 0) return assetLeftBehind(tag, names[0], checksum)
  }
  return gh(['release', 'view', tag, '--json', 'url,isDraft,assets'])
}

function runGh(args) {
  const result = spawnSync('gh', args, { encoding: 'utf8' })
  return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const tag = process.env.RELEASE_TAG
  const [packagePath, checksumPath] = process.argv.slice(2)
  if (!tag || !packagePath || !checksumPath) {
    process.stderr.write('RELEASE_TAG, package, and checksum are required.\n')
    process.exit(1)
  }
  const result = attachReleaseAssets({ tag, packagePath, checksumPath, notesFile: process.env.RELEASE_NOTES_FILE, gh: runGh })
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  process.exit(result.status === 0 ? 0 : result.status || 1)
}
