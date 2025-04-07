
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { supabase } from '@/integrations/supabase/client';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Get all work orders
 */
export const getAllWorkOrders = async (): Promise<ApiResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*');

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data || [], 'Work orders retrieved successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error retrieving work orders: ${error.message}`,
      { error }
    );
  }
};

/**
 * Get work order by ID
 */
export const getWorkOrderById = async (workOrderId: string): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .eq('id', workOrderId)
      .single();

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data || null, 'Work order retrieved successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error retrieving work order: ${error.message}`,
      { error }
    );
  }
};

/**
 * Create a new work order
 */
export const createWorkOrder = async (workOrderData: any): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .insert(workOrderData)
      .select('*')
      .single();

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data, 'Work order created successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error creating work order: ${error.message}`,
      { error }
    );
  }
};

/**
 * Update a work order
 */
export const updateWorkOrder = async (workOrderId: string, updateData: any): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .update(updateData)
      .eq('id', workOrderId)
      .select('*')
      .single();

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data, 'Work order updated successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error updating work order: ${error.message}`,
      { error }
    );
  }
};

/**
 * Delete a work order
 */
export const deleteWorkOrder = async (workOrderId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', workOrderId);

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(true, 'Work order deleted successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error deleting work order: ${error.message}`,
      { error }
    );
  }
};

/**
 * Get tasks for a work order
 */
export const getWorkOrderTasks = async (workOrderId: string): Promise<ApiResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('work_order_tasks')
      .select('*')
      .eq('work_order_id', workOrderId);

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data || [], 'Work order tasks retrieved successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error retrieving work order tasks: ${error.message}`,
      { error }
    );
  }
};

/**
 * Create task for a work order
 */
export const createWorkOrderTask = async (workOrderId: string, taskData: any): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('work_order_tasks')
      .insert({ ...taskData, work_order_id: workOrderId })
      .select('*')
      .single();

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data, 'Task created successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error creating task: ${error.message}`,
      { error }
    );
  }
};

/**
 * Update a work order task
 */
export const updateWorkOrderTask = async (taskId: string, updateData: any): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('work_order_tasks')
      .update(updateData)
      .eq('id', taskId)
      .select('*')
      .single();

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data, 'Task updated successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error updating task: ${error.message}`,
      { error }
    );
  }
};

/**
 * Delete a work order task
 */
export const deleteWorkOrderTask = async (taskId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('work_order_tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(true, 'Task deleted successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error deleting task: ${error.message}`,
      { error }
    );
  }
};

/**
 * Get billing information for a work order
 */
export const getWorkOrderBilling = async (workOrderId: string): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('workbills')
      .select('*')
      .eq('work_order_id', workOrderId)
      .single();

    if (error) {
      return createErrorResponse(
        ErrorCategory.DATABASE,
        error.message,
        { error }
      );
    }

    return createSuccessResponse(data || null, 'Billing information retrieved successfully');
  } catch (error: any) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Error retrieving billing information: ${error.message}`,
      { error }
    );
  }
};
