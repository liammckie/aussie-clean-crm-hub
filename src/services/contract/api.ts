
import { supabase } from '@/integrations/supabase/client';
import { createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { handleSupabaseError } from '@/utils/supabaseErrors';
import { ContractData, ContractCreateData } from '@/types/contract-types';

/**
 * Get all contracts
 */
export const getAllContracts = async () => {
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
};

/**
 * Get contracts for a specific client
 */
export const getClientContracts = async (clientId) => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
        
    if (error) return handleSupabaseError(error);
      
    return createSuccessResponse(data, 'Client contracts retrieved successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Get a contract by ID
 */
export const getContractById = async (contractId) => {
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
};

/**
 * Create a new contract
 */
export const createContract = async (contractData) => {
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
};

/**
 * Update an existing contract
 */
export const updateContract = async (contractId, contractData) => {
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
};

/**
 * Delete a contract
 */
export const deleteContract = async (contractId) => {
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
};

/**
 * Get billing lines for a contract
 */
export const getContractBillingLines = async (contractId) => {
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
};

/**
 * Create billing line for a contract
 */
export const createBillingLine = async (contractId, billingLineData) => {
  try {
    const fullData = { ...billingLineData, contract_id: contractId };
    const { data, error } = await supabase
      .from('billing_line')
      .insert([fullData])
      .select()
      .single();
        
    if (error) return handleSupabaseError(error);
      
    return createSuccessResponse(data, 'Billing line created successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Update billing line
 */
export const updateBillingLine = async (billingLineId, billingLineData) => {
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
};

/**
 * Delete billing line
 */
export const deleteBillingLine = async (billingLineId) => {
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
};

/**
 * Get budget items for a contract
 */
export const getContractBudgets = async (contractId) => {
  try {
    const { data, error } = await supabase
      .from('contract_budget')
      .select('*')
      .eq('contract_id', contractId);
        
    if (error) return handleSupabaseError(error);
      
    return createSuccessResponse(data, 'Contract budgets retrieved successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Create budget item for a contract
 */
export const createContractBudget = async (contractId, budgetData) => {
  try {
    const fullData = { ...budgetData, contract_id: contractId };
    const { data, error } = await supabase
      .from('contract_budget')
      .insert([fullData])
      .select()
      .single();
        
    if (error) return handleSupabaseError(error);
      
    return createSuccessResponse(data, 'Contract budget created successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Update budget item
 */
export const updateContractBudget = async (budgetId, budgetData) => {
  try {
    const { data, error } = await supabase
      .from('contract_budget')
      .update(budgetData)
      .eq('id', budgetId)
      .select()
      .single();
        
    if (error) return handleSupabaseError(error);
      
    return createSuccessResponse(data, 'Contract budget updated successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Delete budget item
 */
export const deleteContractBudget = async (budgetId) => {
  try {
    const { error } = await supabase
      .from('contract_budget')
      .delete()
      .eq('id', budgetId);
        
    if (error) return handleSupabaseError(error);
      
    return createSuccessResponse(true, 'Contract budget deleted successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};
