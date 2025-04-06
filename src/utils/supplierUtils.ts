
import { SupplierData, SupplierCreateData } from '@/types/supplier-types';

/**
 * Prepares supplier data for database insertion by mapping frontend fields to database columns
 */
export function prepareSupplierForDb(supplierData: SupplierCreateData | Partial<SupplierData>): Record<string, any> {
  // Create base object with standard fields
  const dbData: Record<string, any> = {
    supplier_name: supplierData.supplier_name,
    supplier_type: supplierData.supplier_type,
    status: supplierData.status || 'active',
    abn: supplierData.abn,
    acn: supplierData.acn,
    business_name: supplierData.supplier_name, // Map supplier_name to business_name in the DB
    notes: supplierData.notes,
  };

  // Map contact details
  if (supplierData.contact_person) {
    dbData.primary_contact_name = supplierData.contact_person;
  }
  
  if (supplierData.phone) {
    dbData.primary_contact_phone = supplierData.phone;
  }
  
  if (supplierData.email) {
    dbData.primary_contact_email = supplierData.email;
  }

  // Add any other specific mappings needed
  if (supplierData.bank_details) {
    dbData.bank_details = supplierData.bank_details;
  }

  return dbData;
}

/**
 * Maps database supplier structure to frontend structure
 */
export function mapDbSupplierToUi(dbSupplier: any): SupplierData {
  return {
    supplier_id: dbSupplier.id,
    supplier_name: dbSupplier.business_name || dbSupplier.supplier_name,
    supplier_type: dbSupplier.supplier_type,
    status: dbSupplier.status,
    abn: dbSupplier.abn,
    acn: dbSupplier.acn,
    contact_person: dbSupplier.primary_contact_name,
    phone: dbSupplier.primary_contact_phone,
    email: dbSupplier.primary_contact_email,
    notes: dbSupplier.notes,
    bank_details: dbSupplier.bank_details,
    created_at: dbSupplier.created_at,
    updated_at: dbSupplier.updated_at,
  };
}

/**
 * Validate supplier data
 */
export function validateSupplier(data: Partial<SupplierData>) {
  const errors: Record<string, string> = {};
  
  if (!data.supplier_name) {
    errors.supplier_name = "Supplier name is required";
  }
  
  if (!data.supplier_type) {
    errors.supplier_type = "Supplier type is required";
  }
  
  if (!data.status) {
    errors.status = "Status is required";
  }
  
  // Basic ABN validation (11 digits)
  if (data.abn && !/^\d{11}$/.test(data.abn.replace(/\s/g, ''))) {
    errors.abn = "ABN must be 11 digits";
  }
  
  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}
