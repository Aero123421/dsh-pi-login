import { build } from 'esbuild'
import { piStreamPatchPlugin, nodeBundleBanner } from './pi-stream-patch.mjs'
import { writeBundleNotices } from './bundle-notices.mjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

await mkdir('dist', { recursive: true })
const manifest = JSON.parse(await readFile('package.json', 'utf8'))
const host = await build({ metafile: true, entryPoints: ['src/index.mjs'], outfile: 'dist/index.js', bundle: true, platform: 'node', format: 'esm', target: 'node22', external: ['@deepseek-ai/*'], plugins: [piStreamPatchPlugin()], banner: { js: nodeBundleBanner } })
await writeBundleNotices(host.metafile)
const client = await build({
  entryPoints: ['src/client.jsx'],
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2022',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom', '@deepseek-ai/dsh-client-ui-primitives'],
  write: false,
  loader: { '.css': 'text' },
  minify: true,
})
await writeFile('dist/client.js', `window.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)},factory(require){const module={exports:{}};const exports=module.exports;\n${client.outputFiles[0].text}\nreturn module.exports;}});\n`)
console.log(`${manifest.name}: built`)
