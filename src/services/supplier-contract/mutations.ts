
import { supabase } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';
import { SupplierContractLink, AssignSupplierToContractData } from '@/types/supplier-contract-types';
import { ApiResponse, handleApiError } from '@/utils/api-utils';

/**
 * Link a supplier to a contract
 */
export async function assignSupplierToContract(linkData: AssignSupplierToContractData): Promise<ApiResponse<any>> {
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
      return handleApiError(
        error, 
        `Failed to assign supplier to contract: ${error.message}`,
        {
          supplierId: linkData.supplier_id,
          contractId: linkData.contract_id
        },
        LogCategory.CONTRACT
      );
    }
    
    return {
      data,
      message: 'Supplier assigned to contract successfully'
    };
  } catch (error) {
    return handleApiError(
      error, 
      'An unexpected error occurred while assigning supplier to contract',
      {
        supplierId: linkData.supplier_id,
        contractId: linkData.contract_id
      },
      LogCategory.CONTRACT
    );
  }
}

/**
 * Remove a supplier from a contract
 */
export async function removeSupplierFromContract(supplierId: string, contractId: string): Promise<ApiResponse<any>> {
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
      return handleApiError(
        error, 
        `Failed to remove supplier from contract: ${error.message}`,
        { supplierId, contractId },
        LogCategory.CONTRACT
      );
    }
    
    return {
      data,
      message: 'Supplier removed from contract successfully'
    };
  } catch (error) {
    return handleApiError(
      error, 
      'An unexpected error occurred while removing supplier from contract',
      { supplierId, contractId },
      LogCategory.CONTRACT
    );
  }
}
