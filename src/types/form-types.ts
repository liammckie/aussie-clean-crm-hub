
import { z } from 'zod';
import { ClientStatus } from './database-schema';

// Address type definition
export type AddressType = 'billing' | 'physical' | 'postal' | 'shipping' |
  'head_office' | 'branch' | 'residential' | 'commercial' | 'warehouse' | 'site';

// Contact type definition
export type ContactType = 'Primary' | 'Billing' | 'Operations' | 'Emergency' |
  'Technical' | 'Support' | 'Sales' | 'Management';

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
  contact_type: z.enum([
    'Primary', 'Billing', 'Operations', 'Emergency',
    'Technical', 'Support', 'Sales', 'Management'
  ] as const),
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

// Form data types
export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ClientFormData = z.infer<typeof clientFormSchema>;

// Unified address form data
export interface UnifiedAddressFormData {
  entity_type: 'client' | 'site' | 'supplier' | 'employee' | 'internal';
  entity_id: string;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  is_primary?: boolean;
}

// Unified contact form data
export interface UnifiedContactFormData {
  entity_type: 'client' | 'site' | 'supplier' | 'employee' | 'internal';
  entity_id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  company?: string;
  contact_type: string;
  is_primary: boolean;
}
