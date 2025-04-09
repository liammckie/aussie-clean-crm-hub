
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ErrorReporting } from '@/utils/errorReporting';
import { AppLogger, LogCategory } from '@/utils/logging';
import { isApiError } from '@/types/api-response';
import { contractService } from '@/services/contract';
import { EntityType, toFormEntityType } from '@/types/form-types';

export type MutationOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

/**
 * Hook for contract-related queries and mutations
 */
export function useContracts() {
  const queryClient = useQueryClient();

  const getContracts = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const response = await contractService.getContracts();
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    }
  });

  const getContractsByClientId = (clientId: string) => {
    return useQuery({
      queryKey: ['contracts', 'client', clientId],
      queryFn: async () => {
        const response = await contractService.getContractsByClientId(clientId);
        
        if (isApiError(response)) {
          throw new Error(response.message);
        }
        
        return response.data;
      },
      enabled: !!clientId
    });
  };

  const createContract = useMutation({
    mutationFn: async (contractData: any) => {
      const response = await contractService.createContract(contractData);
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create contract: ${error.message}`);
      ErrorReporting.captureException(error);
    }
  });

  const updateContract = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await contractService.updateContract(id, data);
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update contract: ${error.message}`);
      ErrorReporting.captureException(error);
    }
  });

  const deleteContract = useMutation({
    mutationFn: async (id: string) => {
      const response = await contractService.deleteContract(id);
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete contract: ${error.message}`);
      ErrorReporting.captureException(error);
    }
  });

  return {
    getContracts,
    getContractsByClientId,
    createContract: createContract.mutate,
    updateContract: updateContract.mutate,
    deleteContract: deleteContract.mutate,
    isCreatingContract: createContract.isPending,
    isUpdatingContract: updateContract.isPending,
    isDeletingContract: deleteContract.isPending
  };
}
