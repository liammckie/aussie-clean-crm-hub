
import { z } from 'zod';

// Client schema
export const clientSchema = z.object({
  business_name: z.string().min(1, { message: "Business name is required" }),
  trading_name: z.string().optional().nullable(),
  abn: z.string().optional().nullable(),
  acn: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  status: z.string().default('Prospect'),
  onboarding_date: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  billing_cycle: z.string().optional().nullable(),
  payment_terms: z.string().optional().nullable(),
  payment_method: z.string().optional().nullable(),
  tax_status: z.string().optional().nullable(),
  credit_limit: z.number().optional().nullable(),
  // Address fields
  address_line_1: z.string().optional().nullable(),
  address_line_2: z.string().optional().nullable(),
  suburb: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  country: z.string().optional().nullable().default('Australia'),
  // Additional fields
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export type ClientSchemaType = z.infer<typeof clientSchema>;

// Site schema
export const siteSchema = z.object({
  client_id: z.string().uuid(),
  site_name: z.string().min(1, { message: "Site name is required" }),
  site_code: z.string().min(1, { message: "Site code is required" }),
  address_line_1: z.string().min(1, { message: "Address is required" }),
  address_line_2: z.string().optional().nullable(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(4, { message: "Postcode is required" }),
  status: z.enum(['active', 'inactive', 'pending_activation']),
  site_type: z.enum(['residential', 'industrial', 'retail', 'hospitality', 'office', 'warehouse', 'educational', 'medical']).optional().nullable(),
  site_contact_name: z.string().optional().nullable(),
  site_contact_email: z.string().email().optional().nullable(),
  site_contact_phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  induction_required: z.boolean().default(false).optional().nullable(),
  square_meters: z.number().optional().nullable(),
});

export type SiteSchemaType = z.infer<typeof siteSchema>;
