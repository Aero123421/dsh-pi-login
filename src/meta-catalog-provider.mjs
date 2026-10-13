import { LlmError } from '@deepseek-ai/dsh-llm'
import { MetaCatalogError } from './meta-catalog.mjs'

/** Muse authentication, contract presentation and errors belong to this provider. */
export function metaCatalogProvider(session) {
  return {
    session,
    presentation(models) {
      const { account, entitlementStale } = session.state()
      return {
        ...account ? { status: { message: entitlementStale ? 'metaSubscriptionUnknown' : account.active === true ? 'metaSubscriptionActive' : account.active === false ? 'metaSubscriptionInactive' : 'metaSubscriptionUnknown', detail: account.tierName } } : {},
        notes: ['metaReloadHint', ...models.some(model => model.id.includes('contributor')) ? ['metaContributorHint'] : []],
      }
    },
    errorCodes: {
      'meta-login-required': 'catalog-login-required', 'meta-key-override': 'catalog-key-override',
      'meta-settings-incompatible': 'catalog-settings-incompatible', 'meta-account-changed': 'catalog-account-changed',
      'meta-rate-limited': 'catalog-rate-limited',
    },
    errors: {
      'catalog-login-required': 'metaLoginRequired', 'catalog-key-override': 'metaKeyOverride',
      'catalog-settings-incompatible': 'metaSettingsIncompatible', 'catalog-account-changed': 'metaAccountChanged',
      'catalog-rate-limited': 'metaRateLimited',
    },
    async authorizeModel(model, profile) {
      try {
        const apiKey = await session.keyForModel('meta', model, profile)
        return apiKey === undefined ? undefined : { apiKey, headers: { 'x-api-version': '1.0.0' } }
      }
      catch (error) {
        if (!(error instanceof MetaCatalogError)) throw error
        const messages = {
          'meta-refresh-required': 'Reload your Muse account model list before using this model. Your login or available models may have changed.',
          'meta-key-override': 'This model requires your saved Muse login. Remove the API-key reference or choose saved credentials.',
          'meta-settings-incompatible': 'This Muse model requires the standard Meta endpoint and no Authorization header override.',
        }
        throw new LlmError(messages[error.code] ?? 'Could not verify access to this Muse model. Reload your account model list.', error.code)
      }
    },
  }
}
