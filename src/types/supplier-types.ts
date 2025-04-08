import { z } from "zod";

// Supplier status enum
export enum SupplierStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  TERMINATED = "terminated",
  ON_HOLD = "on_hold",
  SUSPENDED = "suspended"
}

// Supplier type enum
export enum SupplierType {
  SERVICE = "service",
  PRODUCT = "product",
  BOTH = "both"
}

// Australian states
export const AustralianStates = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

// Bank details schema
export const bankDetailsSchema = z.object({
  account_name: z.string().optional().nullable(),
  account_number: z.string().optional().nullable(),
  bsb: z.string().optional().nullable(),
  bank_name: z.string().optional().nullable(),
});

export type BankDetails = z.infer<typeof bankDetailsSchema>;

// Base supplier schema that matches the database table structure
export const supplierFormSchema = z.object({
  supplier_name: z.string().min(1, "Supplier name is required"),
  business_name: z.string().optional(), // Added for compatibility
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
  email: z.string().optional().nullable(),
  billing_email: z.string().optional().nullable(),
  invoice_email: z.string().optional().nullable(),
  services_provided: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  bank_details: bankDetailsSchema.optional().nullable(),
  payment_terms_days: z.number().int().optional().nullable(),
  preferred_payment_method: z.string().optional().nullable(),
});

// Define the SupplierData type based on the Zod schema
export type SupplierData = {
  supplier_id?: string; // Database PK
  id?: string; // Alternative key for compatibility
  supplier_name: string; 
  business_name?: string; // Added for compatibility
  supplier_type: string;
  status: string;
  date_onboarded?: string | null;
  date_terminated?: string | null;
  abn?: string | null;
  acn?: string | null;
  supplier_code?: string | null;
  address_line?: string | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  billing_email?: string | null;
  invoice_email?: string | null;
  services_provided?: string | null;
  notes?: string | null;
  bank_details?: BankDetails | null;
  payment_terms_days?: number | null;
  preferred_payment_method?: string | null;
  created_at?: string;
  updated_at?: string;
};

// Type for creating a new supplier (omits id and timestamps)
export type SupplierCreateData = Omit<SupplierData, 'supplier_id' | 'id' | 'created_at' | 'updated_at'>;

// Supplier with compliance documents
export type SupplierWithCompliance = SupplierData & {
  compliance_documents: ComplianceDocument[];
};

// Compliance document type
export type ComplianceDocument = {
  id: string;
  document_id: string; // Added this field to match what's used in the component
  supplier_id: string;
  document_name: string;
  document_type: string;
  expiry_date?: string | null;
  file_url?: string | null;
  created_at: string;
  updated_at: string;
};
