
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supplierService } from '@/services/supplier';
import { 
  SupplierData, 
  SupplierDocumentData, 
  SupplierServiceData, 
  SupplierCreateData 
} from '@/services/supplier/types';
import { ErrorReporting } from '@/utils/errorReporting';
import { AppLogger, LogCategory } from '@/utils/logging';
import { Cache } from '@/utils/caching/cache';

export const useSuppliers = () => {
  const queryClient = useQueryClient();
  
  // Query to fetch all suppliers
  const { 
    data: suppliers, 
    isLoading: isLoadingSuppliers,
    error: suppliersError,
    refetch: refetchSuppliers
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      AppLogger.debug(LogCategory.SUPPLIER, 'Fetching suppliers');
      
      // Try to get suppliers from cache first
      const cachedSuppliers = Cache.get<any[]>('all-suppliers');
      if (cachedSuppliers) {
        return cachedSuppliers;
      }
      
      const response = await supplierService.getAllSuppliers();
      
      if ('category' in response) {
        AppLogger.error(LogCategory.SUPPLIER, `Error fetching suppliers: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      AppLogger.info(
        LogCategory.SUPPLIER, 
        `Retrieved ${response.data?.length || 0} suppliers`
      );
      
      // Store in cache for 2 minutes
      Cache.set('all-suppliers', response.data, 2 * 60 * 1000, 'suppliers');
      return response.data;
    },
  });

  // Query to fetch a single supplier by ID
  const useSupplierDetails = (supplierId: string | undefined) => {
    return useQuery({
      queryKey: ['supplier', supplierId],
      queryFn: async () => {
        if (!supplierId) throw new Error('Supplier ID is required');
        
        AppLogger.debug(LogCategory.SUPPLIER, `Fetching supplier details: ${supplierId}`);
        
        // Try to get from cache first
        const cacheKey = `supplier-detail-${supplierId}`;
        const cachedSupplier = Cache.get<SupplierData>(cacheKey);
        if (cachedSupplier) {
          return cachedSupplier;
        }
        
        const response = await supplierService.getSupplierById(supplierId);
        
        if ('category' in response) {
          AppLogger.error(
            LogCategory.SUPPLIER, 
            `Error fetching supplier details: ${response.message}`, 
            { supplierId }
          );
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        
        // Cache for 2 minutes
        Cache.set(cacheKey, response.data, 2 * 60 * 1000, 'suppliers');
        return response.data;
      },
      enabled: !!supplierId,
    });
  };

  // Query to fetch documents for a supplier
  const useSupplierDocuments = (supplierId: string | undefined) => {
    return useQuery({
      queryKey: ['supplier-documents', supplierId],
      queryFn: async () => {
        if (!supplierId) return [];
        
        AppLogger.debug(LogCategory.SUPPLIER, `Fetching documents for supplier: ${supplierId}`);
        
        const cacheKey = `supplier-documents-${supplierId}`;
        const cachedDocs = Cache.get<SupplierDocumentData[]>(cacheKey);
        if (cachedDocs) {
          return cachedDocs;
        }
        
        const response = await supplierService.getSupplierDocuments(supplierId);
        
        if ('category' in response) {
          AppLogger.error(
            LogCategory.SUPPLIER, 
            `Error fetching supplier documents: ${response.message}`, 
            { supplierId }
          );
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        
        AppLogger.info(
          LogCategory.SUPPLIER, 
          `Retrieved ${response.data?.length || 0} documents for supplier`, 
          { supplierId }
        );
        
        Cache.set(cacheKey, response.data, 2 * 60 * 1000, 'supplier-documents');
        return response.data;
      },
      enabled: !!supplierId,
    });
  };

  // Query to fetch services for a supplier
  const useSupplierServices = (supplierId: string | undefined) => {
    return useQuery({
      queryKey: ['supplier-services', supplierId],
      queryFn: async () => {
        if (!supplierId) return [];
        
        AppLogger.debug(LogCategory.SUPPLIER, `Fetching services for supplier: ${supplierId}`);
        
        const cacheKey = `supplier-services-${supplierId}`;
        const cachedServices = Cache.get<SupplierServiceData[]>(cacheKey);
        if (cachedServices) {
          return cachedServices;
        }
        
        const response = await supplierService.getSupplierServices(supplierId);
        
        if ('category' in response) {
          AppLogger.error(
            LogCategory.SUPPLIER, 
            `Error fetching supplier services: ${response.message}`, 
            { supplierId }
          );
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        
        Cache.set(cacheKey, response.data, 2 * 60 * 1000, 'supplier-services');
        return response.data;
      },
      enabled: !!supplierId,
    });
  };
  
  // Query to fetch contracts for a supplier
  const useSupplierContracts = (supplierId: string | undefined) => {
    return useQuery({
      queryKey: ['supplier-contracts', supplierId],
      queryFn: async () => {
        if (!supplierId) return [];
        
        AppLogger.debug(LogCategory.SUPPLIER, `Fetching contracts for supplier: ${supplierId}`);
        
        const cacheKey = `supplier-contracts-${supplierId}`;
        const cachedContracts = Cache.get(cacheKey);
        if (cachedContracts) {
          return cachedContracts;
        }
        
        const response = await supplierService.getSupplierContracts(supplierId);
        
        if ('category' in response) {
          AppLogger.error(
            LogCategory.SUPPLIER, 
            `Error fetching supplier contracts: ${response.message}`, 
            { supplierId }
          );
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        
        Cache.set(cacheKey, response.data, 2 * 60 * 1000, 'supplier-contracts');
        return response.data;
      },
      enabled: !!supplierId,
    });
  };

  // Mutation to create a new supplier
  const createSupplierMutation = useMutation({
    mutationFn: async (data: SupplierCreateData) => {
      const response = await supplierService.createSupplier(data);
      
      if ('category' in response) {
        AppLogger.error(LogCategory.SUPPLIER, `Error creating supplier: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier created successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to create supplier');
    }
  });

  // Mutation to update an existing supplier
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SupplierData> }) => {
      const response = await supplierService.updateSupplier(id, data);
      
      if ('category' in response) {
        AppLogger.error(LogCategory.SUPPLIER, `Error updating supplier: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', data.id] });
      toast.success('Supplier updated successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to update supplier');
    }
  });

  // Mutation to delete a supplier
  const deleteSupplierMutation = useMutation({
    mutationFn: async (supplierId: string) => {
      const response = await supplierService.deleteSupplier(supplierId);
      
      if ('category' in response) {
        AppLogger.error(LogCategory.SUPPLIER, `Error deleting supplier: ${response.message}`);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier deleted successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to delete supplier');
    }
  });

  return {
    suppliers,
    isLoadingSuppliers,
    suppliersError,
    refetchSuppliers,
    
    useSupplierDetails,
    useSupplierDocuments,
    useSupplierServices,
    useSupplierContracts,
    
    createSupplier: createSupplierMutation.mutateAsync,
    isCreatingSupplier: createSupplierMutation.isPending,
    
    updateSupplier: updateSupplierMutation.mutateAsync,
    isUpdatingSupplier: updateSupplierMutation.isPending,
    
    deleteSupplier: deleteSupplierMutation.mutateAsync,
    isDeletingSupplier: deleteSupplierMutation.isPending,
  };
};
