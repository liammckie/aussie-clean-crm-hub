
export type EntityType = 'client' | 'supplier' | 'employee' | 'site' | 'internal';
export type AddressType = 'billing' | 'postal' | 'physical';

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
  is_primary?: boolean;
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
  mobile?: string;
  position?: string;
  company?: string;
  contact_type: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UnifiedAddressFormData {
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
  is_primary?: boolean;
}

export interface UnifiedContactFormData {
  entity_type: EntityType;
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

export type ValidationErrorResponse = {
  category: 'validation';
  message: string;
  details?: {
    field?: string;
    code?: string;
  };
};
