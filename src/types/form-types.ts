
import { z } from 'zod';
import { ClientStatus } from './database-schema';

// Address type definition
export type AddressType = 'billing' | 'physical' | 'postal' | 'shipping' |
  'head_office' | 'branch' | 'residential' | 'commercial' | 'warehouse' | 'site';

// Contact type definition
export type ContactType = 'Primary' | 'Billing' | 'Operations' | 'Emergency' |
  'Technical' | 'Support' | 'Sales' | 'Management' | 'client_primary' | 
  'client_site' | 'supplier' | 'employee' | 'hr_payroll' | 'emergency' | 
  'sales_lead' | 'subcontractor';

// Preferred communication type
export type PreferredCommunication = 'email' | 'phone' | 'portal';

// Address form schema
export const addressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  street_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: z.string().default("Australia"),
  address_type: z.enum([
    'billing', 'physical', 'postal', 'shipping', 'head_office', 
    'branch', 'residential', 'commercial', 'warehouse', 'site'
  ] as const),
  is_primary: z.boolean().default(false)
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  position: z.string().optional(),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  contact_type: z.string(),
  is_primary: z.boolean().default(false)
});

// Client form schema
export const clientFormSchema = z.object({
  business_name: z.string().min(1, { message: "Business name is required" }),
  trading_name: z.string().optional(),
  abn: z.string().optional(),
  acn: z.string().optional(),
  industry: z.string().optional(),
  status: z.nativeEnum(ClientStatus).default(ClientStatus.PROSPECT),
  onboarding_date: z.date().optional(),
  source: z.string().optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional().default("Australia"),
  billing_cycle: z.string().optional(),
  payment_terms: z.string().optional(),
  payment_method: z.string().optional(),
  tax_status: z.string().optional(),
  credit_limit: z.number().optional()
});

// Unified Address Schema
export const unifiedAddressSchema = z.object({
  entity_type: z.enum(['client', 'site', 'supplier', 'employee', 'internal']),
  entity_id: z.string().uuid(),
  name: z.string().optional(),
  address_line_1: z.string().min(1, { message: "Address line 1 is required" }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: z.string().default("Australia"),
  address_type: z.enum([
    'billing', 'physical', 'postal', 'shipping', 'head_office', 
    'branch', 'residential', 'commercial', 'warehouse', 'site'
  ] as const),
  is_primary: z.boolean().default(false)
});

// Unified Contact Schema
export const unifiedContactSchema = z.object({
  entity_type: z.enum(['client', 'site', 'supplier', 'employee', 'internal']),
  entity_id: z.string().uuid(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  phone_landline: z.string().optional(),
  mobile: z.string().optional(),
  position: z.string().optional(),
  job_title: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string(),
  preferred_communication: z.enum(['email', 'phone', 'portal']).optional(),
  is_primary: z.boolean().default(false),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
  notes: z.string().optional()
});

// Form data types
export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ClientFormData = z.infer<typeof clientFormSchema>;

// Unified form data types
export type UnifiedAddressFormData = z.infer<typeof unifiedAddressSchema>;
export type UnifiedContactFormData = z.infer<typeof unifiedContactSchema>;

// Helper functions for form initialization
export const createDefaultAddressValues = (initialData: Partial<UnifiedAddressFormData>): UnifiedAddressFormData => {
  return {
    entity_type: initialData.entity_type || 'client',
    entity_id: initialData.entity_id || '',
    name: initialData.name || undefined,
    address_line_1: initialData.address_line_1 || '',
    address_line_2: initialData.address_line_2 || undefined,
    suburb: initialData.suburb || '',
    state: initialData.state || '',
    postcode: initialData.postcode || '',
    country: initialData.country || 'Australia',
    address_type: initialData.address_type || 'billing',
    is_primary: initialData.is_primary === undefined ? false : initialData.is_primary
  };
};

export const createDefaultContactValues = (
  initialData: Partial<UnifiedContactFormData>, 
  defaultContactType: ContactType
): UnifiedContactFormData => {
  return {
    entity_type: initialData.entity_type || 'client',
    entity_id: initialData.entity_id || '',
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || undefined,
    phone_landline: initialData.phone_landline || undefined,
    mobile: initialData.mobile || undefined,
    position: initialData.position || undefined,
    job_title: initialData.job_title || undefined,
    company: initialData.company || undefined,
    contact_type: initialData.contact_type || defaultContactType,
    preferred_communication: initialData.preferred_communication || undefined,
    is_primary: initialData.is_primary === undefined ? false : initialData.is_primary,
    account_manager: initialData.account_manager || undefined,
    state_manager: initialData.state_manager || undefined,
    national_manager: initialData.national_manager || undefined,
    notes: initialData.notes || undefined
  };
};
