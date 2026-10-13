/**
 * Connects Pi's credential store, auth context, and login flows to
 * Harness Credentials and Authorization services.
 *
 * @module dsh-pi-login/runtime/auth
 */

import { homedir } from 'node:os'
import { access } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'
import type { AuthContext, AuthOperationOptions, Credential, CredentialInfo, CredentialStore } from '@earendil-works/pi-ai'
import type { Context } from '@deepseek-ai/cordis'
import {
  credentialKey, credentialKeyId, credentialKeyScope, credentialRef, isCredentialKeySegment, isCredentialRefName,
} from '@deepseek-ai/dsh-credentials'
import type { CredentialKey, CredentialProvider, CredentialRecord } from '@deepseek-ai/dsh-credentials'
import { launchEnvironmentOf } from '@deepseek-ai/dsh-launch-environment'
import { LlmError } from '@deepseek-ai/dsh-llm'

/**
 * The record scope every credential this adapter family stores is written
 * under. It is the plugin's registered name, which is what tells a later
 * reader — a configuration UI, or a second adapter family serving the same
 * provider name — that this plugin owns the format inside the record.
 */
export const RECORD_SCOPE = 'llm-pi-ai'

/**
 * The record address for a connection, or a retained legacy native provider.
 * @param recordId - the Host-owned connection credential record ID.
 * @returns the scoped credential key this adapter family reads and writes.
 */
export function recordKeyFor(recordId: string): CredentialKey {
  return credentialKey(RECORD_SCOPE, recordId)
}

/**
 * The JSON image of one grant payload: plain objects lose their
 * explicitly-undefined members and array entries JSON cannot hold become
 * null, exactly as `JSON.stringify` would render them. pi-ai credentials
 * idiomatically carry optional members as explicit `undefined` (a github.com
 * Copilot grant holds `enterpriseUrl: undefined`), which the credential
 * store's strict validator refuses as unrepresentable. Everything else —
 * non-finite numbers and foreign prototypes included — passes through
 * untouched, so a genuinely unstorable value still fails loud at the store.
 * @param value - the value to render.
 * @returns the value's JSON image.
 */
function jsonImage(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(entry => entry === undefined ? null : jsonImage(entry))
  if (typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype) {
    const image: Record<string, unknown> = {}
    for (const [key, member] of Object.entries(value)) {
      if (member !== undefined) image[key] = jsonImage(member)
    }
    return image
  }
  return value
}

/**
 * Translate a stored record into the credential pi-ai expects.
 *
 * An `api-key` record is structural on both sides, so it is rebuilt field by
 * field. A `grant` payload is pi-ai's own OAuth credential, stored verbatim:
 * the seam treats it as opaque JSON precisely so a library that owns a token
 * format keeps owning it, refresh fields and all.
 * @param record - the stored record, or undefined when nothing is stored.
 * @returns the pi-ai credential, or undefined for an absent record.
 */
function toPiCredential(record: CredentialRecord | undefined): Credential | undefined {
  if (record === undefined) return undefined
  if (record.kind === 'api-key') {
    return {
      type: 'api_key',
      ...record.key === undefined ? {} : { key: record.key },
      ...record.env === undefined ? {} : { env: { ...record.env } },
    }
  }
  return record.payload as Credential
}

/**
 * Translate a pi-ai credential into the record to store.
 * @param credential - what a login or refresh produced.
 * @returns the record to commit, in the union the credential seam stores.
 */
function toRecord(credential: Credential): CredentialRecord {
  if (credential.type === 'api_key') {
    return {
      kind: 'api-key',
      ...credential.key === undefined ? {} : { key: credential.key },
      ...credential.env === undefined ? {} : { env: { ...credential.env } },
    }
  }
  return { kind: 'grant', payload: jsonImage(credential) }
}

/**
 * The credential service, or the failure that names what is missing. Reads
 * answer "nothing stored" without a service, because a composition with no
 * credential plane genuinely holds no credential; writes refuse, because a
 * login whose grant silently evaporated would report success and then fail
 * every request.
 * @param ctx - the plugin context.
 * @returns the live service.
 * @throws {LlmError} code `NO_CREDENTIAL_STORE` when none is mounted.
 */
