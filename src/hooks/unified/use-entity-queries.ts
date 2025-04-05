
import { useQuery } from '@tanstack/react-query';
import { unifiedService } from '@/services/unified';
import { EntityType } from '@/services/unified';
import { useUnifiedAddressesRealtimeSync, useUnifiedContactsRealtimeSync } from '../use-realtime-sync';

/**
 * Hook for querying entity data (addresses and contacts)
 */
export function useEntityQueries() {
  // Query for fetching addresses for an entity
  const useEntityAddresses = (entityType: EntityType | undefined, entityId: string | undefined) => {
    // Set up realtime sync for this entity's addresses
    useUnifiedAddressesRealtimeSync(entityType, entityId);
    
    return useQuery({
      queryKey: ['unified-addresses', entityType, entityId],
      queryFn: async () => {
        if (!entityType || !entityId) throw new Error('Entity type and ID are required');
        
        console.log(`Fetching addresses for ${entityType} ${entityId}...`);
        const response = await unifiedService.getAddresses(entityType, entityId);
        if ('category' in response) {
          console.error(`Error fetching addresses for ${entityType} ${entityId}:`, response);
          throw new Error(response.message);
        }
        console.log(`Fetched addresses for ${entityType} ${entityId} successfully:`, response.data);
        return response.data || []; 
      },
      enabled: !!entityType && !!entityId,
    });
  };

  // Query for fetching contacts for an entity
  const useEntityContacts = (entityType: EntityType | undefined, entityId: string | undefined) => {
    // Set up realtime sync for this entity's contacts
    useUnifiedContactsRealtimeSync(entityType, entityId);
    
    return useQuery({
      queryKey: ['unified-contacts', entityType, entityId],
      queryFn: async () => {
        if (!entityType || !entityId) throw new Error('Entity type and ID are required');
        
        console.log(`Fetching contacts for ${entityType} ${entityId}...`);
        const response = await unifiedService.getContacts(entityType, entityId);
        if ('category' in response) {
          console.error(`Error fetching contacts for ${entityType} ${entityId}:`, response);
          throw new Error(response.message);
        }
        console.log(`Fetched contacts for ${entityType} ${entityId} successfully:`, response.data);
        return response.data || [];
      },
      enabled: !!entityType && !!entityId,
    });
  };

  return {
    useEntityAddresses,
    useEntityContacts
  };
}
