
import { z } from 'zod';

// Enums for supplier types and statuses
export enum SupplierType {
  CONSUMABLE = 'Consumable',
  SERVICE = 'Service',
  DELIVERY = 'Delivery',
  EQUIPMENT = 'Equipment',
  SUBCONTRACTOR = 'Subcontractor',
  STAFFING = 'Staffing',
  TRAINING = 'Training',
  INSURANCE = 'Insurance',
  OTHER = 'Other'
}

export enum SupplierStatus {
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  SUSPENDED = 'Suspended',
  TERMINATED = 'Terminated'
}

export const AustralianStates = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const;
export type AustralianState = typeof AustralianStates[number];

// Zod schema for supplier validation
export const supplierFormSchema = z.object({
  supplier_name: z.string().min(1, 'Supplier name is required'),
  supplier_type: z.nativeEnum(SupplierType),
  status: z.nativeEnum(SupplierStatus).default(SupplierStatus.ACTIVE),
  date_onboarded: z.string().optional(),
  date_terminated: z.string().nullable().optional(),
  abn: z.string().optional(),
  acn: z.string().optional(),
  supplier_code: z.string().optional(),
  address_line: z.string().optional(),
  suburb: z.string().optional(),
  state: z.enum(AustralianStates).optional(),
  postcode: z.string().regex(/^\d{4}$/, 'Must be a valid 4-digit Australian postcode').optional(),
  country: z.string().default('Australia'),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  billing_email: z.string().email('Invalid email address').optional(),
  invoice_email: z.string().email('Invalid email address').optional(),
  services_provided: z.string().optional(),
  bank_details: z.object({
    bsb: z.string().optional(),
    account_number: z.string().optional(),
    account_name: z.string().optional()
  }).optional(),
  notes: z.string().optional()
});

// Type for supplier data
export type SupplierData = z.infer<typeof supplierFormSchema> & {
  supplier_id: string;
  created_at?: string;
  updated_at?: string;
  compliance_documents?: ComplianceDocument[];
  cumulative_spend?: number;
  unpaid_balance?: number;
  sites_count?: number;
  qa_scores?: QAScore[];
};

// Type for supplier creation
export type SupplierCreateData = Omit<SupplierData, 'supplier_id'>;

// Types for compliance documents
export interface ComplianceDocument {
  document_id: string;
  supplier_id: string;
  document_type: string;
  document_name: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  status?: string;
  document_url?: string;
  amount_covered?: number;
  issuer_name?: string;
  verified_by?: string;
  verified_at?: string;
}

// Types for QA scores
export interface QAScore {
  score_id: string;
  supplier_id: string;
  score: number;
  date: string;
  notes?: string;
  reviewer?: string;
}
