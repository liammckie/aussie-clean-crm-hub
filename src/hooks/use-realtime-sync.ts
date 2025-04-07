
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';

type SyncConfig = {
  table: string;
  schema?: string;
  queryKey: string | string[];
  enabled?: boolean;
  onDataChange?: (payload: any) => void;
  retries?: number;
  maxRetries?: number;
  quietMode?: boolean;
};

/**
 * Hook to synchronize data in real-time using Supabase Realtime
 * 
 * @param config Configuration for the real-time sync
 * @deprecated Realtime sync is temporarily disabled
 */
export function useRealtimeSync(config: SyncConfig) {
  const { 
    table, 
    schema = 'public', 
    queryKey, 
    enabled = true,
    onDataChange,
    retries = 0,
    maxRetries = 3,
    quietMode = false
  } = config;
  
  const queryClient = useQueryClient();
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // Note: Realtime sync is temporarily disabled
  // This hook maintains its API surface for compatibility
  // but does not actually setup realtime connections
  
  useEffect(() => {
    // Realtime disabled - just log the attempted configuration
    AppLogger.debug(LogCategory.REALTIME, `Realtime sync for ${table} requested but disabled`, { 
      table, 
      queryKey: queryKeyArray
    });
    
    return () => {
      // Nothing to clean up
    };
  }, [table, schema, queryKeyArray.join(','), enabled]);
  
  return null; // Return null since no channel is created
}

/**
 * Hook to synchronize the clients list in real-time
 * @deprecated Realtime sync is temporarily disabled
 */
export function useClientsRealtimeSync() {
  // Return a no-op hook
  return null;
}

/**
 * Hook to synchronize a specific client's data in real-time
 * @deprecated Realtime sync is temporarily disabled
 */
export function useClientRealtimeSync(clientId?: string) {
  // Return a no-op hook
  return null;
}

/**
 * Hook to synchronize client contacts in real-time
 * @deprecated Realtime sync is temporarily disabled
 */
export function useClientContactsRealtimeSync(clientId?: string) {
  // Return a no-op hook
  return null;
}

/**
 * Hook to synchronize client addresses in real-time
 * @deprecated Realtime sync is temporarily disabled
 */
export function useClientAddressesRealtimeSync(clientId?: string) {
  // Return a no-op hook
  return null;
}

/**
 * Hook to synchronize unified addresses in real-time
 * @deprecated Realtime sync is temporarily disabled
 */
export function useUnifiedAddressesRealtimeSync(entityType?: string, entityId?: string) {
  // Return a no-op hook
  return null;
}

/**
 * Hook to synchronize unified contacts in real-time
 * @deprecated Realtime sync is temporarily disabled
 */
export function useUnifiedContactsRealtimeSync(entityType?: string, entityId?: string) {
  // Return a no-op hook
  return null;
}
