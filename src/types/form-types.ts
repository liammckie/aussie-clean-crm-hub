
import { z } from 'zod';

/**
 * Form Types - Centralized definitions for form data structures and validation
 */

// Address types
export type AddressType = 'billing' | 'shipping' | 'site' | 'warehouse' | 'postal' | 'physical' | 'head_office' | 'branch' | 'residential' | 'commercial';

// Define unified address form data
export interface UnifiedAddressFormData {
  entity_type: string;
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

// Contact types
export type ContactType = 'Billing' | 'Operations' | 'Emergency' | 'Primary' | 'Technical' | 'Management';
export type PreferredCommunication = 'email' | 'phone' | 'mobile' | 'post';

// Define unified contact form data
export interface UnifiedContactFormData {
  entity_type: string;
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
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  mobile: phoneSchema,
  position: z.string().optional(),
  contact_type: z.string() as z.ZodType<ContactType>,
  is_primary: z.boolean().default(false)
});
