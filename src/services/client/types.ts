
import { ContactType, AddressType } from '@/types/form-types';
import { ApiResponse } from '@/types/api-response';
import { ClientStatus } from '@/types/database-schema';

/**
 * Client types for consistent type usage across client-related code
 */

// Client database record as retrieved from Supabase
export interface ClientRecord {
  id: string;
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status: ClientStatus;
  onboarding_date?: string;
  source?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  created_at?: string;
  updated_at?: string;
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  // Legacy fields
  address?: string;
  phone?: string;
  account_manager_id?: string;
  relationship_rating?: number;
}

// Client form data for create/update operations
export interface ClientFormData {
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status?: ClientStatus | string;
  onboarding_date?: string | Date;
  source?: string;
  address?: string;
  phone?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

// Client with all relationships
export interface ClientWithContacts extends ClientRecord {
  contacts: ClientContactRecord[];
  addresses: ClientAddressRecord[];
}

// Client contact record as retrieved from Supabase
export interface ClientContactRecord {
  id: string;
  client_id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  contact_type: ContactType;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

// Client contact form data for create/update operations
export interface ContactFormData {
  client_id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  contact_type: ContactType | string;
  is_primary?: boolean;
}

// Client address record as retrieved from Supabase
export interface ClientAddressRecord {
  id: string;
  client_id: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  created_at?: string;
  updated_at?: string;
}

// Client address form data for create/update operations
export interface AddressFormData {
  client_id: string;
  street: string;
  street_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country?: string;
  address_type?: AddressType;
}

// API response types to ensure consistent return types
export type ClientApiResponse = ApiResponse<ClientRecord>;
export type ClientsApiResponse = ApiResponse<ClientRecord[]>;
export type ClientContactApiResponse = ApiResponse<ClientContactRecord>;
export type ClientContactsApiResponse = ApiResponse<ClientContactRecord[]>;
export type ClientAddressApiResponse = ApiResponse<ClientAddressRecord>;
export type ClientAddressesApiResponse = ApiResponse<ClientAddressRecord[]>;

// Validation error response
export type ValidationErrorResponse = {
  category: 'validation';
  message: string;
  details?: {
    field?: string;
    error?: string;
    code?: string;
  };
};
