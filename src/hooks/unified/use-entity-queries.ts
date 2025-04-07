
import { useQuery } from '@tanstack/react-query';
import { unifiedApi } from '@/services/unified/api';
import { EntityType } from '@/services/client/types';
import { AppLogger, LogCategory } from '@/utils/logging';
import { toast } from 'sonner';

/**
 * Hook for querying entity data (addresses and contacts)
 */
export function useEntityQueries() {
  // Query for fetching addresses for an entity
  const useEntityAddresses = (entityType: EntityType | undefined, entityId: string | undefined) => {
    // Realtime sync is temporarily disabled
    
    return useQuery({
      queryKey: ['unified-addresses', entityType, entityId],
      queryFn: async () => {
        if (!entityType || !entityId) throw new Error('Entity type and ID are required');
        
        AppLogger.debug(LogCategory.DATA, `Fetching addresses for ${entityType} ${entityId}...`);
        const response = await unifiedApi.getAddresses(entityType, entityId);
        if ('category' in response) {
          AppLogger.error(LogCategory.ERROR, `Error fetching addresses: ${response.message}`, {
            entityType, 
            entityId, 
            error: response
          });
          throw new Error(response.message);
        }
        AppLogger.debug(LogCategory.DATA, `Fetched ${response.data?.length || 0} addresses for ${entityType} ${entityId}`);
        return response.data || []; 
      },
      enabled: !!entityType && !!entityId,
      // Use stale time of 0 to allow for manual refreshes
      staleTime: 0,
      // Add error handling within the hook
      meta: {
        errorMessage: `Could not load addresses for ${entityType || 'entity'}`
      }
    });
  };

  // Query for fetching contacts for an entity
  const useEntityContacts = (entityType: EntityType | undefined, entityId: string | undefined) => {
    // Realtime sync is temporarily disabled
    
    return useQuery({
      queryKey: ['unified-contacts', entityType, entityId],
      queryFn: async () => {
        if (!entityType || !entityId) throw new Error('Entity type and ID are required');
        
        AppLogger.debug(LogCategory.DATA, `Fetching contacts for ${entityType} ${entityId}...`);
        const response = await unifiedApi.getContacts(entityType, entityId);
        if ('category' in response) {
          AppLogger.error(LogCategory.ERROR, `Error fetching contacts: ${response.message}`, {
            entityType, 
            entityId, 
            error: response
          });
          throw new Error(response.message);
        }
        AppLogger.debug(LogCategory.DATA, `Fetched ${response.data?.length || 0} contacts for ${entityType} ${entityId}`);
        return response.data || [];
      },
      enabled: !!entityType && !!entityId,
      // Use stale time of 0 to allow for manual refreshes
      staleTime: 0,
      // Add error handling within the hook
      meta: {
        errorMessage: `Could not load contacts for ${entityType || 'entity'}`
      }
    });
  };

  return {
    useEntityAddresses,
    useEntityContacts
  };
}
