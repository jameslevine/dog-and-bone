# Dog and Bone — Tools & Technology

## Language & Runtime

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20.x LTS | Runtime for Netlify Functions and build scripts |
| TypeScript | ~6.0 | Type safety across frontend and functions |

## Frontend

| Tool | Version | Why |
|---|---|---|
| React | 19 | Component model, hooks, concurrent features |
| Vite | 8 | Fast dev server, optimised builds, MDX plugin |
| Tailwind CSS | 4 | Utility-first styling with custom design tokens |
| React Router | 7 | Client-side routing, data loaders |
| Zustand | 5 | Minimal global state (cart + app selection) |
| TanStack Query | 5 | Server state management, mutation handling |
| Formik | 2 | Form state management |
| Yup | 1 | Schema-based form validation |
| react-i18next | 17 | Internationalisation (English + future languages) |
| @mdx-js/rollup | 3 | MDX compilation at build time for blog |
| gray-matter | 4 | Frontmatter parsing for blog posts |
| lucide-react | latest | Icon library |
| clsx + tailwind-merge | latest | Conditional class name utility (`cn()`) |
| @fontsource/nunito | 5 | Self-hosted Nunito font |
| @fontsource/jetbrains-mono | 5 | Self-hosted JetBrains Mono (code blocks) |
| @stripe/stripe-js | 9 | Stripe.js client (for redirect) |

## Backend (Netlify Functions)

| Tool | Version | Why |
|---|---|---|
| stripe | 22 | Stripe Node.js SDK for creating checkout sessions |
| @aws-sdk/client-bedrock-runtime | 3 | Amazon Bedrock API for AI asset generation |

## Testing

| Tool | Version | Why |
|---|---|---|
| Vitest | 4 | Fast Vite-native test runner |
| @testing-library/react | 16 | DOM-centric component testing |
| @testing-library/jest-dom | 6 | Custom DOM matchers |
| @testing-library/user-event | 14 | Realistic user interaction simulation |
| MSW | 2 | API mocking at network level |
| jsdom | 29 | DOM environment for tests |
| @vitest/coverage-v8 | 4 | V8 coverage provider |

## Developer Tooling

| Tool | Version | Why |
|---|---|---|
| ESLint | 9 | Linting (TypeScript + React + jsx-a11y) |
| Prettier | 3 | Code formatting |
| Husky | 9 | Git hooks (pre-commit, commit-msg) |
| lint-staged | 16 | Run linters only on staged files |
| commitlint | 20 | Enforce conventional commit format |

## External Services

| Service | Purpose | Pricing |
|---|---|---|
| Netlify | Hosting, Functions, Forms, CDN | Free tier (upgradeable) |
| Stripe | Payment processing | 1.4% + 20p per EU transaction |
| Rewardful | Affiliate programme | $29/month after trial |
| Amazon Bedrock | AI image + video generation | Pay per use |

## Android

| Tool | Purpose |
|---|---|
| Android Studio Ladybug | IDE for Kotlin launcher development |
| Kotlin 2.x | Launcher language |
| ADB (Android Debug Bridge) | Device configuration scripts |
| Samsung Galaxy A12 | Target hardware (Android 11–12) |

## Environment Setup (Local Development)

```bash
# Prerequisites
node --version   # 20+
npm --version    # 10+

# Clone and install
git clone <repo>
npm install

# Set up environment
cp .env.example .env
# Fill in VITE_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY (test mode)

# AWS credentials (for AI asset generation only)
# Ensure ~/.aws/credentials has a [default] profile with Bedrock access

# Run dev server
npm run dev

# Run with Netlify functions (requires netlify-cli)
npx netlify dev

# Run tests
npm test

# Generate AI assets (one-time or on demand)
npm run generate:ai-assets
```

## CI/CD

No automated CI/CD pipeline configured. Manual deployment via Netlify CLI or Git push to main branch (if Netlify is connected to the repository).
