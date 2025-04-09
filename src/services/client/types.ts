
// Add to your existing types.ts file, making sure ClientFormData extends AddressFieldsFormData

import { AddressFieldsFormData } from '@/components/client/form/AddressFields';
import { ClientStatus } from '@/types/database-schema';

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
