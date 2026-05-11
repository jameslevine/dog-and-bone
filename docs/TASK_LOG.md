# Dog and Bone — Task Log

## 🔵 Current Task

- **Task**: Code hygiene pass + doc refresh
- **Started**: 2026-05-11
- **Context**: Site has been live since 2026-04-29. Since then: admin-server rewrite, AWS device-tracking infrastructure (SAM + DynamoDB + 4 Lambdas + S3 + API Gateway). Docs were stale. Audit also surfaced 5 flaky tests, a leaked API key in `.env.example`, stray `console.log`s, 2 oversized pages, and inconsistent Lambda hygiene.
- **Progress**: Sanitised `.env.example`, fixed 5 tests (vitest was double-counting via `context/` snapshot — excluded), removed `console.log`s, flattened `src/router/` and `src/styles/`, split `SetupGuidePage` (422→90 lines) and `SendYourPhonePage` (356→97 lines) with new `CodeBlock`/`InlineCode` atoms, hardened all 4 device-tracking Lambdas (try/catch, env-var validation, consistent DocumentClient usage), refreshed ROADMAP/ARCHITECTURE/DECISIONS. No git commits — all changes unstaged for review.

## ✅ Completed Tasks

| Date | Task | Notes |
| --- | --- | --- |
| 2026-04-07 | Vite + React + TypeScript project scaffold | create-vite@9 |
| 2026-04-07 | All npm dependencies installed | Frontend + testing + linting |
| 2026-04-07 | Tailwind CSS v4 configured | Custom design tokens: yellow/brown palette |
| 2026-04-07 | ESLint (Airbnb-style + TypeScript) configured | .eslintrc.cjs |
| 2026-04-07 | Prettier configured | .prettierrc |
| 2026-04-07 | Husky + commitlint + lint-staged | pre-commit + commit-msg hooks |
| 2026-04-07 | Vitest + React Testing Library + MSW | 90% coverage threshold set |
| 2026-04-07 | netlify.toml | Redirects + security headers + CSP |
| 2026-04-07 | .env.example | All required env vars documented |
| 2026-04-07 | Global CSS (globals.css) | Fonts, skip link, focus styles, scrollbar |
| 2026-04-07 | All docs/ files created | ROADMAP, ARCHITECTURE, API_SCHEMA, TOOLS_AND_TECH, TASK_LOG, DECISIONS |
| 2026-04-07 | Project directory structure created | All src/, netlify/, android/, scripts/ folders |
| 2026-04-07 | Dog and Bone SVG logo | Bone icon + Cockney wordmark |
| 2026-04-07 | Atom components | Button, Badge, Icon, Input, Textarea, Checkbox, RadioButton, Spinner, Tag, Logo |
| 2026-04-07 | MainLayout + Header + Footer | Sticky header, mobile nav, footer links |
| 2026-04-07 | React Router with all page stubs | All routes wired up |
| 2026-04-07 | Data layer | profiles.ts, apps.ts, testimonials.ts, aiAssets.ts |
| 2026-04-07 | Zustand stores | cartStore, customizationStore |
| 2026-04-07 | Home page | Hero video, ValueProps, Testimonials, CTABanner |
| 2026-04-07 | Store page + profile selector | 4 profile cards with features |
| 2026-04-07 | App customisation form | Per-category checkbox grid with Formik |
| 2026-04-07 | Checkout flow + Stripe redirect | Netlify function + order summary |
| 2026-04-07 | Send Your Phone page + Netlify Form | Mail-in service form |
| 2026-04-07 | Netlify Function: create-checkout-session | Stripe Checkout session creation |
| 2026-04-07 | Netlify Function: stripe-webhook | Webhook handler for completed payments |
| 2026-04-07 | Netlify Function: generate-setup-script | Per-order ADB shell script generator |
| 2026-04-07 | MDX blog system | import.meta.glob based dynamic loader |
| 2026-04-07 | 12 blog articles | SEO content across 3 target markets |
| 2026-04-07 | Affiliate page (Rewardful) | Sign-up CTA and commission info |
| 2026-04-07 | Android Setup Guide page | ADB walkthrough with code snippets |
| 2026-04-07 | About page | Brand story, mission, founder note |
| 2026-04-07 | Samsung A12 bloatware removal scripts | Baked into generate-setup-script function |
| 2026-04-07 | Per-order ADB script templates | generateScript() in generate-setup-script.ts |
| 2026-04-07 | AI asset generation scripts | npm run generate:ai-assets via Bedrock |
| 2026-04-07 | Phase 12: Deployment prep | Build fixed, .env.example updated, DEPLOYMENT.md written |
| 2026-04-29 | Remove add-on products | Removed ADDONS array, updated checkout function, fixed ESLint config |
| 2026-04-29 | Update Stripe Price IDs | Created 4 products in Stripe test mode, updated profiles.ts |
| 2026-04-29 | Android launcher build system | Added build-launcher.sh, sign-release.sh, Gradle wrapper fixed |
| 2026-04-29 | Android keystore setup | Created production keystore, signed release APK (4.8MB) |
| 2026-04-29 | Keystore backup | Encrypted with GPG, stored in 1Password |
| 2026-04-29 | Production deployment | Site live on Netlify with working Stripe checkout |
| 2026-04-30 | Remove public admin dashboard | Commit `9bf7589` — replaced with local-only admin server |
| 2026-04-30 | Admin dashboard with Stripe orders + auth | Commits `fdebb69`, `9c0bca2` |
| 2026-05-01 | Local admin server built (`admin-server/`) | Commit `37ffaf4` — Express + ADB orchestration |
| 2026-05-02 | Admin server error handling + fixes | Commits `df4062a`, `2932cc3`, `49077cc` |
| 2026-05-03 | AWS device-tracking infra scaffolded | Commit `726eac2` — SAM template + DEVICE_TRACKING.md |
| 2026-05-04 | Phase 1: device tracking deployed | Commit `657d8d4` |
| 2026-05-05 | Phase 2: device registration + remote config | Commit `891c9f9` |
| 2026-05-06 | Phase 3: device inventory | Commit `e3e50f4` |
| 2026-05-11 | SAM YAML: `CodeUri` + esbuild over `InlineCode` | Uncommitted — for review |
| 2026-05-11 | Sanitise leaked AWS_DEVICE_API_KEY in `.env.example` | Replaced with placeholders — user must rotate the real key |
| 2026-05-11 | Fix 5 flaky tests | Logo SVG→img, profiles.popular, Affiliate stats, HeroSection, vitest `context/` exclusion |
| 2026-05-11 | Remove stray console.log from stripe-webhook.ts | Kept one load-bearing `console.info` with justification comment |
| 2026-05-11 | Flatten `src/router/` and `src/styles/` folders | `src/routes.tsx` + `src/globals.css` |
| 2026-05-11 | Split SetupGuidePage | 422 → 90 lines; extracted `SetupGuidePage.sections.tsx` + `CodeBlock`/`InlineCode` atoms |
| 2026-05-11 | Split SendYourPhonePage | 356 → 97 lines; extracted `SendYourPhoneForm.tsx` + `SendYourPhonePage.schema.ts` |
| 2026-05-11 | Harden 4 device-tracking Lambdas | try/catch, env-var validation, consistent DynamoDBDocumentClient |
| 2026-05-11 | Refresh all docs | ROADMAP phases 13–15, ARCHITECTURE device-tracking section, DECISIONS ADRs, TASK_LOG current task |

