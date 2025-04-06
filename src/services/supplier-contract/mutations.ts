
import { supabase } from '@/integrations/supabase/client';
import { ErrorReporting } from '@/utils/errorReporting';
import { AppLogger, LogCategory } from '@/utils/logging';
import { AssignSupplierToContractData } from '@/types/supplier-contract-types';

/**
 * Assign a supplier to a contract
 */
export async function assignSupplierToContract(linkData: AssignSupplierToContractData) {
  try {
    AppLogger.info(LogCategory.SUPPLIER_CONTRACT, 'Assigning supplier to contract', { 
      supplierId: linkData.supplier_id, 
      contractId: linkData.contract_id 
    });
    
    const { data, error } = await supabase
      .from('supplier_contract')
      .insert({
        supplier_id: linkData.supplier_id,
        contract_id: linkData.contract_id,
        role: linkData.role,
        status: 'active',
        services: linkData.services,
        percentage: linkData.percentage,
        notes: linkData.notes,
        assigned_at: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Error assigning supplier to contract', { error, linkData });
      
      return {
        category: 'server',
        message: `Failed to assign supplier to contract: ${error.message}`,
        details: error
      };
    }
    
    return {
      data,
      message: 'Supplier assigned to contract successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Exception assigning supplier to contract', { error, linkData });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while assigning supplier to contract',
      details: error
    };
  }
}

/**
 * Remove a supplier from a contract
 */
export async function removeSupplierFromContract(supplierId: string, contractId: string) {
  try {
    AppLogger.info(LogCategory.SUPPLIER_CONTRACT, 'Removing supplier from contract', { supplierId, contractId });
    
    const { data, error } = await supabase
      .from('supplier_contract')
      .delete()
      .match({ supplier_id: supplierId, contract_id: contractId })
      .select()
      .single();
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Error removing supplier from contract', { error, supplierId, contractId });
      
      return {
        category: 'server',
        message: `Failed to remove supplier from contract: ${error.message}`,
        details: error
      };
    }
    
    return {
      data,
      message: 'Supplier removed from contract successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Exception removing supplier from contract', { error, supplierId, contractId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while removing supplier from contract',
      details: error
    };
  }
}
