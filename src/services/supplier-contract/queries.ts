
import { supabase } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ContractWithSupplier } from '@/types/supplier-contract-types';
import { ApiResponse, handleApiError } from '@/utils/api-utils';

/**
 * Get contracts associated with a specific supplier
 */
export async function getContractsBySupplier(supplierId: string): Promise<ApiResponse<ContractWithSupplier[]>> {
  try {
    AppLogger.info(LogCategory.CONTRACT, 'Fetching contracts for supplier', { supplierId });
    
    const { data, error } = await supabase
      .from('supplier_contract_links')
      .select(`
        *,
        contracts:contract_id (
          contract_id,
          contract_number,
          status,
          contract_value,
          clients:client_id (
            client_name
          )
        )
      `)
      .eq('supplier_id', supplierId);
    
    if (error) {
      return handleApiError(
        error, 
        `Failed to fetch supplier contracts: ${error.message}`,
        { supplierId },
        LogCategory.CONTRACT
      );
    }
    
    // Transform the data to match the ContractWithSupplier type
    const contracts = data.map(link => {
      const contract = link.contracts;
      return {
        contract_id: contract.contract_id,
        contract_number: contract.contract_number,
        client_name: contract.clients?.client_name || 'Unknown Client',
        status: contract.status,
        contract_value: contract.contract_value,
        supplier_role: link.role
      } as ContractWithSupplier;
    });
    
    return {
      data: contracts,
      message: 'Supplier contracts fetched successfully'
    };
  } catch (error) {
    return handleApiError(
      error, 
      'An unexpected error occurred while fetching supplier contracts',
      { supplierId },
      LogCategory.CONTRACT
    );
  }
}

/**
 * Get suppliers associated with a specific contract
 */
export async function getSuppliersByContract(contractId: string): Promise<ApiResponse<any[]>> {
  try {
    AppLogger.info(LogCategory.CONTRACT, 'Fetching suppliers for contract', { contractId });
    
    const { data, error } = await supabase
      .from('supplier_contract_links')
      .select(`
        *,
        suppliers:supplier_id (
          supplier_id,
          supplier_name,
          supplier_type,
          status
        )
      `)
      .eq('contract_id', contractId);
    
    if (error) {
      return handleApiError(
        error, 
        `Failed to fetch contract suppliers: ${error.message}`,
        { contractId },
        LogCategory.CONTRACT
      );
    }
    
    return {
      data,
      message: 'Contract suppliers fetched successfully'
    };
  } catch (error) {
    return handleApiError(
      error, 
      'An unexpected error occurred while fetching contract suppliers',
      { contractId },
      LogCategory.CONTRACT
    );
  }
}
