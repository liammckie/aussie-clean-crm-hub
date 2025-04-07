
import { createClient } from '@supabase/supabase-js';
import { AppLogger, LogCategory } from '@/utils/logging';

// Create a single supabase client for the entire application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log initialization
AppLogger.debug(LogCategory.SYSTEM, `Initializing Supabase client with URL: ${supabaseUrl}`);

// Use a singleton pattern to ensure we only create one instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // Detect session from URL query params
      },
    });
    AppLogger.debug(LogCategory.SYSTEM, 'Supabase client initialized');
  }
  return supabaseInstance;
};

// Export the singleton instance for backward compatibility
export const supabase = getSupabaseClient();
