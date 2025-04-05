import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractService, ContractData, BillingLineData } from '@/services/contract';
import { ErrorReporting } from '@/utils/errorReporting';
import { AppLogger, LogCategory, withCache } from '@/utils/logging';

export const useContracts = (clientId?: string) => {
  const queryClient = useQueryClient();
  
  // Query to fetch all contracts for a client
  const { 
    data: contracts, 
    isLoading: isLoadingContracts,
    error: contractsError,
    refetch: refetchContracts
  } = useQuery({
    queryKey: ['client-contracts', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      AppLogger.debug(LogCategory.CONTRACT, `Fetching contracts for client: ${clientId}`);
      
      // Use cache wrapper for contract queries
      const cacheKey = `client-contracts-${clientId}`;
      
      return await withCache(cacheKey, async () => {
        const response = await contractService.getClientContracts(clientId);
        
        if ('category' in response) {
          AppLogger.error(LogCategory.CONTRACT, `Error fetching contracts: ${response.message}`, { clientId });
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        
        AppLogger.info(
          LogCategory.CONTRACT, 
          `Retrieved ${response.data?.length || 0} contracts for client`,
          { clientId }
        );
        
        return response.data;
      }, { ttl: 2 * 60 * 1000, tag: 'contracts' }); // Cache for 2 minutes
    },
    enabled: !!clientId,
  });

  // Query to fetch a single contract by ID
  const useContractDetails = (contractId: string | undefined) => {
    return useQuery({
      queryKey: ['contract', contractId],
      queryFn: async () => {
        if (!contractId) throw new Error('Contract ID is required');
        
        AppLogger.debug(LogCategory.CONTRACT, `Fetching contract details: ${contractId}`);
        
        // Use cache wrapper for contract details
        const cacheKey = `contract-detail-${contractId}`;
        
        return await withCache(cacheKey, async () => {
          const response = await contractService.getContractById(contractId);
          
          if ('category' in response) {
            AppLogger.error(
              LogCategory.CONTRACT, 
              `Error fetching contract details: ${response.message}`, 
              { contractId }
            );
            toast.error(`Error: ${response.message}`);
            throw new Error(response.message);
          }
          
          return response.data;
        }, { ttl: 2 * 60 * 1000, tag: 'contracts' });
      },
      enabled: !!contractId,
    });
  };

  // Query to fetch billing lines for a contract
  const useContractBillingLines = (contractId: string | undefined) => {
    return useQuery({
      queryKey: ['contract-billing-lines', contractId],
      queryFn: async () => {
        if (!contractId) return [];
        
        AppLogger.debug(
          LogCategory.CONTRACT, 
          `Fetching billing lines for contract: ${contractId}`
        );
        
        // Use cache wrapper for billing lines
        const cacheKey = `contract-billing-lines-${contractId}`;
        
        return await withCache(cacheKey, async () => {
          const response = await contractService.getContractBillingLines(contractId);
          
          if ('category' in response) {
            AppLogger.error(
              LogCategory.CONTRACT, 
              `Error fetching billing lines: ${response.message}`, 
              { contractId }
            );
            toast.error(`Error: ${response.message}`);
            throw new Error(response.message);
          }
          
          AppLogger.info(
            LogCategory.CONTRACT, 
            `Retrieved ${response.data?.length || 0} billing lines`, 
            { contractId }
          );
          
          return response.data;
        }, { ttl: 2 * 60 * 1000, tag: 'billing-lines' });
      },
      enabled: !!contractId,
    });
  };

  // Mutation to create a new contract
  const createContractMutation = useMutation({
    mutationFn: async (data: Omit<ContractData, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await contractService.createContract(data);
      
      if ('category' in response) {
        AppLogger.error(LogCategory.CONTRACT, `Error creating contract: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-contracts', clientId] });
      toast.success('Contract created successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to create contract');
    }
  });

  // Mutation to update an existing contract
  const updateContractMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContractData> }) => {
      const response = await contractService.updateContract(id, data);
      
      if ('category' in response) {
        AppLogger.error(LogCategory.CONTRACT, `Error updating contract: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-contracts', clientId] });
      queryClient.invalidateQueries({ queryKey: ['contract', data.id] });
      toast.success('Contract updated successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to update contract');
    }
  });

  // Mutation to delete a contract
  const deleteContractMutation = useMutation({
    mutationFn: async (contractId: string) => {
      const response = await contractService.deleteContract(contractId);
      
      if ('category' in response) {
        AppLogger.error(LogCategory.CONTRACT, `Error deleting contract: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contracts', clientId] });
      toast.success('Contract deleted successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to delete contract');
    }
  });

  // Mutation to create a new billing line
  const createBillingLineMutation = useMutation({
    mutationFn: async (data: Omit<BillingLineData, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await contractService.createBillingLine(data);
      
      if ('category' in response) {
        AppLogger.error(LogCategory.CONTRACT, `Error creating billing line: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contract-billing-lines', data.contract_id] });
      queryClient.invalidateQueries({ queryKey: ['contract', data.contract_id] });
      toast.success('Billing line created successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to create billing line');
    }
  });

  return {
    contracts,
    isLoadingContracts,
    contractsError,
    refetchContracts,
    
    useContractDetails,
    useContractBillingLines,
    
    createContract: createContractMutation.mutate,
    isCreatingContract: createContractMutation.isPending,
    
    updateContract: updateContractMutation.mutate,
    isUpdatingContract: updateContractMutation.isPending,
    
    deleteContract: deleteContractMutation.mutate,
    isDeletingContract: deleteContractMutation.isPending,
    
    createBillingLine: createBillingLineMutation.mutate,
    isCreatingBillingLine: createBillingLineMutation.isPending,
  };
};
