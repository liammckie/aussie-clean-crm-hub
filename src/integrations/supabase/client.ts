// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fzrhweggxusfwrohtvpb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmh3ZWdneHVzZndyb2h0dnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU4MjQsImV4cCI6MjA1OTI4MTgyNH0.W0ocOlTW9Oc4nRytpYByg49B_4pA4lgWoxeSUM0tqdc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);