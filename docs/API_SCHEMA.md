# Dog and Bone — API Schema

## Base URL

- **Development**: `http://localhost:8888/.netlify/functions`
- **Production**: `https://your-site.netlify.app/.netlify/functions`

## Authentication

- **Customer-facing endpoints**: No authentication required
- **Admin endpoints**: `?secret=ADMIN_SECRET` query parameter (env var)
- **Stripe webhooks**: Verified via `stripe-signature` header

---

## Endpoints

### POST `/create-checkout-session`

Creates a Stripe Checkout Session for a phone order.

**Request**
```json
{
  "profileId": "essential" | "family" | "senior" | "balance",
  "apps": ["whatsapp", "gmaps", "camera", "calendar"],
  "addons": ["charger", "express-setup"],
  "successUrl": "https://example.com/checkout/success",
  "cancelUrl": "https://example.com/checkout/cancel",
  "referralId": "rewardful_referral_id_or_null"
}
```

**Response `200`**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_xxx..."
}
```

**Response `400`**
```json
{
  "error": "Invalid profileId"
}
```

**Response `500`**
```json
{
  "error": "Failed to create checkout session"
}
```

**Stripe Session Metadata**
```
metadata.profileId = "essential"
metadata.apps = "whatsapp,gmaps,camera,calendar"
metadata.addons = "charger"
```

---

### POST `/stripe-webhook`

Receives Stripe webhook events. Must receive the raw request body for signature verification.

**Headers Required**
```
stripe-signature: t=xxx,v1=xxx,...
Content-Type: application/json
```

**Handled Events**

| Event | Action |
|---|---|
| `checkout.session.completed` | Log order details to console |
| `payment_intent.payment_failed` | Log failure to console |

**Response `200`** — `{ "received": true }`
**Response `400`** — `{ "error": "Webhook signature verification failed" }`

---

### GET `/generate-setup-script`

Generates a per-order ADB bash script. **Admin only.**

**Query Parameters**
```
?orderId=cs_live_xxx&secret=ADMIN_SECRET
```

**Response `200`**
```
Content-Type: application/x-sh
Content-Disposition: attachment; filename="order-cs_xxx-setup.sh"

#!/bin/bash
# Dog and Bone — Order Setup Script
# Order: cs_xxx
# Profile: essential
# Apps: whatsapp, gmaps, camera, calendar
...
```

**Response `401`** — `{ "error": "Unauthorized" }`
**Response `404`** — `{ "error": "Order not found" }`
**Response `500`** — `{ "error": "Failed to generate script" }`

---

## Netlify Form

### Send Your Phone Booking Form

Submitted via standard HTML form with `netlify` attribute. Netlify captures submissions and emails the admin.

**Form Name**: `send-your-phone`

**Fields**
```
name: string (required)
email: string (required, email)
phone: string (required)
phoneModel: string (required)
profileId: "essential" | "family" | "senior" | "balance" (required)
apps: string (comma-separated app IDs)
customApps: string (optional — requested additional apps)
notes: string (optional)
```

**Success redirect**: `/send-your-phone?submitted=true`

---

## Stripe Products Reference

| Product ID | Name | Price |
|---|---|---|
| TBD | Dog and Bone — Essential Profile | £149 |
| TBD | Dog and Bone — Family Profile | £149 |
| TBD | Dog and Bone — Senior Profile | £149 |
| TBD | Dog and Bone — Balance Profile | £149 |
| TBD | USB-C Charger Add-on | £12 |
| TBD | Express Setup Add-on | £15 |
| TBD | Send Your Phone Configuration | £49 |

*Price IDs to be populated after creating products in Stripe dashboard.*
