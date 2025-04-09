
import { useQuery } from '@tanstack/react-query';
import { unifiedService } from '@/services/unified/service';
import { EntityType, toDatabaseEntityType } from '@/types/form-types';
import { isApiError } from '@/types/api-response';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * Hook for fetching addresses for a specific entity
 * @param entityType The type of entity (client, supplier, etc.)
 * @param entityId The ID of the entity
 * @returns Query result with addresses data
 */
export function useUnifiedAddresses(entityType: EntityType, entityId: string | undefined) {
  return useQuery({
    queryKey: ['unified-addresses', entityType, entityId],
    queryFn: async () => {
      if (!entityId) {
        throw new Error('Entity ID is required');
      }
      
      const response = await unifiedService.getEntityAddresses(
        toDatabaseEntityType(entityType),
        entityId
      );
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!entityId,
    staleTime: 1000 * 60 // 1 minute
  });
}

/**
 * Hook for fetching a single address by ID
 * @param addressId The ID of the address to fetch
 * @returns Query result with address data
 */
export function useUnifiedAddress(addressId: string | undefined) {
  return useQuery({
    queryKey: ['unified-address', addressId],
    queryFn: async () => {
      if (!addressId) {
        throw new Error('Address ID is required');
      }
      
      const response = await unifiedService.getAddressById(addressId);
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!addressId,
    staleTime: 1000 * 60 // 1 minute
  });
}

/**
 * Hook for fetching primary addresses for a specific entity and address type
 * @param entityType The type of entity (client, supplier, etc.)
 * @param entityId The ID of the entity
 * @param addressType Optional address type filter
 * @returns Query result with the primary address
 */
export function useUnifiedPrimaryAddress(
  entityType: EntityType, 
  entityId: string | undefined,
  addressType?: string
) {
  const addressesQuery = useUnifiedAddresses(entityType, entityId);
  
  const primaryAddress = addressesQuery.data?.find(address => 
    address.is_primary && (!addressType || address.address_type === addressType)
  );
  
  return {
    ...addressesQuery,
    data: primaryAddress
  };
}
