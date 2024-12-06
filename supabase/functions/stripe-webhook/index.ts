import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

Deno.serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')

  try {
    const body = await request.text()
    const receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined,
      cryptoProvider
    )

    console.log(`Event received: ${receivedEvent.id}`)

    // Handle successful payment
    if (receivedEvent.type === 'checkout.session.completed') {
      const session = receivedEvent.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId

      if (orderId) {
        // Update order status and payment status
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'completed',
            status: 'processing'
          })
          .eq('id', orderId)

        if (error) {
          console.error('Error updating order:', error)
          return new Response(JSON.stringify({ error: 'Failed to update order' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }
    }

    return new Response(JSON.stringify({ ok: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to process webhook' }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})