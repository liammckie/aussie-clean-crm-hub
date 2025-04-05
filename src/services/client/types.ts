
// If this file doesn't exist yet, we'll create it with the address types needed

export type ClientStatus = 'Prospect' | 'Active' | 'On Hold' | 'Cancelled';

export type AddressType = 'billing' | 'postal' | 'physical';

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
