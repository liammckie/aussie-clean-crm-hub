
import * as api from './api';
import { WorkOrderCreateData, WorkOrderData } from '@/types/work-order-types';

/**
 * Service for managing work orders
 */
export const workOrderService = {
  /**
   * Get all work orders with pagination and filtering
   */
  getWorkOrders: api.getWorkOrders,
  
  /**
   * Get a single work order by ID
   */
  getWorkOrderById: api.getWorkOrderById,
  
  /**
   * Create a new work order
   */
  createWorkOrder: api.createWorkOrder,
  
  /**
   * Update an existing work order
   */
  updateWorkOrder: api.updateWorkOrder,
  
  /**
   * Delete a work order
   */
  deleteWorkOrder: api.deleteWorkOrder,
  
  /**
   * Get tasks for a work order
   */
  getWorkOrderTasks: api.getWorkOrderTasks,
  
  /**
   * Create a task for a work order
   */
  createWorkOrderTask: api.createWorkOrderTask,
  
  /**
   * Update a work order task
   */
  updateWorkOrderTask: api.updateWorkOrderTask,
  
  /**
   * Delete a work order task
   */
  deleteWorkOrderTask: api.deleteWorkOrderTask,
  
  /**
   * Get billing information for a work order
   */
  getWorkOrderBilling: api.getWorkOrderBilling,
};
