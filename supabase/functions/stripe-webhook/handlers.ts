import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from './utils';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

export const handleCheckoutSession = async (session: any) => {
  console.log('💳 Processing checkout session:', session.id);
  console.log('Session metadata:', session.metadata);

  const metadata = session.metadata;
  if (!metadata?.userId || !metadata?.productId) {
    throw new Error('Missing required metadata in session');
  }

  console.log('Creating order in database...');
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

  console.log('✅ Order created successfully:', order);
  return order;
};

export const handlePaymentIntent = async (paymentIntent: any, status: 'completed' | 'failed') => {
  console.log(`💰 Payment intent ${status}:`, paymentIntent.id);
  
  const { error: updateError } = await supabase
    .from('orders')
    .update({ payment_status: status })
    .eq('stripe_session_id', paymentIntent.id);

  if (updateError) {
    console.error('Error updating order payment status:', updateError);
    throw updateError;
  }

  console.log(`✅ Order payment status updated to ${status}`);
};

export const handleCharge = async (charge: any) => {
  console.log('💳 Processing charge:', charge.id);
  console.log('Payment intent:', charge.payment_intent);
  
  if (charge.payment_intent) {
    const { data: sessions, error: sessionsError } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', charge.payment_intent);

    if (sessionsError) {
      console.error('Error finding order:', sessionsError);
      throw sessionsError;
    }

    console.log('Found orders:', sessions);

    if (sessions && sessions.length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'completed' })
        .eq('stripe_session_id', charge.payment_intent);

      if (updateError) {
        console.error('Error updating order payment status:', updateError);
        throw updateError;
      }
      console.log('✅ Order payment status updated to completed');
    }
  }
};