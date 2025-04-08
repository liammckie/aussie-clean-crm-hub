
import { z } from 'zod';
import { ApiResponse } from './api-response';

/**
 * Client record structure from database
 */
export interface ClientRecord {
  id: string;
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status?: string;
  onboarding_date?: string; // Always a string in db
  source?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  client_contacts?: any[];
  client_addresses?: any[];
  updated_at?: string;
  created_at?: string;
  phone?: string;
  address?: string;
  // Calculated fields from ClientDataProcessor
  annual_revenue?: number;
  site_count?: number;
  displayAddress?: string;
}

// Add this type to unify client form data types across the application
export interface ClientFormData {
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status: string;
  onboarding_date?: string; // String only, no Date object
  source?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  address?: string;
}

// API response types for clients
export type ClientApiResponse = ApiResponse<ClientRecord>;
export type ClientsApiResponse = ApiResponse<ClientRecord[]>;
