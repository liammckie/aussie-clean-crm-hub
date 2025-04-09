
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

export type ContractData = any;

/**
 * Hook for contract-related queries and mutations
 */
export function useContracts(clientId?: string) {
  const queryClient = useQueryClient();

  const contractsQuery = useQuery({
    queryKey: ['contracts', clientId],
    queryFn: async () => {
      const response = clientId 
        ? await contractService.getClientContracts(clientId)
        : await contractService.getAllContracts();
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: clientId ? !!clientId : true
  });

  const getContractsByClientId = (clientId: string) => {
    return useQuery({
      queryKey: ['contracts', 'client', clientId],
      queryFn: async () => {
        const response = await contractService.getClientContracts(clientId);
        
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
    // Return the contracts data from the query
    contracts: contractsQuery.data,
    isLoadingContracts: contractsQuery.isLoading,
    contractsError: contractsQuery.error,
    refetchContracts: contractsQuery.refetch,
    
    // Original methods
    getContracts: contractsQuery,
    getContractsByClientId,
    createContract: createContract.mutate,
    updateContract: updateContract.mutate,
    deleteContract: deleteContract.mutate,
    isCreatingContract: createContract.isPending,
    isUpdatingContract: updateContract.isPending,
    isDeletingContract: deleteContract.isPending,
    
    // Additional methods needed by other components
    useContractBillingLines: (contractId?: string) => {
      return useQuery({
        queryKey: ['contract-billing-lines', contractId],
        queryFn: async () => {
          if (!contractId) return [];
          const response = await contractService.getContractBillingLines(contractId);
          if (isApiError(response)) {
            throw new Error(response.message);
          }
          return response.data;
        },
        enabled: !!contractId
      });
    },
    
    useContractDetails: (contractId?: string) => {
      return useQuery({
        queryKey: ['contract-details', contractId],
        queryFn: async () => {
          if (!contractId) return null;
          const response = await contractService.getContractById(contractId);
          if (isApiError(response)) {
            throw new Error(response.message);
          }
          return response.data;
        },
        enabled: !!contractId
      });
    },
    
    useUpdateContract: () => updateContract,
    
    useCreateContract: () => createContract
  };
}
