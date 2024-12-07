import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

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
    // Check for Stripe secret key
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not set')
      throw new Error('Stripe configuration error')
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2022-11-15',
    })

    // Get Supabase configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing')
      throw new Error('Supabase configuration error')
    }

    // Create Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '')
    console.log('Verifying token...')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError) {
      console.error('Auth error:', authError)
      throw new Error('Invalid token')
    }
    
    if (!user) {
      console.error('No user found')
      throw new Error('User not found')
    }

    console.log('User authenticated:', user.email)

    // Get customer for the authenticated user
    console.log('Fetching Stripe customer...')
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })

    if (req.method === 'GET') {
      // List payment methods
      if (customers.data.length === 0) {
        console.log('No Stripe customer found for user')
        return new Response(
          JSON.stringify({ paymentMethods: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Fetching payment methods for customer:', customers.data[0].id)
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customers.data[0].id,
        type: 'card',
      })

      console.log('Retrieved payment methods:', paymentMethods.data.length)

      return new Response(
        JSON.stringify({ paymentMethods: paymentMethods.data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    
    if (req.method === 'DELETE') {
      const { paymentMethodId } = await req.json()
      
      if (!paymentMethodId) {
        throw new Error('Payment method ID is required')
      }

      console.log('Deleting payment method:', paymentMethodId)
      await stripe.paymentMethods.detach(paymentMethodId)
      console.log('Successfully deleted payment method:', paymentMethodId)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error(`Method ${req.method} not allowed`)
  } catch (error) {
    console.error('Error in manage-payment-methods:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})