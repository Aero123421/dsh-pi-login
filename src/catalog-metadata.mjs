// Shared discovery metadata; account credentials stay in provider-private tags.
// Symbols survive model copies but never appear in JSON/RPC responses.
export const DISCOVERED_MODEL = Symbol('dsh-pi-login/discovered-model')
// Muse Code catalog entries that also offer a Contributor-mode choice.
export const MUSE_CONTRIBUTOR = Symbol('dsh-pi-login/muse-contributor')
// An actual Contributor model ID returned by Muse, distinct from a base
// model whose Contributor mode is selected only by a request header.
export const MUSE_CONTRIBUTOR_ONLY = Symbol('dsh-pi-login/muse-contributor-only')
// Descriptor for the same base ID when Contributor mode lists different
// efforts or limits. The choice still sends that base ID.
export const MUSE_CONTRIBUTOR_CAPS = Symbol('dsh-pi-login/muse-contributor-caps')
// The account catalog did not name a known effort list. Max is not offered.
export const MUSE_EFFORTS_UNVERIFIED = Symbol('dsh-pi-login/muse-efforts-unverified')
// Catalog default effort, already limited to a level this descriptor offers.
export const MUSE_DEFAULT_EFFORT = Symbol('dsh-pi-login/muse-default-effort')
// Muse Code selects the account's mode per request with this header.
export const MUSE_CONTRIBUTOR_HEADER = 'x-tbh-contributor-mode'
