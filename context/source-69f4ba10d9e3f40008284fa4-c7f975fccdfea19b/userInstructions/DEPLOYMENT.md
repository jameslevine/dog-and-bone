# Dog and Bone — Deployment Guide

This guide walks you through deploying the Dog and Bone website to Netlify and connecting it to Stripe for live payments. Follow each section in order.

---

## Section 1: Prerequisites

Before you start, make sure you have the following:

1. **Node.js 18 or higher** installed on your computer
   - Check by running: `node --version`
   - Download from: https://nodejs.org

2. **Netlify CLI** installed globally:
   ```
   npm install -g netlify-cli
   ```

3. **A Netlify account** — sign up free at https://netlify.com

4. **A Stripe account** — sign up at https://stripe.com
   - Start in test mode (no real money charged during testing)

5. **A GitHub account** — the code must be on GitHub for Netlify to deploy it automatically

6. **A Rewardful account** (optional — can be added later) — sign up at https://rewardful.com

---

## Section 2: Stripe Setup (do this FIRST)

You need to create your products in Stripe before the website can take payments.

### Step 1: Create the main phone product

1. Log in to https://dashboard.stripe.com
2. Make sure you are in **Test mode** (toggle in the top-right corner)
3. Go to **Products** in the left menu
4. Click **+ Add product**
5. Fill in:
   - **Name**: `Dog and Bone Phone`
   - **Description**: `Samsung Galaxy A12 configured as a minimalist phone`
6. Under **Pricing**, click **Add a price**:
   - **Pricing model**: One-time
   - **Price**: `149.00`
   - **Currency**: GBP
7. Click **Save product**
8. **Copy the Price ID** — it starts with `price_` and looks like `price_1ABC123XYZ`

Repeat this for each of the four profiles, creating one price per profile:

| Product name | Price |
|---|---|
| Dog and Bone Phone — Essential | £149.00 GBP |
| Dog and Bone Phone — Family | £149.00 GBP |
| Dog and Bone Phone — Senior | £149.00 GBP |
| Dog and Bone Phone — Balance | £149.00 GBP |

You will end up with four separate Price IDs — one for each profile.

### Step 2: Create the add-on products (optional)

Repeat the process above for add-ons:

| Product name | Price |
|---|---|
| USB-C Charger | £12.00 GBP |
| Express Setup | £15.00 GBP |

### Step 3: Note all your Price IDs

You will need all six Price IDs (or four if you skip add-ons). Keep them handy — you will enter them as environment variables in Netlify in Section 3.

---

## Section 3: Netlify Deployment

### Step 1: Push the code to GitHub

Open a terminal in the project folder and run:

```bash
git init
git add -A
git commit -m "feat: initial Dog and Bone website"
git remote add origin git@github.com:YOUR_USERNAME/dog-and-bone.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Create the repository on GitHub first at https://github.com/new (set it to private if you prefer).

### Step 2: Connect Netlify to GitHub

1. Log in to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** and authorise Netlify to access your repositories
4. Select the `dog-and-bone` repository
5. Build settings should be detected automatically. Confirm:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy site**

Netlify will run the first build. It will fail if environment variables are not yet set — that is expected. Continue to Step 3.

### Step 3: Set environment variables

1. In the Netlify dashboard, go to your site
2. Click **Site configuration** → **Environment variables**
3. Click **Add a variable** and add each of the following:

| Variable name | Description | Example value |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (safe for frontend) | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side only) | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (set up in Section 4) | `whsec_...` |
| `STRIPE_PRICE_ESSENTIAL` | Stripe Price ID for Essential profile | `price_...` |
| `STRIPE_PRICE_FAMILY` | Stripe Price ID for Family profile | `price_...` |
| `STRIPE_PRICE_SENIOR` | Stripe Price ID for Senior profile | `price_...` |
| `STRIPE_PRICE_BALANCE` | Stripe Price ID for Balance profile | `price_...` |
| `STRIPE_PRICE_CHARGER` | Stripe Price ID for USB-C Charger add-on | `price_...` |
| `STRIPE_PRICE_EXPRESS` | Stripe Price ID for Express Setup add-on | `price_...` |
| `ADMIN_SECRET` | A long random secret string you choose | `any-long-random-string-here` |
| `VITE_REWARDFUL_ID` | Your Rewardful campaign ID (optional) | `abc123` |

To find your Stripe publishable and secret keys:
- Go to https://dashboard.stripe.com/test/apikeys
- Copy the **Publishable key** and **Secret key**

### Step 4: Trigger a redeploy

After adding all environment variables:

1. Go to **Deploys** in the Netlify dashboard
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete (about 1–2 minutes)
4. Click the live URL to confirm the site loads

---

## Section 4: Stripe Webhook Setup

Webhooks allow Stripe to notify your site when a payment is completed.

### Step 1: Add the webhook endpoint

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **+ Add endpoint**
3. In **Endpoint URL**, enter:
   ```
   https://YOUR-SITE-NAME.netlify.app/.netlify/functions/stripe-webhook
   ```
   Replace `YOUR-SITE-NAME` with your actual Netlify subdomain (shown in your Netlify dashboard)

4. Under **Select events**, choose:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`

