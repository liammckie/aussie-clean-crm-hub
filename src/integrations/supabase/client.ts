// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://predtpiopoxrnijtdclt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZWR0cGlvcG94cm5panRkY2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMDc4MzIsImV4cCI6MjA1ODY4MzgzMn0.U91qHIIDTTe3omk01FyAb_ljkP5v_kvxXGwMClxQ7no";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);