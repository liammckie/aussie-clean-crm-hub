
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrderService } from '@/services/work-order/service';
import { isApiSuccess } from '@/types/api-response';
import { toast } from 'sonner';
import { WorkOrderData, WorkOrderTask, WorkbillData } from '@/types/work-order-types';

/**
 * Custom hook for work orders data and operations
 */
export function useWorkOrders() {
  const queryClient = useQueryClient();
  
  /**
   * Query to fetch all work orders
   */
  const getAllWorkOrders = () => {
    return useQuery({
      queryKey: ['work-orders'],
      queryFn: async () => {
        const response = await workOrderService.getAllWorkOrders();
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data as WorkOrderData[];
      }
    });
  };
  
  /**
   * Query to fetch a work order by ID
   */
  const getWorkOrderById = (workOrderId: string | undefined) => {
    return useQuery({
      queryKey: ['work-orders', workOrderId],
      queryFn: async () => {
        if (!workOrderId) return null;
        
        const response = await workOrderService.getWorkOrderById(workOrderId);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data as WorkOrderData;
      },
      enabled: !!workOrderId
    });
  };
  
  /**
   * Mutation to create a new work order
   */
  const createWorkOrder = useMutation({
    mutationFn: async (workOrderData: any) => {
      const response = await workOrderService.createWorkOrder(workOrderData);
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      return response.data as WorkOrderData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      toast.success('Work order created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create work order: ${error.message}`);
    }
  });
  
  /**
   * Mutation to update a work order
   */
  const updateWorkOrder = useMutation({
    mutationFn: async ({ workOrderId, workOrderData }: { workOrderId: string, workOrderData: any }) => {
      const response = await workOrderService.updateWorkOrder(workOrderId, workOrderData);
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      return response.data as WorkOrderData;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['work-orders', variables.workOrderId] });
      toast.success('Work order updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update work order: ${error.message}`);
    }
  });
  
  /**
   * Mutation to delete a work order
   */
  const deleteWorkOrder = useMutation({
    mutationFn: async (workOrderId: string) => {
      const response = await workOrderService.deleteWorkOrder(workOrderId);
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      toast.success('Work order deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete work order: ${error.message}`);
    }
  });
  
  /**
   * Query to fetch work order tasks
   */
  const getWorkOrderTasks = (workOrderId: string | undefined) => {
    return useQuery({
      queryKey: ['work-orders', workOrderId, 'tasks'],
      queryFn: async () => {
        if (!workOrderId) return [];
        
        const response = await workOrderService.getWorkOrderTasks(workOrderId);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data as WorkOrderTask[];
      },
      enabled: !!workOrderId
    });
  };
  
  /**
   * Query to fetch work order billing
   */
  const getWorkOrderBilling = (workOrderId: string | undefined) => {
    return useQuery({
      queryKey: ['work-orders', workOrderId, 'billing'],
      queryFn: async () => {
        if (!workOrderId) return null;
        
        const response = await workOrderService.getWorkOrderBilling(workOrderId);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data as WorkbillData;
      },
      enabled: !!workOrderId
    });
  };

  // Return a structured object with all work order hooks
  const allWorkOrders = getAllWorkOrders();
  
  // Export named hooks for individual use
  return {
    // The query hooks
    getAllWorkOrders,
    getWorkOrderById,
    getWorkOrderTasks,
    getWorkOrderBilling,
    
    // The mutation hooks
    useCreateWorkOrder: () => createWorkOrder,
    useUpdateWorkOrder: () => updateWorkOrder,
    useDeleteWorkOrder: () => deleteWorkOrder,
    
    // Direct access to work order data (for backward compatibility)
    workOrders: allWorkOrders.data || [],
    isLoadingWorkOrders: allWorkOrders.isLoading,
    workOrdersError: allWorkOrders.error as Error,
    refetchWorkOrders: allWorkOrders.refetch
  };
}

// Export the individual hooks as standalone functions
export const useWorkOrderById = (workOrderId: string) => useWorkOrders().getWorkOrderById(workOrderId);
export const useWorkOrderTasks = (workOrderId: string) => useWorkOrders().getWorkOrderTasks(workOrderId);
export const useWorkOrderBilling = (workOrderId: string) => useWorkOrders().getWorkOrderBilling(workOrderId);
export const useCreateWorkOrder = () => useWorkOrders().useCreateWorkOrder();
