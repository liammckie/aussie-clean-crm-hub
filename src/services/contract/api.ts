
import { supabase } from '@/integrations/supabase/client';
import { createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { handleSupabaseError } from '@/utils/supabaseErrors';

export const contractApi = {
  fetchAllContracts: async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, clients(business_name)')
        .order('created_at', { ascending: false });
        
      if (error) return handleSupabaseError(error);
      
      // Format data to include client_name from the joined clients table
      const formattedData = data.map(contract => ({
        ...contract,
        client_name: contract.clients?.business_name || 'Unknown Client'
      }));
      
      return createSuccessResponse(formattedData, 'Contracts retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  fetchContractById: async (contractId) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, clients(business_name)')
        .eq('id', contractId)
        .single();
        
      if (error) return handleSupabaseError(error);
      
      const formattedData = {
        ...data,
        client_name: data.clients?.business_name || 'Unknown Client'
      };
      
      return createSuccessResponse(formattedData, 'Contract retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  createContract: async (contractData) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([contractData])
        .select()
        .single();
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(data, 'Contract created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  updateContract: async (contractId, contractData) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update(contractData)
        .eq('id', contractId)
        .select()
        .single();
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(data, 'Contract updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  deleteContract: async (contractId) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(true, 'Contract deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  fetchBillingLines: async (contractId) => {
    try {
      const { data, error } = await supabase
        .from('billing_line')
        .select('*')
        .eq('contract_id', contractId);
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(data, 'Billing lines retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  createBillingLine: async (billingLineData) => {
    try {
      const { data, error } = await supabase
        .from('billing_line')
        .insert([billingLineData])
        .select()
        .single();
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(data, 'Billing line created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  updateBillingLine: async (billingLineId, billingLineData) => {
    try {
      const { data, error } = await supabase
        .from('billing_line')
        .update(billingLineData)
        .eq('id', billingLineId)
        .select()
        .single();
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(data, 'Billing line updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  deleteBillingLine: async (billingLineId) => {
    try {
      const { error } = await supabase
        .from('billing_line')
        .delete()
        .eq('id', billingLineId);
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(true, 'Billing line deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  fetchContractSites: async (contractId) => {
    try {
      const { data, error } = await supabase
        .from('contract_sites')
        .select('*, sites(*)')
        .eq('contract_id', contractId);
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(data, 'Contract sites retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  addSiteToContract: async (contractSiteData) => {
    try {
      const { data, error } = await supabase
        .from('contract_sites')
        .insert([contractSiteData])
        .select()
        .single();
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(data, 'Site added to contract successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  removeSiteFromContract: async (contractSiteId) => {
    try {
      const { error } = await supabase
        .from('contract_sites')
        .delete()
        .eq('id', contractSiteId);
        
      if (error) return handleSupabaseError(error);
      
      return createSuccessResponse(true, 'Site removed from contract successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};
