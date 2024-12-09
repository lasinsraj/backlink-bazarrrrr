import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (request) => {
  try {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    const signature = request.headers.get('stripe-signature');
    console.log('Webhook received with signature:', signature ? 'Present' : 'Missing');

    if (!signature) {
      throw new Error('No Stripe signature found in request headers');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured in environment variables');
    }

    const body = await request.text();
    console.log('Request body received, length:', body.length);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Event constructed successfully:', event.type);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Processing completed checkout session:', session.id);
        
        const metadata = session.metadata;
        console.log('Session metadata:', metadata);

        if (!metadata?.userId || !metadata?.productId) {
          throw new Error('Missing required metadata in session');
        }

        // Create order in database
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: metadata.userId,
            product_id: metadata.productId,
            payment_status: 'completed',
            status: 'pending',
            stripe_session_id: session.id,
            keywords: metadata.keywords || null,
            target_url: metadata.targetUrl || null
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating order:', orderError);
          throw orderError;
        }

        console.log('Order created successfully:', order);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object;
        console.log('Charge succeeded:', charge.id);
        
        // Update order payment status if needed
        if (charge.payment_intent) {
          const { data: sessions, error: sessionsError } = await supabase
            .from('orders')
            .select('id')
            .eq('stripe_session_id', charge.payment_intent);

          if (sessionsError) {
            console.error('Error finding order:', sessionsError);
            throw sessionsError;
          }

          if (sessions && sessions.length > 0) {
            const { error: updateError } = await supabase
              .from('orders')
              .update({ payment_status: 'completed' })
              .eq('stripe_session_id', charge.payment_intent);

            if (updateError) {
              console.error('Error updating order payment status:', updateError);
              throw updateError;
            }
            console.log('Order payment status updated to completed');
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        
        const { error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: 'completed' })
          .eq('stripe_session_id', paymentIntent.id);

        if (updateError) {
          console.error('Error updating order payment status:', updateError);
          throw updateError;
        }
        console.log('Order payment status updated for payment intent:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);
        
        const { error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('stripe_session_id', paymentIntent.id);

        if (updateError) {
          console.error('Error updating order payment status:', updateError);
          throw updateError;
        }
        console.log('Order payment status updated to failed');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});