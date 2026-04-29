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

---

## Post-Launch Backlog

These items are not blockers for launch but are planned for after the first live orders:

| Task | Priority | Notes |
| --- | --- | --- |
| Google Analytics / Plausible | P2 | Track page views and conversion funnel |
| Generate AI images via Bedrock | P1 | Run `npm run generate:ai-assets` once AWS configured |
| Build and sideload Android launcher APK | P0 | Required for per-order phone setup |
| Switch Stripe to live mode | P0 | Follow Section 6 of `userInstructions/DEPLOYMENT.md` |
| Email confirmation on order | P1 | Trigger via stripe-webhook when checkout.session.completed |
| Customer order portal | P2 | Let customers track their order status |
