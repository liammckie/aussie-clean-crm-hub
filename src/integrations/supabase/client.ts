
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Default values for local development
const DEFAULT_SUPABASE_URL = 'https://your-project.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-anon-key';

// Get URL and key from environment variables
let supabaseUrl: string;
let supabaseAnonKey: string;

// Check if import.meta is available (browser environment)
if (typeof import.meta !== 'undefined' && import.meta.env) {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
} else {
  // Fallback for environments where import.meta is not available
  supabaseUrl = process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Type guard to check if an error is from Supabase
export const isSupabaseError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  
  // Check for common properties in Supabase error objects
  return (
    'code' in error || 
    'message' in error || 
    'error' in error || 
    'details' in error ||
    'hint' in error ||
    'errorMessage' in error
  );
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
