# Dog and Bone — Project Roadmap

## Project Overview

Dog and Bone (Cockney rhyming slang for "phone") sells Samsung Galaxy A12 phones pre-configured as minimalist devices. We strip away the noise — no social media, no algorithmic feeds, no infinite scroll — and ship a focused, intentional phone. Customers choose exactly which apps they want. We configure it and send it back.

Target markets: seniors wanting simplicity and safety, parents managing children's screen time, and adults seeking digital detox and life balance.

Tagline: *"Simple phone. Happy life."*

## Goals & Success Criteria

- Fully functional e-commerce site live on Netlify
- Customers can browse profiles, select apps, and complete a Stripe purchase
- Affiliate programme driving referral traffic via Rewardful
- AI-generated lifestyle imagery reflecting brand values
- Android setup tools (ADB scripts + custom launcher APK) enabling rapid device configuration
- Blog content driving organic SEO traffic across three target audiences
- Post-purchase mail-in service enabling existing phone owners to have devices configured

## Milestones

### Phase 1 — Foundation & Brand 🟢

Set up tooling, design tokens, documentation, and brand identity.

### Phase 2 — Design System 🟢

Build atom and molecule components, logo, and layout system.

### Phase 3 — Core Pages & Payments 🟢

Home, Store, Customize, Checkout, Send Your Phone pages + Stripe integration.

### Phase 4 — Content & Community 🟢

12 blog articles, affiliate programme page, about page, setup guide.

### Phase 5 — Android Tooling 🟢

Custom Kotlin launcher APK + per-order ADB setup scripts.

### Phase 6 — Launch 🟢

Deploy to Netlify, configure Stripe production webhook, smoke test. **COMPLETE - Site live and operational.**

### Phase 7 — Blog System 🟢

MDX-based blog with category filtering and SEO-optimised articles.

### Phase 8 — Affiliate Programme 🟢

Rewardful integration, affiliate landing page, referral tracking in Stripe metadata.

### Phase 9 — AI Asset Generation 🟢

Amazon Bedrock Nova Canvas/Reel integration, prompt library, generation scripts.

### Phase 10 — Checkout Flow Polish 🟢

Order review page, add-ons (charger, express setup), Stripe redirect.

### Phase 11 — Testing & Coverage 🟢

Unit and integration tests, 90% coverage threshold, MSW mocks.

### Phase 12 — Deployment Prep 🟢

Production build verified clean, `.env.example` complete, operator deployment guide written.

### Phase 13 — Local Admin Server 🟢

Replaced the public admin dashboard with a local Node/Express server (`admin-server/`) that detects connected Android devices via ADB, fetches Stripe orders live, and orchestrates the generate-setup-script flow. Runs on `localhost:3000` only — ADB requires USB access.

### Phase 14 — AWS Device Tracking & Remote Config 🟢

SAM-deployed device-management stack: API Gateway (API-key authenticated) + DynamoDB (`DevicesTable`) + S3 (`ConfigBucket`) + 4 Lambdas (register-device, list-devices, get-config, update-config). Enables devices to phone-home on boot and pull updated app configuration remotely. Estimated cost ~£3/month. Infrastructure in `infrastructure/device-management.yaml`, Lambda sources in `infrastructure/functions/`, integration guide in `infrastructure/DEVICE_TRACKING.md`.

### Phase 15 — Code Hygiene Pass (2026-05-11) 🟢

Audit + cleanup: fixed 5 flaky tests, removed stray `console.log` from stripe-webhook, flattened `src/router/` and `src/styles/`, split `SetupGuidePage` (422 → 90 lines) and `SendYourPhonePage` (356 → 97 lines), extracted `CodeBlock` and `InlineCode` atoms, hardened 4 device-tracking Lambdas with try/catch + env validation + consistent DocumentClient usage, sanitized leaked AWS API key from `.env.example`.

---

## Feature List

