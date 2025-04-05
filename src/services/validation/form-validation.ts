
import { z } from 'zod';
import { UnifiedContactFormData, UnifiedAddressFormData } from '@/types/form-types';

/**
 * Helper to validate phone numbers
 * Simple validation for Australian phone numbers
 */
const isValidPhoneNumber = (value: string): boolean => {
  if (!value) return true; // Allow empty for optional fields
  // Basic Australian mobile/landline validation (accepts various formats)
  return /^(\+?61|0)[2-478]?[0-9]{8}$/.test(value.replace(/\s+/g, ''));
};

/**
 * Phone number validation schema
 */
export const phoneNumberSchema = z.string().optional().refine(
  (val) => !val || isValidPhoneNumber(val),
  { message: "Please enter a valid phone number" }
);

/**
 * Contact validation schema with enhanced validation
 */
export const contactValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  position: z.string().optional(),
  phone: phoneNumberSchema,
  mobile: phoneNumberSchema,
  company: z.string().optional(),
  contact_type: z.string().min(1, { message: "Contact type is required" }),
  is_primary: z.boolean().default(false),
  entity_type: z.enum(['client', 'supplier', 'employee', 'site', 'internal']).optional(),
  entity_id: z.string().optional()
});

/**
 * Address validation schema with enhanced validation
 */
export const addressValidationSchema = z.object({
  address_line_1: z.string().min(1, { message: 'Street address is required' }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: 'Suburb is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postcode: z.string().min(4, { message: 'Postcode must be at least 4 characters' }),
  country: z.string().default('Australia'),
  address_type: z.enum(['billing', 'postal', 'physical']).default('billing'),
  is_primary: z.boolean().default(false),
  name: z.string().optional(),
  entity_type: z.enum(['client', 'supplier', 'employee', 'site', 'internal']).optional(),
  entity_id: z.string().optional()
});

/**
 * Login validation schema with enhanced password requirements
 */
export const loginValidationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password cannot exceed 128 characters" })
    .refine(
      (password) => /[a-z]/.test(password),
      { message: "Password must contain at least one lowercase letter" }
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
      (password) => /\d/.test(password),
      { message: "Password must contain at least one number" }
    ),
  rememberMe: z.boolean().default(true)
});

/**
 * Validate contact data with proper typing for error handling
 */
export function validateContact(data: Partial<UnifiedContactFormData>) {
  return contactValidationSchema.safeParse(data);
}

/**
 * Validate address data with proper typing for error handling
 */
export function validateAddress(data: Partial<UnifiedAddressFormData>) {
  return addressValidationSchema.safeParse(data);
}

/**
 * Validate login data with proper typing for error handling
 */
export function validateLogin(data: { email: string; password: string; rememberMe?: boolean }) {
  return loginValidationSchema.safeParse(data);
}
