
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
    payment_terms: supplierData.payment_terms
  };

  // Map contact information
  if (supplierData.contact_person) dbData.primary_contact_name = supplierData.contact_person;
  if (supplierData.email) dbData.primary_contact_email = supplierData.email;
  if (supplierData.phone) dbData.primary_contact_phone = supplierData.phone;

  // Add additional fields if present
  if (supplierData.date_onboarded) dbData.date_onboarded = supplierData.date_onboarded;
  if (supplierData.date_terminated) dbData.date_terminated = supplierData.date_terminated;
  
  return dbData;
}
