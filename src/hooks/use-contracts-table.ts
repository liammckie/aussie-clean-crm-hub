
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractService } from '@/services/contract';

export function useContracts() {
  const queryClient = useQueryClient();

  // Query to fetch all contracts
  const { 
    data: contracts, 
    isLoading: isLoadingContracts,
    error: contractsError,
    refetch: refetchContracts
  } = useQuery({
    queryKey: ['contracts-table'],
    queryFn: async () => {
      // Get all contracts
      const response = await contractService.getAllContracts();
      
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }

      // Map the contracts to include client names for the table
      const enhancedContracts = await Promise.all(response.data.map(async (contract) => {
        try {
          // This is a placeholder for client data fetching
          // In a real implementation, you might want to batch fetch clients or include them in the contracts query
          return {
            ...contract,
            client_name: contract.client_id, // Use client_id as placeholder until we fetch actual client name
            account_manager: contract.account_manager || '',
            state_manager: contract.state_manager || '',
            national_manager: contract.national_manager || ''
          };
        } catch (error) {
          console.error('Error enriching contract data:', error);
          return {
            ...contract,
            client_name: 'Unknown Client',
            account_manager: contract.account_manager || '',
            state_manager: contract.state_manager || '',
            national_manager: contract.national_manager || ''
          };
        }
      }));
      
      return enhancedContracts;
    },
  });

  // Mutation to update contract manager fields
  const updateContractManagersMutation = useMutation({
    mutationFn: async ({ 
      contractId, 
      managerField, 
      value 
    }: { 
      contractId: string; 
      managerField: 'account_manager' | 'state_manager' | 'national_manager'; 
      value: string 
    }) => {
      const response = await contractService.updateContract(contractId, { [managerField]: value });
      
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts-table'] });
    },
    onError: (error) => {
      toast.error(`Failed to update manager: ${error.message}`);
    }
  });

  // Mutation to update multiple contracts in bulk
  const bulkUpdateContractManagersMutation = useMutation({
    mutationFn: async ({ 
      contractIds, 
      managerField, 
      value 
    }: { 
      contractIds: string[]; 
      managerField: 'account_manager' | 'state_manager' | 'national_manager'; 
      value: string 
    }) => {
      const results = await Promise.all(
        contractIds.map(id => contractService.updateContract(id, { [managerField]: value }))
      );
      
      const errors = results.filter(result => 'category' in result);
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} contracts`);
      }
      
      return results.map(result => 'data' in result ? result.data : null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts-table'] });
      toast.success('Successfully updated contracts');
    },
    onError: (error) => {
      toast.error(`Bulk update failed: ${error.message}`);
    }
  });

  return {
    contracts,
    isLoadingContracts,
    contractsError,
    refetchContracts,
    updateContractManager: updateContractManagersMutation.mutate,
    isUpdatingContractManager: updateContractManagersMutation.isPending,
    bulkUpdateContractManagers: bulkUpdateContractManagersMutation.mutate,
    isBulkUpdating: bulkUpdateContractManagersMutation.isPending
  };
}
