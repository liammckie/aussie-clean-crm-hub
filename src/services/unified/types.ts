
export type EntityType = 'client' | 'supplier' | 'employee' | 'site' | 'internal';
// Import these types from form-types.ts instead of redefining them
import { 
  AddressType,
  ContactType,
  PreferredCommunication,
  UnifiedAddressFormData,
  UnifiedContactFormData
} from '@/types/form-types';

export interface UnifiedAddressRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  is_primary: boolean; // Changed from optional to required
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UnifiedContactRecord {
  id: string;
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
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Re-export the types from form-types.ts
export { UnifiedAddressFormData, UnifiedContactFormData };

export type ValidationErrorResponse = {
  category: 'validation';
  message: string;
  details?: {
    field?: string;
    code?: string;
  };
};
