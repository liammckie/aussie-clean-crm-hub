
import { ApiResponse } from '@/types/api-response';

// Define the entity types for the unified API
export enum EntityType {
  CLIENT = 'client',
  CONTACT = 'contact',
  SITE = 'site',
  SUPPLIER = 'supplier',
  CONTRACT = 'contract',
  WORK_ORDER = 'work_order'
}

// Define address types
export enum AddressType {
  BILLING = 'billing',
  PHYSICAL = 'physical',
  POSTAL = 'postal',
  SITE = 'site',
  SHIPPING = 'shipping',
  HEAD_OFFICE = 'head_office',
  BRANCH = 'branch',
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  WAREHOUSE = 'warehouse'
}

// Define contact types
export enum ContactType {
  PRIMARY = 'primary',
  BILLING = 'billing',
  TECHNICAL = 'technical',
  OPERATIONS = 'operations',
  SALES = 'sales',
  SUPPORT = 'support',
  MANAGER = 'manager',
  OTHER = 'other',
  EMERGENCY = 'emergency'
}

/**
 * Client data record structure from database
 */
export interface ClientRecord {
  id: string;
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status?: string;
  onboarding_date?: string;
  source?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  created_at?: string;
  updated_at?: string;
  // Additional fields needed by components
  phone?: string;
  address?: string;
}

/**
 * Client with contacts for display
 */
export interface ClientWithContacts extends ClientRecord {
  contacts?: ContactRecord[];
}

/**
 * Client contact record structure
 */
export interface ContactRecord {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  is_primary: boolean;
  contact_type?: ContactType;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Computed property for display
  name?: string;
}

/**
 * Client address record structure
 */
export interface ClientAddressRecord {
  id: string;
  client_id: string;
  address_type: AddressType;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Data required to insert a new client
 */
export interface ClientFormData {
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status?: string;
  onboarding_date?: string | Date;
  source?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  // Additional fields needed by existing components
  phone?: string;
  address?: string;
}

/**
 * Data required to create a client contact
 */
export interface ContactFormData {
  client_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  is_primary: boolean;
  contact_type?: ContactType;
  notes?: string;
  // Added for compatibility with existing components
  name?: string;
}

/**
 * Data required to create a client address
 */
export interface AddressFormData {
  client_id: string;
  address_type: AddressType;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

/**
 * API response types
 */
export type ClientApiResponse = ApiResponse<ClientRecord>;
export type ClientsApiResponse = ApiResponse<ClientRecord[]>;
export type ContactApiResponse = ApiResponse<ContactRecord>;
export type ContactsApiResponse = ApiResponse<ContactRecord[]>;
export type AddressApiResponse = ApiResponse<ClientAddressRecord>;
export type AddressesApiResponse = ApiResponse<ClientAddressRecord[]>;

/**
 * Validation error response type
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
