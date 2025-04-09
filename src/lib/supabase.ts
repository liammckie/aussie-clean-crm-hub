
// Re-export Supabase client from the integrations folder
// This file exists for backward compatibility
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';

// Log the re-export to help track usage patterns
AppLogger.debug(LogCategory.SYSTEM, 'Using supabase client via backward compatibility import (src/lib/supabase.ts)');

export const supabase = supabaseClient;
export const getSupabaseClient = () => supabaseClient;
