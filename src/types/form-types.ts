
import { z } from 'zod';
// Import EntityType from the unified types
import { EntityType } from '@/services/unified/types';

/**
 * Contact types based on database enum
 */
export const contactTypeEnum = z.enum([
  'client_primary',
  'client_site',
  'supplier',
  'subcontractor',
  'employee',
  'emergency',
  'hr_payroll',
  'sales_lead'
]);

/**
 * Address types based on database enum
 */
export const addressTypeEnum = z.enum([
  'head_office',
  'billing',
  'site',
  'residential',
  'postal',
  'warehouse'
]);

/**
 * Preferred communication method enum
 */
export const preferredCommunicationEnum = z.enum([
  'phone',
  'email',
  'portal'
]);

/**
 * Base address schema with all required fields properly specified
 */
export const addressBaseSchema = z.object({
  address_line_1: z.string().min(1, { message: 'Street address is required' }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: 'Suburb is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postcode: z.string().min(4, { message: 'Postcode must be at least 4 characters' }),
  country: z.string().default('Australia'),
  address_type: addressTypeEnum.default('billing'),
  is_primary: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/**
 * Base contact schema with all required fields properly specified
 */
export const contactBaseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  position: z.string().optional(),
  job_title: z.string().optional(),
  phone: z.string().optional(),
  phone_landline: z.string().optional(),
  mobile: z.string().optional(),
  company: z.string().optional(),
  contact_type: contactTypeEnum.default('client_primary'),
  preferred_communication: preferredCommunicationEnum.default('email'),
  is_primary: z.boolean().default(false),
  notes: z.string().optional(),
});

/**
 * Infer the base types from the schemas
 */
export type AddressBaseFormData = z.infer<typeof addressBaseSchema>;
export type ContactBaseFormData = z.infer<typeof contactBaseSchema>;
export type ContactType = z.infer<typeof contactTypeEnum>;
export type AddressType = z.infer<typeof addressTypeEnum>;
export type PreferredCommunication = z.infer<typeof preferredCommunicationEnum>;

/**
 * Entity type enum for addresses and contacts
 */
export const entityTypeEnum = z.enum(['client', 'supplier', 'employee', 'site', 'internal']);
export type EntityTypeValue = z.infer<typeof entityTypeEnum>;

/**
 * Unified address form data with entity information
 */
export const unifiedAddressSchema = addressBaseSchema.extend({
  entity_type: entityTypeEnum.optional(),
  entity_id: z.string().optional(),
  name: z.string().optional(),
});

/**
 * Unified contact form data with entity information
 */
export const unifiedContactSchema = contactBaseSchema.extend({
  entity_type: entityTypeEnum.optional(),
  entity_id: z.string().optional(),
});

/**
 * Type definitions for the unified schemas
 */
export type UnifiedAddressFormData = z.infer<typeof unifiedAddressSchema>;
export type UnifiedContactFormData = z.infer<typeof unifiedContactSchema>;

/**
 * Helper to create default values for address forms
 */
export const createDefaultAddressValues = (
  initialData: Partial<UnifiedAddressFormData> = {}
): UnifiedAddressFormData => ({
  address_line_1: initialData.address_line_1 || '',
  address_line_2: initialData.address_line_2 || '',
  suburb: initialData.suburb || '',
  state: initialData.state || '',
  postcode: initialData.postcode || '',
  country: initialData.country || 'Australia',
  address_type: initialData.address_type || 'billing',
  is_primary: Boolean(initialData.is_primary ?? false),  // Ensure it's always a boolean
  entity_type: initialData.entity_type,
  entity_id: initialData.entity_id,
  name: initialData.name || '',
  latitude: initialData.latitude,
  longitude: initialData.longitude,
});

/**
 * Helper to create default values for contact forms
 */
export const createDefaultContactValues = (
  initialData: Partial<UnifiedContactFormData> = {},
  defaultContactType: ContactType = 'client_primary'
): UnifiedContactFormData => ({
  name: initialData.name || '',
  email: initialData.email || '',
  position: initialData.position || '',
  job_title: initialData.job_title || '',
  phone: initialData.phone || '',
  phone_landline: initialData.phone_landline || '',
  mobile: initialData.mobile || '',
  company: initialData.company || '',
  contact_type: initialData.contact_type || defaultContactType,
  preferred_communication: initialData.preferred_communication || 'email',
  is_primary: Boolean(initialData.is_primary ?? false),  // Ensure it's always a boolean
  entity_type: initialData.entity_type,  // Fixed: using the correct field
  entity_id: initialData.entity_id,
  notes: initialData.notes || '',
});
