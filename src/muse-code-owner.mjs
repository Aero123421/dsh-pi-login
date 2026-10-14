import { MUSE_CODE_INTEGRATION_ID, MUSE_CODE_SERVICE_ID } from './sdk-service.mjs'
import { ConnectionError } from './connections.mjs'

const ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const CONTRIBUTOR_TERMS = 'https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode'

/**
 * Meta's Muse Code subscription as one connection type. Sign-in, credentials,
 * routes and generation run through the Pi SDK's Meta provider (see
 * `sdkServiceOf`); this owner only names the service and owns its records.
 */
export function createMuseCodeOwner({ ctx, connections } = {}) {
  const recordKey = connection => {
    if (!ID.test(connection?.credentialRecordId ?? '')) throw new ConnectionError('invalid-request')
    return `llm-pi-ai/${connection.credentialRecordId}`
  }
  return {
    integrationId: MUSE_CODE_INTEGRATION_ID,
    label: 'Meta',
    source: 'https://dev.meta.ai/docs/muse-code',
    listServices: () => [{
      serviceId: MUSE_CODE_SERVICE_ID, label: 'Muse Code',
      methods: [{ id: 'oauth', label: 'Sign in with Meta' }],
      capabilities: { auth: true, models: true, usage: true, settings: true },
      sourceTermsUrl: CONTRIBUTOR_TERMS,
    }],
    listConnections: () => Object.entries(connections.raw()).filter(([, connection]) => connection.integrationId === MUSE_CODE_INTEGRATION_ID)
      .map(([connectionId, connection]) => ({ connectionId, serviceId: connection.serviceId, routeId: connection.routeId })),
    authKey: recordKey,
    routeIdFor: id => `muse-${id}`,
    validateConnection(connection) {
      if (connection.serviceId !== MUSE_CODE_SERVICE_ID || connection.authMethod !== 'oauth' || !ID.test(connection.credentialRecordId)
        || connection.credentialRef || connection.headerRefs && Object.keys(connection.headerRefs).length
        || connection.profile?.baseURL || connection.profile?.api || connection.profile?.apiKeyEnv) throw new ConnectionError('owner-managed')
    },
    async describeConnection(connection) {
      const description = await ctx.credentials.describeRecord(recordKey(connection))
      return { configured: description.configured === true, writable: description.writable !== false }
    },
    async deleteCredentials(connection) {
      await ctx.credentials.deleteRecord(recordKey(connection))
      // CLI-era (0.6.x) sign-ins were stored separately; remove them with the connection.
      await ctx.credentials.deleteRecord(`dsh-muse-code/${connection.credentialRecordId}`)
    },
  }
}
