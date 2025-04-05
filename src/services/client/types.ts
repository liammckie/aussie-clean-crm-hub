// If this file doesn't exist yet, we'll create it with the address types needed

export type ClientStatus = 'Prospect' | 'Active' | 'On Hold' | 'Cancelled';

// Import the AddressType from form-types instead of redefining it
import { AddressType, ContactType as FormContactType } from '@/types/form-types';

// Entity types for cross-referencing
export type EntityType = 'client' | 'supplier' | 'employee' | 'site' | 'internal';

// Use the same ContactType as defined in form-types or map to it
export type ContactType = 'Billing' | 'Operations' | 'Emergency' | 'Primary';

// Re-export AddressType from form-types for backward compatibility
export { AddressType };

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
  
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  
  // Financial fields
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Relations
  client_contacts?: ContactRecord[];
  client_addresses?: AddressRecord[];
}

export interface ClientFormData {
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status: ClientStatus;
  onboarding_date?: string;
  source?: string;
  
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  
  // Financial fields
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
}

export interface ClientWithContacts extends ClientRecord {
  client_contacts: ContactRecord[];
}

export interface ContactRecord {
  id: string;
  name: string;
  position?: string;
  email: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  client_id: string;
  contact_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactFormData {
  name: string;
  position?: string;
  email: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  contact_type: string;
  client_id: string;
}

export interface AddressRecord {
  id: string;
  street: string;
  street_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  client_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddressFormData {
  street: string;
  street_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  client_id: string;
}

// New unified interfaces for reusable components

export interface UnifiedAddressRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UnifiedContactRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  company?: string;
  contact_type: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ValidationErrorResponse {
  category: 'validation';
  message: string;
  details?: {
    field?: string;
    error?: string;
  };
}

export interface ErrorResponse {
  status: number;
  message: string;
}
