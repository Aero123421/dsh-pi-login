// Shared discovery metadata; account credentials stay in provider-private tags.
// Symbols survive model copies but never appear in JSON/RPC responses.
export const DISCOVERED_MODEL = Symbol('dsh-pi-login/discovered-model')
// Muse Code catalog entries that also offer a Contributor-mode choice.
export const MUSE_CONTRIBUTOR = Symbol('dsh-pi-login/muse-contributor')
// An actual Contributor model ID returned by Muse, distinct from a base
// model whose Contributor mode is selected only by a request header.
export const MUSE_CONTRIBUTOR_ONLY = Symbol('dsh-pi-login/muse-contributor-only')
// Muse Code selects the account's mode per request with this header.
export const MUSE_CONTRIBUTOR_HEADER = 'x-tbh-contributor-mode'
