
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unifiedAddressService } from '@/services/address/unified-address-service';
import { EntityType } from '@/types/database-schema';
import { UnifiedAddressFormData } from '@/types/form-types';
import { ApiResponse, isApiSuccess } from '@/types/api-response';
import { UnifiedAddressRecord } from '@/services/unified/types';

interface UseUnifiedAddressesOptions {
  onAddressCreated?: (address: UnifiedAddressRecord) => void;
  onAddressUpdated?: (address: UnifiedAddressRecord) => void;
  onAddressDeleted?: () => void;
}

/**
 * Hook for managing unified addresses
 * This provides a consistent interface for working with addresses in components
 */
export const useUnifiedAddresses = (
  entityType: EntityType, 
  entityId: string | undefined,
  options?: UseUnifiedAddressesOptions
) => {
  const queryClient = useQueryClient();
  
  // Get all addresses for an entity
  const { data: addresses, isLoading, error, refetch } = useQuery({
    queryKey: ['unified-addresses', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return [];
      
      const response = await unifiedAddressService.getAddresses(entityType, entityId);
      
      if (!isApiSuccess(response)) {
        console.error('Error fetching addresses:', response.message);
        return [];
      }
      
      return response.data;
    },
    enabled: !!entityId
  });
  
  // Get the primary address for an entity
  const { 
    data: primaryAddress, 
    isLoading: isLoadingPrimary 
  } = useQuery({
    queryKey: ['unified-primary-address', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return null;
      
      const response = await unifiedAddressService.getPrimaryAddress(entityType, entityId);
      
      if (!isApiSuccess(response)) {
        // No primary address found - not necessarily an error
        return null;
      }
      
      return response.data;
    },
    enabled: !!entityId
  });
  
  // Create address mutation
  const createAddress = useMutation({
    mutationFn: async (addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'>) => {
      if (!entityId) {
        throw new Error('Entity ID is required to create an address');
      }
      
      const response = await unifiedAddressService.createAddress(
        entityType,
        entityId,
        addressData
      );
      
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses', entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ['unified-primary-address', entityType, entityId] });
      toast.success('Address created successfully');
      if (options?.onAddressCreated) {
        options.onAddressCreated(data);
      }
    },
    onError: (error) => {
      toast.error(`Failed to create address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  // Update address mutation
  const updateAddress = useMutation({
    mutationFn: async ({ 
      addressId, 
      addressData 
    }: { 
      addressId: string; 
      addressData: Partial<UnifiedAddressFormData>; 
    }) => {
      const response = await unifiedAddressService.updateAddress(addressId, addressData);
      
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses', entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ['unified-primary-address', entityType, entityId] });
      toast.success('Address updated successfully');
      if (options?.onAddressUpdated) {
        options.onAddressUpdated(data);
      }
    },
    onError: (error) => {
      toast.error(`Failed to update address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  // Delete address mutation
  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await unifiedAddressService.deleteAddress(addressId);
      
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses', entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ['unified-primary-address', entityType, entityId] });
      toast.success('Address deleted successfully');
      if (options?.onAddressDeleted) {
        options.onAddressDeleted();
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  return {
    // Queries
    addresses: addresses || [],
    primaryAddress,
    isLoading,
    isLoadingPrimary,
    error,
    refetch,
    
    // Mutations
    createAddress: createAddress.mutate,
    updateAddress: updateAddress.mutate,
    deleteAddress: deleteAddress.mutate,
    isCreating: createAddress.isPending,
    isUpdating: updateAddress.isPending,
    isDeleting: deleteAddress.isPending
  };
};

export default useUnifiedAddresses;
