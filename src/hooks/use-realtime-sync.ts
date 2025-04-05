import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';

type SyncConfig = {
  table: string;
  schema?: string;
  queryKey: string | string[];
  enabled?: boolean;
  onDataChange?: (payload: any) => void;
  retries?: number;
  maxRetries?: number;
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
    maxRetries = 3
  } = config;
  
  const queryClient = useQueryClient();
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  useEffect(() => {
    if (!enabled) return;
    
    let channel: RealtimeChannel | null = null;

    try {
      channel = supabase
        .channel(`${table}-changes-${Date.now()}`) // Use unique channel name to avoid conflicts
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
            schema,
            table
          },
          (payload) => {
            console.log(`Realtime sync: ${payload.eventType} in ${table}`, payload);
            
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
          console.log(`Realtime subscription status for ${table}:`, status);
          
          if (status === 'SUBSCRIBED') {
            console.log(`Realtime sync enabled for ${table}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`Error subscribing to ${table} changes`);
            
            // Only show toast on final retry
            if (retries >= maxRetries) {
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
              console.log(`Will retry ${table} subscription in ${retryDelay}ms (attempt ${retries + 1})`);
              
              setTimeout(() => {
                useRealtimeSync({...config, retries: retries + 1, maxRetries});
              }, retryDelay);
            }
          }
        });
    } catch (error) {
      console.error('Error setting up realtime sync:', error);
      
      ErrorReporting.captureException(
        error instanceof Error ? error : new Error(`Failed to set up real-time sync for ${table}`),
        { table, schema }
      );
    }

    // Cleanup function
    return () => {
      if (channel) {
        console.log(`Removing realtime subscription for ${table}`);
        supabase.removeChannel(channel);
      }
    };
  }, [table, schema, queryKeyArray.join(','), enabled, queryClient, onDataChange, retries, maxRetries]);
}

/**
 * Hook to synchronize the clients list in real-time
 */
export function useClientsRealtimeSync() {
  return useRealtimeSync({
    table: 'clients',
    queryKey: ['clients']
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
