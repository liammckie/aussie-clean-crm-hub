
import { useQuery } from '@tanstack/react-query';
import { workOrderService } from '@/services/work-order/service';
import { toast } from 'sonner';

export const useWorkOrders = () => {
  // Fetch all work orders
  const {
    data: workOrders,
    isLoading,
    error,
    refetch
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
    workOrders,
    isLoadingWorkOrders: isLoading,
    workOrdersError: error,
    refetchWorkOrders: refetch,
    getWorkOrderById
  };
};
