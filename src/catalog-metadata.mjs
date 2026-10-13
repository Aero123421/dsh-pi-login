// Shared discovery metadata; account credentials stay in provider-private tags.
// Symbols survive model copies but never appear in JSON/RPC responses.
export const DISCOVERED_MODEL = Symbol('dsh-pi-login/discovered-model')
