import { MUSE_CODE_INTEGRATION_ID, MUSE_CODE_SERVICE_ID, MUSE_CODE_EVIDENCE, MuseCodeError } from './muse-code.mjs'
import { MuseCodeHostManager, museCodeCredentialKey, validateMuseCodeConnection, MUSE_CODE_CONTRIBUTOR_TERMS } from './muse-code-host.mjs'

/** The registry delegates each independent Muse connection to this owner. */
export function createMuseCodeOwner({ ctx, connections, privateRoot, isCurrent, onLogin, openHost, environment } = {}) {
  const bind = connection => connection.profileKey !== undefined ? connection : connections.binding(connection)
  const current = isCurrent ?? (connection => connections.isCurrent(connection))
  const manager = new MuseCodeHostManager({ credentials: ctx.credentials, privateRoot, isCurrent: current,
    canExecute: connection => { try { return connections.lookup(connection.connectionId).enabled !== false } catch { return false } },
    ...openHost ? { openHost } : {}, ...environment ? { environment } : {} })
  return {
    integrationId: MUSE_CODE_INTEGRATION_ID,
    label: 'Meta',
    source: MUSE_CODE_EVIDENCE.repository,
    manager,
    listServices: () => [{
      serviceId: MUSE_CODE_SERVICE_ID, label: 'Muse Code',
      methods: [{ id: 'oauth', label: 'Muse Code account' }],
      capabilities: { auth: true, models: true, usage: true, settings: true },
      executionKind: 'agent-session', llmCompatible: false,
      requiresHostCli: true, liveVerified: false,
      sourceTermsUrl: MUSE_CODE_CONTRIBUTOR_TERMS,
    }],
    listConnections: () => Object.entries(connections.raw()).filter(([, connection]) => connection.integrationId === MUSE_CODE_INTEGRATION_ID)
      .map(([connectionId, connection]) => ({ connectionId, serviceId: connection.serviceId, routeId: connection.routeId })),
    credentialKey: museCodeCredentialKey,
    authKey: museCodeCredentialKey,
    routeIdFor: id => `muse-${id}`,
    initialConnection: () => ({ museCode: { contributorMode: false, modelId: 'muse-wonder-1.0' } }),
    validateConnection: validateMuseCodeConnection,
    async describeConnection(connection) {
      const description = await ctx.credentials.describeRecord(museCodeCredentialKey(connection))
      return { configured: description.configured === true, writable: description.writable !== false,
        authStatus: description.configured ? 'saved' : 'auth-required', executionKind: 'agent-session', llmCompatible: false,
        liveVerified: false, requiresHostCli: true }
    },
    async publicConnection(connection) {
      return { contributor: connection.museCode?.contributorMode === true,
        sourceTermsUrl: MUSE_CODE_CONTRIBUTOR_TERMS, executionKind: 'agent-session', llmCompatible: false,
        liveVerified: false, requiresHostCli: true }
    },
    registerFlow(context, connection, flowIsCurrent = () => current(bind(connection)), flowOnLogin = onLogin) {
      return context.authorization.registerFlow({
        key: museCodeCredentialKey(connection), label: connection.displayName,
        methods: [{ id: 'oauth', label: 'Muse Code account' }],
        async run(session) {
          if (session.method !== 'oauth' || !flowIsCurrent()) throw new MuseCodeError('muse-code-connection-changed')
          session.signal.throwIfAborted()
          await manager.login(bind(connection), { signal: session.signal,
            notify: notice => { if (flowIsCurrent() && !session.signal.aborted) session.notify(notice) } })
          if (!flowIsCurrent()) throw new MuseCodeError('muse-code-connection-changed')
          await flowOnLogin?.(connection.connectionId)
        },
      })
    },
    read: (connection, options) => manager.read(bind(connection), options),
    readModels: (connection, options) => manager.readModels(bind(connection), options),
    readUsage: (connection, options) => manager.readUsage(bind(connection), options),
    startAgentSession: (connection, options) => manager.startAgentSession(bind(connection), options),
    resumeAgentSession: (connection, options) => manager.resumeAgentSession(bind(connection), options),
    configureConnection: (_connection, patch, binding) => manager.configure(binding, patch),
    async deleteCredentials(connection) {
      await manager.closeConnection(connection.connectionId)
      await ctx.credentials.deleteRecord(museCodeCredentialKey(connection))
    },
    dispose: () => manager.dispose(),
  }
}
