
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

// Helper function to convert Date objects to strings in client data
export function prepareClientDataForSubmission(data: any): ClientFormData {
  return {
    ...data,
    onboarding_date: data.onboarding_date 
      ? (typeof data.onboarding_date === 'string' 
          ? data.onboarding_date 
          : data.onboarding_date.toISOString().split('T')[0])
      : undefined
  };
}

// Helper function to format client data with date strings
export function prepareClientFormData(data: any): ClientFormData {
  return prepareClientDataForSubmission(data);
}
