import { applyLoginUI } from './routes.mjs'
import { apply as applyRuntime, Config } from './runtime/index.ts'
import { catalogModels, resolveRouteModels } from './runtime/catalog.ts'
import { credentialStoreFrom } from './runtime/auth.ts'
import { MetaCatalogSession } from './meta-catalog.mjs'
import { metaCatalogProvider } from './meta-catalog-provider.mjs'
import { ProviderCatalogs } from './provider-catalogs.mjs'
import { DISCOVERED_MODEL } from './catalog-metadata.mjs'
import { DEFAULT_INPUT, DEFAULT_CONTEXT_WINDOW, DEFAULT_MAX_TOKENS } from './runtime/config.ts'
import { modelChoices } from './runtime/fast.ts'
export { Config, applyLoginUI }
export { ProviderCatalogs } from './provider-catalogs.mjs'
export { DISCOVERED_MODEL } from './catalog-metadata.mjs'
export { PiAiAdapter } from './runtime/adapter.ts'
export { resolveProfiles } from './runtime/config.ts'
export const inject = ['llm', 'authorization', 'credentials', 'connection', 'settings']
export const name = 'dsh-pi-login'
export function apply(ctx, config) {
  const meta = new MetaCatalogSession({
    credentials: credentialStoreFrom(ctx), profile: () => config.providers.get().meta ?? {},
    baseline: catalogModels, onChange: () => ctx.emit('dsh-pi-login/catalog-updated'),
  })
  const catalogs = new ProviderCatalogs({ meta: metaCatalogProvider(meta) })
  ctx.effect(() => () => catalogs.dispose(), 'Pi: provider catalog lifetime')
  applyRuntime(ctx, config, {
    catalog: provider => catalogs.catalog(provider), revision: () => catalogs.revision(),
    onLogin: provider => catalogs.onLogin(provider),
    authorizeModel: (provider, model, profile) => catalogs.authorizeModel(provider, model, profile),
  })
  applyLoginUI(ctx, {
    catalogs,
    catalog: (provider, profile) => {
      const learned = catalogs.catalog(provider)
      const models = resolveRouteModels({ defaultInput: DEFAULT_INPUT, defaultContextWindow: DEFAULT_CONTEXT_WINDOW, defaultMaxTokens: DEFAULT_MAX_TOKENS, provider, ...profile }, 'deferred', learned).models
      const discovered = new Set(models.filter(model => model[DISCOVERED_MODEL]).map(model => model.id))
      return modelChoices(provider, models, profile, discovered).map(choice => ({ ...choice, capabilityUnverified: choice.discovered && !choice.model[DISCOVERED_MODEL]?.verified }))
    },
  })
  let alive = true
  ctx.effect(() => () => { alive = false }, 'Pi: migration lifetime')
  // Copy existing profiles once after this entry becomes writable. Credentials
  // keep their existing llm-pi-ai scope; the original profile is left intact.
  void ctx.fiber.await().then(async () => {
    if (!alive || config.legacyImported.get()) return
    const section = ctx.settings.describe({ redactSecrets: false }).find(row => row.ns === name)
    if (!section) return
    const legacy = ctx.get('configEditor')?.entries().find(entry => entry.options.id === 'llm-pi-ai')?.options.config?.providers ?? {}
    await ctx.settings.update(name, { providers: { ...legacy, ...config.providers.get() }, legacyImported: true }, section.revision)
  }).catch(() => { if (alive) ctx.logger.warn('Pi: could not import existing provider settings; retry after restarting') })
}
