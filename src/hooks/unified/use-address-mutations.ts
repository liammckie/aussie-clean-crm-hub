import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ErrorReporting } from '@/utils/errorReporting';
import { unifiedService } from '@/services/unified';
import { UnifiedAddressFormData } from '@/types/form-types';
import { EntityType } from '@/types/form-types';
import { ValidationErrorResponse } from '@/services/unified/types';
import { ApiResponse, isApiError } from '@/types/api-response';

/**
 * Hook for address mutations (create, update, delete)
 */
export function useAddressMutations() {
  const queryClient = useQueryClient();

  // Mutation to create a new address
  const createAddressMutation = useMutation({
    mutationFn: async ({ 
      entityType, 
      entityId, 
      addressData 
    }: { 
      entityType: EntityType; 
      entityId: string; 
      addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'> 
    }) => {
      console.log(`Creating address for ${entityType} ${entityId} with data:`, addressData);
      const response = await unifiedService.createAddress(entityType, entityId, addressData);
      
      if (isApiError(response)) {
        console.warn('Validation error during address creation:', response);
        if (response.category === 'validation') {
          return response as ValidationErrorResponse;
        }
        
        console.error('Error creating address:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Address created successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data && !('category' in data)) {
        console.log('Invalidating addresses query after successful creation');
        queryClient.invalidateQueries({ queryKey: ['unified-addresses', variables.entityType, variables.entityId] });
        toast.success('Address created successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to update an address
  const updateAddressMutation = useMutation({
    mutationFn: async ({ 
      addressId, 
      addressData 
    }: { 
      addressId: string;
      addressData: Partial<UnifiedAddressFormData>;
    }) => {
      console.log(`Updating address ${addressId} with data:`, addressData);
      const response = await unifiedService.updateAddress(addressId, addressData);
      
      if (isApiError(response)) {
        if (response.category === 'validation') {
          console.warn('Validation error during address update:', response);
          return response as ValidationErrorResponse;
        }
        
        console.error('Error updating address:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Address updated successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data && !('category' in data)) {
        console.log('Invalidating addresses query after successful update');
        queryClient.invalidateQueries({ queryKey: ['unified-addresses'] });
        toast.success('Address updated successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to delete an address
  const deleteAddressMutation = useMutation({
    mutationFn: async ({ addressId }: { addressId: string }) => {
      console.log(`Deleting address ${addressId}`);
      const response = await unifiedService.deleteAddress(addressId);
      
      if (isApiError(response)) {
        console.error('Error deleting address:', response);
        throw new Error(response.message);
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses'] });
      toast.success('Address deleted successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to delete address');
    }
  });

  return {
    createAddress: createAddressMutation.mutate,
    isCreatingAddress: createAddressMutation.isPending,
    updateAddress: updateAddressMutation.mutate,
    isUpdatingAddress: updateAddressMutation.isPending,
    deleteAddress: deleteAddressMutation.mutate,
    isDeletingAddress: deleteAddressMutation.isPending,
  };
}
