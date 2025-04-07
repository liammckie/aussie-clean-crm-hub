
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
  description: z.string().optional()
});

// Type inferred from schema
export type ContractFormData = z.infer<typeof contractFormSchema>;

// Helper to create default values
export const createDefaultContractValues = (): ContractFormData => ({
  contract_name: "",
  contract_code: "",
  client_id: "",
  service_type: ServiceType.COMMERCIAL_CLEANING,
  status: "draft",
  start_date: new Date().toISOString().split("T")[0],
  is_ongoing: false
});

// API response types
export type ContractApiResponse = ApiResponse<ContractData>;
export type ContractsApiResponse = ApiResponse<ContractData[]>;
