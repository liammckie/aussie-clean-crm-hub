import { z } from 'zod';

export type AddressType = 'billing' | 'shipping' | 'physical' | 'postal' | 'head_office' | 'branch' | 'residential' | 'commercial';
export type ContactType = 'client_primary' | 'client_site' | 'supplier' | 'employee' | 'hr_payroll' | 'emergency';
export type PreferredCommunication = 'phone' | 'email' | 'portal';

// Unified Address Form Schema
export const unifiedAddressSchema = z.object({
  entity_type: z.string().min(1, { message: "Entity type is required" }),
  entity_id: z.string().min(1, { message: "Entity ID is required" }),
  name: z.string().optional(),
  address_line_1: z.string().min(1, { message: "Address line 1 is required" }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: z.string().min(1, { message: "Country is required" }).default('Australia'),
  address_type: z.string().min(1, { message: "Address type is required" }),
  is_primary: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

// Unified Contact Form Schema
export const unifiedContactSchema = z.object({
  entity_type: z.string().min(1, { message: "Entity type is required" }),
  entity_id: z.string().min(1, { message: "Entity ID is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  phone_landline: z.string().optional(),
  mobile: z.string().optional(),
  position: z.string().optional(),
  job_title: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string().min(1, { message: "Contact type is required" }),
  preferred_communication: z.string().optional(),
  is_primary: z.boolean().default(false),
  account_manager: z.string().optional(),  // Added new field
  state_manager: z.string().optional(),    // Added new field
  national_manager: z.string().optional(), // Added new field
  notes: z.string().optional()
});

export type UnifiedAddressFormData = z.infer<typeof unifiedAddressSchema>;
export type UnifiedContactFormData = z.infer<typeof unifiedContactSchema>;

// Helper to create default values for the address form
export const createDefaultAddressValues = (initialData: Partial<UnifiedAddressFormData> = {}, addressType: AddressType = 'physical'): UnifiedAddressFormData => {
  return {
    entity_type: initialData.entity_type || '',
    entity_id: initialData.entity_id || '',
    name: initialData.name || '',
    address_line_1: initialData.address_line_1 || '',
    address_line_2: initialData.address_line_2 || '',
    suburb: initialData.suburb || '',
    state: initialData.state || '',
    postcode: initialData.postcode || '',
    country: initialData.country || 'Australia',
    address_type: initialData.address_type || addressType,
    is_primary: initialData.is_primary === undefined ? false : initialData.is_primary,
    latitude: initialData.latitude,
    longitude: initialData.longitude
  };
};

// Helper to create default values for the contact form
export const createDefaultContactValues = (initialData: Partial<UnifiedContactFormData> = {}, contactType: ContactType = 'client_primary'): UnifiedContactFormData => {
  return {
    entity_type: initialData.entity_type || '',
    entity_id: initialData.entity_id || '',
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    phone_landline: initialData.phone_landline || '',
    mobile: initialData.mobile || '',
    position: initialData.position || '',
    job_title: initialData.job_title || '',
    company: initialData.company || '',
    contact_type: initialData.contact_type || contactType,
    preferred_communication: initialData.preferred_communication || 'email',
    is_primary: initialData.is_primary === undefined ? false : initialData.is_primary,
    account_manager: initialData.account_manager || '',  // Added new field
    state_manager: initialData.state_manager || '',      // Added new field
    national_manager: initialData.national_manager || '', // Added new field
    notes: initialData.notes || ''
  };
};
