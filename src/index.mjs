import { applyLoginUI } from './routes.mjs'
import { apply as applyRuntime, Config } from './runtime/index.ts'
import { resolveRouteModels } from './runtime/catalog.ts'
import { DEFAULT_INPUT, DEFAULT_CONTEXT_WINDOW, DEFAULT_MAX_TOKENS } from './runtime/config.ts'
import { modelChoices } from './runtime/fast.ts'
export { Config, applyLoginUI }
export { PiAiAdapter } from './runtime/adapter.ts'
export { resolveProfiles } from './runtime/config.ts'
export const inject = ['llm', 'authorization', 'credentials', 'connection', 'settings']
export const name = 'dsh-pi-login'
export function apply(ctx, config) {
  applyRuntime(ctx, config)
  applyLoginUI(ctx, {
    catalog: (provider, profile) => modelChoices(provider, resolveRouteModels({ defaultInput: DEFAULT_INPUT, defaultContextWindow: DEFAULT_CONTEXT_WINDOW, defaultMaxTokens: DEFAULT_MAX_TOKENS, provider, ...profile }, 'deferred').models, profile),
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
