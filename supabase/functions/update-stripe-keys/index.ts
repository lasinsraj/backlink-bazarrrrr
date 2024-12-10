import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      throw new Error('Missing Supabase configuration')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Invalid token:', authError)
      throw new Error('Invalid token')
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      console.error('User is not admin:', profileError)
      throw new Error('Unauthorized')
    }

    // Get the keys from request body
    const { publishableKey, secretKey, webhookSecret } = await req.json()

    if (!publishableKey || !secretKey || !webhookSecret) {
      console.error('Missing required keys')
      throw new Error('Missing required keys')
    }

    // Update secrets using the Management API
    const managementApiUrl = `${supabaseUrl}/functions/v1/secrets`
    const secrets = [
      { name: 'STRIPE_SECRET_KEY', value: secretKey },
      { name: 'STRIPE_WEBHOOK_SIGNING_SECRET', value: webhookSecret }
    ]

    console.log('Attempting to update Stripe secrets')

    for (const secret of secrets) {
      const response = await fetch(managementApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(secret)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Failed to update ${secret.name}:`, errorText)
        throw new Error(`Failed to update ${secret.name}`)
      }
    }

    console.log('Successfully updated Stripe configuration')

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error updating Stripe keys:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})