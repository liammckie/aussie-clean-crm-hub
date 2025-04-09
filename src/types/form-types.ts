
import { z } from 'zod';
import { AddressType as DatabaseAddressType, ContactType as DatabaseContactType, EntityType as DatabaseEntityType } from "@/types/database-schema";

// Form-specific types for contact forms - align with DatabaseContactType
export enum ContactType {
  PRIMARY = 'primary',
  BILLING = 'billing',
  OPERATIONS = 'operations',
  TECHNICAL = 'technical',
  EMERGENCY = 'emergency',
  SALES = 'sales',
  SUPPORT = 'support',
  MANAGER = 'manager',
  OTHER = 'other'
}

// Form-specific types for address forms
export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
  PHYSICAL = 'physical',
  POSTAL = 'postal',
  REGISTERED = 'registered'
}

export enum EntityType {
  CLIENT = 'client',
  SUPPLIER = 'supplier',
  EMPLOYEE = 'employee',
  SITE = 'site',
  INTERNAL = 'internal',
  CONTACT = 'contact'
}

// Adapter functions to convert between form and database types
export function toDatabaseContactType(formType: ContactType): DatabaseContactType {
  return formType.toLowerCase() as DatabaseContactType;
}

export function toFormContactType(dbType: DatabaseContactType): ContactType {
  const mapping: Record<string, ContactType> = {
    'primary': ContactType.PRIMARY,
    'billing': ContactType.BILLING,
    'operations': ContactType.OPERATIONS,
    'technical': ContactType.TECHNICAL,
    'emergency': ContactType.EMERGENCY,
    'sales': ContactType.SALES,
    'support': ContactType.SUPPORT,
    'manager': ContactType.MANAGER,
    'other': ContactType.OTHER
  };
  return mapping[dbType] || ContactType.OTHER;
}

export function toDatabaseEntityType(formType: EntityType): DatabaseEntityType {
  // Safe mapping from form entity type to database entity type
  const entityTypeMapping: Record<EntityType, DatabaseEntityType> = {
    [EntityType.CLIENT]: DatabaseEntityType.CLIENT,
    [EntityType.SUPPLIER]: DatabaseEntityType.SUPPLIER,
    [EntityType.EMPLOYEE]: DatabaseEntityType.EMPLOYEE,
    [EntityType.SITE]: DatabaseEntityType.SITE,
    [EntityType.INTERNAL]: DatabaseEntityType.CLIENT, // Map INTERNAL to CLIENT as fallback
    [EntityType.CONTACT]: DatabaseEntityType.CONTACT
  };
  
  return entityTypeMapping[formType];
}

export function toFormEntityType(dbType: DatabaseEntityType): EntityType {
  const mapping: Record<string, EntityType> = {
    'client': EntityType.CLIENT,
    'supplier': EntityType.SUPPLIER,
    'employee': EntityType.EMPLOYEE,
    'site': EntityType.SITE,
    'contact': EntityType.CONTACT,
    'contract': EntityType.CONTACT, // Handle 'contract' mapping
    'work_order': EntityType.CONTACT, // Handle 'work_order' mapping
    'financial': EntityType.CONTACT // Handle 'financial' mapping
  };
  return mapping[dbType] || EntityType.CLIENT;
}

export interface UnifiedAddressFormData {
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: string;
  is_primary: boolean;
  [key: string]: any;
}

export interface UnifiedContactFormData {
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  contact_type: ContactType;
  is_primary: boolean;
  first_name?: string;
  last_name?: string;
  title?: string;
  company?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  [key: string]: any;
}

// Export the AddressFormData for backward compatibility
export type AddressFormData = UnifiedAddressFormData;

// Add the schema for UnifiedContactForm
export const unifiedContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  position: z.string().optional(),
  contact_type: z.nativeEnum(ContactType),
  is_primary: z.boolean().default(false),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
});

// Add the enum for preferred communication
export enum PreferredCommunication {
  EMAIL = 'email',
  PHONE = 'phone',
  MOBILE = 'mobile',
  MAIL = 'mail'
}

// Create default values helper for contact form
export function createDefaultContactValues(initialData?: Partial<UnifiedContactFormData>): UnifiedContactFormData {
  return {
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    mobile: initialData?.mobile || '',
    position: initialData?.position || '',
    contact_type: initialData?.contact_type || ContactType.PRIMARY,
    is_primary: initialData?.is_primary || false,
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    title: initialData?.title || '',
    company: initialData?.company || '',
    account_manager: initialData?.account_manager || '',
    state_manager: initialData?.state_manager || '',
    national_manager: initialData?.national_manager || '',
  };
}