## 🔴 Blocked / Pending

None — all critical blockers resolved.

## ⏭️ Next Up

1. **[SECURITY — MUST DO FIRST]** The current `AWS_DEVICE_API_KEY` is **compromised**. It is in committed git history (commits `657d8d4`, `37ffaf4`) hardcoded in `android/launcher/.../DeviceRegistration.kt` and was previously also hardcoded as a fallback in `admin-server/index.js` (now removed). Actions required, in order:
   1. Rotate the key in AWS (API Gateway → API Keys → delete old, create new, update Usage Plan)
   2. Update local `.env` + Netlify env vars with the new key
   3. Edit `android/launcher/app/src/main/java/com/dogandbonephone/launcher/DeviceRegistration.kt` lines 18–19 with the new key + URL (hardcoded-in-APK is the intended pattern per ADR-011)
   4. Rebuild + re-sign the launcher APK and redistribute to any already-provisioned devices
   5. (Optional but recommended) `git filter-repo` or BFG to scrub the old key from history; force-push requires user approval
2. **[COMMIT]** Single `infra:` commit of `infrastructure/functions/*` + hardened YAML diff + sanitised `.env.example`. Confirm `infrastructure/.aws-sam/` stays gitignored.
3. **[GO-LIVE]** Switch Stripe to live mode (Section 6 of `userInstructions/DEPLOYMENT.md`). Update Price IDs, configure production webhook, smoke-test.
4. **[FEATURE]** Wire launcher → AWS device API: `POST /device/register` on boot; periodic `GET /device/config`. Integration guide: `infrastructure/DEVICE_TRACKING.md`.
5. **[HARDWARE]** Test signed launcher APK on physical Samsung A12 (carry-over from 2026-04-29).
6. **[ADMIN]** Extend `admin-server/index.js` to call `list-devices` + `update-config` for remote-config push.
7. **[TESTS]** Add tests for `WiFiForm.tsx`, `ContactsForm.tsx`, `FAQPage.tsx`.
8. **[PERF]** Route-based code splitting to shrink the 626 KB JS bundle.
9. **[OPS]** Decide on `deno.lock` — keep + add to `.gitignore`, or remove.
10. **[OPTIONAL]** Google Analytics / Plausible, AI video generation.
