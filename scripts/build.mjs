import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { ensureUpstream, upstreamRoot } from './upstream.mjs'

await ensureUpstream()
const componentCss = new Map()
const nativeComponents = {
  name: 'official-ui-components',
  setup(builder) {
    builder.onResolve({ filter: /^@deepseek-ai\/dsh-client-ui-primitives$/ }, () => ({ path: resolve('scripts/native-components.jsx') }))
    builder.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      const source = await readFile(path, 'utf8')
      const prefix = `dshpi_${createHash('sha256').update(path.slice(upstreamRoot.length)).digest('hex').slice(0, 8)}_`
      const classes = Object.fromEntries([...source.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(match => [match[1], prefix + match[1]]))
      let css = source.replace(/:global\(([^)]+)\)/g, (_, selector) => selector.replaceAll('.', '__GLOBAL_DOT__'))
      css = css.replace(/\.([a-zA-Z_][\w-]*)/g, (_, name) => `.${classes[name]}`).replaceAll('__GLOBAL_DOT__', '.')
      componentCss.set(path, css)
      return { contents: `export default ${JSON.stringify(classes)}`, loader: 'js' }
    })
  },
}
await build({ entryPoints: ['scripts/native-components.jsx'], bundle: true, platform: 'browser', format: 'cjs', write: false, jsx: 'automatic', external: ['react', 'react/jsx-runtime', 'react-dom'], plugins: [nativeComponents] })
// CSS order must not depend on parallel file reads completing first.
const cssEntries = [...componentCss].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
await writeFile('.cache/native-controls.css', cssEntries.map(([, css]) => css).join('\n'))
await mkdir('dist', { recursive: true })
const manifest = JSON.parse(await readFile('package.json', 'utf8'))
await build({ entryPoints: ['src/index.mjs'], outfile: 'dist/index.js', bundle: true, platform: 'node', format: 'esm', target: 'node22', external: ['@deepseek-ai/*', '@earendil-works/pi-ai', '@earendil-works/pi-ai/*'] })
const client = await build({ entryPoints: ['src/client.jsx'], bundle: true, platform: 'browser', format: 'cjs', target: 'es2022', jsx: 'automatic', external: ['react', 'react/jsx-runtime', 'react-dom'], write: false, plugins: [nativeComponents], loader: { '.css': 'text' }, minify: true })
await writeFile('dist/client.js', `window.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)},factory(require){const module={exports:{}};const exports=module.exports;\n${client.outputFiles[0].text}\nreturn module.exports;}});\n`)
console.log(`${manifest.name}: built`)
