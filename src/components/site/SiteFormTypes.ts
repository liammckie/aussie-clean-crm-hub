
import { z } from 'zod';
import { SiteType } from '@/services/site';

// Define site form schema
export const siteSchema = z.object({
  site_name: z.string().min(1, { message: "Site name is required" }),
  site_code: z.string().min(1, { message: "Site code is required" }),
  address_line_1: z.string().min(1, { message: "Address is required" }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(4, { message: "Postcode is required" }),
  site_contact_name: z.string().optional(),
  site_contact_email: z.string().email().optional().or(z.literal('')),
  site_contact_phone: z.string().optional(),
  notes: z.string().optional(),
  region: z.string().optional(),
  induction_required: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'pending_activation']).default('pending_activation'),
  site_type: z.enum(['residential', 'industrial', 'retail', 'hospitality', 'office', 'warehouse', 'educational', 'medical']).optional(),
  square_meters: z.number().optional(),
});

export type SiteFormData = z.infer<typeof siteSchema>;
