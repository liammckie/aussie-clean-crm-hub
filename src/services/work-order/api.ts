
import { supabase } from '@/integrations/supabase/client';
import { createErrorResponse, createSuccessResponse } from '@/types/api-response';
import { handleSupabaseError } from '@/utils/supabaseErrors';

export const workOrderApi = {
  fetchAllWorkOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select('*, clients(business_name), sites(site_name), suppliers(business_name)')
        .order('created_at', { ascending: false });
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      // Format data to include names from joined tables
      const formattedData = data.map(wo => ({
        ...wo,
        client_name: wo.clients?.business_name || 'Unknown Client',
        site_name: wo.sites?.site_name || 'Unknown Site',
        supplier_name: wo.suppliers?.business_name || 'No Supplier',
      }));
      
      return createSuccessResponse(formattedData, 'Work orders retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  fetchWorkOrderById: async (workOrderId) => {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select('*, clients(business_name), sites(site_name, address_line_1, suburb, state, postcode), suppliers(business_name)')
        .eq('id', workOrderId)
        .single();
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      const formattedData = {
        ...data,
        client_name: data.clients?.business_name || 'Unknown Client',
        site_name: data.sites?.site_name || 'Unknown Site',
        site_address: data.sites ? 
          `${data.sites.address_line_1}, ${data.sites.suburb}, ${data.sites.state} ${data.sites.postcode}` 
          : 'No address',
        supplier_name: data.suppliers?.business_name || 'No Supplier',
      };
      
      return createSuccessResponse(formattedData, 'Work order retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  createWorkOrder: async (workOrderData) => {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .insert([workOrderData])
        .select()
        .single();
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      return createSuccessResponse(data, 'Work order created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  updateWorkOrder: async (workOrderId, workOrderData) => {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .update(workOrderData)
        .eq('id', workOrderId)
        .select()
        .single();
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      return createSuccessResponse(data, 'Work order updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  deleteWorkOrder: async (workOrderId) => {
    try {
      const { error } = await supabase
        .from('work_orders')
        .delete()
        .eq('id', workOrderId);
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      return createSuccessResponse(true, 'Work order deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Work Order Tasks API
  fetchWorkOrderTasks: async (workOrderId) => {
    try {
      const { data, error } = await supabase
        .from('work_order_tasks')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('created_at');
        
      if (error) {
        return handleSupabaseError(error, 'Error fetching tasks');
      }
      
      return createSuccessResponse(data, 'Tasks retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  createWorkOrderTask: async (taskData) => {
    try {
      const { data, error } = await supabase
        .from('work_order_tasks')
        .insert([taskData])
        .select()
        .single();
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      return createSuccessResponse(data, 'Task created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  updateWorkOrderTask: async (taskId, taskData) => {
    try {
      const { data, error } = await supabase
        .from('work_order_tasks')
        .update(taskData)
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      return createSuccessResponse(data, 'Task updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  deleteWorkOrderTask: async (taskId) => {
    try {
      const { error } = await supabase
        .from('work_order_tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) {
        return handleSupabaseError(error);
      }
      
      return createSuccessResponse(true, 'Task deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};
