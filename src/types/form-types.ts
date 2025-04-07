
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

// Define address types
export type AddressType = 
  | 'billing'
  | 'shipping'
  | 'physical'
  | 'postal'
  | 'head_office'
  | 'branch'
  | 'residential'
  | 'commercial'
  | 'warehouse'
  | 'site';

// Define preferred communication type
export type PreferredCommunication = 'email' | 'phone' | 'portal';

// Form data for unified contact form
export interface UnifiedContactFormData {
  name: string;
  email: string;
  position?: string; // job title
  company?: string;
  phone?: string;
  phone_landline?: string; // Added for ContactAdditionalFields component
  mobile?: string;
  contact_type: ContactType;
  is_primary: boolean;
  notes?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  job_title?: string; // Alternative to position
  preferred_communication?: PreferredCommunication;
}

// Form data for unified address form
export interface UnifiedAddressFormData {
  address_line1: string;
  address_line2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  is_primary: boolean;
  latitude?: number;
  longitude?: number;
  notes?: string;
  name?: string;  // Added for address.ts usage
}

// Define the schema for address validation
export const unifiedAddressSchema = z.object({
  address_line1: z.string().min(1, { message: "Address line 1 is required" }),
  address_line2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  address_type: z.string().min(1, { message: "Address type is required" }),
  is_primary: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
  name: z.string().optional()
});

// Helper function to create default values for address form
export function createDefaultAddressValues(initialData?: Partial<UnifiedAddressFormData>): UnifiedAddressFormData {
  return {
    address_line1: initialData?.address_line1 || '',
    address_line2: initialData?.address_line2 || '',
    suburb: initialData?.suburb || '',
    state: initialData?.state || '',
    postcode: initialData?.postcode || '',
    country: initialData?.country || 'Australia',
    address_type: initialData?.address_type || 'billing',
    is_primary: initialData?.is_primary === true,
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    notes: initialData?.notes || '',
    name: initialData?.name || '',
  };
}

// Form data types with common fields
export interface FormDataWithIsPrimary {
  is_primary?: boolean;
}
