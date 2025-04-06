
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workOrderService } from '@/services/work-order';
import { WorkOrderData, WorkOrderCreateData } from '@/types/work-order-types';
import { AppLogger, LogCategory } from '@/utils/logging';

export function useWorkOrders(page: number = 1, pageSize: number = 10, filters?: any) {
  return useQuery({
    queryKey: ['work-orders', page, pageSize, filters],
    queryFn: async () => {
      const response = await workOrderService.getWorkOrders(page, pageSize, filters);
      
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response;
    }
  });
}

export function useWorkOrderById(workOrderId: string | undefined) {
  return useQuery({
    queryKey: ['work-order', workOrderId],
    queryFn: async () => {
      if (!workOrderId) {
        throw new Error('Work order ID is required');
      }
      
      const response = await workOrderService.getWorkOrderById(workOrderId);
      
      if ('category' in response) {
        if (response.category === 'not_found') {
          return null;
        }
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!workOrderId
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: WorkOrderCreateData) => {
      const response = await workOrderService.createWorkOrder(data);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      toast.success('Work order created successfully');
      AppLogger.info(LogCategory.WORK_ORDER, 'Work order created');
    },
    onError: (error) => {
      toast.error(`Failed to create work order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      AppLogger.error(LogCategory.WORK_ORDER, 'Error creating work order', { error });
    }
  });
}

export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ workOrderId, data }: { workOrderId: string, data: Partial<WorkOrderData> }) => {
      const response = await workOrderService.updateWorkOrder(workOrderId, data);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['work-order', data.id] });
      toast.success('Work order updated successfully');
      AppLogger.info(LogCategory.WORK_ORDER, 'Work order updated', { workOrderId: data.id });
    },
    onError: (error) => {
      toast.error(`Failed to update work order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      AppLogger.error(LogCategory.WORK_ORDER, 'Error updating work order', { error });
    }
  });
}

export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workOrderId: string) => {
      const response = await workOrderService.deleteWorkOrder(workOrderId);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return workOrderId;
    },
    onSuccess: (workOrderId) => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      toast.success('Work order deleted successfully');
      AppLogger.info(LogCategory.WORK_ORDER, 'Work order deleted', { workOrderId });
    },
    onError: (error) => {
      toast.error(`Failed to delete work order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      AppLogger.error(LogCategory.WORK_ORDER, 'Error deleting work order', { error });
    }
  });
}

export function useWorkOrderTasks(workOrderId: string | undefined) {
  return useQuery({
    queryKey: ['work-order-tasks', workOrderId],
    queryFn: async () => {
      if (!workOrderId) {
        return [];
      }
      
      const response = await workOrderService.getWorkOrderTasks(workOrderId);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!workOrderId
  });
}

export function useWorkOrderBilling(workOrderId: string | undefined) {
  return useQuery({
    queryKey: ['work-order-billing', workOrderId],
    queryFn: async () => {
      if (!workOrderId) {
        return [];
      }
      
      const response = await workOrderService.getWorkOrderBilling(workOrderId);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!workOrderId
  });
}
