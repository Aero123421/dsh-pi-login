/**
 * Independent Muse Code integration. MSP is an agent-session protocol, not
 * a DSH LLM provider. Keep unavailable operations explicit; never substitute
 * the Pi Meta Model API, its credentials, or its model ids.
 */
export const MUSE_CODE_INTEGRATION_ID = 'meta-muse-code'
export const MUSE_CODE_SERVICE_ID = 'muse-code'

export const MUSE_CODE_EVIDENCE = Object.freeze({
  repository: 'https://github.com/meta-models/muse-code-sdk',
  commit: 'a0c8611b382584eb5091942b477f30e92e1c8d18',
  sdkVersion: '1.4.7',
  protocol: 'Muse Session Protocol (MSP)',
  schema: 'https://github.com/meta-models/muse-code-sdk/blob/a0c8611b382584eb5091942b477f30e92e1c8d18/schema/msp/msp.d.ts',
  experimentalDocsCommit: '1ee1e5dee1f5c4d9aad22c9182205ccb5648b2dd',
  accountProtocol: 'https://meta-models.github.io/muse-code-sdk/next/generated/msp/methods/account-loginstart/',
  settingsProtocol: 'https://meta-models.github.io/muse-code-sdk/next/generated/msp/types/settingswritevalueparams/',
  isolationSource: 'https://github.com/HarjjotSinghh/aonia/blob/main/docs/SPEC.md',
  contributorTerms: 'https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode',
  modelAvailability: 'https://dev.meta.ai/docs/models#models__muse-wonder-availability',
  limitations: Object.freeze([
    'agent-session-protocol',
    'live-multi-account-isolation-unverified',
    'contributor-setting-probed-per-host',
    'catalog-is-not-entitlement',
    'live-generation-unverified',
  ]),
})

const ERRORS = Object.freeze({
  'muse-code-unavailable': 'This Muse Code operation is unavailable on the current host.',
  'muse-code-llm-unsupported': 'Muse Code MSP runs agent sessions with host-owned tools. A compatible DSH LLM bridge has not been verified.',
  'muse-code-observation-invalid': 'The Muse Code observation did not match the verified MSP contract.',
  'muse-code-observation-failed': 'The Muse Code observation could not be read.',
  'muse-code-observation-closed': 'This Muse Code observation session has ended.',
  'muse-code-cli-required': 'Install the official Muse Code CLI and its supported MSP SDK on the host to use this connection.',
  'muse-code-protocol-unsupported': 'This Muse Code CLI does not provide the required account and settings protocol. Update the official CLI.',
  'muse-code-login-required': 'Sign in to this Muse Code connection first.',
  'muse-code-login-failed': 'Muse Code sign-in did not complete.',
  'muse-code-mode-unavailable': 'This account or Muse Code host cannot apply the requested Contributor setting.',
  'muse-code-connection-changed': 'This Muse Code connection or host profile changed during the operation.',
  'muse-code-connection-disabled': 'Enable this Muse Code connection before starting a new agent turn.',
  'muse-code-busy': 'This Muse Code connection is already performing an operation.',
  'muse-code-session-failed': 'The Muse Code agent session failed. No other account or API was used.',
  'muse-code-model-unavailable': 'The requested Muse Code model was not advertised by this host.',
})

export class MuseCodeError extends Error {
  constructor(code) {
    super(ERRORS[code] ?? ERRORS['muse-code-unavailable'])
    this.name = 'MuseCodeError'
    this.code = Object.hasOwn(ERRORS, code) ? code : 'muse-code-unavailable'
  }
}

