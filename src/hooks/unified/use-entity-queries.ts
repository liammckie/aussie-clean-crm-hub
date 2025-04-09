
import { useQuery } from '@tanstack/react-query';
import { unifiedService } from '@/services/unified';
import { EntityType as FormEntityType } from '@/types/form-types';
import { EntityType as DbEntityType } from '@/types/database-schema';
import { ApiResponse } from '@/types/api-response';
import { UnifiedAddressRecord, UnifiedContactRecord } from '@/services/unified/types';
import { ErrorReporting } from '@/utils/errorReporting';

// Convert form entity type to database entity type
const toDbEntityType = (formType: FormEntityType): DbEntityType => {
  // Use lowercase version as database expects lowercase values
  return formType.toLowerCase() as DbEntityType;
};

/**
 * Hook for querying unified entities (addresses and contacts)
 */
export function useEntityQueries() {
  /**
   * Hook for querying entity addresses
   * @param entityType Type of entity (client, site, etc.)
   * @param entityId ID of the entity
   * @param options Additional query options
   * @returns Query result object
   */
  const useEntityAddresses = (
    entityType: FormEntityType,
    entityId: string | undefined,
    options: { enabled?: boolean } = {}
  ) => {
    return useQuery<UnifiedAddressRecord[], Error>({
      queryKey: ['unified-addresses', entityType, entityId],
      queryFn: async (): Promise<UnifiedAddressRecord[]> => {
        if (!entityId) {
          return [];
        }

        const response = await unifiedService.getEntityAddresses(
          toDbEntityType(entityType), 
          entityId
        );
        
        if ('category' in response) {
          console.error('Error fetching addresses:', response);
          throw new Error(response.message);
        }
        
        return response.data;
      },
      enabled: !!entityId && (options.enabled !== false),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      meta: {
        onError: (error: Error) => {
          ErrorReporting.captureException(error);
        }
      }
    });
  };

  /**
   * Hook for querying entity contacts
   * @param entityType Type of entity (client, site, etc.)
   * @param entityId ID of the entity
   * @param options Additional query options
   * @returns Query result object
   */
  const useEntityContacts = (
    entityType: FormEntityType,
    entityId: string | undefined,
    options: { enabled?: boolean } = {}
  ) => {
    return useQuery<UnifiedContactRecord[], Error>({
      queryKey: ['unified-contacts', entityType, entityId],
      queryFn: async (): Promise<UnifiedContactRecord[]> => {
        if (!entityId) {
          return [];
        }
        
        const response = await unifiedService.getEntityContacts(
          toDbEntityType(entityType), 
          entityId
        );
        
        if ('category' in response) {
          console.error('Error fetching contacts:', response);
          throw new Error(response.message);
        }
        
        return response.data;
      },
      enabled: !!entityId && (options.enabled !== false),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      meta: {
        onError: (error: Error) => {
          ErrorReporting.captureException(error);
        }
      }
    });
  };
  
  return {
    useEntityAddresses,
    useEntityContacts
  };
}
