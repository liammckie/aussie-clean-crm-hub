
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
export const getClientContracts = async (clientId: string) => {
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
export const getContractById = async (contractId: string) => {
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
export const createContract = async (contractData: ContractCreateData) => {
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
export const updateContract = async (contractId: string, contractData: Partial<ContractData>) => {
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
export const deleteContract = async (contractId: string) => {
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
