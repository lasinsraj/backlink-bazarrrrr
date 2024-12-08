import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (request) => {
  console.log('Webhook endpoint hit!', new Date().toISOString());
  console.log('Request method:', request.method);

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = request.headers.get('Stripe-Signature');
    console.log('Stripe signature present:', !!signature);
    
    if (!signature) {
      console.error('No Stripe signature found in request headers');
      throw new Error('No signature found');
    }

    const body = await request.text();
    console.log('Request body length:', body.length);
    
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('Stripe initialized, verifying webhook signature...');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');
    console.log('Webhook secret present:', !!webhookSecret);
    
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret || '',
        undefined,
        undefined
      );
      console.log('Event constructed successfully:', event.type);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Processing event type: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session ID:', session.id);
      
      // Get the metadata from the session
      const metadata = session.metadata;
      console.log('Session metadata:', metadata);

      if (!metadata?.userId || !metadata?.productId) {
        console.error('Missing required metadata:', metadata);
        throw new Error('Missing required metadata in session');
      }

      // Initialize Supabase client
      console.log('Initializing Supabase client...');
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      console.log('Supabase credentials present:', !!supabaseUrl && !!supabaseKey);

      const supabase = createClient(
        supabaseUrl || '',
        supabaseKey || ''
      );

      console.log('Creating order in database...');
      
      // Create the order
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
    }

    return new Response(JSON.stringify({ success: true }), {
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