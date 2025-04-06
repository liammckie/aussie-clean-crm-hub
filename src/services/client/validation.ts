
import { z } from 'zod';
import { ClientStatus } from '@/types/database-schema';
import { AddressType } from '@/types/form-types';

/**
 * Client validation schemas using Zod
 * Centralizes all validation logic for client-related data
 */

// Business identifier validation schemas
export const abnSchema = z.string()
  .trim()
  .regex(/^\d{11}$|^\d{2}\s\d{3}\s\d{3}\s\d{3}$/, { 
    message: "ABN must be 11 digits, can include spaces in format XX XXX XXX XXX" 
  })
  .optional()
  .nullable();

export const acnSchema = z.string()
  .trim()
  .regex(/^\d{9}$|^\d{3}\s\d{3}\s\d{3}$/, { 
    message: "ACN must be 9 digits, can include spaces in format XXX XXX XXX" 
  })
  .optional()
  .nullable();

// Phone validation schema
export const phoneSchema = z.string()
  .trim()
  .regex(/^(\+?[0-9\s\-\(\)]{8,20})$/, { 
    message: "Invalid phone number format" 
  })
  .optional()
  .nullable();

// Email validation schema
export const emailSchema = z.string()
  .trim()
  .email({ message: "Invalid email format" })
  .optional()
  .nullable();

// Date schema that handles string dates
export const dateSchema = z.union([
  z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { 
      message: "Date format must be YYYY-MM-DD" 
    }),
  z.date()
])
.transform(val => {
  if (typeof val === 'string') {
    return val; // Return the string as is for database storage
  }
  return val.toISOString().split('T')[0]; // Convert Date to YYYY-MM-DD string
})
.optional()
.nullable();

// Client address schema
export const clientAddressSchema = z.object({
  street: z.string().trim().min(1, { message: "Street address is required" }),
  street_2: z.string().trim().optional().nullable(),
  suburb: z.string().trim().min(1, { message: "Suburb is required" }),
  state: z.string().trim().min(1, { message: "State is required" }),
  postcode: z.string().trim().min(1, { message: "Postcode is required" }),
  country: z.string().trim().default("Australia"),
  address_type: z.enum(["billing", "physical", "postal", "shipping", 
    "head_office", "branch", "residential", "commercial", "warehouse", "site"] as [AddressType, ...AddressType[]]),
  client_id: z.string().uuid({ message: "Valid client ID is required" }),
});

// Client contact schema
export const clientContactSchema = z.object({
  name: z.string().trim().min(1, { message: "Contact name is required" }),
  position: z.string().trim().optional().nullable(),
  email: emailSchema.refine(val => val !== null && val !== undefined && val !== '', {
    message: "Contact email is required"
  }),
  phone: phoneSchema,
  mobile: phoneSchema,
  is_primary: z.boolean().default(false),
  contact_type: z.string().trim().min(1, { message: "Contact type is required" }),
  client_id: z.string().uuid({ message: "Valid client ID is required" }),
});

// Client form schema - comprehensive schema for client data validation
export const clientSchema = z.object({
  business_name: z.string().trim().min(1, { message: "Business name is required" }),
  trading_name: z.string().trim().optional().nullable(),
  abn: abnSchema,
  acn: acnSchema,
  industry: z.string().trim().optional().nullable(),
  status: z.nativeEnum(ClientStatus).default(ClientStatus.PROSPECT),
  onboarding_date: dateSchema,
  source: z.string().trim().optional().nullable(),
  
  // Address fields
  address_line_1: z.string().trim().optional().nullable(),
  address_line_2: z.string().trim().optional().nullable(),
  suburb: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  postcode: z.string().trim().optional().nullable(),
  country: z.string().trim().optional().nullable().default('Australia'),
  address: z.string().trim().optional().nullable(),
  
  // Contact fields
  phone: phoneSchema,
  
  // Financial fields
  billing_cycle: z.string().trim().optional().nullable(),
  payment_terms: z.string().trim().optional().nullable(),
  payment_method: z.string().trim().optional().nullable(),
  tax_status: z.string().trim().optional().nullable(),
  credit_limit: z.number().optional().nullable(),
});

/**
 * Helper function to convert validation errors to standardized format
 */
export function handleValidationError(error: z.ZodError): { 
  category: 'validation'; 
  message: string;
  details: { field: string; }
} {
  const firstError = error.errors[0];
  return {
    category: 'validation',
    message: firstError.message,
    details: { field: firstError.path.join('.') }
  };
}

/**
 * Generic validation function for any schema
 */
export function validateWithZod<T extends z.ZodType<any, any>, Output = z.infer<T>>(
  schema: T,
  data: unknown
): { data: Output } | { 
  category: 'validation'; 
  message: string;
  details: { field: string; }
} {
  try {
    const validData = schema.parse(data);
    return { data: validData as Output };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return {
      category: 'validation',
      message: 'Unknown validation error occurred',
      details: { field: 'unknown' }
    };
  }
}
