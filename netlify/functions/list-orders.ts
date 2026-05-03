import type { Handler, HandlerEvent } from '@netlify/functions'
import { stripe } from './utils/stripe-client'
import { CORS_HEADERS } from './utils/cors'

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const params = event.queryStringParameters ?? {}
  const { secret, limit = '50' } = params

  // Auth check
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Unauthorized' }),
    }
  }

  try {
    // Fetch recent checkout sessions (last 50)
    const sessions = await stripe.checkout.sessions.list({
      limit: parseInt(limit),
      expand: ['data.customer'],
    })

    // Transform to simpler format
    const orders = sessions.data.map((session) => ({
      id: session.id,
      created: session.created,
      amount: session.amount_total || 0,
      currency: session.currency || 'gbp',
      status: session.payment_status,
      customerEmail: session.customer_details?.email || 'N/A',
      customerName: session.customer_details?.name || 'N/A',
      profileId: session.metadata?.profileId || 'unknown',
      apps: session.metadata?.apps || '',
      seniorContacts: session.metadata?.seniorContacts || '[]',
      familyEmergencyContact: session.metadata?.familyEmergencyContact || 'null',
      wifiSsid: session.metadata?.wifiSsid || '',
      customAppsRequest: session.metadata?.customAppsRequest || '',
    }))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ orders }),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch orders'
    console.error('Stripe list sessions error:', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: message }),
    }
  }
}
