
import { z } from 'zod';

// Payment terms for suppliers
export const SUPPLIER_PAYMENT_TERMS = ['net_7', 'net_14', 'net_30', 'net_45', 'net_60', 'due_on_receipt'];

export enum SupplierType {
  SERVICE = 'Service Provider',
  PRODUCT = 'Product Supplier',
  CONTRACTOR = 'Independent Contractor',
  CONSULTANT = 'Consultant'
}

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ONBOARDING = 'onboarding',
  TERMINATED = 'terminated',
  ON_HOLD = 'on_hold',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export const AustralianStates = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

// Form schema for creating/editing suppliers
export const supplierFormSchema = z.object({
  supplier_name: z.string().min(1, 'Supplier name is required'),
  supplier_type: z.string(),
  status: z.string(),
  date_onboarded: z.string().optional().nullable(),
  date_terminated: z.string().optional().nullable(),
  abn: z.string().optional().nullable(),
  acn: z.string().optional().nullable(),
  supplier_code: z.string().optional().nullable(),
  address_line: z.string().optional().nullable(),
  suburb: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  contact_person: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable(),
  billing_email: z.string().email('Invalid email format').optional().nullable(),
  invoice_email: z.string().email('Invalid email format').optional().nullable(),
  services_provided: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  payment_terms: z.string().optional().nullable()
}).refine((data) => {
  // If status is active, require payment_terms
  if (data.status === SupplierStatus.ACTIVE && !data.payment_terms) {
    return false;
  }
  return true;
}, {
  message: "Payment terms are required for active suppliers",
  path: ["payment_terms"]
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
export type SupplierCreateData = z.infer<typeof supplierFormSchema>;

// Database schema interface - matches actual suppliers table structure
export interface SupplierData {
  id: string;
  business_name: string;
  supplier_type?: string;
  status: string;
  abn?: string;
  acn?: string;
  notes?: string;
  primary_contact_name?: string;
  primary_contact_phone?: string;
  primary_contact_email?: string;
  last_review_date?: string;
  payment_terms_days?: number;
  preferred_payment_method?: string;
  compliance_status?: string;
  created_at: string;
  updated_at: string;
}

// Extended interface for display purposes that includes form fields
export interface SupplierDisplayData extends SupplierData {
  supplier_name: string; // Maps to business_name
  supplier_code?: string;
  date_onboarded?: string;
  date_terminated?: string;
  address_line?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  contact_person?: string; // Maps to primary_contact_name
  phone?: string; // Maps to primary_contact_phone
  email?: string; // Maps to primary_contact_email
  billing_email?: string;
  invoice_email?: string;
  services_provided?: string;
  payment_terms?: string;
  bank_details?: {
    bsb?: string;
    account_number?: string;
    account_name?: string;
  };
}

// Compliance document interface
export interface ComplianceDocument {
  id: string;
  supplier_id: string;
  document_name: string;
  document_type: string;
  file_url?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}
