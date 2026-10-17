# Bundled dependency license sources

`node scripts/build.mjs` generates `dist/THIRD_PARTY_NOTICES.txt` from every npm package represented in the Host bundle's esbuild input graph. It copies each package's supplied `LICENSE`, `LICENCE`, `NOTICE`, and `COPYRIGHT` files. `data-uri-to-buffer` supplies its full MIT notice in its package README; that text is copied as well. Missing texts fail the build.

The following packages omit license files from their published npm tarballs. These upstream texts are retained for reproducible offline builds:

| Local text | Packages | Source |
| --- | --- | --- |
| `pi-ai-LICENSE.txt` | `@earendil-works/pi-ai` 1.3.0, `@earendil-works/pi-telemetry` 1.3.0 | [Pi LICENSE at the 1.3.0 source commit](https://github.com/earendil-works/pi/blob/71023aec1546d6d677a65669c5665c0927ce0dd0/LICENSE), MIT, Mario Zechner |
| `aws-sdk-LICENSE.txt` | AWS SDK packages without their own packaged text, including `credential-provider-http`, `credential-provider-login`, and `nested-clients` | The Apache 2.0 `LICENSE` supplied by the installed `@aws-sdk/core` 3.978.2 package from [aws/aws-sdk-js-v3](https://github.com/aws/aws-sdk-js-v3) |
| `proxy-agents-LICENSE.txt` | `proxy-agent-negotiate` 1.1.0 | [The same proxy-agents repository's agent-base MIT notice](https://github.com/TooTallNate/proxy-agents/blob/main/packages/agent-base/LICENSE), Nathan Rajlich, also named as the author by the negotiate package |
| `standardwebhooks-LICENSE.txt` | `standardwebhooks` 1.1.1 | [Standard Webhooks repository root LICENSE](https://github.com/standard-webhooks/standard-webhooks/blob/main/LICENSE), Apache 2.0 |

The `standardwebhooks` 1.1.1 npm manifest declares `MIT`, while its repository root supplies the Apache 2.0 text. The generated notice preserves the package's declared license and the available upstream text separately; it does not change the package's metadata or invent a copyright notice absent from the distributed package.

The original web client `clsx` notice remains in the top-level `THIRD_PARTY_NOTICES.md`. Build tools and DSH-supplied external packages are not included in the Host dependency graph.
