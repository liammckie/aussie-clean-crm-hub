
import { supabase } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';
import { SupplierContractLink, AssignSupplierToContractData } from '@/types/supplier-contract-types';
import { ApiResponse, handleApiError, createSuccessResponse, ErrorCategory } from '@/utils/api-utils';

/**
 * Link a supplier to a contract
 */
export async function assignSupplierToContract(linkData: AssignSupplierToContractData): Promise<ApiResponse<any>> {
  try {
    AppLogger.info(LogCategory.CONTRACT, 'Assigning supplier to contract', { 
      supplierId: linkData.supplier_id,
      contractId: linkData.contract_id
    });
    
    // Check for existing link to prevent duplicates
    const { data: existingLink, error: checkError } = await supabase
      .from('supplier_contract_links')
      .select()
      .eq('supplier_id', linkData.supplier_id)
      .eq('contract_id', linkData.contract_id)
      .single();
    
    if (existingLink) {
      return {
        category: ErrorCategory.VALIDATION,
        message: 'This supplier is already assigned to the contract',
        details: existingLink
      };
    }
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found, which is expected
      return handleApiError(
        checkError,
        'Error checking for existing supplier-contract link',
        {
          supplierId: linkData.supplier_id,
          contractId: linkData.contract_id
        },
        LogCategory.CONTRACT
      );
    }
    
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
        'Failed to assign supplier to contract',
        {
          supplierId: linkData.supplier_id,
          contractId: linkData.contract_id
        },
        LogCategory.CONTRACT
      );
    }
    
    return createSuccessResponse(
      data, 
      'Supplier assigned to contract successfully'
    );
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
    
    // Check if link exists before attempting to delete
    const { data: existingLink, error: checkError } = await supabase
      .from('supplier_contract_links')
      .select()
      .eq('supplier_id', supplierId)
      .eq('contract_id', contractId)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') { // Not found
        return {
          category: ErrorCategory.NOT_FOUND,
          message: 'Supplier is not assigned to this contract',
          details: { supplierId, contractId }
        };
      }
      
      return handleApiError(
        checkError, 
        'Error checking supplier-contract link',
        { supplierId, contractId },
        LogCategory.CONTRACT
      );
    }
    
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
        'Failed to remove supplier from contract',
        { supplierId, contractId },
        LogCategory.CONTRACT
      );
    }
    
    return createSuccessResponse(
      data,
      'Supplier removed from contract successfully'
    );
  } catch (error) {
    return handleApiError(
      error, 
      'An unexpected error occurred while removing supplier from contract',
      { supplierId, contractId },
      LogCategory.CONTRACT
    );
  }
}
