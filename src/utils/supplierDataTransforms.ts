
import { SupplierFormData, SupplierData, SupplierDisplayData } from '@/types/supplier-types';

/**
 * Transform form data to database format
 */
export function formDataToDbData(formData: SupplierFormData): Partial<SupplierData> {
  return {
    business_name: formData.supplier_name,
    supplier_type: formData.supplier_type,
    status: formData.status,
    abn: formData.abn,
    acn: formData.acn,
    notes: formData.notes,
    primary_contact_name: formData.contact_person,
    primary_contact_phone: formData.phone,
    primary_contact_email: formData.email,
    // Map payment_terms to payment_terms_days if it's a number
    payment_terms_days: formData.payment_terms ? parseInt(formData.payment_terms.replace(/\D/g, '')) || undefined : undefined,
  };
}

/**
 * Transform database data to display format
 */
export function dbDataToDisplayData(dbData: SupplierData): SupplierDisplayData {
  return {
    ...dbData,
    supplier_name: dbData.business_name,
    contact_person: dbData.primary_contact_name,
    phone: dbData.primary_contact_phone,
    email: dbData.primary_contact_email,
    supplier_code: undefined, // Not in current schema
    date_onboarded: undefined, // Not in current schema
    date_terminated: undefined, // Not in current schema
    address_line: undefined, // Not in current schema
    suburb: undefined, // Not in current schema
    state: undefined, // Not in current schema
    postcode: undefined, // Not in current schema
    country: undefined, // Not in current schema
    billing_email: undefined, // Not in current schema
    invoice_email: undefined, // Not in current schema
    services_provided: undefined, // Not in current schema
    payment_terms: dbData.payment_terms_days ? `net_${dbData.payment_terms_days}` : undefined,
    bank_details: undefined, // Not in current schema
  };
}

/**
 * Transform display data to form data for editing
 */
export function displayDataToFormData(displayData: SupplierDisplayData): SupplierFormData {
  return {
    supplier_name: displayData.supplier_name || displayData.business_name,
    supplier_type: displayData.supplier_type || '',
    status: displayData.status,
    date_onboarded: displayData.date_onboarded || null,
    date_terminated: displayData.date_terminated || null,
    abn: displayData.abn || '',
    acn: displayData.acn || '',
    supplier_code: displayData.supplier_code || '',
    address_line: displayData.address_line || '',
    suburb: displayData.suburb || '',
    state: displayData.state || '',
    postcode: displayData.postcode || '',
    country: displayData.country || 'Australia',
    contact_person: displayData.contact_person || displayData.primary_contact_name || '',
    phone: displayData.phone || displayData.primary_contact_phone || '',
    email: displayData.email || displayData.primary_contact_email || '',
    billing_email: displayData.billing_email || '',
    invoice_email: displayData.invoice_email || '',
    services_provided: displayData.services_provided || '',
    notes: displayData.notes || '',
    payment_terms: displayData.payment_terms || ''
  };
}
