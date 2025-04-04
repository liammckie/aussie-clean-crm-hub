
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { ErrorCategory, handleSupabaseError } from '@/utils/supabaseErrors';
import { ErrorReporting } from '@/utils/errorReporting';

// Supabase configuration
const SUPABASE_URL = "https://fzrhweggxusfwrohtvpb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmh3ZWdneHVzZndyb2h0dnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU4MjQsImV4cCI6MjA1OTI4MTgyNH0.W0ocOlTW9Oc4nRytpYByg49B_4pA4lgWoxeSUM0tqdc";

/**
 * Supabase Client Configuration
 */
const SUPABASE_CONFIG = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    debug: import.meta.env.DEV // Enable debug logs in development
  },
  global: {
    headers: { 
      'x-client-info': `aussie-clean-erp/${import.meta.env.VITE_APP_VERSION || 'dev'}`
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};

// Validate configuration
if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL');
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing SUPABASE_PUBLISHABLE_KEY');
}

// Initialize the Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  SUPABASE_CONFIG
);

// Log initialization status
if (import.meta.env.DEV) {
  console.log(`Supabase client initialized with URL: ${SUPABASE_URL}`);
}

// Add monitoring for critical operations
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    ErrorReporting.setUser(session?.user ? {
      id: session.user.id,
      email: session.user.email || undefined,
    } : null);
    
    ErrorReporting.addBreadcrumb({
      category: 'auth',
      message: 'User signed in',
      level: 'info'
    });
  } else if (event === 'SIGNED_OUT') {
    ErrorReporting.setUser(null);
    
    ErrorReporting.addBreadcrumb({
      category: 'auth',
      message: 'User signed out',
      level: 'info'
    });
  }
});

/**
 * Helper function to check if an error is a Supabase error
 */
export function isSupabaseError(error: unknown): error is { message: string; code: string } {
  return Boolean(
    error && 
    typeof error === 'object' && 
    'message' in error && 
    'code' in error
  );
}

/**
 * Extended authentication functions with better error handling
 */
export const auth = {
  /**
   * Get the current user session
   * @returns The current user session or null if not authenticated
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return data.session;
    } catch (error) {
      handleSupabaseError(error, 'Failed to get user session', { operation: 'getSession' });
      return null;
    }
  },

  /**
   * Get the current user
   * @returns The current user or null if not authenticated
   */
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data.user;
    } catch (error) {
      handleSupabaseError(error, 'Failed to get current user', { operation: 'getCurrentUser' });
      return null;
    }
  },
  
  /**
   * Sign out the current user
   * @returns True if sign out was successful, false otherwise
   */
  signOut: async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return true;
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign out', { operation: 'signOut' });
      return false;
    }
  }
};
