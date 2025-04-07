
import { z } from 'zod';
import { AddressType as DBAddressType, ContactType as DBContactType, EntityType as DBEntityType } from '@/types/database-schema';

/**
 * Form Types - Centralized definitions for form data structures and validation
 */

// Address types - using the enums from database types for consistency
export type AddressType = DBAddressType | string;

// Entity types for relational references
export type EntityType = keyof typeof DBEntityType | string;

// Contact types - updated to be compatible with both string literals and enum
export type ContactType = DBContactType | 'Primary' | 'Billing' | 'Operations' | 'Emergency' | 'Technical' | 'Management' | 
  'client_primary' | 'client_site' | 'hr_payroll';

export type PreferredCommunication = 'email' | 'phone' | 'mobile' | 'post';

// Define unified address form data
export interface UnifiedAddressFormData {
  entity_type: EntityType;
  entity_id: string;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country?: string;
  address_type: AddressType;
  is_primary?: boolean;
  latitude?: number;
  longitude?: number;
}

// Define unified contact form data
export interface UnifiedContactFormData {
  entity_type: EntityType;
  entity_id: string;
  name: string;
  email: string;
  phone?: string;
  phone_landline?: string;
  mobile?: string;
  position?: string;
  job_title?: string;
  company?: string;
  contact_type: ContactType;
  preferred_communication?: PreferredCommunication;
  is_primary: boolean;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  notes?: string;
}

// Export ClientFormData type which is imported in many places
export interface ClientFormData {
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status: string;
  onboarding_date?: string | Date;
  source?: string;
  address?: string;
  phone?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

// Common form schemas
export const emailSchema = z.string().email({ message: "Invalid email format" }).or(z.literal(''));
export const phoneSchema = z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, { message: "Invalid phone number format" }).optional();
export const nameSchema = z.string().min(2, { message: "Name must be at least 2 characters" });
export const postcodeSchema = z.string().regex(/^[0-9]{4,5}$/, { message: "Postcode must be 4-5 digits" });
export const abnSchema = z.string().regex(/^\d{11}$/, { message: "ABN must be 11 digits" }).or(z.literal('')).optional();
export const acnSchema = z.string().regex(/^\d{9}$/, { message: "ACN must be 9 digits" }).or(z.literal('')).optional();

// Address form schema
export const addressSchema = z.object({
  address_line_1: z.string().min(1, { message: "Address is required" }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: postcodeSchema,
  country: z.string().default('Australia'),
  address_type: z.string() as z.ZodType<AddressType>,
  is_primary: z.boolean().default(false)
});

// Contact form schema
export const contactSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  mobile: phoneSchema,
  position: z.string().optional(),
  contact_type: z.string() as z.ZodType<ContactType>,
  is_primary: z.boolean().default(false),
  name: z.string().optional()
});

// Add missing schemas needed to fix errors:
export const unifiedAddressSchema = z.object({
  entity_type: z.string() as z.ZodType<EntityType>,
  entity_id: z.string().min(1, { message: "Entity ID is required" }),
  name: z.string().optional(),
  address_line_1: z.string().min(1, { message: "Address is required" }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: postcodeSchema,
  country: z.string().default('Australia'),
  address_type: z.string() as z.ZodType<AddressType>,
  is_primary: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const unifiedContactSchema = z.object({
  entity_type: z.string() as z.ZodType<EntityType>,
  entity_id: z.string().min(1, { message: "Entity ID is required" }),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  phone_landline: phoneSchema,
  mobile: phoneSchema,
  position: z.string().optional(),
  job_title: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string() as z.ZodType<ContactType>,
  preferred_communication: z.enum(['email', 'phone', 'mobile', 'post']).optional(),
  is_primary: z.boolean().default(false),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Create default values for address forms
 */
export const createDefaultAddressValues = (
  initialData: Partial<UnifiedAddressFormData> = {},
  defaultAddressType: AddressType = 'physical'
): UnifiedAddressFormData => {
  return {
    entity_type: initialData.entity_type || DBEntityType.CLIENT.toLowerCase(),
    entity_id: initialData.entity_id || '',
    name: initialData.name,
    address_line_1: initialData.address_line_1 || '',
    address_line_2: initialData.address_line_2,
    suburb: initialData.suburb || '',
    state: initialData.state || '',
    postcode: initialData.postcode || '',
    country: initialData.country || 'Australia',
    address_type: initialData.address_type || defaultAddressType,
    is_primary: typeof initialData.is_primary === 'boolean' ? initialData.is_primary : false,
    latitude: initialData.latitude,
    longitude: initialData.longitude
  };
};

/**
 * Create default values for contact forms
 */
export const createDefaultContactValues = (
  initialData: Partial<UnifiedContactFormData> = {},
  defaultContactType: ContactType = 'Primary'
): UnifiedContactFormData => {
  return {
    entity_type: initialData.entity_type || DBEntityType.CLIENT.toLowerCase(),
    entity_id: initialData.entity_id || '',
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone,
    phone_landline: initialData.phone_landline,
    mobile: initialData.mobile,
    position: initialData.position,
    job_title: initialData.job_title,
    company: initialData.company,
    contact_type: initialData.contact_type || defaultContactType,
    preferred_communication: initialData.preferred_communication,
    is_primary: typeof initialData.is_primary === 'boolean' ? initialData.is_primary : false,
    account_manager: initialData.account_manager,
    state_manager: initialData.state_manager,
    national_manager: initialData.national_manager,
    notes: initialData.notes
  };
};
