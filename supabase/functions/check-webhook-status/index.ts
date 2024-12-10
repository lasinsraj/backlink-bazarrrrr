import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the Stripe secret key from environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('Stripe secret key not found')
      throw new Error('Stripe configuration missing')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    })

    let body;
    try {
      body = await req.json()
    } catch (e) {
      console.error('Error parsing request body:', e)
      throw new Error('Invalid request body')
    }

    const { webhookUrl } = body
    if (!webhookUrl) {
      throw new Error('Webhook URL is required')
    }

    console.log('Checking webhook status for URL:', webhookUrl)

    // Get all webhook endpoints
    const webhookEndpoints = await stripe.webhookEndpoints.list()
    console.log('Found webhook endpoints:', webhookEndpoints.data.length)
    
    // Check if our webhook URL is configured and enabled
    const webhook = webhookEndpoints.data.find(
      endpoint => endpoint.url === webhookUrl
    )

    console.log('Webhook status:', webhook ? 'found' : 'not found')

    if (webhook && webhook.status === 'enabled') {
      return new Response(
        JSON.stringify({
          active: true,
          message: 'Webhook is properly configured and active',
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    return new Response(
      JSON.stringify({
        active: false,
        message: webhook 
          ? 'Webhook exists but is not enabled'
          : 'Webhook is not configured',
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error checking webhook status:', error)
    return new Response(
      JSON.stringify({
        active: false,
        message: error.message || 'Failed to check webhook status',
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400,
      }
    )
  }
})