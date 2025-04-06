
import { supabase } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ErrorReporting } from '@/utils/errorReporting';
import { SupplierContractLink, AssignSupplierToContractData } from '@/types/supplier-contract-types';
import { ContractWithSupplier } from '@/types/supplier-contract-types';

/**
 * Get contracts associated with a specific supplier
 */
export async function getContractsBySupplier(supplierId: string) {
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
      AppLogger.error(LogCategory.CONTRACT, 'Error fetching supplier contracts', { error, supplierId });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to fetch supplier contracts: ${error.message}`,
        details: error
      };
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
    AppLogger.error(LogCategory.CONTRACT, 'Exception fetching supplier contracts', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while fetching supplier contracts',
      details: error
    };
  }
}

/**
 * Get suppliers associated with a specific contract
 */
export async function getSuppliersByContract(contractId: string) {
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
      AppLogger.error(LogCategory.CONTRACT, 'Error fetching contract suppliers', { error, contractId });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to fetch contract suppliers: ${error.message}`,
        details: error
      };
    }
    
    return {
      data,
      message: 'Contract suppliers fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.CONTRACT, 'Exception fetching contract suppliers', { error, contractId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while fetching contract suppliers',
      details: error
    };
  }
}

/**
 * Link a supplier to a contract
 */
export async function assignSupplierToContract(linkData: AssignSupplierToContractData) {
  try {
    AppLogger.info(LogCategory.CONTRACT, 'Assigning supplier to contract', { 
      supplierId: linkData.supplier_id,
      contractId: linkData.contract_id
    });
    
    const link: Partial<SupplierContractLink> = {
      supplier_id: linkData.supplier_id,
      contract_id: linkData.contract_id,
      role: linkData.role,
      services: linkData.services,
      percentage: linkData.percentage,
      notes: linkData.notes,
      status: 'active',
      assigned_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('supplier_contract_links')
      .insert(link)
      .select()
      .single();
    
    if (error) {
      AppLogger.error(LogCategory.CONTRACT, 'Error assigning supplier to contract', {
        error,
        supplierId: linkData.supplier_id,
        contractId: linkData.contract_id
      });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to assign supplier to contract: ${error.message}`,
        details: error
      };
    }
    
    return {
      data,
      message: 'Supplier assigned to contract successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.CONTRACT, 'Exception assigning supplier to contract', {
      error,
      supplierId: linkData.supplier_id,
      contractId: linkData.contract_id
    });
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
    AppLogger.info(LogCategory.CONTRACT, 'Removing supplier from contract', { supplierId, contractId });
    
    const { data, error } = await supabase
      .from('supplier_contract_links')
      .delete()
      .eq('supplier_id', supplierId)
      .eq('contract_id', contractId)
      .select()
      .single();
    
    if (error) {
      AppLogger.error(LogCategory.CONTRACT, 'Error removing supplier from contract', {
        error,
        supplierId,
        contractId
      });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to remove supplier from contract: ${error.message}`,
        details: error
      };
    }
    
    return {
      data,
      message: 'Supplier removed from contract successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.CONTRACT, 'Exception removing supplier from contract', {
      error,
      supplierId,
      contractId
    });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while removing supplier from contract',
      details: error
    };
  }
}