function writableStore(ctx: Context): CredentialProvider {
  const credentials = ctx.get('credentials')
  if (credentials === undefined) {
    throw new LlmError(
      'llm-pi-ai: this composition mounts no credentials service, so there is nowhere to store the'
      + ' credential a sign-in produces; mount one (dsh-credentials-local) to sign in',
      'NO_CREDENTIAL_STORE',
    )
  }
  return credentials
}

/** Immutable ownership of one native provider's connection credential. */
export interface ConnectionAuthBinding {
  connectionId: string
  /** Pi's native provider ID, never the Harness route ID. */
  serviceId: string
  credentialRecordId: string
  /** Captures connection generation and the active Host profile. */
  isCurrent?: () => boolean
}

function assertCurrent(binding: ConnectionAuthBinding): void {
  if (binding.isCurrent?.() === false) {
    throw new LlmError('This connection changed while authentication was in progress.', 'STALE_CONNECTION')
  }
}

/** A single native provider mapped to a single connection-owned record. */
function scopedCredentialStore(ctx: Context, binding: ConnectionAuthBinding): CredentialStore {
  binding = { ...binding }
  if (!isCredentialKeySegment(binding.credentialRecordId) || !binding.serviceId || !binding.connectionId) {
    throw new LlmError('This connection cannot address its credential record.', 'UNSTORABLE_PROVIDER_ID')
  }
  const key = recordKeyFor(binding.credentialRecordId)
  const credentialOf = (record: CredentialRecord | undefined): Credential | undefined => {
    const credential = toPiCredential(record)
    // Provider SDKs receive their own snapshot; mutating it before a failed
    // commit must not modify a Host service's in-memory record by reference.
    return credential === undefined ? undefined : structuredClone(credential)
  }
  const assertProvider = (providerId: string): void => {
    if (providerId !== binding.serviceId) {
      throw new LlmError('This credential store belongs to another connection.', 'AUTH_CONNECTION_MISMATCH')
    }
    assertCurrent(binding)
  }
  const read = async (providerId: string, options?: AuthOperationOptions): Promise<Credential | undefined> => {
    if (providerId !== binding.serviceId) return undefined
    options?.signal?.throwIfAborted()
    assertCurrent(binding)
    const record = await ctx.get('credentials')?.readRecord(key)
    assertCurrent(binding)
    options?.signal?.throwIfAborted()
    return credentialOf(record)
  }
  return {
    read,
    async list(options) {
      const credential = await read(binding.serviceId, options)
      return credential === undefined ? [] : [{ providerId: binding.serviceId, type: credential.type }]
    },
    async modify(providerId, mutate, options) {
      assertProvider(providerId)
      options?.signal?.throwIfAborted()
      const stored = await writableStore(ctx).modifyRecord(key, async current => {
        // Retain the Host's record lock across the SDK refresh and rotation.
        assertProvider(providerId)
        options?.signal?.throwIfAborted()
        const next = await mutate(credentialOf(current))
        // SDK/provider cancellation is cooperative. Refuse even an SDK that
        // finishes its network request after deletion or profile switching.
        assertProvider(providerId)
        options?.signal?.throwIfAborted()
        return next === undefined ? undefined : toRecord(next)
      })
      assertCurrent(binding)
      return credentialOf(stored)
    },
    async delete(providerId, options) {
      assertProvider(providerId)
      options?.signal?.throwIfAborted()
      await writableStore(ctx).deleteRecord(key)
      assertCurrent(binding)
    },
  }
}

/**
 * Bridge the Harness record lock to Pi, preserving serialized OAuth rotation.
 * A binding restricts every operation to its native service and owned record.
 * The unbound form remains available for provider settings before migration.
 */
