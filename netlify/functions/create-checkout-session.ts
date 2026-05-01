import type { Handler, HandlerEvent } from '@netlify/functions'
import { stripe } from './utils/stripe-client'
import { CORS_HEADERS, handleOptions } from './utils/cors'
import { PROFILES } from '../../src/data/profiles'

const PRICE_IDS: Record<string, string> = Object.fromEntries(
  PROFILES.map((p) => [p.id, p.stripePriceId]),
)

interface Contact {
  name: string
  phone: string
}

interface CheckoutRequestBody {
  profileId: string
  apps: string[]
  successUrl: string
  cancelUrl: string
  referralId: string | null
  seniorContacts?: Contact[]
  familyEmergencyContact?: Contact | null
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

  const {
    profileId,
    apps,
    successUrl,
    cancelUrl,
    referralId,
    seniorContacts,
    familyEmergencyContact,
  } = body

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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      metadata: {
        profileId,
        apps: Array.isArray(apps) ? apps.join(',') : '',
        endorsely_referral: referralId || '',
        seniorContacts: seniorContacts ? JSON.stringify(seniorContacts) : '',
        familyEmergencyContact: familyEmergencyContact
          ? JSON.stringify(familyEmergencyContact)
          : '',
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
