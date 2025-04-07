
import { z } from 'zod';

// Type for entity types
export type EntityType = 'client' | 'supplier' | 'site' | 'work_order' | 'contract';

// Type for contact types
export type ContactType = 
  | 'Primary'
  | 'Billing'
  | 'Operations'
  | 'Emergency'
  | 'Technical'
  | 'Support'
  | 'Sales'
  | 'Management'
  | 'client_primary'
  | 'client_site'
  | 'supplier'
  | 'employee'
  | 'hr_payroll'
  | 'emergency'
  | 'sales_lead'
  | 'subcontractor';

// Form data for unified contact form
export interface UnifiedContactFormData {
  name: string;
  email: string;
  position?: string;
  company?: string;
  phone?: string;
  mobile?: string;
  contact_type: ContactType;
  is_primary: boolean;
  notes?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
}

// Form data for unified address form
export interface UnifiedAddressFormData {
  address_line1: string;
  address_line2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: string;
  is_primary: boolean;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

// Form data types with common fields
export interface FormDataWithIsPrimary {
  is_primary?: boolean;
}

