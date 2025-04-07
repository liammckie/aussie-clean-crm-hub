
import { ApiResponse } from "@/types/api-response";

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
}

// API response types
export type ContractApiResponse = ApiResponse<ContractData>;
export type ContractsApiResponse = ApiResponse<ContractData[]>;
