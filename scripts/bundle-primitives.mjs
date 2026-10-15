import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { ensureUpstream, upstreamRoot } from './upstream.mjs'

/** One browser factory of the official primitives, sharing the caller's React. */
export async function bundlePrimitives() {
  await ensureUpstream()
  await mkdir('.cache', { recursive: true })
  const componentCss = new Map()
  const nativeComponents = {
    name: 'official-ui-components',
    setup(builder) {
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
  const client = await build({
    entryPoints: ['scripts/native-components.jsx'],
    bundle: true,
    platform: 'browser',
    format: 'cjs',
    target: 'es2022',
    jsx: 'automatic',
    write: false,
    external: ['react', 'react/jsx-runtime', 'react-dom'],
    plugins: [nativeComponents],
  })
  const cssEntries = [...componentCss].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
  await writeFile('.cache/primitives.css', cssEntries.map(([, css]) => css).join('\n'))
  await writeFile('.cache/primitives.js', `window.__DSH_UI_PRIMITIVES_FACTORY__=function(require){const module={exports:{}};const exports=module.exports;\n${client.outputFiles[0].text}\nreturn module.exports;};\n`)
}