export function credentialStoreFrom(ctx: Context, binding?: ConnectionAuthBinding): CredentialStore {
  if (binding !== undefined) return scopedCredentialStore(ctx, binding)
  return {
    async read(providerId) {
      const credentials = ctx.get('credentials')
      if (credentials === undefined) return undefined
      if (!isCredentialKeySegment(providerId)) return undefined
      return toPiCredential(await credentials.readRecord(recordKeyFor(providerId)))
    },
    async list(): Promise<readonly CredentialInfo[]> {
      const stored = await ctx.get('credentials')?.listRecords() ?? []
      const mine: CredentialInfo[] = []
      for (const entry of stored) {
        // Records another plugin owns are not this collection's to report:
        // their payloads are written in a format pi-ai never agreed to.
        if (credentialKeyScope(entry.key) !== RECORD_SCOPE) continue
        mine.push({
          providerId: credentialKeyId(entry.key),
          type: entry.kind === 'api-key' ? 'api_key' : 'oauth',
        })
      }
      return mine
    },
    async modify(providerId, mutate) {
      if (!isCredentialKeySegment(providerId)) {
        throw new LlmError(
          `llm-pi-ai: provider id "${providerId}" cannot address a stored credential record (a record id is a`
          + ' lowercase hyphenated identifier); authenticate this route through apiKeyEnv instead of a stored'
          + ' credential',
          'UNSTORABLE_PROVIDER_ID',
        )
      }
      const stored = await writableStore(ctx).modifyRecord(recordKeyFor(providerId), async (current) => {
        const next = await mutate(toPiCredential(current))
        return next === undefined ? undefined : toRecord(next)
      })
      return toPiCredential(stored)
    },
    // `async` so a missing service reaches the caller as a rejection: pi-ai's
    // store contract is promise-returning, and a synchronous throw would
    // escape the `ModelsError` wrapper every other storage failure gets.
    async delete(providerId) {
      if (!isCredentialKeySegment(providerId)) return
      await writableStore(ctx).deleteRecord(recordKeyFor(providerId))
    },
  }
}

/** Connection routes resolve only explicit records/references, never ambient auth. */
export function connectionAuthFrom(ctx: Context, binding: ConnectionAuthBinding): {
  credentials: CredentialStore, authContext: AuthContext,
} {
  return {
    credentials: credentialStoreFrom(ctx, binding),
    authContext: {
      async env() { assertCurrent(binding); return undefined },
      async fileExists() { assertCurrent(binding); return false },
    },
  }
}

/**
 * A pi-ai `AuthContext` over the harness credential plane and the host
 * filesystem.
 *
 * `env()` answers from the credential seam first, so a value a deployment
 * stored through the harness is found by a provider's own ambient discovery —
 * without this, that discovery reads only the process environment and a stored
 * `AWS_ACCESS_KEY_ID` is invisible to it. `fileExists()` answers about the host
 * process's own filesystem rather than the workspace `ctx.fs` seam, because the
 * paths it is asked about (`~/.aws/credentials`, application-default
 * credentials) are facts about where this process runs, not about the project
 * under edit.
 * @param ctx - the plugin context carrying the optional `ctx.credentials`.
 * @returns the auth context to hand `createModels()`.
 */
export function authContextFrom(ctx: Context): AuthContext {
  return {
    async env(name) {
      // pi-ai asks about arbitrary provider-declared names; one that is not a
      // POSIX identifier can never have been stored as a reference, and asking
      // the seam would throw instead of answering "not set".
      if (isCredentialRefName(name)) {
        const credentials = ctx.get('credentials')
        const hit = await credentials?.resolve(credentialRef(name))
        if (hit !== undefined) return hit.value
      }
      return launchEnvironmentOf(ctx).get(name)?.value
    },
    async fileExists(path) {
      const expanded = path.startsWith('~/') || path === '~'
        ? resolvePath(homedir(), path.slice(1).replace(/^\//, ''))
        : path
      try {
        await access(expanded)
        return true
      } catch {
        // Absent, unreadable, or a broken symlink — every one of which means
        // this ambient credential source cannot be used, which is the only
        // distinction the caller makes.
        return false
      }
    },
  }
}
