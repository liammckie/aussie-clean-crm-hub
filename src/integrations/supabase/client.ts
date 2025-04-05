
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define the Supabase project URL and anon key
// Using the project ID from the project information
const SUPABASE_URL = 'https://fzrhweggxusfwrohtvpb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmh3ZWdneHVzZndyb2h0dnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU4MjQsImV4cCI6MjA1OTI4MTgyNH0.W0ocOlTW9Oc4nRytpYByg49B_4pA4lgWoxeSUM0tqdc';

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Enhanced type guard to check if an error is from Supabase with more detailed error properties
export const isSupabaseError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  
  // Check for common properties in Supabase error objects
  const possibleError = error as Record<string, unknown>;
  
  // PostgreSQL error codes (e.g. "23505" for unique violation)
  if ('code' in possibleError) return true;
  
  // Error message
  if ('message' in possibleError) return true;
  
  // General error description
  if ('error' in possibleError) return true;
  
  // Detailed error information
  if ('details' in possibleError || 'hint' in possibleError) return true;
  
  // Error message in different format
  if ('errorMessage' in possibleError) return true;
  
  // Check for RLS policy violation which has a specific pattern
  if ('msg' in possibleError && typeof possibleError.msg === 'string') {
    const msgStr = possibleError.msg as string;
    if (msgStr.includes('row-level security')) return true;
  }
  
  // Check for auth-related errors
  if ('status' in possibleError && 'message' in possibleError) {
    return true;
  }
  
  return false;
};

/**
 * Log Supabase API requests in development mode
 */
export function setupSupabaseInterceptor(client: SupabaseClient) {
  // Only setup in development
  if (typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.PROD) {
    // @ts-ignore - Accessing private members for debug purposes
    if (client._logDebug) {
      console.log('Supabase debug logging already enabled');
      return client;
    }
    
    // @ts-ignore - Enable debug logging
    client._logDebug = true;
    
    console.log('Supabase debug logging enabled');
  }
  
  return client;
}

// Setup debug interceptor in development
setupSupabaseInterceptor(supabase);
