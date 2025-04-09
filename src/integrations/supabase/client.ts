
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { AppLogger, LogCategory } from '@/utils/logging';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  AppLogger.error(LogCategory.SYSTEM, 'Missing Supabase environment variables');
  console.error(
    'Error initializing Supabase client: Missing environment variables. ' +
    'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined.'
  );
}

// Create and export the supabase client with TypeScript support
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Create a typed version of the supabase client for better type safety
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export a function to get the supabase client
export const getSupabaseClient = () => supabase;

// Log when the client is imported
AppLogger.debug(LogCategory.SYSTEM, 'Supabase client initialized');
