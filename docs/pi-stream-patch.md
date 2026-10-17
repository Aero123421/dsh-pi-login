# Pi 1.3.0 tool argument streaming

The Host build includes Pi AI SDK 1.3.0 and its dependencies, with a narrowly scoped streaming patch applied by `scripts/pi-stream-patch.mjs`. The published `dist/index.js` contains the patched implementation. It does not require installation scripts, changes to the consumer's `node_modules`, or a DSH-owned Pi patch. The package keeps its exact Pi dependency for source tooling and compatibility metadata.

## Completed argument errors

Pi's `parseToolCallArguments()` accepts completed JSON objects, applies Pi's string repair behavior, and reports malformed or nonobject JSON through `argumentsError`. Its fallback `arguments: {}` is an error sentinel.

`toStreamChunks()` checks `argumentsError` at `toolcall_end` and in the terminal message. A rejected call receives no successful `tool-call` block end. The turn finishes with a nonretryable `INVALID_TOOL_ARGUMENTS` error and no successful replay envelope, retaining usage accounting. This prevents an optional-only tool schema from treating the error sentinel as valid defaults. A legitimate `{}` remains a successful call. The final failure message excludes the SDK error's embedded raw arguments.

## Streaming performance patch

Completions, Responses/Codex/Azure, Anthropic, Bedrock, Mistral Conversations, and Pi Messages keep their raw argument deltas. The patch removes only provisional `parseStreamingJson()` assignments that repeatedly parse the growing prefix. Final `parseToolCallArguments()` calls remain unchanged; Pi Messages retains its supplied terminal tool call. This matches the adapter's use of raw `event.delta`, rather than Pi's provisional parsed argument object.

Every known replacement is checked for its exact occurrence count. The build rejects an installed Pi version other than 1.3.0 and rejects changed provider source or missing final validators. SDK upgrades must deliberately update this patch and rerun the SDK streaming tests.

Pi's lazy OAuth loaders and Bedrock loader ordinarily hide Node imports behind variable specifiers. The Host build changes the nine known OAuth loader calls and the Bedrock call into literal dynamic imports so esbuild includes their modules. Other computed imports of Node builtins continue to use Node. The complete Pi module graph stays inside one Host bundle; no Pi package import remains external. This preserves SDK module state and avoids assuming that the dependency manager hoists Pi's transitive dependencies. The generated Host bundle is approximately 6.2 MiB uncompressed in the verification environment.

The Host's full dependency license texts are generated from its actual esbuild module graph into `dist/THIRD_PARTY_NOTICES.txt`; fallback sources for packages that omit their license file are documented in [`licenses/README.md`](../licenses/README.md).

## Retry ownership

SDK retries remain disabled with `maxRetries: 0`. DSH owns retries. Statusless `Unable to forward upstream stream`, `upstream_stream_read_error`, and `Upstream HTTP/2 stream failed` map to `TRANSPORT`; temporary service unavailability maps to `SERVER`. Authentication, quota, rate-limit, and invalid-request classifications run first, so these phrases do not override a permanent HTTP failure.

## Verification and measurement

Run:

```sh
node --test tests/runtime-stream.test.mjs tests/pi-stream-patch.test.mjs
node scripts/pi-stream-benchmark.mjs
```

The tests exercise the real Pi SDK with local SSE fixtures. They cover late/interleaved call identities, valid empty arguments, malformed/nonobject final arguments, the adapter's terminal failure, usage preservation, final argument validation for Completions/Responses/Anthropic, packaged OAuth loader resolution, Bedrock lazy API construction, and source drift rejection. Large Unicode/escaped argument strings arrive as 64-character deltas and must produce identical final arguments with exactly one complete-argument JSON parse. Timing is not a CI gate.

The benchmark compares unmodified Pi 1.3.0 and the patched build under the same consumer and local SSE input. JSON wire construction happens outside the timed interval. Each implementation receives a 1 KiB warmup followed by three runs per size; elapsed time includes SDK SSE decoding and event consumption. No external API call is made. This measures synthetic SDK processing, not provider latency or the complete DSH agent loop.

2026-10-17, Linux x64, Node v24.19.0, 64-byte argument deltas, three runs per input (milliseconds):

| Text size | Unmodified median (min–max) | Patched median (min–max) |
| --- | ---: | ---: |
| 32 KiB | 262.60 (243.81–308.92) | 10.08 (6.23–15.02) |
| 64 KiB | 835.60 (778.59–835.62) | 10.14 (9.85–11.46) |
| 128 KiB | 3218.65 (3054.02–3233.53) | 20.58 (20.11–21.54) |
| 256 KiB | 13513.99 (13102.00–15980.35) | 38.72 (37.67–48.23) |

Every measured run also verified exact reconstruction of the completed JSON object and absence of `argumentsError`. The larger inputs show the removed repeated-prefix work; these local timings are observations, not a service-level latency guarantee. Authentication with live accounts and live-provider inference were not exercised by this benchmark.
