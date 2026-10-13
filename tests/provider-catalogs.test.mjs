import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ProviderCatalogs, CatalogRefreshError } from '../src/provider-catalogs.mjs'
import { DISCOVERED_MODEL } from '../src/catalog-metadata.mjs'
import { PiLoginBroker, dispatch } from '../src/broker.mjs'
import { catalogModels, resolveRouteModels } from '../src/runtime/catalog.ts'
import { modelChoices } from '../src/runtime/fast.ts'

function fixture(t) {
  const calls = [], profiles = { example: { enabled: true }, second: { enabled: true } }
  let revision = 1
  const entries = Object.fromEntries(['example', 'second'].map(provider => {
    const models = [{ id: 'base', name: 'Base', enabled: true }]
    const session = {
      version: 0,
      refresh() { calls.push(`refresh:${provider}`); models.push({ id: 'new', name: 'New', discovered: true }); this.version++ },
      validate() { calls.push(`validate:${provider}`) },
      catalog: () => models,
      invalidate() { calls.push(`invalidate:${provider}`); this.version++ },
      dispose() { calls.push(`dispose:${provider}`) },
      state: () => ({ token: 'private-secret' }),
    }
    return [provider, { session, authorizeModel: async () => ({ apiKey: `private-${provider}-key`, headers: { 'x-example-version': '1' } }) }]
  }))
  const catalogs = new ProviderCatalogs(entries)
  const authorization = { describe: key => ['example', 'second', 'static'].includes(key.slice('llm-pi-ai/'.length)) ? {} : undefined }
  const settings = {
    describe: () => [{ ns: 'dsh-pi-login', revision, value: { providers: profiles } }],
    update: async (_, patch, expected) => {
      assert.equal(expected, revision++)
      for (const [provider, changes] of Object.entries(patch.providers)) Object.assign(profiles[provider], changes)
    },
  }
  const broker = new PiLoginBroker(authorization, {}, settings, {
    catalogs,
    catalog: (provider, profile) => (catalogs.catalog(provider) ?? []).map(model => ({ ...model, enabled: model.discovered ? profile.enabledDiscoveredModels?.includes(model.id) === true : model.enabled })),
  })
  t.after(() => { catalogs.dispose(); return broker.dispose() })
  return { catalogs, entries, broker, profiles, calls }
}

test('the common RPC refreshes only the selected non-Meta provider and saves explicit opt-in', async t => {
  const f = fixture(t)
  const value = await dispatch(f.broker, 'refresh-models', { key: 'llm-pi-ai/example' })
  assert.deepEqual(f.calls, ['refresh:example'])
  assert.equal(value.refresh.canRefresh, true)
  assert.equal(value.models.find(model => model.id === 'new').enabled, false)
  assert.ok(!JSON.stringify(value).includes('private-secret'))
  await dispatch(f.broker, 'set-model', { key: 'llm-pi-ai/example', model: 'new', enabled: true, revision: value.revision })
  assert.deepEqual(f.profiles.example.enabledDiscoveredModels, ['new'])
  assert.equal(f.calls.at(-1), 'validate:example')
  assert.equal(f.broker.models('llm-pi-ai/second').models.length, 1)
  await dispatch(f.broker, 'models', { key: 'llm-pi-ai/second' })
  assert.equal(f.calls.at(-1), 'validate:second')
  f.catalogs.onLogin('second')
  assert.equal(f.calls.at(-1), 'invalidate:second')
  assert.equal(f.catalogs.revision(), 2)
  assert.deepEqual(await f.catalogs.authorizeModel('example', {}, {}), { apiKey: 'private-example-key', headers: { 'x-example-version': '1' } })
  assert.equal(f.catalogs.authorizeModel('static', {}, {}), undefined)
})

test('unsupported or unknown providers cannot trigger a different provider refresh', async t => {
  const f = fixture(t)
  assert.deepEqual(f.broker.models('llm-pi-ai/static').refresh, { canRefresh: false })
  await assert.rejects(dispatch(f.broker, 'refresh-models', { key: 'llm-pi-ai/static' }), /catalog-refresh-unsupported/)
  for (const key of [null, {}, 'llm-pi-ai/unknown', 'other/example', 'llm-pi-ai/example/extra']) {
    await assert.rejects(dispatch(f.broker, 'refresh-models', { key }), /invalid-request/)
  }
  assert.deepEqual(f.calls, [])
})

test('provider errors and presentation have an explicit public boundary', async t => {
  const f = fixture(t), entry = f.entries.example
  entry.errorCodes = { 'private-auth': 'catalog-login-required', 'private-other': 'secret-invalid-code' }
  entry.errors = { 'catalog-login-required': 'metaLoginRequired', 'secret-invalid-code': 'bad', 'catalog-rate-limited': 'https://secret.example' }
  entry.presentation = () => ({ status: { message: 'metaSubscriptionActive', detail: 'Plan\u0000 Name' }, notes: ['metaReloadHint', 'https://secret.example'], token: 'private-token' })
  assert.deepEqual(f.catalogs.state('example'), {
    canRefresh: true, status: { message: 'metaSubscriptionActive', detail: 'Plan Name' },
    notes: ['metaReloadHint'], errors: { 'catalog-login-required': 'metaLoginRequired' },
  })
  for (const [code, expected] of [['private-auth', 'catalog-login-required'], ['private-other', 'catalog-refresh-failed'], [undefined, 'catalog-refresh-failed']]) {
    entry.session.refresh = () => { throw Object.assign(new Error('private-token'), { code }) }
    await assert.rejects(dispatch(f.broker, 'refresh-models', { key: 'llm-pi-ai/example' }), error => error.message === expected)
  }
  entry.session.refresh = () => { throw new CatalogRefreshError('catalog-rate-limited') }
  await assert.rejects(dispatch(f.broker, 'refresh-models', { key: 'llm-pi-ai/example' }), /catalog-rate-limited/)
})

test('concurrent refreshes share work and disposal blocks a pending result', async () => {
  let release, calls = 0, disposed = false
  const catalogs = new ProviderCatalogs({ example: { session: {
    refresh: () => { calls++; return new Promise(resolve => { release = resolve }) },
    dispose: () => { disposed = true },
  } } })
  const first = catalogs.refresh('example')
  assert.equal(catalogs.refresh('example'), first)
  await Promise.resolve()
  assert.equal(calls, 1)
  catalogs.dispose(); release()
  await assert.rejects(first, /catalog-refresh-failed/)
  await assert.rejects(catalogs.refresh('example'), /catalog-refresh-failed/)
  assert.equal(disposed, true)
})

test('shared discovery metadata survives non-Meta model resolution and supports opt-in', () => {
  const baseline = catalogModels('anthropic')
  const learned = { ...baseline.values().next().value, id: 'fixture-new-model', [DISCOVERED_MODEL]: { verified: true } }
  const models = resolveRouteModels({ provider: 'anthropic', defaultInput: ['text'], defaultContextWindow: 1000, defaultMaxTokens: 100 }, 'strict', new Map([...baseline, [learned.id, learned]])).models
  const discovered = new Set(models.filter(model => model[DISCOVERED_MODEL]).map(model => model.id))
  const choices = enabled => modelChoices('anthropic', models, { enabledDiscoveredModels: enabled }, discovered)
  assert.equal(choices([]).find(model => model.id === learned.id).enabled, false)
  assert.equal(choices([learned.id]).find(model => model.id === learned.id).enabled, true)
  assert.ok(!JSON.stringify(learned).includes('verified'))
})
