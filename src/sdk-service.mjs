export const MUSE_CODE_INTEGRATION_ID = 'meta-muse-code'
export const MUSE_CODE_SERVICE_ID = 'muse-code'

/**
 * The Pi SDK provider that serves a connection, or undefined when another
 * owner serves it. Muse Code signs in and generates through the SDK's Meta
 * provider (the same device login and key mint as the official CLI); only its
 * catalog and Contributor selection are Muse Code specific.
 */
export function sdkServiceOf(connection) {
  if (connection.integrationId === 'pi') return connection.serviceId
  if (connection.integrationId === MUSE_CODE_INTEGRATION_ID && connection.serviceId === MUSE_CODE_SERVICE_ID) return 'meta'
  return undefined
}
