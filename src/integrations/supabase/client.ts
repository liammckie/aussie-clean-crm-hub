
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fzrhweggxusfwrohtvpb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmh3ZWdneHVzZndyb2h0dnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU4MjQsImV4cCI6MjA1OTI4MTgyNH0.W0ocOlTW9Oc4nRytpYByg49B_4pA4lgWoxeSUM0tqdc";

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL');
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing SUPABASE_PUBLISHABLE_KEY');
}

// Initialize the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Helper function to check if an error is a Supabase error
export function isSupabaseError(error: unknown): error is { message: string; code: string } {
  return Boolean(
    error && 
    typeof error === 'object' && 
    'message' in error && 
    'code' in error
  );
}

// Export auth-related utilities
export const auth = {
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  },
  
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session;
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
  }
};
