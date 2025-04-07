
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrderService } from '@/services/work-order/service';
import { toast } from 'sonner';
import { isApiSuccess } from '@/types/api-response';

export const useWorkOrders = () => {
  const queryClient = useQueryClient();

  // Fetch all work orders
  const {
    data: workOrders,
    isLoading: isLoadingWorkOrders,
    error: workOrdersError,
    refetch: refetchWorkOrders
  } = useQuery({
    queryKey: ['work-orders'],
    queryFn: async () => {
      try {
        const response = await workOrderService.getAllWorkOrders();
        
        if ('category' in response) {
          toast.error(`Error loading work orders: ${response.message}`);
          throw new Error(response.message);
        }
        
        return response.data;
      } catch (err) {
        console.error('Error fetching work orders:', err);
        throw err;
      }
    }
  });

  // Fetch work order details by ID
  const useWorkOrderById = (workOrderId: string) => useQuery({
    queryKey: ['work-order', workOrderId],
    queryFn: async () => {
      try {
        const response = await workOrderService.getWorkOrderById(workOrderId);
        
        if ('category' in response) {
          toast.error(`Error loading work order: ${response.message}`);
          throw new Error(response.message);
        }
        
        return response.data;
      } catch (err) {
        console.error(`Error fetching work order ${workOrderId}:`, err);
        throw err;
      }
    },
    enabled: !!workOrderId
  });

  // Create a new work order
  const useCreateWorkOrder = () => {
    return useMutation({
      mutationFn: async (workOrderData: any) => {
        const response = await workOrderService.createWorkOrder(workOrderData);
        
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['work-orders'] });
        toast.success('Work order created successfully');
      },
      onError: (error: Error) => {
        toast.error(`Failed to create work order: ${error.message}`);
      }
    });
  };

  // Update an existing work order
  const useUpdateWorkOrder = () => {
    return useMutation({
      mutationFn: async ({ workOrderId, updateData }: { workOrderId: string, updateData: any }) => {
        const response = await workOrderService.updateWorkOrder(workOrderId, updateData);
        
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        
        return response.data;
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['work-orders'] });
        queryClient.invalidateQueries({ queryKey: ['work-order', variables.workOrderId] });
        toast.success('Work order updated successfully');
      },
      onError: (error: Error) => {
        toast.error(`Failed to update work order: ${error.message}`);
      }
    });
  };

  // Delete a work order
  const useDeleteWorkOrder = () => {
    return useMutation({
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
  };

  // Fetch work order tasks
  const useWorkOrderTasks = (workOrderId: string) => {
    return useQuery({
      queryKey: ['work-order', workOrderId, 'tasks'],
      queryFn: async () => {
        const response = await workOrderService.getWorkOrderTasks(workOrderId);
        
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        
        return response.data;
      },
      enabled: !!workOrderId
    });
  };

  // Fetch work order billing
  const useWorkOrderBilling = (workOrderId: string) => {
    return useQuery({
      queryKey: ['work-order', workOrderId, 'billing'],
      queryFn: async () => {
        const response = await workOrderService.getWorkOrderBilling(workOrderId);
        
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        
        return response.data;
      },
      enabled: !!workOrderId
    });
  };

  // Get work order by ID function (for page component usage)
  const getWorkOrderById = (workOrderId: string) => useQuery({
    queryKey: ['work-order', workOrderId],
    queryFn: async () => {
      try {
        const response = await workOrderService.getWorkOrderById(workOrderId);
        
        if ('category' in response) {
          toast.error(`Error loading work order: ${response.message}`);
          throw new Error(response.message);
        }
        
        return response.data;
      } catch (err) {
        console.error(`Error fetching work order ${workOrderId}:`, err);
        throw err;
      }
    },
    enabled: !!workOrderId
  });

  return {
    // Direct access properties
    workOrders,
    isLoadingWorkOrders,
    workOrdersError,
    refetchWorkOrders,
    
    // Hook functions
    getWorkOrderById,
    useWorkOrderById,
    useCreateWorkOrder,
    useUpdateWorkOrder,
    useDeleteWorkOrder,
    useWorkOrderTasks,
    useWorkOrderBilling,
    
    // For pages that expect these properties directly
    data: workOrders,
    isLoading: isLoadingWorkOrders,
    error: workOrdersError,
    isError: !!workOrdersError,
    refetch: refetchWorkOrders
  };
};

export default useWorkOrders;
