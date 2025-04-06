
import { supabase } from '@/integrations/supabase/client';
import { WorkOrderData, WorkOrderCreateData, WorkOrderTask, WorkbillData } from '@/types/work-order-types';
import { ApiResponse, formatError } from '@/utils/api-utils';

// Fetch all work orders with pagination and filtering
export const getWorkOrders = async (
  page: number = 1, 
  pageSize: number = 10,
  filters?: {
    status?: string;
    priority?: string;
    client_id?: string;
    site_id?: string;
    contract_id?: string;
    supplier_id?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }
): Promise<ApiResponse<WorkOrderData[]>> {
  try {
    let query = supabase
      .from('work_orders')
      .select(`
        *,
        clients!inner(business_name),
        sites!inner(site_name),
        suppliers(business_name)
      `);
    
    // Apply filters if they exist
    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      
      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }
      
      if (filters.site_id) {
        query = query.eq('site_id', filters.site_id);
      }
      
      if (filters.contract_id) {
        query = query.eq('contract_id', filters.contract_id);
      }
      
      if (filters.supplier_id) {
        query = query.eq('supplier_id', filters.supplier_id);
      }
      
      if (filters.dateFrom) {
        query = query.gte('scheduled_start', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.lte('scheduled_start', filters.dateTo);
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,work_order_number.ilike.%${filters.search}%`);
      }
    }
    
    // Add pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query.range(from, to).order('created_at', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) {
      return formatError('server', error.message);
    }
    
    // Transform the data to match our interface
    const workOrders: WorkOrderData[] = data.map(item => ({
      ...item,
      client_name: item.clients?.business_name,
      site_name: item.sites?.site_name,
      supplier_name: item.suppliers?.business_name
    }));
    
    return {
      data: workOrders,
      message: 'Work orders retrieved successfully',
      count: count || 0
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Get a single work order by ID
export const getWorkOrderById = async (id: string): Promise<ApiResponse<WorkOrderData>> {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        clients!inner(business_name),
        sites!inner(site_name),
        suppliers(business_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return formatError('not_found', `Work order with ID ${id} not found`);
      }
      return formatError('server', error.message);
    }
    
    const workOrder: WorkOrderData = {
      ...data,
      client_name: data.clients?.business_name,
      site_name: data.sites?.site_name,
      supplier_name: data.suppliers?.business_name
    };
    
    return {
      data: workOrder,
      message: 'Work order retrieved successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Create a new work order
export const createWorkOrder = async (workOrderData: WorkOrderCreateData): Promise<ApiResponse<WorkOrderData>> {
  try {
    // Generate a work order number (format: WO-YYYYMMDD-XXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get count of work orders created today to generate a unique number
    const { count, error: countError } = await supabase
      .from('work_orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(date.setHours(0, 0, 0, 0)).toISOString())
      .lt('created_at', new Date(date.setHours(23, 59, 59, 999)).toISOString());
    
    if (countError) {
      return formatError('server', countError.message);
    }
    
    const sequence = String(count ? count + 1 : 1).padStart(3, '0');
    const workOrderNumber = `WO-${dateStr}-${sequence}`;
    
    const { data, error } = await supabase
      .from('work_orders')
      .insert({
        ...workOrderData,
        work_order_number: workOrderNumber
      })
      .select()
      .single();
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data,
      message: 'Work order created successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Update an existing work order
export const updateWorkOrder = async (id: string, workOrderData: Partial<WorkOrderData>): Promise<ApiResponse<WorkOrderData>> {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .update(workOrderData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data,
      message: 'Work order updated successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Delete a work order
export const deleteWorkOrder = async (id: string): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data: true,
      message: 'Work order deleted successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Get work order tasks
export const getWorkOrderTasks = async (workOrderId: string): Promise<ApiResponse<WorkOrderTask[]>> {
  try {
    const { data, error } = await supabase
      .from('work_order_tasks')
      .select('*')
      .eq('work_order_id', workOrderId)
      .order('created_at', { ascending: true });
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data,
      message: 'Work order tasks retrieved successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Create a work order task
export const createWorkOrderTask = async (task: Omit<WorkOrderTask, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<WorkOrderTask>> {
  try {
    const { data, error } = await supabase
      .from('work_order_tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data,
      message: 'Task created successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Update a work order task
export const updateWorkOrderTask = async (id: string, taskData: Partial<WorkOrderTask>): Promise<ApiResponse<WorkOrderTask>> {
  try {
    const { data, error } = await supabase
      .from('work_order_tasks')
      .update(taskData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data,
      message: 'Task updated successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Delete a work order task
export const deleteWorkOrderTask = async (id: string): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('work_order_tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data: true,
      message: 'Task deleted successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};

// Get workbills for a work order
export const getWorkOrderBilling = async (workOrderId: string): Promise<ApiResponse<WorkbillData[]>> {
  try {
    const { data, error } = await supabase
      .from('workbills')
      .select(`
        *,
        suppliers(business_name)
      `)
      .eq('work_order_id', workOrderId);
    
    if (error) {
      return formatError('server', error.message);
    }
    
    return {
      data,
      message: 'Work order billing retrieved successfully'
    };
    
  } catch (error: any) {
    return formatError('server', error.message);
  }
};
