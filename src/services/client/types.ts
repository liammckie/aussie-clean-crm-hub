
// Import types from database schema
import { AddressFieldsFormData } from '@/components/client/form/AddressFields';
import { AddressType, ClientStatus, ContactType, EntityType } from '@/types/database-schema';
import { ApiResponse } from '@/types/api-response';
import { ClientRecord } from '@/types/database-schema';

// Re-export types from database schema for backward compatibility
export { AddressType, ClientStatus, ContactType, EntityType };

// Ensure ClientFormData includes all fields from AddressFieldsFormData
export interface ClientFormData extends AddressFieldsFormData {
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
  phone?: string;
}

// API Response types
export type ClientApiResponse = ApiResponse<ClientRecord>;
export type ClientsApiResponse = ApiResponse<ClientRecord[]>;

// Contact types
export interface ContactFormData {
  name: string;
  position?: string;
  email: string;
  phone?: string;
  mobile?: string;
  contact_type: ContactType;
  is_primary: boolean;
}

export interface ContactRecord {
  id: string;
  client_id: string;
  name: string;
  position?: string;
  email: string;
  phone?: string;
  mobile?: string;
  contact_type: ContactType;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

// Address form data
export interface AddressFormData {
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
}
