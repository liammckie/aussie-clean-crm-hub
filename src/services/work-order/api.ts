
import { ApiResponse } from '@/types/api-response';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all work orders
 */
export const getAllWorkOrders = async (): Promise<ApiResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*');

    if (error) {
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data || [],
      message: 'Work orders retrieved successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error retrieving work orders: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data || null,
      message: 'Work order retrieved successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error retrieving work order: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data,
      message: 'Work order created successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error creating work order: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data,
      message: 'Work order updated successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error updating work order: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: true,
      message: 'Work order deleted successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error deleting work order: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data || [],
      message: 'Work order tasks retrieved successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error retrieving work order tasks: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data,
      message: 'Task created successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error creating task: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data,
      message: 'Task updated successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error updating task: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: true,
      message: 'Task deleted successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error deleting task: ${error.message}`,
      details: error
    };
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
      return {
        category: 'database',
        message: error.message,
        details: error
      };
    }

    return {
      data: data || null,
      message: 'Billing information retrieved successfully'
    };
  } catch (error: any) {
    return {
      category: 'server',
      message: `Error retrieving billing information: ${error.message}`,
      details: error
    };
  }
};
