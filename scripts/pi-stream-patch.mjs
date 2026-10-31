import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { dirname, resolve, relative } from 'node:path'

export const piRoot = dirname(dirname(fileURLToPath(import.meta.resolve('@earendil-works/pi-ai'))))

// Pi 1.4.0 validates completed arguments with parseToolCallArguments(). Only
// provisional reparsing is removed: Harness consumes the raw delta instead.
const provisionalParses = {
  'api/openai-completions.js': ['block.arguments = parseStreamingJson(block.partialArgs);', 1],
  'api/anthropic-messages.js': ['block.arguments = parseStreamingJson(block.partialJson);', 1],
  'api/bedrock-converse-stream.js': ['block.arguments = parseStreamingJson(block.partialJson);', 1],
  'api/mistral-conversations.js': ['block.arguments = parseStreamingJson(block.partialArgs);', 1],
  'api/openai-responses-shared.js': ['slot.block.arguments = parseStreamingJson(slot.block.partialJson);', 2],
  'api/pi-messages.js': ['partial.content[event.contentIndex].arguments =\n                    parseStreamingJson(json);', 1],
}

export function patchPiSource(path, source) {
  const patch = provisionalParses[path]
  if (patch) {
    const [statement, expected] = patch
    const count = source.split(statement).length - 1
    if (count !== expected) throw new Error(`Pi streaming patch mismatch: ${path} (${count}, expected ${expected})`)
    if (path !== 'api/pi-messages.js' && !source.includes('parseToolCallArguments(')) {
      throw new Error(`Pi final argument validation missing: ${path}`)
    }
    source = source.replaceAll(statement, '/* Arguments are parsed and validated at toolcall_end. */')
  }
  // These Node-only loaders hide literal imports from browser bundlers. This
  // Host bundle includes their complete module graph, preserving one SDK copy.
  if (path === 'auth/oauth/load.js') {
    let count = 0
    source = source.replace(/importOAuthModule\("(\.\/[^"\n]+)\.ts"\)/g, (_, name) => {
      count++
      return `import(${JSON.stringify(`${name}.js`)})`
    })
    if (count !== 9) throw new Error(`Pi OAuth loader patch mismatch (${count}, expected 9)`)
  }
  if (path === 'api/bedrock-converse-stream.lazy.js') {
    const before = 'importNodeOnlyApi("./bedrock-converse-stream.ts")'
    if (source.split(before).length !== 2) throw new Error('Pi Bedrock loader patch mismatch')
    source = source.replace(before, 'import("./bedrock-converse-stream.js")')
  }
  return source
}

export function piStreamPatchPlugin() {
  return {
    name: 'pi-1.4.0-stream-arguments',
    setup(builder) {
      builder.onStart(async () => {
        const manifest = JSON.parse(await readFile(resolve(piRoot, 'package.json'), 'utf8'))
        if (manifest.version !== '1.4.0') throw new Error(`Pi streaming patch requires 1.4.0; installed ${manifest.version}`)
      })
      builder.onResolve({ filter: /^@earendil-works\/pi-ai(?:\/|$)/ }, args => ({ path: fileURLToPath(import.meta.resolve(args.path)) }))
      builder.onLoad({ filter: /\.js$/ }, async args => {
        const path = relative(resolve(piRoot, 'dist'), args.path).replaceAll('\\', '/')
        if (path.startsWith('../')) return
        const source = await readFile(args.path, 'utf8')
        return { contents: patchPiSource(path, source), loader: 'js' }
      })
    },
  }
}

// Bundled CommonJS dependencies still need Node's runtime require for builtins.
export const nodeBundleBanner = "import { createRequire as piBundleCreateRequire } from 'node:module'; const require = piBundleCreateRequire(import.meta.url);"
