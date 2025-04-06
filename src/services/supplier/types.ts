
/**
 * Type definitions for the supplier management system
 */

// Main supplier data type
export interface SupplierData {
  id: string;
  business_name: string;
  abn?: string;
  acn?: string;
  status: 'active' | 'on_hold' | 'suspended' | 'terminated';
  supplier_code?: string;
  primary_contact_name?: string;
  primary_contact_phone?: string;
  primary_contact_email?: string;
  billing_email?: string;
  invoice_email?: string;
  services_provided?: string;
  supplier_type?: string;
  date_onboarded?: string;
  date_terminated?: string | null;
  compliance_status?: string;
  last_review_date?: string | null;
  notes?: string;
  bank_details?: SupplierBankDetails;
  cumulative_spend?: number;
  unpaid_balance?: number;
  sites_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Bank details stored as a nested object
export interface SupplierBankDetails {
  account_name?: string;
  bsb?: string;
  account_number?: string;
  bank_name?: string;
  payment_reference?: string;
}

// Supplier compliance document
export interface SupplierDocumentData {
  id: string;
  supplier_id: string;
  document_name: string;
  document_type: string;
  expiry_date?: string;
  file_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Supplier create data for new suppliers
export interface SupplierCreateData {
  business_name: string;
  abn?: string;
  acn?: string;
  status: 'active' | 'on_hold' | 'suspended' | 'terminated';
  supplier_code?: string;
  primary_contact_name?: string;
  primary_contact_phone?: string;
  primary_contact_email?: string;
  billing_email?: string;
  invoice_email?: string;
  services_provided?: string;
  supplier_type?: string;
  date_onboarded?: string;
  notes?: string;
  bank_details?: SupplierBankDetails;
}

// Service that a supplier provides
export interface SupplierServiceData {
  id: string;
  supplier_id: string;
  service_type: string;
  created_at?: string;
}
