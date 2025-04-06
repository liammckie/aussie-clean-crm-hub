
import { 
  AddressType,
  ContactType,
  PreferredCommunication,
  UnifiedAddressFormData,
  UnifiedContactFormData
} from '@/types/form-types';

export type EntityType = 'client' | 'supplier' | 'employee' | 'site' | 'internal';

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
  is_primary: boolean;
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
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type { UnifiedAddressFormData, UnifiedContactFormData };

export type ValidationErrorResponse = {
  category: 'validation';
  message: string;
  details?: {
    field?: string;
    code?: string;
  };
};
