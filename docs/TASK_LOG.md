# Dog and Bone — Task Log

## 🔵 Current Task

- **Task**: Post-launch monitoring and next steps
- **Started**: 2026-04-07
- **Context**: All 12 phases complete. Site is ready for Netlify deployment. Deployment guide written at `userInstructions/DEPLOYMENT.md`.
- **Progress**: Build passes cleanly. `.env.example` updated. Deployment guide created.

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

## 🔴 Blocked / Pending

- Stripe Price IDs — must be created in Stripe dashboard and added as Netlify env vars (see `userInstructions/DEPLOYMENT.md`)
- Netlify site URL — needed to configure the Stripe webhook endpoint
- Real AI-generated images and videos — run `npm run generate:ai-assets` once AWS Bedrock is configured
- Business mailing address — needed for `/send-your-phone` success confirmation text
- Android launcher APK — custom Kotlin launcher to be built and sideloaded per order

## ⏭️ Next Up

1. Monitor Stripe dashboard for first test orders
2. Set up Google Analytics or Plausible (optional)
3. Generate AI images via `npm run generate:ai-assets` (requires AWS Bedrock access)
4. Build and sideload the Android launcher APK (`android/` folder)
5. Switch Stripe to live mode once test orders are confirmed working (see Section 6 of DEPLOYMENT.md)
