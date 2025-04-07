
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
  onboarding_date?: string;
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
  onboarding_date?: string; // Make sure it's string only
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
export function prepareClientFormData(data: any): ClientFormData {
  return {
    ...data,
    onboarding_date: data.onboarding_date instanceof Date 
      ? data.onboarding_date.toISOString().split('T')[0] 
      : data.onboarding_date
  };
}
