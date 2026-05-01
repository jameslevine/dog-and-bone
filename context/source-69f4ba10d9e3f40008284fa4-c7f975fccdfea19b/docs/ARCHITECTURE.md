# Dog and Bone — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Customer Browser                      │
│  React SPA (Vite build, served from Netlify CDN)        │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTPS
┌───────────────────▼─────────────────────────────────────┐
│                    Netlify                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Static Files (CDN Edge)               │    │
│  │  HTML + JS + CSS + AI images/videos             │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Netlify Functions (Lambda)            │    │
│  │  create-checkout-session                        │    │
│  │  stripe-webhook                                 │    │
│  │  generate-setup-script (admin-protected)        │    │
│  └──────────────────┬──────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Netlify Forms                         │    │
│  │  Send Your Phone booking form                   │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────┬─────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│     Stripe      │   │   Rewardful     │
│  Checkout/      │   │  Affiliate      │
│  Products/      │   │  tracking       │
│  Webhooks       │   └─────────────────┘
└─────────────────┘
```

## Component Breakdown

### Frontend (React SPA)

**Pages**
- `HomePage` — hero with video, value props, product tease, testimonials
- `StorePage` — profile selector, pricing, add to cart
- `CustomizePage` — app selection form (Formik + Yup)
- `CheckoutPage` — order summary + Stripe redirect
- `SendYourPhonePage` — mail-in service info + Netlify Form
- `BlogListPage` / `BlogPostPage` — MDX-driven articles
- `AffiliatePage` — programme info + Rewardful sign-up
- `SetupGuidePage` — Android installation documentation
- `AboutPage` — brand story

**State Management (Zustand)**
- `cartStore` — selected profile, add-ons, total price
- `customizationStore` — selected app IDs per category

**Data Layer**
- `src/data/profiles.ts` — profile definitions + Stripe Price IDs
- `src/data/apps.ts` — master app catalog with categories + package names
- `src/data/aiAssets.ts` — Bedrock image/video prompts manifest

### Backend (Netlify Functions)

**`create-checkout-session`**
- Accepts: `{ profileId, apps: string[], addons: string[] }`
- Creates Stripe Checkout Session with app selections in metadata
- Returns: `{ url: string }`

**`stripe-webhook`**
- Verifies Stripe signature
- Handles `checkout.session.completed`
- Logs order details (manual fulfilment MVP)

**`generate-setup-script`**
- Admin-protected (requires `?secret=ADMIN_SECRET`)
- Accepts: `?orderId=cs_xxx`
- Retrieves session from Stripe, reads `metadata.apps` + `metadata.profileId`
- Returns dynamically generated `.sh` file

### AI Asset Generation

**`scripts/generate-ai-assets.ts`** (run once locally)
- AWS Bedrock `amazon.nova-canvas-v1:0` → PNG images → `public/images/ai/`
- AWS Bedrock `amazon.nova-reel-v1:0` → MP4 videos → `public/videos/`
- Source of truth: `src/data/aiAssets.ts`

### Android Tooling

**`android/launcher/`** — Android Studio project (Kotlin)
- Custom home launcher APK branded as Dog and Bone
- Shows only whitelisted apps (read from `assets/app-config.json`)
- Profile-specific features: emergency SOS (Senior), PIN lock (Family)

**`android/scripts/`** — ADB bash scripts
- `disable-bloatware.sh` — common Samsung A12 package removal
- `generate-order-script.sh` — reads order JSON, outputs per-device script
- Profile templates with `%%APP_LIST%%` placeholders

## Data Flow

### Purchase Flow
```
Store → Customize → Checkout → Stripe Checkout (hosted)
    └── cartStore ──────────────────────────────┘
    └── customizationStore → serialised metadata
                                    │
                              Stripe webhook
                                    │
                              Log to console (admin)
                                    │
                        Admin: GET generate-setup-script
                                    │
                        Run .sh on connected device
                                    │
                          Ship configured phone
```

### Mail-in Service Flow
```
SendYourPhone page → Netlify Form → Email notification to admin
Admin receives phone → Runs setup script → Ships back
```

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Global state | Zustand v5 |
| Data fetching | TanStack Query v5 |
| Forms + validation | Formik + Yup |
| i18n | react-i18next |
| Blog | MDX + @mdx-js/rollup |
| Payments | Stripe |
| Hosting + Functions | Netlify |
| Affiliate | Rewardful |
| AI assets | Amazon Bedrock (Nova Canvas, Nova Reel) |
| Testing | Vitest + React Testing Library + MSW |

## Infrastructure

- **Hosting**: Netlify CDN (global edge network)
- **Functions**: Netlify Functions (Node.js 20, AWS Lambda under the hood)
- **Forms**: Netlify Forms (no backend required)
- **DNS**: Netlify DNS or external registrar pointing to Netlify
- **Environments**: `main` branch → production

## Security

- CSP headers enforced via `netlify.toml`
- `generate-setup-script` function protected by `ADMIN_SECRET` env var
- Stripe webhook verified with `STRIPE_WEBHOOK_SECRET`
- No secrets in code — all via Netlify environment variables
- HTTPS-only (Netlify enforces this)

## Key Dependencies

See [TOOLS_AND_TECH.md](./TOOLS_AND_TECH.md) for full dependency list with versions and rationale.

## Additional Documents

- [API_SCHEMA.md](./API_SCHEMA.md) — Netlify Function endpoints
- [TOOLS_AND_TECH.md](./TOOLS_AND_TECH.md) — full tech stack
- [DECISIONS.md](./DECISIONS.md) — architectural decision records
- [TASK_LOG.md](./TASK_LOG.md) — current work-in-progress
