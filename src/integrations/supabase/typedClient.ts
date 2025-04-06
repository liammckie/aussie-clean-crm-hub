
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Create a strongly typed Supabase client
 * @param supabaseUrl Supabase project URL
 * @param supabaseAnonKey Supabase anonymous key
 * @returns Typed Supabase client
 */
export const createTypedSupabaseClient = (
  supabaseUrl: string,
  supabaseAnonKey: string
) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};

// Export empty database type for use in other files
export type { Database } from '@/types/supabase';

// Export typed client types for convenience
export type TypedSupabaseClient = ReturnType<typeof createTypedSupabaseClient>;
