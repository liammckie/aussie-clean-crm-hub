
import { supabase } from '@/integrations/supabase/client';
import { createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { handleSupabaseError } from '@/utils/supabaseErrors';
import { BillingLineData } from '@/services/contract/types';

/**
 * Get billing lines for a contract
 */
export const getContractBillingLines = async (contractId: string) => {
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
export const createBillingLine = async (contractId: string, billingLineData: Partial<BillingLineData>) => {
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
export const updateBillingLine = async (billingLineId: string, billingLineData: Partial<BillingLineData>) => {
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
export const deleteBillingLine = async (billingLineId: string) => {
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
