
import { ApiResponse } from '@/types/api-response';
import { EntityType, AddressType, ContactType } from '@/types/database-schema';

export type { EntityType, AddressType, ContactType };

/**
 * Unified address form data structure
 */
export interface UnifiedAddressFormData {
  entity_id: string;
  entity_type: EntityType;
  address_type: AddressType;
  address_line1: string;
  address_line2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  is_primary?: boolean;
  name?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

/**
 * Unified address record structure - matches the database schema
 */
export interface UnifiedAddressRecord {
  id: string;
  entity_id: string;
  entity_type: EntityType;
  address_type: AddressType;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  is_primary: boolean;
  name?: string;
  created_at?: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

/**
 * Unified contact form data structure
 */
export interface UnifiedContactFormData {
  entity_id: string;
  entity_type: EntityType;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  is_primary: boolean;
  contact_type?: ContactType;
  notes?: string;
}

/**
 * Unified contact record structure
 */
export interface UnifiedContactRecord {
  id: string;
  entity_id: string;
  entity_type: EntityType;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  company?: string;
  is_primary: boolean;
  contact_type?: ContactType;
  notes?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Validation error response structure
 */
export interface ValidationErrorResponse {
  category: 'validation';
  message: string;
  details?: {
    field?: string;
    error?: string;
    code?: string;
  };
}

/**
 * API response types
 */
export type AddressApiResponse = ApiResponse<UnifiedAddressRecord>;
export type AddressesApiResponse = ApiResponse<UnifiedAddressRecord[]>;
export type ContactApiResponse = ApiResponse<UnifiedContactRecord>;
export type ContactsApiResponse = ApiResponse<UnifiedContactRecord[]>;
