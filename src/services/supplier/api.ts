
import { supabase } from '@/integrations/supabase/client';
import type { 
  SupplierApiResponse, 
  SuppliersApiResponse, 
  ComplianceDocumentsApiResponse,
  ComplianceDocumentApiResponse
} from './types';
import type { SupplierCreateData, SupplierData } from '@/types/supplier-types';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * Create a new supplier
 */
export async function createSupplier(supplierData: SupplierCreateData): Promise<SupplierApiResponse> {
  try {
    AppLogger.info(LogCategory.DATA, 'Creating new supplier', { supplierName: supplierData.supplier_name });
    
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single();
      
    if (error) {
      AppLogger.error(LogCategory.DATA, 'Error creating supplier', { error });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to create supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData,
      message: 'Supplier created successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.DATA, 'Exception creating supplier', { error });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while creating the supplier',
      details: error
    };
  }
}

/**
 * Get all suppliers
 */
export async function getAllSuppliers(): Promise<SuppliersApiResponse> {
  try {
    AppLogger.info(LogCategory.DATA, 'Fetching all suppliers');
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('supplier_name');
      
    if (error) {
      AppLogger.error(LogCategory.DATA, 'Error fetching suppliers', { error });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to fetch suppliers: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData[],
      message: 'Suppliers fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.DATA, 'Exception fetching suppliers', { error });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while fetching suppliers',
      details: error
    };
  }
}

/**
 * Get supplier by ID
 */
export async function getSupplierById(supplierId: string): Promise<SupplierApiResponse> {
  try {
    AppLogger.info(LogCategory.DATA, 'Fetching supplier by ID', { supplierId });
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('supplier_id', supplierId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return {
          category: 'not_found',
          message: 'Supplier not found',
          details: error
        };
      }
      
      AppLogger.error(LogCategory.DATA, 'Error fetching supplier', { error, supplierId });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to fetch supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData,
      message: 'Supplier fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.DATA, 'Exception fetching supplier', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while fetching the supplier',
      details: error
    };
  }
}

/**
 * Update supplier
 */
export async function updateSupplier(supplierId: string, supplierData: Partial<SupplierData>): Promise<SupplierApiResponse> {
  try {
    AppLogger.info(LogCategory.DATA, 'Updating supplier', { supplierId });
    
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplierData)
      .eq('supplier_id', supplierId)
      .select()
      .single();
      
    if (error) {
      AppLogger.error(LogCategory.DATA, 'Error updating supplier', { error, supplierId });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to update supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData,
      message: 'Supplier updated successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.DATA, 'Exception updating supplier', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while updating the supplier',
      details: error
    };
  }
}

/**
 * Delete supplier
 */
export async function deleteSupplier(supplierId: string): Promise<SupplierApiResponse> {
  try {
    AppLogger.info(LogCategory.DATA, 'Deleting supplier', { supplierId });
    
    // First get the supplier to return in the response
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('*')
      .eq('supplier_id', supplierId)
      .single();
      
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('supplier_id', supplierId);
      
    if (error) {
      AppLogger.error(LogCategory.DATA, 'Error deleting supplier', { error, supplierId });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to delete supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: supplier as SupplierData,
      message: 'Supplier deleted successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.DATA, 'Exception deleting supplier', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while deleting the supplier',
      details: error
    };
  }
}

/**
 * Get compliance documents for supplier
 */
export async function getComplianceDocuments(supplierId: string): Promise<ComplianceDocumentsApiResponse> {
  try {
    AppLogger.info(LogCategory.DATA, 'Fetching compliance documents', { supplierId });
    
    const { data, error } = await supabase
      .from('supplier_compliance_documents')
      .select('*')
      .eq('supplier_id', supplierId);
      
    if (error) {
      AppLogger.error(LogCategory.DATA, 'Error fetching compliance documents', { error, supplierId });
      
      return {
        category: error.code === '42P01' ? 'permission' : 'server',
        message: `Failed to fetch compliance documents: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data,
      message: 'Compliance documents fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.DATA, 'Exception fetching compliance documents', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: 'server',
      message: 'An unexpected error occurred while fetching compliance documents',
      details: error
    };
  }
}
