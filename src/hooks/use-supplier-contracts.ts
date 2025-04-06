
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierContractService } from '@/services/supplier-contract';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';
import { AssignSupplierToContractData } from '@/types/supplier-contract-types';

/**
 * Hook for querying contracts associated with a supplier
 */
export function useSupplierContracts(supplierId: string | undefined) {
  return useQuery({
    queryKey: ['supplier-contracts', supplierId],
    queryFn: async () => {
      if (!supplierId) {
        return [];
      }
      
      const response = await supplierContractService.getContractsBySupplier(supplierId);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    },
    enabled: !!supplierId
  });
}

/**
 * Hook for querying suppliers associated with a contract
 */
export function useContractSuppliers(contractId: string | undefined) {
  return useQuery({
    queryKey: ['contract-suppliers', contractId],
    queryFn: async () => {
      if (!contractId) {
        return [];
      }
      
      const response = await supplierContractService.getSuppliersByContract(contractId);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    },
    enabled: !!contractId
  });
}

/**
 * Hook for assigning a supplier to a contract
 */
export function useAssignSupplierToContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (linkData: AssignSupplierToContractData) => {
      const response = await supplierContractService.assignSupplierToContract(linkData);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Supplier assigned to contract successfully');
      
      AppLogger.info(
        LogCategory.CONTRACT,
        'Supplier assigned to contract',
        { supplierId: variables.supplier_id, contractId: variables.contract_id }
      );
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['supplier-contracts', variables.supplier_id] });
      queryClient.invalidateQueries({ queryKey: ['contract-suppliers', variables.contract_id] });
    },
    onError: (error: Error, variables) => {
      toast.error('Failed to assign supplier to contract', {
        description: error.message
      });
      
      AppLogger.error(
        LogCategory.CONTRACT,
        'Error assigning supplier to contract',
        { 
          error,
          supplierId: variables.supplier_id,
          contractId: variables.contract_id
        }
      );
    }
  });
}

/**
 * Hook for removing a supplier from a contract
 */
export function useRemoveSupplierFromContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      supplierId,
      contractId
    }: {
      supplierId: string;
      contractId: string;
    }) => {
      const response = await supplierContractService.removeSupplierFromContract(
        supplierId,
        contractId
      );
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (_data, variables) => {
      toast.success('Supplier removed from contract successfully');
      
      AppLogger.info(
        LogCategory.CONTRACT,
        'Supplier removed from contract',
        { supplierId: variables.supplierId, contractId: variables.contractId }
      );
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['supplier-contracts', variables.supplierId] });
      queryClient.invalidateQueries({ queryKey: ['contract-suppliers', variables.contractId] });
    },
    onError: (error: Error, variables) => {
      toast.error('Failed to remove supplier from contract', {
        description: error.message
      });
      
      AppLogger.error(
        LogCategory.CONTRACT,
        'Error removing supplier from contract',
        { 
          error,
          supplierId: variables.supplierId,
          contractId: variables.contractId
        }
      );
    }
  });
}
