
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedService } from '@/services/unified/service';
import { toast } from 'sonner';
import { ErrorReporting } from '@/utils/errorReporting';
import { AppLogger, LogCategory } from '@/utils/logging';
import { isApiError } from '@/types/api-response';
import { EntityType, toDatabaseEntityType } from '@/types/form-types';

export type MutationOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

/**
 * Hook for address mutations (create, update, delete)
 */
export function useAddressMutations() {
  const queryClient = useQueryClient();

  const createAddress = useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      addressData,
    }: {
      entityType: EntityType;
      entityId: string;
      addressData: any;
    }) => {
      const dbEntityType = toDatabaseEntityType(entityType);
      const response = await unifiedService.createAddress(
        dbEntityType,
        entityId,
        addressData
      );

      if (isApiError(response)) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['unified-addresses', variables.entityType, variables.entityId],
      });
      AppLogger.info(LogCategory.ADDRESS, 'Address created successfully', { 
        addressId: data?.id || 'unknown' 
      });
    },
    onError: (error, variables) => {
      AppLogger.error(LogCategory.ADDRESS, `Failed to create address: ${error.message}`, {
        entityType: variables.entityType,
        entityId: variables.entityId,
        error,
      });
      ErrorReporting.captureException(error);
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({
      addressId,
      addressData,
    }: {
      addressId: string;
      addressData: any;
    }) => {
      const response = await unifiedService.updateAddress(addressId, addressData);

      if (isApiError(response)) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Since we don't know the entity type and ID here, invalidate all address queries
      queryClient.invalidateQueries({
        queryKey: ['unified-addresses'],
      });
      AppLogger.info(LogCategory.ADDRESS, 'Address updated successfully', { addressId: data.id });
    },
    onError: (error, variables) => {
      AppLogger.error(LogCategory.ADDRESS, `Failed to update address: ${error.message}`, {
        addressId: variables.addressId,
        error,
      });
      ErrorReporting.captureException(error);
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async ({ addressId }: { addressId: string }) => {
      const response = await unifiedService.deleteAddress(addressId);

      if (isApiError(response)) {
        throw new Error(response.message);
      }

      // Return success response properly
      return response.data || { success: true, id: addressId };
    },
    onSuccess: (data) => {
      // Since we don't know the entity type and ID here, invalidate all address queries
      queryClient.invalidateQueries({
        queryKey: ['unified-addresses'],
      });
      AppLogger.info(LogCategory.ADDRESS, 'Address deleted successfully', { 
        addressId: typeof data === 'object' && data && 'id' in data ? data.id : 'unknown' 
      });
    },
    onError: (error, variables) => {
      AppLogger.error(LogCategory.ADDRESS, `Failed to delete address: ${error.message}`, {
        addressId: variables.addressId,
        error,
      });
      ErrorReporting.captureException(error);
    },
  });

  return {
    createAddress: (
      variables: {
        entityType: EntityType;
        entityId: string;
        addressData: any;
      },
      options?: MutationOptions<any>
    ) => {
      return createAddress.mutateAsync(variables, {
        onSuccess: (data) => {
          toast.success('Address created successfully');
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(`Failed to create address: ${error.message}`);
          options?.onError?.(error);
        },
      });
    },
    updateAddress: (
      variables: {
        addressId: string;
        addressData: any;
      },
      options?: MutationOptions<any>
    ) => {
      return updateAddress.mutateAsync(variables, {
        onSuccess: (data) => {
          toast.success('Address updated successfully');
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(`Failed to update address: ${error.message}`);
          options?.onError?.(error);
        },
      });
    },
    deleteAddress: (
      variables: {
        addressId: string;
      },
      options?: MutationOptions<any>
    ) => {
      return deleteAddress.mutateAsync(variables, {
        onSuccess: (data) => {
          toast.success('Address deleted successfully');
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(`Failed to delete address: ${error.message}`);
          options?.onError?.(error);
        },
      });
    },
    isCreatingAddress: createAddress.isPending,
    isDeletingAddress: deleteAddress.isPending,
    isUpdatingAddress: updateAddress.isPending,
  };
}
