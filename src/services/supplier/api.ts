
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
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Create a new supplier
 */
export async function createSupplier(supplierData: SupplierCreateData): Promise<SupplierApiResponse> {
  try {
    AppLogger.info(LogCategory.SUPPLIER, 'Creating new supplier', { supplierName: supplierData.supplier_name });
    
    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        business_name: supplierData.supplier_name,
        supplier_type: supplierData.supplier_type,
        status: supplierData.status,
        abn: supplierData.abn,
        notes: supplierData.notes,
        primary_contact_name: supplierData.contact_person,
        primary_contact_phone: supplierData.phone,
        primary_contact_email: supplierData.email
      })
      .select()
      .single();
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER, 'Error creating supplier', { error });
      
      return {
        category: ErrorCategory.PERMISSION,
        message: `Failed to create supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData,
      message: 'Supplier created successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER, 'Exception creating supplier', { error });
    ErrorReporting.captureException(error);
    
    return {
      category: ErrorCategory.SERVER,
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
    AppLogger.info(LogCategory.SUPPLIER, 'Fetching all suppliers');
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('business_name');
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER, 'Error fetching suppliers', { error });
      
      return {
        category: ErrorCategory.PERMISSION,
        message: `Failed to fetch suppliers: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData[],
      message: 'Suppliers fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER, 'Exception fetching suppliers', { error });
    ErrorReporting.captureException(error);
    
    return {
      category: ErrorCategory.SERVER,
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
    AppLogger.info(LogCategory.SUPPLIER, 'Fetching supplier by ID', { supplierId });
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return {
          category: ErrorCategory.NOT_FOUND,
          message: 'Supplier not found',
          details: error
        };
      }
      
      AppLogger.error(LogCategory.SUPPLIER, 'Error fetching supplier', { error, supplierId });
      
      return {
        category: ErrorCategory.PERMISSION,
        message: `Failed to fetch supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData,
      message: 'Supplier fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER, 'Exception fetching supplier', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: ErrorCategory.SERVER,
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
    AppLogger.info(LogCategory.SUPPLIER, 'Updating supplier', { supplierId });
    
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplierData)
      .eq('id', supplierId)
      .select()
      .single();
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER, 'Error updating supplier', { error, supplierId });
      
      return {
        category: ErrorCategory.PERMISSION,
        message: `Failed to update supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data as SupplierData,
      message: 'Supplier updated successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER, 'Exception updating supplier', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: ErrorCategory.SERVER,
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
    AppLogger.info(LogCategory.SUPPLIER, 'Deleting supplier', { supplierId });
    
    // First get the supplier to return in the response
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .single();
      
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', supplierId);
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER, 'Error deleting supplier', { error, supplierId });
      
      return {
        category: ErrorCategory.PERMISSION,
        message: `Failed to delete supplier: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: supplier as SupplierData,
      message: 'Supplier deleted successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER, 'Exception deleting supplier', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: ErrorCategory.SERVER,
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
    AppLogger.info(LogCategory.SUPPLIER, 'Fetching compliance documents', { supplierId });
    
    const { data, error } = await supabase
      .from('supplier_compliance_documents')
      .select('*')
      .eq('supplier_id', supplierId);
      
    if (error) {
      AppLogger.error(LogCategory.SUPPLIER, 'Error fetching compliance documents', { error, supplierId });
      
      return {
        category: ErrorCategory.PERMISSION,
        message: `Failed to fetch compliance documents: ${error.message}`,
        details: error
      };
    }
    
    return {
      data: data,
      message: 'Compliance documents fetched successfully'
    };
  } catch (error) {
    AppLogger.error(LogCategory.SUPPLIER, 'Exception fetching compliance documents', { error, supplierId });
    ErrorReporting.captureException(error);
    
    return {
      category: ErrorCategory.SERVER,
      message: 'An unexpected error occurred while fetching compliance documents',
      details: error
    };
  }
}
