import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')

  try {
    const body = await request.text()
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined,
      undefined
    )

    console.log(`Event received: ${receivedEvent.id}`)

    // Handle successful payment
    if (receivedEvent.type === 'checkout.session.completed') {
      const session = receivedEvent.data.object as Stripe.Checkout.Session
      const metadata = session.metadata
      
      if (!metadata?.userId || !metadata?.productId) {
        throw new Error('Missing required metadata')
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      // Create the order after successful payment
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: metadata.userId,
          product_id: metadata.productId,
          payment_status: 'completed',
          status: 'completed',
          stripe_session_id: session.id
        })

      if (orderError) {
        console.error('Error creating order:', orderError)
        throw orderError
      }

      console.log('Order created successfully')
    }

    return new Response(JSON.stringify({ ok: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to process webhook' }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})