import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const { webhookUrl } = await req.json()

    // Get all webhook endpoints
    const webhookEndpoints = await stripe.webhookEndpoints.list()
    
    // Check if our webhook URL is configured and enabled
    const webhook = webhookEndpoints.data.find(
      endpoint => endpoint.url === webhookUrl
    )

    if (webhook && webhook.status === 'enabled') {
      return new Response(
        JSON.stringify({
          active: true,
          message: 'Webhook is properly configured and active',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        active: false,
        message: webhook 
          ? 'Webhook exists but is not enabled'
          : 'Webhook is not configured',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error checking webhook status:', error)
    return new Response(
      JSON.stringify({
        active: false,
        message: error.message,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})