5. Click **Add endpoint**

### Step 2: Copy the Webhook Signing Secret

1. On the webhook detail page, click **Reveal** next to **Signing secret**
2. Copy the value — it starts with `whsec_`
3. Go back to Netlify → **Site configuration** → **Environment variables**
4. Update the `STRIPE_WEBHOOK_SECRET` variable with this value
5. Trigger a redeploy

---

## Section 5: Admin Setup Script Access

When an order is placed, you will need to configure the phone using the admin tool.

### How to use the setup script generator

1. Log in to https://dashboard.stripe.com
2. Go to **Payments** → find the completed order
3. Click the order → copy the **Checkout Session ID** (starts with `cs_test_` or `cs_`)
4. Visit this URL in your browser (replace the placeholders):
   ```
   https://YOUR-SITE.netlify.app/.netlify/functions/generate-setup-script?orderId=cs_XXX&secret=YOUR_ADMIN_SECRET
   ```
   - Replace `cs_XXX` with the actual session ID
   - Replace `YOUR_ADMIN_SECRET` with the value you set for `ADMIN_SECRET` in Netlify

5. A `.sh` file will download automatically
6. Connect the Samsung A12 to your computer via USB and enable **USB Debugging** on the phone
7. Run the script from your terminal:
   ```bash
   chmod +x order-cs_XXX-setup.sh
   ./order-cs_XXX-setup.sh
   ```

The script will disable bloatware and configure the phone with the exact apps the customer selected.

---

## Section 6: Going Live with Stripe (Real Payments)

Once you have tested everything in test mode, switch to live mode to accept real payments.

1. In the Stripe dashboard, toggle from **Test mode** to **Live mode** (top-right corner)
2. Go to **Products** and recreate all the same products and prices in live mode
3. Go to https://dashboard.stripe.com/apikeys and copy the **live** publishable and secret keys
4. In Netlify → **Environment variables**, update:
   - `VITE_STRIPE_PUBLISHABLE_KEY` → live publishable key (`pk_live_...`)
   - `STRIPE_SECRET_KEY` → live secret key (`sk_live_...`)
   - All six `STRIPE_PRICE_*` variables → live Price IDs
5. Set up a new webhook in live mode (repeat Section 4 but with the live mode toggle on)
6. Update `STRIPE_WEBHOOK_SECRET` with the live webhook signing secret
7. Trigger a final redeploy

**Important:** Run one test order with a real card after switching to live mode to confirm everything works end to end.

---

## Section 7: Smoke Test Checklist

After deploying, run through this checklist to confirm the site is working correctly.

- [ ] Home page loads with video/image hero section
- [ ] All 4 profile cards are visible on `/store`
- [ ] App selection form works on `/customize`
- [ ] Stripe test checkout completes with test card `4242 4242 4242 4242` (any future expiry, any CVC)
- [ ] Success page (`/success`) appears after payment
- [ ] Blog loads at `/blog` with all articles listed
- [ ] Individual blog posts open and render correctly
- [ ] `/send-your-phone` form submits without error (check Netlify dashboard → Forms for submissions)
- [ ] `/affiliate` page loads with working sign-up link
- [ ] `/about` page loads correctly
- [ ] `/setup-guide` page loads correctly
- [ ] A non-existent URL (e.g. `/blah`) shows the 404 page

To check Netlify Forms for `/send-your-phone` submissions:
1. Go to Netlify dashboard → **Forms** → select `send-your-phone`

---

## Section 8: Rewardful Setup (Optional Affiliate Programme)

Set this up when you are ready to run an affiliate programme.

1. Sign up at https://rewardful.com
2. Create a **Campaign**:
   - Choose either a percentage commission (e.g. 10%) or a flat discount (e.g. £15)
   - Connect Rewardful to your Stripe account using their guided setup
3. Go to **Settings** in Rewardful and copy your **Client ID** (a short alphanumeric string)
4. In Netlify → **Environment variables**, set:
   - `VITE_REWARDFUL_ID` → your Rewardful Client ID
5. Trigger a redeploy

Affiliates sign up via the link displayed on the `/affiliate` page of your site. They will receive a unique referral link to share, and Rewardful tracks commissions automatically through Stripe.

---

## Need Help?

If anything is unclear or not working, check:

- **Netlify build logs**: Netlify dashboard → Deploys → click the latest deploy
- **Function logs**: Netlify dashboard → Functions → select the function → View logs
- **Stripe logs**: https://dashboard.stripe.com/test/logs (or live logs for production)
- **Stripe webhook logs**: https://dashboard.stripe.com/test/webhooks → select your endpoint → Recent deliveries
