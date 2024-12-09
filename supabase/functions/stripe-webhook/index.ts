import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { 
  corsHeaders, 
  logWebhookEvent, 
  createErrorResponse, 
  createSuccessResponse 
} from './utils.ts'
import {
  handleCheckoutSession,
  handlePaymentIntent,
  handleCharge
} from './handlers.ts'

serve(async (request) => {
  console.log('🚀 Webhook function started');
  console.log('Request method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));

  try {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    const signature = request.headers.get('stripe-signature');
    console.log('Stripe signature:', signature ? 'Present' : 'Missing');

    if (!signature) {
      return createErrorResponse('No Stripe signature found in request headers');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');
    if (!webhookSecret) {
      return createErrorResponse('Webhook secret not configured');
    }

    const body = await request.text();
    console.log('📝 Request body received');
    console.log('Body length:', body.length);
    console.log('Raw body preview:', body.substring(0, 200) + '...');

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Event constructed successfully');
      logWebhookEvent(event);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return createErrorResponse(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSession(event.data.object);
        break;

      case 'charge.succeeded':
        await handleCharge(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntent(event.data.object, 'completed');
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntent(event.data.object, 'failed');
        break;

      default:
        console.log('⚠️ Unhandled event type:', event.type);
    }

    console.log('✅ Webhook processing completed successfully');
    return createSuccessResponse();

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    console.error('Error stack:', error.stack);
    return createErrorResponse(error.message);
  }
});