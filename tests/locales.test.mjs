import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { en, ja } from '../src/locales.mjs'

const placeholders = text => [...text.matchAll(/\{([A-Za-z][\w.]*)\}/g)].map(match => match[1]).sort()
test('login UI dictionaries agree in keys and placeholders', () => {
  assert.deepEqual(Object.keys(ja).sort(), Object.keys(en).sort())
  for (const key of Object.keys(en)) assert.deepEqual(placeholders(ja[key]), placeholders(en[key]))
})
test('the published package has no runtime dependency that installs build scripts', async () => {
  const manifest = JSON.parse(await readFile('package.json', 'utf8'))
  assert.equal(manifest.dependencies, undefined)
  assert.equal(manifest.devDependencies['@earendil-works/pi-ai'], '1.4.0')
})
test('the standalone bundle registers its installed package ID', async () => {
  const manifest = JSON.parse(await readFile('package.json', 'utf8'))
  const client = await readFile('dist/client.js', 'utf8')
  assert.ok(client.startsWith(`window.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)}`))
  assert.match(client, /require\("@deepseek-ai\/dsh-client-ui-primitives"\)/)
  assert.equal(client.includes('useModalLayer'), false)
  assert.ok(manifest.dsh.bundle.patch)
  assert.ok(manifest.dsh.client.external.includes('@deepseek-ai/dsh-client-ui-primitives'))
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-api-remotes'))
  for (const language of ['en', 'ja']) {
    const metadata = JSON.parse(await readFile(`locale/${language}.json`, 'utf8'))
    assert.equal(typeof metadata.meta.title, 'string')
    assert.equal(typeof metadata.meta.description, 'string')
  }
})
