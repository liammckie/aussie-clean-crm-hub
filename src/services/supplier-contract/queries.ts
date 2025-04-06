
import { supabase } from '@/integrations/supabase/client';
import { ErrorReporting } from '@/utils/errorReporting';
import { AppLogger, LogCategory } from '@/utils/logging';

/**
 * Get all contracts associated with a supplier
 */
export async function getContractsBySupplier(supplierId: string) {
  try {
    AppLogger.info(LogCategory.SUPPLIER_CONTRACT, 'Fetching contracts by supplier', { supplierId });
    
    const { data, error } = await supabase
      .from('supplier_contract')
      .select(`
        link_id,
        role,
        status,
        services,
        percentage,
        assigned_at,
        contracts (
          id,
          contract_name,
          contract_code,
          status,
          total_annual_value
        )
      `)
      .eq('supplier_id', supplierId);
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Error fetching contracts by supplier', { error, supplierId });
      
      return {
        category: 'server',
        message: `Failed to fetch contracts for supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data,
      message: 'Contracts fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Exception fetching contracts by supplier', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while fetching supplier contracts',
      details: error
    };
  }
}

/**
 * Get all suppliers associated with a contract
 */
export async function getSuppliersByContract(contractId: string) {
  try {
    AppLogger.info(LogCategory.SUPPLIER_CONTRACT, 'Fetching suppliers by contract', { contractId });
    
    const { data, error } = await supabase
      .from('supplier_contract')
      .select(`
        link_id,
        role,
        status,
        services,
        percentage,
        assigned_at,
        suppliers (
          supplier_id,
          supplier_name,
          supplier_type,
          status,
          abn
        )
      `)
      .eq('contract_id', contractId);
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Error fetching suppliers by contract', { error, contractId });
      
      return {
        category: 'server',
        message: `Failed to fetch suppliers for contract: ${error.message}`,
        details: error
      };
    }
    
    return {
      data,
      message: 'Suppliers fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Exception fetching suppliers by contract', { error, contractId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while fetching contract suppliers',
      details: error
    };
  }
}
