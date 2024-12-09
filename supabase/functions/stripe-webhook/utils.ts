export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const logWebhookEvent = (event: any) => {
  console.log('🎯 Processing webhook event:', {
    type: event.type,
    id: event.id,
    created: new Date(event.created * 1000).toISOString(),
  });
};

export const createErrorResponse = (message: string, status = 400) => {
  console.error('❌ Error:', message);
  return new Response(
    JSON.stringify({ error: message }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status 
    }
  );
};

export const createSuccessResponse = (data: any = { received: true }) => {
  console.log('✅ Success response:', data);
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
};