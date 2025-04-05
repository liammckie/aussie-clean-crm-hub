
import { Tables } from '@/integrations/supabase/types';

// Client status type to match database enum
export type ClientStatus = 'Active' | 'Prospect' | 'On Hold' | 'Cancelled';

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

// Client with contacts
export interface ClientWithContacts extends ClientRecord {
  client_contacts?: ContactRecord[];
}
