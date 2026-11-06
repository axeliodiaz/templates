# Versioned public design CSS CDN

Only three already-public CSS files are distributed: Lumen, Lumen dark and Felix tokens. No template pages, confidential sources, ZIPs, user data, credentials or application API are included.

Each asset has a version and its full SHA-256 in the path. `manifest.json` records source refs, exact commits, bytes and hashes. Felix is pinned to the existing felix-tokens-v1.0.0 tag; both Lumen files are byte-identical in current Templates main and develop. Old source and jsDelivr links are untouched. Consumers migrate separately after the deployed bytes are verified.

Lumen retains its existing Google Fonts import for Plus Jakarta Sans (400/500/600/700). No local asset paths, scripts or images are referenced. This preserves exact consumer bytes and existing font behavior. Google Fonts is still an external dependency, with the existing system-ui fallback. Changing or self-hosting fonts needs its own version and license inventory.

## Routes and policy

- `/v1/<name>-<full-sha256>.css`: exact source bytes; CSS UTF-8; wildcard CORS without credentials; one-year immutable caching; content hash ETag; HEAD and304 supported.
- `/v1/manifest-<full-sha256>.json`: immutable manifest, same CORS.
- OPTIONS returns204 on known paths; nonread methods return405. Everything else returns404 and no-store. There is no mutable latest alias, proxy, directory browse or origin fetch.
- Embedded small assets avoid KV/storage costs. Free Workers plan only. No custom domain, DNS, routes, secrets, scheduled job, paid upgrade or account permissions.

## Test and release

`node tests/css-cdn.cjs` verifies embedded bytes, hashes, types, cache/CORS/security headers, HEAD,304,OPTIONS,405,404 and manifest. The regular build workflow runs it.

Before each deployment, verify the actual account remains Free and count all Workers and Pages deployments in the rolling seven-day window, paging past the cutoff for every script/project. At most100 including this deployment is allowed without a new concrete owner decision. Token403 is not zero; use existing authorized read access or hold. Recheck immediately before deploy.

Deploy with the project-local Wrangler using `cdn/wrangler.toml`. Do not modify the existing worker or services. Record the actual provider-returned workers.dev URL, live version and fetched hashes in the ticket, then validate GET/HEAD/304/CORS and404 against the live origin. Keep old source until all consumers are released and inspected. A rollback must keep every previously published immutable path and bytes available; add new versions rather than overwriting content.

A free Worker has the account request/CPU limits shown by the live plan. This distribution adds one request-serving Worker, no paid plan. It is not permission to exceed the owner's deployment limit. Consumer releases and repo visibility are separate tickets, each with their own gates.
