
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedService } from '@/services/unified/service';
import { EntityType } from '@/types/database-schema';
import { UnifiedAddressRecord } from '@/services/address/types';
import { isApiError } from '@/types/api-response';
import { AppLogger, LogCategory } from '@/utils/logging';
import { toast } from 'sonner';

interface UseUnifiedAddressesOptions {
  onAddressCreated?: () => void;
  onAddressUpdated?: () => void;
  onAddressDeleted?: () => void;
}

/**
 * Hook for managing unified addresses for an entity
 */
export function useUnifiedAddresses(
  entityType: EntityType,
  entityId: string | undefined,
  options: UseUnifiedAddressesOptions = {}
) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Query for fetching addresses
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['unified-addresses', entityType, entityId],
    queryFn: async (): Promise<UnifiedAddressRecord[]> => {
      if (!entityId) {
        return [];
      }

      const response = await unifiedService.getEntityAddresses(entityType, entityId);
      
      if (isApiError(response)) {
        console.error('Error fetching addresses:', response);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!entityId
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: async (addressData: any) => {
      setIsCreating(true);
      try {
        if (!entityId) {
          throw new Error('Entity ID is required');
        }

        const response = await unifiedService.createAddress(
          entityType,
          entityId,
          addressData
        );

        if (isApiError(response)) {
          throw new Error(response.message);
        }

        return response.data as UnifiedAddressRecord;
      } finally {
        setIsCreating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses', entityType, entityId] });
      toast.success('Address created successfully');
      if (options.onAddressCreated) {
        options.onAddressCreated();
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to create address: ${error.message}`);
      AppLogger.error(LogCategory.ERROR, `Failed to create address: ${error.message}`, { entityType, entityId });
    }
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async ({ addressId, addressData }: { addressId: string; addressData: any }) => {
      setIsUpdating(true);
      try {
        const response = await unifiedService.updateAddress(addressId, addressData);

        if (isApiError(response)) {
          throw new Error(response.message);
        }

        return response.data as UnifiedAddressRecord;
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses', entityType, entityId] });
      toast.success('Address updated successfully');
      if (options.onAddressUpdated) {
        options.onAddressUpdated();
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to update address: ${error.message}`);
      AppLogger.error(LogCategory.ERROR, `Failed to update address: ${error.message}`);
    }
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      setIsDeleting(true);
      try {
        const response = await unifiedService.deleteAddress(addressId);

        if (isApiError(response)) {
          throw new Error(response.message);
        }

        return response.data;
      } finally {
        setIsDeleting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses', entityType, entityId] });
      toast.success('Address deleted successfully');
      if (options.onAddressDeleted) {
        options.onAddressDeleted();
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete address: ${error.message}`);
      AppLogger.error(LogCategory.ERROR, `Failed to delete address: ${error.message}`);
    }
  });

  // Helper functions with error handling
  const createAddress = useCallback(
    (addressData: any) => createAddressMutation.mutate(addressData),
    [createAddressMutation]
  );

  const updateAddress = useCallback(
    ({ addressId, addressData }: { addressId: string; addressData: any }) =>
      updateAddressMutation.mutate({ addressId, addressData }),
    [updateAddressMutation]
  );

  const deleteAddress = useCallback(
    (addressId: string) => deleteAddressMutation.mutate(addressId),
    [deleteAddressMutation]
  );

  const addresses = Array.isArray(data) ? data : [];

  return {
    addresses,
    isLoading,
    error,
    refetch,
    createAddress,
    updateAddress,
    deleteAddress,
    isCreating,
    isUpdating,
    isDeleting
  };
}
