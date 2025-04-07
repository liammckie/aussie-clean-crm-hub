
import { ApiResponse } from '@/types/api-response';
import * as workOrderApi from './api';

/**
 * Work order service implementation
 */
export const workOrderService = {
  /**
   * Get all work orders
   */
  getAllWorkOrders: async (): Promise<ApiResponse<any[]>> => {
    return (workOrderApi as any).getWorkOrders();
  },

  /**
   * Get work order by ID
   */
  getWorkOrderById: async (workOrderId: string): Promise<ApiResponse<any>> => {
    return (workOrderApi as any).getWorkOrderById(workOrderId);
  },

  /**
   * Create a new work order
   */
  createWorkOrder: async (workOrderData: any): Promise<ApiResponse<any>> => {
    return (workOrderApi as any).createWorkOrder(workOrderData);
  },

  /**
   * Update an existing work order
   */
  updateWorkOrder: async (workOrderId: string, updateData: any): Promise<ApiResponse<any>> => {
    return (workOrderApi as any).updateWorkOrder(workOrderId, updateData);
  },

  /**
   * Delete a work order
   */
  deleteWorkOrder: async (workOrderId: string): Promise<ApiResponse<boolean>> => {
    return (workOrderApi as any).deleteWorkOrder(workOrderId);
  },

  /**
   * Get tasks for a work order
   */
  getWorkOrderTasks: async (workOrderId: string): Promise<ApiResponse<any[]>> => {
    return (workOrderApi as any).getWorkOrderTasks(workOrderId);
  },

  /**
   * Create task for a work order
   */
  createWorkOrderTask: async (workOrderId: string, taskData: any): Promise<ApiResponse<any>> => {
    return (workOrderApi as any).createWorkOrderTask(workOrderId, taskData);
  },

  /**
   * Update a work order task
   */
  updateWorkOrderTask: async (taskId: string, updateData: any): Promise<ApiResponse<any>> => {
    return (workOrderApi as any).updateWorkOrderTask(taskId, updateData);
  },

  /**
   * Delete a work order task
   */
  deleteWorkOrderTask: async (taskId: string): Promise<ApiResponse<boolean>> => {
    return (workOrderApi as any).deleteWorkOrderTask(taskId);
  },

  /**
   * Get billing information for a work order
   */
  getWorkOrderBilling: async (workOrderId: string): Promise<ApiResponse<any>> => {
    return (workOrderApi as any).getWorkOrderBilling(workOrderId);
  }
};

export default workOrderService;
