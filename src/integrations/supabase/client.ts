
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ErrorCategory } from '@/utils/supabaseErrors';

// Define the Supabase project URL and anon key
// Using the project ID from the project information
const SUPABASE_URL = 'https://fzrhweggxusfwrohtvpb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmh3ZWdneHVzZndyb2h0dnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU4MjQsImV4cCI6MjA1OTI4MTgyNH0.W0ocOlTW9Oc4nRytpYByg49B_4pA4lgWoxeSUM0tqdc';

// Create the Supabase client with additional security options
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Detect session from URL query params
  },
  // Add global error handling
  global: {
    fetch: (...args) => {
      // Fixed: Properly type the arguments for fetch
      // Could add request logging/interception here for security monitoring
      return fetch(args[0], args[1]);
    }
  }
});

// Enhanced type guard to check if an error is from Supabase with more detailed error properties
export const isSupabaseError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  
  // Safe type assertion
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
 * Check if the current user is authenticated
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

/**
 * Enhanced authentication check with improved security
 * Throws a standardized error for authentication failures
 * @throws Error with consistent format for authentication failures 
 */
export const checkAuthentication = async (): Promise<void> => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    const authError = new Error('Authentication required. Please sign in to continue.');
    // Add additional context for error handling systems
    (authError as any).category = ErrorCategory.AUTHENTICATION;
    (authError as any).code = 'auth/not-authenticated';
    (authError as any).timestamp = new Date().toISOString();
    throw authError;
  }
};

/**
 * Get the current user's ID with validation
 * @returns User ID if authenticated, null otherwise
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id || null;
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