| Feature | Priority | Status |
| --- | --- | --- |
| Brand identity (name, logo, colors, typography) | P0 | 🟢 Complete |
| Tailwind design tokens | P0 | 🟢 Complete |
| Vite + React + TypeScript scaffold | P0 | 🟢 Complete |
| ESLint + Prettier + Husky | P0 | 🟢 Complete |
| Vitest + Testing Library | P0 | 🟢 Complete |
| netlify.toml configuration | P0 | 🟢 Complete |
| Documentation (docs/) | P0 | 🟢 Complete |
| Dog and Bone SVG logo | P0 | 🟢 Complete |
| Atom components (Button, Input, etc.) | P0 | 🟢 Complete |
| MainLayout + Header + Footer | P0 | 🟢 Complete |
| React Router with all page stubs | P0 | 🟢 Complete |
| Data layer (profiles, apps, types) | P0 | 🟢 Complete |
| Zustand stores (cart, customisation) | P0 | 🟢 Complete |
| Amazon Bedrock AI image generation | P1 | 🟢 Complete |
| Amazon Bedrock AI video generation | P1 | 🟢 Complete |
| Home page | P0 | 🟢 Complete |
| Store page + profile selector | P0 | 🟢 Complete |
| App customisation form | P0 | 🟢 Complete |
| Checkout flow + Stripe redirect | P0 | 🟢 Complete |
| Send Your Phone page + Netlify Form | P0 | 🟢 Complete |
| Netlify Function: create-checkout-session | P0 | 🟢 Complete |
| Netlify Function: stripe-webhook | P0 | 🟢 Complete |
| Netlify Function: generate-setup-script | P0 | 🟢 Complete |
| MDX blog system | P0 | 🟢 Complete |
| 12 blog articles | P0 | 🟢 Complete |
| Affiliate page (Rewardful) | P1 | 🟢 Complete |
| Android Setup Guide page | P0 | 🟢 Complete |
| About page | P1 | 🟢 Complete |
| Samsung A12 bloatware removal scripts | P0 | 🟢 Complete |
| Per-order ADB script templates | P0 | 🟢 Complete |
| Custom Kotlin Android launcher | P0 | 🟢 Complete |
| i18n structure (English) | P2 | 🟢 Complete |
| WCAG 2.1 AA accessibility | P0 | 🟢 Complete |
| 90% test coverage | P0 | 🟢 Complete |
| Netlify production deployment | P0 | 🟢 Complete |
| Stripe Price IDs updated (4 profiles) | P0 | 🟢 Complete |
| Android launcher build system | P0 | 🟢 Complete |
| Android launcher signed APK | P0 | 🟢 Complete |
| Keystore backup in 1Password | P0 | 🟢 Complete |
| Local admin server (ADB + Stripe orders) | P0 | 🟢 Complete |
| AWS SAM device tracking (DynamoDB + 4 Lambdas + S3) | P0 | 🟢 Complete |
| AWS API Gateway with API-key auth | P0 | 🟢 Complete |
| Code hygiene pass (2026-05-11) | P1 | 🟢 Complete |

---

## Post-Launch Backlog

These items are not blockers for launch but are planned for after the first live orders:

| Task | Priority | Notes |
| --- | --- | --- |
| Rotate leaked AWS_DEVICE_API_KEY | P0 | API Gateway → API Keys → delete old, create new, update Usage Plan |
| Commit `infrastructure/functions/*` + sanitised `.env.example` | P0 | Single `infra:` commit |
| Switch Stripe to live mode | P0 | Follow Section 6 of `userInstructions/DEPLOYMENT.md` |
| Wire launcher → device-tracking API | P1 | `POST /device/register` on boot + polling `GET /device/config` — see `infrastructure/DEVICE_TRACKING.md` |
| Test signed launcher APK on physical A12 | P0 | Carry-over from 2026-04-29 |
| Extend admin-server with list-devices + update-config | P1 | Push remote-config changes from the local dashboard |
| Route-based code splitting | P2 | Reduce 626 KB JS chunk |
| Add tests for WiFiForm, ContactsForm, FAQPage | P2 | Currently untested |
| Email confirmation on order | P1 | Trigger via stripe-webhook when checkout.session.completed |
| Customer order portal | P2 | Let customers track their order status |
| Google Analytics / Plausible | P2 | Track page views and conversion funnel |
| Generate AI videos via Bedrock | P2 | Run `npm run generate:ai-assets` |
