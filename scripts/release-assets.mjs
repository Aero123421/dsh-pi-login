import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { basename } from 'node:path'
import { pathToFileURL } from 'node:url'

/** Attach a package to a GitHub Release without publishing it or replacing assets. */
export function attachReleaseAssets({ tag, packagePath, checksumPath, notesFile, gh }) {
  const names = [basename(packagePath), basename(checksumPath)]
  const view = gh(['release', 'view', tag, '--json', 'isDraft,assets'])
  if (view.status !== 0) {
    if (!/not found/i.test(`${view.stderr}\n${view.stdout}`)) return view
    const args = ['release', 'create', tag, packagePath, checksumPath, '--verify-tag', '--draft', '--title', tag]
    if (notesFile && existsSync(notesFile)) args.push('--notes-file', notesFile)
    else args.push('--generate-notes')
    const created = gh(args)
    if (created.status !== 0) return created
  } else {
    const release = JSON.parse(view.stdout)
    const present = new Set((release.assets ?? []).map(asset => asset.name))
    const conflict = names.filter(name => present.has(name))
    if (conflict.length > 0) {
      return { status: 1, stdout: '', stderr: `Release ${tag} already has ${conflict.join(', ')}; leaving those assets unchanged.\n` }
    }
    const uploaded = gh(['release', 'upload', tag, packagePath, checksumPath])
    if (uploaded.status !== 0) return uploaded
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
