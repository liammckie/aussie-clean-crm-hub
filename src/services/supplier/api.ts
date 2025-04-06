
import { supabase } from '@/integrations/supabase/client';
import { SupplierData, SupplierDocumentData, SupplierCreateData, SupplierServiceData } from './types';
import { ErrorResponse, handleSupabaseError, logSuccess } from '@/utils/supabaseErrors';

/**
 * Get all suppliers
 */
export async function getAllSuppliers() {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('business_name', { ascending: true });

    if (error) throw error;

    logSuccess('Retrieved', 'suppliers', data);
    return { data: data as SupplierData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch suppliers');
  }
}

/**
 * Get a supplier by ID
 */
export async function getSupplierById(supplierId: string) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .single();

    if (error) throw error;

    logSuccess('Retrieved', 'supplier', data);
    return { data: data as SupplierData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch supplier details');
  }
}

/**
 * Create a new supplier
 */
export async function createSupplier(supplierData: SupplierCreateData) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([supplierData])
      .select()
      .single();

    if (error) throw error;

    logSuccess('Created', 'supplier', data);
    return { data: data as SupplierData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to create supplier');
  }
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(supplierId: string, supplierData: Partial<SupplierData>) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplierData)
      .eq('id', supplierId)
      .select()
      .single();

    if (error) throw error;

    logSuccess('Updated', 'supplier', data);
    return { data: data as SupplierData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to update supplier');
  }
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(supplierId: string) {
  try {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', supplierId);

    if (error) throw error;

    logSuccess('Deleted', 'supplier', { id: supplierId });
    return { data: true };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to delete supplier');
  }
}

/**
 * Get compliance documents for a supplier
 */
export async function getSupplierDocuments(supplierId: string) {
  try {
    const { data, error } = await supabase
      .from('supplier_compliance_documents')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'supplier documents', data);
    return { data: data as SupplierDocumentData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch supplier documents');
  }
}

/**
 * Create a new supplier document
 */
export async function createSupplierDocument(documentData: Omit<SupplierDocumentData, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('supplier_compliance_documents')
      .insert([documentData])
      .select()
      .single();

    if (error) throw error;

    logSuccess('Created', 'supplier document', data);
    return { data: data as SupplierDocumentData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to create supplier document');
  }
}

/**
 * Update an existing supplier document
 */
export async function updateSupplierDocument(documentId: string, documentData: Partial<SupplierDocumentData>) {
  try {
    const { data, error } = await supabase
      .from('supplier_compliance_documents')
      .update(documentData)
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;

    logSuccess('Updated', 'supplier document', data);
    return { data: data as SupplierDocumentData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to update supplier document');
  }
}

/**
 * Delete a supplier document
 */
export async function deleteSupplierDocument(documentId: string) {
  try {
    const { error } = await supabase
      .from('supplier_compliance_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;

    logSuccess('Deleted', 'supplier document', { id: documentId });
    return { data: true };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to delete supplier document');
  }
}

/**
 * Get services provided by a supplier
 */
export async function getSupplierServices(supplierId: string) {
  try {
    const { data, error } = await supabase
      .from('supplier_services')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('service_type', { ascending: true });

    if (error) throw error;

    logSuccess('Retrieved', 'supplier services', data);
    return { data: data as SupplierServiceData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch supplier services');
  }
}

/**
 * Create a new supplier service
 */
export async function createSupplierService(serviceData: Omit<SupplierServiceData, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('supplier_services')
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;

    logSuccess('Created', 'supplier service', data);
    return { data: data as SupplierServiceData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to create supplier service');
  }
}

/**
 * Delete a supplier service
 */
export async function deleteSupplierService(serviceId: string) {
  try {
    const { error } = await supabase
      .from('supplier_services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;

    logSuccess('Deleted', 'supplier service', { id: serviceId });
    return { data: true };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to delete supplier service');
  }
}

/**
 * Get all contracts associated with a supplier
 */
export async function getSupplierContracts(supplierId: string) {
  try {
    // This is a placeholder for the actual query once we implement supplier-contract relationships
    // Will need to be updated based on how we structure the relationship
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'supplier contracts', data);
    return { data };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch supplier contracts');
  }
}
