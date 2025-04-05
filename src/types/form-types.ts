
import { z } from 'zod';
import { AddressType, EntityType } from '@/services/unified/types';

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
  address_type: z.enum(['billing', 'postal', 'physical']).default('billing'),
  is_primary: z.boolean().default(false),
});

/**
 * Base contact schema with all required fields properly specified
 */
export const contactBaseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  position: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string().min(1, { message: "Contact type is required" }),
  is_primary: z.boolean().default(false),
});

/**
 * Infer the base types from the schemas
 */
export type AddressBaseFormData = z.infer<typeof addressBaseSchema>;
export type ContactBaseFormData = z.infer<typeof contactBaseSchema>;

/**
 * Unified address form data with entity information
 */
export const unifiedAddressSchema = addressBaseSchema.extend({
  entity_type: z.enum(['client', 'supplier', 'employee', 'site', 'internal']).optional(),
  entity_id: z.string().optional(),
  name: z.string().optional(),
});

/**
 * Unified contact form data with entity information
 */
export const unifiedContactSchema = contactBaseSchema.extend({
  entity_type: z.enum(['client', 'supplier', 'employee', 'site', 'internal']).optional(),
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
  is_primary: initialData.is_primary ?? false,
  entity_type: initialData.entity_type,
  entity_id: initialData.entity_id,
  name: initialData.name || '',
});

/**
 * Helper to create default values for contact forms
 */
export const createDefaultContactValues = (
  initialData: Partial<UnifiedContactFormData> = {},
  defaultContactType: string = 'Primary'
): UnifiedContactFormData => ({
  name: initialData.name || '',
  email: initialData.email || '',
  position: initialData.position || '',
  phone: initialData.phone || '',
  mobile: initialData.mobile || '',
  company: initialData.company || '',
  contact_type: initialData.contact_type || defaultContactType,
  is_primary: initialData.is_primary ?? false,
  entity_type: initialData.entity_type,
  entity_id: initialData.entity_id,
});
