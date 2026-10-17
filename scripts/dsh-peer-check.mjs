import { execFileSync } from 'node:child_process'
import { checkCompatibility, semanticVersion } from '../src/updates.mjs'
import manifest from '../package.json' with { type: 'json' }

const ACCEPT = ['0.2.1-alpha.2', '0.2.1-alpha.3', '0.2.1-alpha.10', '0.2.1-rc.2', '0.2.1', '0.2.2-0', '0.2.2-alpha.1', '0.2.9']
const REJECT = ['0.2.1-alpha.1', '0.2.0-rc.2', '0.3.0-0', '0.3.0-alpha.1', '0.3.0', '1.0.0']

const peers = Object.entries(manifest.peerDependencies ?? {}).filter(([name]) => name === '@deepseek-ai/dsh' || name.startsWith('@deepseek-ai/dsh-'))
if (peers.length === 0) throw new Error('package.json declares no @deepseek-ai/dsh peerDependencies')
const ranges = new Set(peers.map(([, range]) => range))
if (ranges.size !== 1) throw new Error(`DSH peers must share one range, found ${[...ranges].join(', ')}`)
for (const [name, range] of peers) {
  let pinned = true
  try { semanticVersion(range) } catch { pinned = false }
  if (pinned) throw new Error(`${name} is pinned to ${range}; the boot check skips the plugin on the next DSH release`)
}
const candidate = { version: manifest.version }
for (const version of ACCEPT) {
  if (checkCompatibility(manifest, candidate, version) !== version) throw new Error(`peers do not accept ${version}`)
}
for (const version of REJECT) {
  try {
    checkCompatibility(manifest, candidate, version)
  } catch (error) {
    if (error?.message === 'incompatible') continue
    throw error
  }
  throw new Error(`peers accept ${version}`)
}
console.log(`DSH peers ${[...ranges][0]} accept ${ACCEPT.join(', ')}`)

if (process.env.DSH_PEER_CHECK_OFFLINE === '1') process.exit(0)
const published = execFileSync('npm', ['view', '@deepseek-ai/dsh@alpha', 'version'], { encoding: 'utf8' }).trim()
semanticVersion(published)
try {
  checkCompatibility(manifest, candidate, published)
} catch (error) {
  throw new Error(`npm @deepseek-ai/dsh@alpha ${published} does not satisfy ${[...ranges][0]} (${error?.message ?? error})`, { cause: error })
}
console.log(`npm @deepseek-ai/dsh@alpha ${published} satisfies the peer range`)
