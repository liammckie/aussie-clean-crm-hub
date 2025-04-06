
import { supabase } from '@/integrations/supabase/client';
import { ContractCreateData } from '@/types/contract-types';
import { ContractData, BillingLineData, ContractBudgetData } from './types';
import { ErrorResponse, handleSupabaseError, logSuccess } from '@/utils/supabaseErrors';

/**
 * Get all contracts
 */
export async function getAllContracts() {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'contracts', data);
    return { data: data as ContractData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch contracts');
  }
}

/**
 * Get contracts for a specific client
 */
export async function getClientContracts(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'client contracts', data);
    return { data: data as ContractData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch client contracts');
  }
}

/**
 * Get a contract by ID
 */
export async function getContractById(contractId: string) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (error) throw error;

    logSuccess('Retrieved', 'contract', data);
    return { data: data as ContractData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch contract details');
  }
}

/**
 * Create a new contract
 */
export async function createContract(contractData: ContractCreateData) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .insert([contractData])
      .select()
      .single();

    if (error) throw error;

    logSuccess('Created', 'contract', data);
    return { data: data as ContractData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to create contract');
  }
}

/**
 * Update an existing contract
 */
export async function updateContract(contractId: string, contractData: Partial<ContractData>) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .update(contractData)
      .eq('id', contractId)
      .select()
      .single();

    if (error) throw error;

    logSuccess('Updated', 'contract', data);
    return { data: data as ContractData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to update contract');
  }
}

/**
 * Delete a contract
 */
export async function deleteContract(contractId: string) {
  try {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', contractId);

    if (error) throw error;

    logSuccess('Deleted', 'contract', { id: contractId });
    return { data: true };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to delete contract');
  }
}

/**
 * Get billing lines for a contract
 */
export async function getContractBillingLines(contractId: string) {
  try {
    const { data, error } = await supabase
      .from('billing_line')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'billing lines', data);
    return { data: data as BillingLineData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch billing lines');
  }
}

/**
 * Create a new billing line
 */
export async function createBillingLine(billingData: Omit<BillingLineData, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('billing_line')
      .insert([billingData])
      .select()
      .single();

    if (error) throw error;

    logSuccess('Created', 'billing line', data);
    return { data: data as BillingLineData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to create billing line');
  }
}

/**
 * Update an existing billing line
 */
export async function updateBillingLine(lineId: string, billingData: Partial<BillingLineData>) {
  try {
    const { data, error } = await supabase
      .from('billing_line')
      .update(billingData)
      .eq('id', lineId)
      .select()
      .single();

    if (error) throw error;

    logSuccess('Updated', 'billing line', data);
    return { data: data as BillingLineData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to update billing line');
  }
}

/**
 * Delete a billing line
 */
export async function deleteBillingLine(lineId: string) {
  try {
    const { error } = await supabase
      .from('billing_line')
      .delete()
      .eq('id', lineId);

    if (error) throw error;

    logSuccess('Deleted', 'billing line', { id: lineId });
    return { data: true };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to delete billing line');
  }
}

/**
 * Get contract budget entries
 */
export async function getContractBudgets(contractId: string) {
  try {
    const { data, error } = await supabase
      .from('contract_budget')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'contract budgets', data);
    return { data: data as ContractBudgetData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch contract budgets');
  }
}

/**
 * Create a new contract budget entry
 */
export async function createContractBudget(budgetData: Omit<ContractBudgetData, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('contract_budget')
      .insert([budgetData])
      .select()
      .single();

    if (error) throw error;

    logSuccess('Created', 'contract budget', data);
    return { data: data as ContractBudgetData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to create contract budget');
  }
}

/**
 * Update an existing contract budget entry
 */
export async function updateContractBudget(budgetId: string, budgetData: Partial<ContractBudgetData>) {
  try {
    const { data, error } = await supabase
      .from('contract_budget')
      .update(budgetData)
      .eq('id', budgetId)
      .select()
      .single();

    if (error) throw error;

    logSuccess('Updated', 'contract budget', data);
    return { data: data as ContractBudgetData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to update contract budget');
  }
}

/**
 * Delete a contract budget entry
 */
export async function deleteContractBudget(budgetId: string) {
  try {
    const { error } = await supabase
      .from('contract_budget')
      .delete()
      .eq('id', budgetId);

    if (error) throw error;

    logSuccess('Deleted', 'contract budget', { id: budgetId });
    return { data: true };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to delete contract budget');
  }
}
