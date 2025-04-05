
import { Tables } from '@/integrations/supabase/types';

// Client status type to match database enum
export type ClientStatus = 'Active' | 'Prospect' | 'On Hold' | 'Cancelled';

// Contact type to match database enum
export type ContactType = 'Billing' | 'Operations' | 'Emergency' | 'Primary';

// Address type to match database enum
export type AddressType = 'billing' | 'postal' | 'physical';

// Client data types
export interface ClientFormData {
  business_name: string;
  trading_name?: string | null;
  abn?: string | null;
  acn?: string | null;
  industry?: string | null;
  status: ClientStatus;
  onboarding_date?: string | null;
  source?: string | null;
  // Billing fields
  billing_cycle?: string | null;
  payment_terms?: string | null;
  payment_method?: string | null;
  tax_status?: string | null;
  credit_limit?: number | null;
  // Address fields
  address_line_1?: string | null;
  address_line_2?: string | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
}

// Client address form data
export interface AddressFormData {
  client_id: string;
  street: string;
  street_2?: string | null;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
}

// Client contact form data
export interface ContactFormData {
  client_id: string;
  name: string;
  email: string;
  position?: string | null;
  phone?: string | null;
  mobile?: string | null;
  contact_type: ContactType;
  is_primary?: boolean;
}

// Error response for validation errors
export interface ValidationErrorResponse {
  category: 'validation';
  message: string;
  details?: { field?: string };
}

// Client type from database
export type ClientRecord = Tables<'clients'>;

// Contact type from database
export type ContactRecord = Tables<'client_contacts'>;

// Address type from database
export type AddressRecord = Tables<'client_addresses'>;

// Client with contacts
export interface ClientWithContacts extends ClientRecord {
  client_contacts?: ContactRecord[];
  client_addresses?: AddressRecord[];
}
