import type { Handler, HandlerEvent } from '@netlify/functions'
import Stripe from 'stripe'
import { stripe } from './utils/stripe-client'

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const sig = event.headers['stripe-signature']

  if (!sig) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing stripe-signature header' }),
    }
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body ?? '', 'base64').toString('utf-8')
    : (event.body ?? '')

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('Webhook signature error:', message)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook error: ${message}` }),
    }
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      console.log('Order completed:', {
        sessionId: session.id,
        profileId: session.metadata?.profileId,
        apps: session.metadata?.apps,
        addons: session.metadata?.addons,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      })
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
      console.error('Payment failed:', {
        paymentIntentId: paymentIntent.id,
        lastError: paymentIntent.last_payment_error?.message,
        amount: paymentIntent.amount,
      })
      break
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  }
}
