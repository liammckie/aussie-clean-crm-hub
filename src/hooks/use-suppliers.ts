
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierService } from '@/services/supplier';
import { AppLogger, LogCategory } from '@/utils/logging';
import { toast } from 'sonner';
import type { SupplierCreateData, SupplierData } from '@/types/supplier-types';

/**
 * Hook for fetching all suppliers
 */
export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await supplierService.getAllSuppliers();
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    }
  });
}

/**
 * Hook for fetching a single supplier by ID
 */
export function useSupplierById(supplierId: string | undefined) {
  return useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: async () => {
      if (!supplierId) {
        return null;
      }
      
      const response = await supplierService.getSupplierById(supplierId);
      
      if ('category' in response) {
        if (response.category === 'not_found') {
          return null;
        }
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!supplierId
  });
}

/**
 * Hook for creating a supplier
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (supplierData: SupplierCreateData) => {
      const response = await supplierService.createSupplier(supplierData);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Supplier created successfully');
      AppLogger.info(LogCategory.SUPPLIER, 'Supplier created', { supplierId: data.id });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create supplier', {
        description: error.message
      });
      AppLogger.error(LogCategory.SUPPLIER, 'Error creating supplier', { error });
    }
  });
}

/**
 * Hook for updating a supplier
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ supplierId, data }: { supplierId: string, data: Partial<SupplierData> }) => {
      const response = await supplierService.updateSupplier(supplierId, data);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Supplier updated successfully');
      AppLogger.info(LogCategory.SUPPLIER, 'Supplier updated', { supplierId: data.id });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', data.id] });
    },
    onError: (error: Error) => {
      toast.error('Failed to update supplier', {
        description: error.message
      });
      AppLogger.error(LogCategory.SUPPLIER, 'Error updating supplier', { error });
    }
  });
}

/**
 * Hook for fetching supplier compliance documents
 */
export function useSupplierComplianceDocuments(supplierId: string | undefined) {
  return useQuery({
    queryKey: ['supplier-compliance', supplierId],
    queryFn: async () => {
      if (!supplierId) {
        return [];
      }
      
      const response = await supplierService.getComplianceDocuments(supplierId);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!supplierId
  });
}
