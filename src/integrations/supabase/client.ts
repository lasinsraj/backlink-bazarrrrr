// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rsgdmshodeqrgoqnfjvh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZ2Rtc2hvZGVxcmdvcW5manZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzODU1MzcsImV4cCI6MjA0Nzk2MTUzN30.k8f5iyDPLcoLJkdl6qlXT0OMO-qBruICdwzGrp4wxfI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);