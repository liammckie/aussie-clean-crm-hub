
import { z } from 'zod';
import { AddressType } from './database-schema';

// Define EntityType for unified systems
export type EntityType = 'client' | 'supplier' | 'employee' | 'site' | 'internal';

// Define ContactType to match database constraints
export type ContactType = 'Primary' | 'Billing' | 'Operations' | 'Technical' | 'Emergency';

// Define PreferredCommunication type
export type PreferredCommunication = 'email' | 'phone' | 'portal';

// Unified Address Form Data
export interface UnifiedAddressFormData {
  entity_type?: EntityType;
  entity_id?: string;
  address_type: AddressType;
  is_primary?: boolean;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

// Unified Contact Form Data
export interface UnifiedContactFormData {
  entity_type?: EntityType;
  entity_id?: string;
  first_name: string;
  last_name?: string;
  name?: string;
  title?: string;
  position?: string;
  email: string;
  phone?: string;
  phone_landline?: string;
  mobile?: string;
  company?: string;
  contact_type: ContactType;
  is_primary?: boolean;
  notes?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  preferred_communication?: PreferredCommunication;
}

// Contact schema for form validation
export const unifiedContactSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  phone_landline: z.string().optional(),
  mobile: z.string().optional(),
  position: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string(),
  is_primary: z.boolean().default(false),
  notes: z.string().optional(),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
  preferred_communication: z.string().optional()
});

// Helper to create default values for contact form
export function createDefaultContactValues(initialData?: Partial<UnifiedContactFormData>): UnifiedContactFormData {
  return {
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    phone_landline: initialData?.phone_landline || '',
    mobile: initialData?.mobile || '',
    position: initialData?.position || '',
    title: initialData?.title || '',
    company: initialData?.company || '',
    contact_type: initialData?.contact_type || 'Primary',
    is_primary: initialData?.is_primary || false,
    notes: initialData?.notes || '',
    account_manager: initialData?.account_manager || '',
    state_manager: initialData?.state_manager || '',
    national_manager: initialData?.national_manager || '',
    preferred_communication: initialData?.preferred_communication || 'email'
  };
}

// Type for unified address record that matches database schema
export interface UnifiedAddressRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  address_type: AddressType;
  is_primary: boolean;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Type for unified contact record that matches database schema
export interface UnifiedContactRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  company?: string;
  contact_type: string;
  is_primary: boolean;
  title?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}
