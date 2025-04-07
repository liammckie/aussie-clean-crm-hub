
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
  
  useEffect(() => {
    if (!enabled) return;
    
    let retryTimeoutId: number | undefined;
    let channel: RealtimeChannel | null = null;

    const setupChannel = () => {
      try {
        // Generate unique channel name with timestamp to avoid conflicts
        const channelName = `${table}-changes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        AppLogger.debug(LogCategory.REALTIME, `Setting up realtime sync for ${table}`, { channelName });
        
        channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
              schema,
              table
            },
            (payload) => {
              AppLogger.debug(LogCategory.REALTIME, `Realtime sync: ${payload.eventType} in ${table}`, payload);
              
              // Add breadcrumb for debugging
              ErrorReporting.addBreadcrumb({
                category: 'realtime',
                message: `${payload.eventType} in ${table}`,
                level: 'info',
                data: {
                  table,
                  operation: payload.eventType,
                  record: payload.new || payload.old
                }
              });
              
              // Invalidate the relevant queries
              queryClient.invalidateQueries({ queryKey: queryKeyArray });
              
              // Call custom handler if provided
              if (onDataChange) {
                onDataChange(payload);
              }
            }
          )
          .subscribe((status) => {
            AppLogger.debug(LogCategory.REALTIME, `Realtime subscription status for ${table}: ${status}`);
            
            if (status === 'SUBSCRIBED') {
              AppLogger.info(LogCategory.REALTIME, `Realtime sync enabled for ${table}`);
            } else if (status === 'CHANNEL_ERROR') {
              AppLogger.error(LogCategory.REALTIME, `Error subscribing to ${table} changes`);
              
              // Only show toast on final retry and if not in quiet mode
              if (retries >= maxRetries && !quietMode) {
                toast.error(`Failed to establish real-time connection`, {
                  description: `Updates to ${table} may not appear automatically. Try refreshing the page.`
                });
                
                ErrorReporting.captureMessage(
                  `Failed to subscribe to real-time updates for ${table} after ${retries} attempts`,
                  { table, schema },
                  'error'
                );
              } else if (retries < maxRetries) {
                // Retry with exponential backoff
                const retryDelay = Math.min(1000 * Math.pow(2, retries), 10000);
                AppLogger.info(LogCategory.REALTIME, `Will retry ${table} subscription in ${retryDelay}ms (attempt ${retries + 1})`);
                
                retryTimeoutId = window.setTimeout(() => {
                  if (channel) {
                    supabase.removeChannel(channel);
                  }
                  setupChannel(); // Retry setup
                }, retryDelay);
              }
            }
          });
          
        channelRef.current = channel;
        return channel;
      } catch (error) {
        AppLogger.error(LogCategory.ERROR, 'Error setting up realtime sync:', error);
        
        ErrorReporting.captureException(
          error instanceof Error ? error : new Error(`Failed to set up real-time sync for ${table}`),
          { table, schema }
        );
        return null;
      }
    };

    // Initial setup
    channel = setupChannel();

    // Cleanup function
    return () => {
      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId);
      }
      
      if (channel) {
        AppLogger.debug(LogCategory.REALTIME, `Removing realtime subscription for ${table}`);
        supabase.removeChannel(channel);
      }
    };
  }, [table, schema, queryKeyArray.join(','), enabled, queryClient, onDataChange, retries, maxRetries, quietMode]);
  
  return channelRef.current;
}

/**
 * Hook to synchronize the clients list in real-time
 */
export function useClientsRealtimeSync() {
  return useRealtimeSync({
    table: 'clients',
    queryKey: ['clients'],
    // Use quiet mode to reduce error messages in the UI for non-critical updates
    quietMode: true
  });
}

/**
 * Hook to synchronize a specific client's data in real-time
 */
export function useClientRealtimeSync(clientId?: string) {
  return useRealtimeSync({
    table: 'clients',
    queryKey: ['client', clientId],
    enabled: !!clientId
  });
}

/**
 * Hook to synchronize client contacts in real-time
 */
export function useClientContactsRealtimeSync(clientId?: string) {
  return useRealtimeSync({
    table: 'client_contacts',
    queryKey: ['client', clientId, 'contacts'],
    enabled: !!clientId
  });
}

/**
 * Hook to synchronize client addresses in real-time
 */
export function useClientAddressesRealtimeSync(clientId?: string) {
  return useRealtimeSync({
    table: 'client_addresses',
    queryKey: ['client', clientId, 'addresses'],
    enabled: !!clientId
  });
}

/**
 * Hook to synchronize unified addresses in real-time
 */
export function useUnifiedAddressesRealtimeSync(entityType?: string, entityId?: string) {
  const queryKey = entityType && entityId 
    ? ['unified-addresses', entityType, entityId]
    : ['unified-addresses'];
  
  return useRealtimeSync({
    table: 'unified_addresses',
    queryKey,
    enabled: true,
    quietMode: true
  });
}

/**
 * Hook to synchronize unified contacts in real-time
 */
export function useUnifiedContactsRealtimeSync(entityType?: string, entityId?: string) {
  const queryKey = entityType && entityId 
    ? ['unified-contacts', entityType, entityId]
    : ['unified-contacts'];
  
  return useRealtimeSync({
    table: 'unified_contacts',
    queryKey,
    enabled: true,
    quietMode: true
  });
}
