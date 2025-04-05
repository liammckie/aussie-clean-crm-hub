
import { z } from 'zod';

// --- Client Types ---
export type ClientStatus = 'Active' | 'Prospect' | 'Inactive' | 'On Hold';

export const clientFormSchema = z.object({
  business_name: z.string().min(1, { message: 'Business name is required' }),
  trading_name: z.string().optional(),
  abn: z.string().optional(),
  acn: z.string().optional(),
  industry: z.string().optional(),
  status: z.enum(['Active', 'Prospect', 'Inactive', 'On Hold']),
  onboarding_date: z.string().optional(),
  source: z.string().optional(),
  billing_cycle: z.string().optional(),
  payment_terms: z.string().optional(),
  payment_method: z.string().optional(),
  tax_status: z.string().optional(),
  credit_limit: z.number().optional(),
  // Address fields
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

// --- Contact Types ---

export type ContactType = 
  | 'client_primary' 
  | 'client_site' 
  | 'supplier' 
  | 'employee' 
  | 'emergency' 
  | 'hr_payroll'
  | 'sales_lead'
  | 'subcontractor';

export type PreferredCommunication = 'email' | 'phone' | 'portal';

export const unifiedContactSchema = z.object({
  entity_type: z.string(),
  entity_id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().optional(),
  phone_landline: z.string().optional(),
  mobile: z.string().optional(),
  position: z.string().optional(),
  job_title: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string(),
  preferred_communication: z.enum(['email', 'phone', 'portal']).optional(),
  is_primary: z.boolean().default(false),
  // Manager fields - only required for employee contacts
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
  notes: z.string().optional()
});

export type UnifiedContactFormData = z.infer<typeof unifiedContactSchema>;

// Helper function to create default contact values
export function createDefaultContactValues(
  initialValues: Partial<UnifiedContactFormData> = {}, 
  defaultContactType: ContactType = 'client_primary'
): UnifiedContactFormData {
  return {
    entity_type: initialValues.entity_type || '',
    entity_id: initialValues.entity_id || '',
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    phone_landline: initialValues.phone_landline || '',
    mobile: initialValues.mobile || '',
    position: initialValues.position || '',
    job_title: initialValues.job_title || '',
    company: initialValues.company || '',
    contact_type: initialValues.contact_type || defaultContactType,
    preferred_communication: initialValues.preferred_communication || 'email',
    is_primary: Boolean(initialValues.is_primary),
    account_manager: initialValues.account_manager || '',
    state_manager: initialValues.state_manager || '',
    national_manager: initialValues.national_manager || '',
    notes: initialValues.notes || ''
  };
}

// --- Address Types ---

export type AddressType = 'billing' | 'shipping' | 'site' | 'warehouse' | 'other';

export const unifiedAddressSchema = z.object({
  entity_type: z.string(),
  entity_id: z.string(),
  name: z.string().optional(),
  address_line_1: z.string().min(1, { message: 'Address line 1 is required' }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: 'Suburb/City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postcode: z.string().min(1, { message: 'Postcode is required' }),
  country: z.string().default('Australia'),
  address_type: z.string(),
  is_primary: z.boolean().default(false)
});

export type UnifiedAddressFormData = z.infer<typeof unifiedAddressSchema>;

// Helper function to create default address values
export function createDefaultAddressValues(
  initialValues: Partial<UnifiedAddressFormData> = {},
  defaultAddressType: AddressType = 'billing'
): UnifiedAddressFormData {
  return {
    entity_type: initialValues.entity_type || '',
    entity_id: initialValues.entity_id || '',
    name: initialValues.name || '',
    address_line_1: initialValues.address_line_1 || '',
    address_line_2: initialValues.address_line_2 || '',
    suburb: initialValues.suburb || '',
    state: initialValues.state || '',
    postcode: initialValues.postcode || '',
    country: initialValues.country || 'Australia',
    address_type: initialValues.address_type || defaultAddressType,
    is_primary: Boolean(initialValues.is_primary)
  };
}
