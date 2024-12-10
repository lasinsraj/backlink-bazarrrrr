import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://rsgdmshodeqrgoqnfjvh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZ2Rtc2hvZGVxcmdvcW5manZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzODU1MzcsImV4cCI6MjA0Nzk2MTUzN30.k8f5iyDPLcoLJkdl6qlXT0OMO-qBruICdwzGrp4wxfI";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  }
});

// Add error handling for fetch operations
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    if (!response.ok) {
      console.error('Fetch error:', {
        status: response.status,
        statusText: response.statusText,
        url: args[0]
      });
    }
    return response;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};