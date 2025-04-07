
import { supabase } from '@/integrations/supabase/client';
import { createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { handleSupabaseError } from '@/utils/supabaseErrors';
import { ContractBudgetData } from '@/services/contract/types';

/**
 * Get budget items for a contract
 */
export const getContractBudgets = async (contractId: string) => {
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
export const createContractBudget = async (contractId: string, budgetData: Partial<ContractBudgetData>) => {
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
export const updateContractBudget = async (budgetId: string, budgetData: Partial<ContractBudgetData>) => {
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
export const deleteContractBudget = async (budgetId: string) => {
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
