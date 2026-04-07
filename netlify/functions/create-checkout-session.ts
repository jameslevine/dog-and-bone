import type { Handler, HandlerEvent } from '@netlify/functions'
import { stripe } from './utils/stripe-client'
import { CORS_HEADERS, handleOptions } from './utils/cors'
import { PROFILES, ADDONS } from '../../src/data/profiles'

const PRICE_IDS: Record<string, string> = Object.fromEntries(
  PROFILES.map((p) => [p.id, p.stripePriceId]),
)

const ADDON_PRICE_IDS: Record<string, string> = Object.fromEntries(
  ADDONS.map((a) => [a.id, a.stripePriceId]),
)

interface CheckoutRequestBody {
  profileId: string
  apps: string[]
  addons: string[]
  successUrl: string
  cancelUrl: string
  referralId: string | null
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions()
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  let body: CheckoutRequestBody

  try {
    if (!event.body) {
      throw new Error('Missing request body')
    }
    body = JSON.parse(event.body) as CheckoutRequestBody
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    }
  }

  const { profileId, apps, addons, successUrl, cancelUrl, referralId } = body

  if (!profileId || !PRICE_IDS[profileId]) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: `Invalid profileId: ${profileId}` }),
    }
  }

  if (!successUrl || !cancelUrl) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'successUrl and cancelUrl are required' }),
    }
  }

  try {
    const lineItems: { price: string; quantity: number }[] = [
      { price: PRICE_IDS[profileId], quantity: 1 },
    ]

    if (Array.isArray(addons)) {
      for (const addonId of addons) {
        const addonPrice = ADDON_PRICE_IDS[addonId]
        if (addonPrice) {
          lineItems.push({ price: addonPrice, quantity: 1 })
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      metadata: {
        profileId,
        apps: Array.isArray(apps) ? apps.join(',') : '',
        addons: Array.isArray(addons) ? addons.join(',') : '',
      },
      client_reference_id: referralId || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
    })

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ url: session.url }),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('Stripe checkout session error:', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: message }),
    }
  }
}
