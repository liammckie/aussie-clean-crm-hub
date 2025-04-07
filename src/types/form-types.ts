import { z } from 'zod';
import { AddressType, EntityType as DbEntityType, ContactType as DbContactType } from './database-schema';

// Type for entity types - use the database schema enum
export type EntityType = DbEntityType | 'client' | 'supplier' | 'site' | 'work_order' | 'contract';

// Type for contact types - consolidate with database enum eventually
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
  | 'subcontractor'
  | DbContactType; // Include database enum values

// Use the database schema's AddressType enum to ensure consistency
export { AddressType } from './database-schema';

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

// Define contact schema using Zod for validation
export const unifiedContactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  position: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  phone_landline: z.string().optional(),
  mobile: z.string().optional(),
  contact_type: z.string().min(1, { message: "Contact type is required" }),
  is_primary: z.boolean().default(false),
  notes: z.string().optional(),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
  job_title: z.string().optional(),
  preferred_communication: z.string().optional()
});

// Helper function to create default values for contact form
export function createDefaultContactValues(initialData?: Partial<UnifiedContactFormData>): UnifiedContactFormData {
  return {
    name: initialData?.name || '',
    email: initialData?.email || '',
    position: initialData?.position || '',
    company: initialData?.company || '',
    phone: initialData?.phone || '',
    phone_landline: initialData?.phone_landline || '',
    mobile: initialData?.mobile || '',
    contact_type: initialData?.contact_type || 'Primary',
    is_primary: initialData?.is_primary === true,
    notes: initialData?.notes || '',
    account_manager: initialData?.account_manager || '',
    state_manager: initialData?.state_manager || '',
    national_manager: initialData?.national_manager || '',
    job_title: initialData?.job_title || '',
    preferred_communication: initialData?.preferred_communication || undefined,
  };
}

// Form data for unified address form - Using address_line1 naming to match form field names
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

// Define the schema for address validation, using enum values from AddressType
export const unifiedAddressSchema = z.object({
  address_line1: z.string().min(1, { message: "Address line 1 is required" }),
  address_line2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  address_type: z.nativeEnum(AddressType),
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
    address_type: initialData?.address_type || AddressType.BILLING,
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
