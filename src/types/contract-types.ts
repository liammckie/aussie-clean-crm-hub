import { ApiResponse } from "@/types/api-response";
import { z } from "zod";

/**
 * Contract data structure
 */
export interface ContractData {
  id: string;
  contract_name: string;
  client_id: string;
  client_name?: string;
  start_date: string;
  end_date?: string;
  status: string;
  contract_value?: number;
  created_at?: string;
  updated_at?: string;
  contract_code: string;
  service_type?: string;
  is_ongoing?: boolean;
  description?: string;
  delivery_mode?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  billing_frequency?: string;
  billing_type?: string;
  payment_terms?: string;
  payment_method?: string;
  total_weekly_value?: number;
  total_monthly_value?: number;
  total_annual_value?: number;
  supplier_cost_weekly?: number;
  supplier_cost_monthly?: number;
  supplier_cost_annual?: number;
  profit_margin_percentage?: number;
  sla_requirements?: string;
  billing_cycle?: string;
  client_representative_name?: string;
  client_representative_contact?: string;
  notes?: string;
  // Days of week fields
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  // Document URL fields
  contract_document_url?: string;
  scope_document_url?: string;
}

/**
 * Contract record from database
 */
export interface ContractRecord {
  id: string;
  contract_name: string;
  client_id: string;
  start_date: string;
  end_date?: string;
  status: string;
  contract_value?: number;
  description?: string;
  client_name?: string;
  // Billing information
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  // Additional fields
  created_at?: string;
  updated_at?: string;
  contract_code: string;
  service_type?: string;
  is_ongoing?: boolean;
  delivery_mode?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  billing_frequency?: string;
  billing_type?: string;
  total_weekly_value?: number;
  total_monthly_value?: number;
  total_annual_value?: number;
  supplier_cost_weekly?: number;
  supplier_cost_monthly?: number;
  supplier_cost_annual?: number;
  profit_margin_percentage?: number;
  sla_requirements?: string;
  client_representative_name?: string;
  client_representative_contact?: string;
  notes?: string;
  // Days of week fields
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  // Document URL fields
  contract_document_url?: string;
  scope_document_url?: string;
}

// Type alias for creating contracts (backward compatibility)
export type ContractCreateData = Partial<ContractData>;

// Service types enum
export enum ServiceType {
  COMMERCIAL_CLEANING = "commercial_cleaning",
  RESIDENTIAL_CLEANING = "residential_cleaning",
  INDUSTRIAL_CLEANING = "industrial_cleaning",
  OFFICE_CLEANING = "office_cleaning",
  WINDOW_CLEANING = "window_cleaning",
  OTHER = "other"
}

// Contract form data schema
export const contractFormSchema = z.object({
  contract_name: z.string().min(2, "Contract name is required"),
  contract_code: z.string().min(1, "Contract code is required"),
  client_id: z.string().uuid("Valid client ID is required"),
  service_type: z.string().optional(),
  status: z.string().default("draft"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_ongoing: z.boolean().optional().default(false),
  contract_value: z.number().optional(),
  description: z.string().optional(),
  delivery_mode: z.string().optional(),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
  billing_frequency: z.string().optional(),
  billing_type: z.string().optional(),
  payment_terms: z.string().optional(),
  payment_method: z.string().optional(),
  total_weekly_value: z.number().optional(),
  total_monthly_value: z.number().optional(),
  total_annual_value: z.number().optional(),
  supplier_cost_weekly: z.number().optional(),
  supplier_cost_monthly: z.number().optional(),
  supplier_cost_annual: z.number().optional(),
  profit_margin_percentage: z.number().optional(),
  sla_requirements: z.string().optional(),
  client_representative_name: z.string().optional(),
  client_representative_contact: z.string().optional(),
  notes: z.string().optional(),
  // Days of week fields
  monday: z.boolean().optional().default(false),
  tuesday: z.boolean().optional().default(false),
  wednesday: z.boolean().optional().default(false),
  thursday: z.boolean().optional().default(false),
  friday: z.boolean().optional().default(false),
  saturday: z.boolean().optional().default(false),
  sunday: z.boolean().optional().default(false),
  // Document URL fields
  contract_document_url: z.string().url("Must be a valid URL").optional(),
  scope_document_url: z.string().url("Must be a valid URL").optional()
}).refine((data) => {
  // If status is active, require billing_frequency and payment_terms
  if (data.status === 'active') {
    if (!data.billing_frequency) {
      return false;
    }
    if (!data.payment_terms) {
      return false;
    }
  }
  return true;
}, {
  message: "Billing frequency and payment terms are required for active contracts",
  path: ["status"] // This will highlight the status field when the refinement fails
});

// Type inferred from schema
export type ContractFormData = z.infer<typeof contractFormSchema>;

// Helper to create default values
export const createDefaultContractValues = (initialValues: Partial<ContractFormData> = {}): ContractFormData => ({
  contract_name: "",
  contract_code: "",
  client_id: "",
  service_type: ServiceType.COMMERCIAL_CLEANING,
  status: "draft",
  start_date: new Date().toISOString().split("T")[0],
  is_ongoing: false,
  description: "",
  delivery_mode: "",
  account_manager: "",
  state_manager: "",
  national_manager: "",
  billing_frequency: "",
  billing_type: "",
  payment_terms: "",
  payment_method: "",
  total_weekly_value: undefined,
  total_monthly_value: undefined,
  total_annual_value: undefined,
  supplier_cost_weekly: undefined,
  supplier_cost_monthly: undefined,
  supplier_cost_annual: undefined,
  profit_margin_percentage: undefined,
  sla_requirements: "",
  client_representative_name: "",
  client_representative_contact: "",
  notes: "",
  // Days of week default values
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
  // Document URLs default values
  contract_document_url: "",
  scope_document_url: "",
  ...initialValues
});

// API response types
export type ContractApiResponse = ApiResponse<ContractData>;
export type ContractsApiResponse = ApiResponse<ContractData[]>;
