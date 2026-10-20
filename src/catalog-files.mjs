import { randomBytes } from 'node:crypto'
import { mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { mkdir, readFile, rename, rm, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const MAX_CATALOG_LENGTH = 8 * 1024 * 1024

/** Profile files for model catalogs. One directory, one file per connection. */
export class CatalogFiles {
  constructor(dir) { this.dir = dir }
  file(id) {
    if (typeof id !== 'string' || !NAME.test(id)) throw Object.assign(new Error('invalid-catalog'), { code: 'invalid-catalog' })
    return join(this.dir, `catalog-${id}.json`)
  }
  readSync(id) {
    try { return readFileSync(this.file(id), 'utf8') }
    catch (error) { if (error?.code === 'ENOENT') return undefined; throw error }
  }
  async read(id) {
    try { return await readFile(this.file(id), 'utf8') }
    catch (error) { if (error?.code === 'ENOENT') return undefined; throw error }
  }
  writeSync(id, value) {
    const target = this.file(id)
    assertCatalog(value)
    mkdirSync(this.dir, { recursive: true, mode: 0o700 })
    const temp = join(this.dir, `.${id}.${randomBytes(8).toString('hex')}.tmp`)
    try {
      writeFileSync(temp, value, { mode: 0o600, flag: 'wx' })
      renameSync(temp, target)
    } catch (error) {
      try { unlinkSync(temp) } catch { /* The failed temp file is already gone. */ }
      throw error
    }
  }
  async write(id, value, { signal, commit } = {}) {
    signal?.throwIfAborted()
    const target = this.file(id)
    assertCatalog(value)
    await mkdir(this.dir, { recursive: true, mode: 0o700 })
    const temp = join(this.dir, `.${id}.${randomBytes(8).toString('hex')}.tmp`)
    try {
      await writeFile(temp, value, { mode: 0o600, flag: 'wx' })
      signal?.throwIfAborted()
      if (commit && !commit()) throw Object.assign(new Error('connection-changed'), { code: 'connection-changed' })
      await rename(temp, target)
    } catch (error) {
      await unlink(temp).catch(() => {})
      throw error
    }
  }
  async remove(id) { await rm(this.file(id), { force: true }) }
}

function assertCatalog(value) {
  if (typeof value !== 'string' || value.length > MAX_CATALOG_LENGTH) throw Object.assign(new Error('invalid-catalog'), { code: 'invalid-catalog' })
}
