# Dog and Bone — Architecture Decision Records

## ADR-001: Brand Name — Dog and Bone

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: Needed a memorable, distinctive brand name for a minimalist phone business.
- **Decision**: "Dog and Bone" — Cockney rhyming slang for phone. Warm, British, instantly memorable, and works across all three target markets (seniors recognise the phrase, parents find it charming, adults appreciate the wit).
- **Alternatives considered**: Clearline (too corporate), Cove (evocative but generic), Haven (too soft).
- **Consequences**: Strong recall, good SEO potential for "minimalist phone UK", slightly informal tone that may need careful management in premium positioning.

---

## ADR-002: Static Site + Netlify Functions (no separate backend)

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: Need a backend for Stripe checkout session creation and webhook handling without managing infrastructure.
- **Decision**: Netlify Functions (serverless, Node.js 20). Zero infrastructure to manage. Cold starts are acceptable for checkout flow (not a hot path). Free tier covers expected initial volume.
- **Alternatives considered**: Separate Express server on Railway/Render (more control, more ops), Next.js (would require replatforming the entire frontend).
- **Consequences**: Netlify vendor lock-in for functions, but migration to Lambda or another provider is straightforward if needed.

---

## ADR-003: MDX Blog (build-time, no CMS)

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: Need a blog for SEO-driven content. Options: headless CMS (Contentful, Sanity), database-backed, or static MDX files.
- **Decision**: MDX files compiled at build time with `@mdx-js/rollup`. Zero monthly cost, content lives in Git, build-time rendering gives excellent SEO and Core Web Vitals scores. Non-developer content editing is not a requirement at MVP.
- **Alternatives considered**: Contentful ($300+/mo for production tier), Sanity (free but adds operational complexity), Notion API (unreliable for production).
- **Consequences**: Content changes require a code deploy. Acceptable for MVP volume. Can migrate to a headless CMS later without changing the blog UI components.

---

## ADR-004: ADB pm disable-user (not pm uninstall)

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: Need to hide apps from the device without permanently removing them.
- **Decision**: `adb shell pm disable-user --user 0 <package>` disables apps per-user rather than uninstalling them. Apps are hidden from the launcher and cannot be launched. The operation is fully reversible with `pm enable`.
- **Alternatives considered**: `pm uninstall` — permanent, harder to reverse, breaks post-purchase alteration service.
- **Consequences**: Disabled apps still consume a small amount of storage. The post-purchase alteration service can re-enable apps with a single command, which is the core operational requirement.

---

## ADR-005: Custom Kotlin Launcher (not Unlauncher)

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: The device needs a branded minimal launcher showing only whitelisted apps.
- **Decision**: Build a native Kotlin Android launcher under the `com.dogandbonephone.launcher` package. Full control over branding, profile-specific features (emergency SOS, PIN lock, downtime mode), and future updates.
- **Alternatives considered**: Unlauncher (open-source, fast, but no branding, no profile-specific features, requires forking to customise).
- **Consequences**: Significant additional development effort. The launcher APK is distributed via the ADB setup script. One APK + config file approach means no recompilation per order.

---

## ADR-006: Per-order Script Generation (Netlify Function)

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: Each customer selects a custom combination of apps. Need to produce a device-specific ADB script for each order.
- **Decision**: `generate-setup-script` Netlify Function reads app selections from Stripe Checkout Session metadata and dynamically generates a bash script. Admin calls `GET /generate-setup-script?orderId=cs_xxx&secret=ADMIN_SECRET` and downloads the `.sh` file.
- **Alternatives considered**: Manual script creation per order (error-prone, slow), storing orders in DynamoDB (over-engineered for MVP volume).
- **Consequences**: Stripe becomes the order database. Metadata is limited to 500 chars per key — encoding app IDs as comma-separated strings stays within this limit.

---

## ADR-007: Amazon Bedrock for AI Assets

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: Need lifestyle photography and short videos for the website. Options: hire photographer, use stock images, generate with AI.
- **Decision**: Amazon Bedrock Nova Canvas (images) and Nova Reel (videos) using the user's existing default AWS profile. Generated assets committed to the repo. One-time generation with re-runs on demand.
- **Alternatives considered**: Midjourney (manual, requires Discord), DALL-E via OpenAI API (no video), stock photography (generic, expensive for commercial use).
- **Consequences**: Generated images may require manual review for quality. Videos are S3-hosted if too large for Git.

---

## ADR-008: Rewardful for Affiliate Programme

- **Date**: 2026-04-07
- **Status**: Accepted
- **Context**: Need an affiliate programme that integrates with Stripe.
- **Decision**: Rewardful. Native Stripe integration — reads `client_reference_id` from Checkout Sessions automatically. $29/month post-trial.
- **Alternatives considered**: PartnerStack ($500/mo), ShareASale (harder Stripe integration), manual tracking (error-prone).
- **Consequences**: Adds $29/month recurring cost. Rewardful handles payout tracking and affiliate portal — no custom development needed.

---

## ADR-009: Local Admin Server (not a deployed dashboard)

- **Date**: 2026-05-01
- **Status**: Accepted
- **Context**: Operator needs to (a) see new orders, (b) connect a phone via USB, (c) generate + run an ADB setup script against that phone. ADB requires a local USB connection.
- **Decision**: A local Node/Express server under `admin-server/` running on `localhost:3000`. Shells out to the `adb` binary, calls the Netlify Functions API to fetch orders, streams script output back to the browser.
- **Alternatives considered**: Hosted web dashboard (can't reach USB-connected devices), native Electron app (heavier, same capability).
- **Consequences**: Operator must run the admin-server locally during fulfilment. Never deploy this to the public internet — it has no auth and exposes the operator's ADB access.

---

## ADR-010: AWS SAM for Device-Tracking Infrastructure

- **Date**: 2026-05-03
- **Status**: Accepted
- **Context**: Devices need to phone-home post-shipment and pull updated app configuration remotely. Decision between Netlify Functions (same platform) and AWS.
- **Decision**: AWS SAM stack in `eu-west-2` — API Gateway + Lambda + DynamoDB + S3. DynamoDB is the natural fit for device inventory keyed by serial; S3 stores per-device JSON configs. SAM provides reproducible deploys via `sam deploy`.
- **Alternatives considered**: Netlify Functions + an external DB (Supabase, Upstash) — cheap but split vendor, harder to reason about IAM. Terraform/CDK — more power, more ceremony for a 4-Lambda stack.
- **Consequences**: Adds a second cloud vendor. Estimated cost ~£3/month for expected volume. `infrastructure/.aws-sam/` build output must stay gitignored.

---

## ADR-011: API-Key Auth for Device Endpoints (not Cognito)

- **Date**: 2026-05-04
- **Status**: Accepted
- **Context**: Device-tracking endpoints are called by (a) the Android launcher on boot and (b) the local admin-server. Neither represents a human user, so user-pool auth is a poor fit.
- **Decision**: API Gateway API keys + Usage Plan. Single key baked into the launcher APK at build time and into the admin-server `.env`. Rotation means rebuilding the APK and updating the admin-server.
- **Alternatives considered**: Cognito (designed for users, over-engineered for M2M), IAM-signed requests via SigV4 (rotates credentials cleanly but requires AWS SDK inside the launcher, adds ~2 MB to the APK), mTLS (overkill).
- **Consequences**: Key rotation requires an APK rebuild + redeploy to all devices — must keep a rotation runbook. A leaked key grants full API access until rotated, so the key must never appear in `.env.example` or Git history.

---

## ADR-012: Lambda CodeUri + esbuild over InlineCode

- **Date**: 2026-05-11
- **Status**: Accepted
- **Context**: The initial SAM template embedded Lambda source inline via `InlineCode`. This prevents linting, testing, and importing from npm packages cleanly, and inflates template size.
- **Decision**: Move each Lambda into `infrastructure/functions/{name}/index.mjs` with `CodeUri` + SAM's esbuild `BuildMethod`. AWS SDK clients are marked `External` since they're provided by the Lambda runtime.
- **Alternatives considered**: Keep `InlineCode` (easier single-file deploys but no test/lint path), switch to TypeScript with `esbuild`/`tsc` pre-step (more ceremony for what is currently plain JavaScript).
- **Consequences**: Source is now lintable, testable, and version-controlled as real files. SAM `sam build` is required before `sam deploy`. `infrastructure/.aws-sam/` must be gitignored.

---

## ADR-013: `context/` Snapshot Excluded from Vitest

- **Date**: 2026-05-11
- **Status**: Accepted
- **Context**: The repo contains a `context/source-.../src/**` snapshot (gitignored, used by tooling). Vitest was discovering tests inside it, doubling every failure and making baseline counts nonsensical (479 ≈ 2 × real 242).
- **Decision**: Explicit `test.exclude` in `vitest.config.ts` covering `context/**`, `admin-server/**`, `infrastructure/**`, `android/**`, and the usual `node_modules`/`dist` paths.
- **Alternatives considered**: Delete the `context/` snapshot (may be required by another tool — unknown), narrow `test.include` to `src/**/*.test.{ts,tsx}` (equivalent effect, but exclusion is more explicit about intent).
- **Consequences**: Test counts now match reality. Adding a new workspace under the repo root (e.g. another Node app) requires remembering to exclude its `node_modules`.
