
import { AddressType as DatabaseAddressType, ContactType as DatabaseContactType, EntityType as DatabaseEntityType } from "@/types/database-schema";

// Form-specific types for contact forms
export enum ContactType {
  PRIMARY = 'Primary',
  BILLING = 'Billing',
  OPERATIONS = 'Operations',
  TECHNICAL = 'Technical',
  EMERGENCY = 'Emergency'
}

// Form-specific types for address forms
export enum AddressType {
  BILLING = 'Billing',
  SHIPPING = 'Shipping',
  PHYSICAL = 'Physical',
  POSTAL = 'Postal',
  REGISTERED = 'Registered'
}

export enum EntityType {
  CLIENT = 'client',
  SUPPLIER = 'supplier',
  EMPLOYEE = 'employee',
  SITE = 'site',
  INTERNAL = 'internal'
}

// Adapter functions to convert between form and database types
export function toDatabaseContactType(formType: ContactType): DatabaseContactType {
  const mapping: Record<ContactType, DatabaseContactType> = {
    [ContactType.PRIMARY]: 'primary',
    [ContactType.BILLING]: 'billing',
    [ContactType.OPERATIONS]: 'operations',
    [ContactType.TECHNICAL]: 'technical',
    [ContactType.EMERGENCY]: 'emergency'
  };
  return mapping[formType];
}

export function toFormContactType(dbType: DatabaseContactType): ContactType {
  const mapping: Record<DatabaseContactType, ContactType> = {
    'primary': ContactType.PRIMARY,
    'billing': ContactType.BILLING,
    'operations': ContactType.OPERATIONS,
    'technical': ContactType.TECHNICAL,
    'emergency': ContactType.EMERGENCY
  };
  return mapping[dbType];
}

export function toDatabaseEntityType(formType: EntityType): DatabaseEntityType {
  return formType.toLowerCase() as DatabaseEntityType;
}

export function toFormEntityType(dbType: DatabaseEntityType): EntityType {
  const mapping: Record<DatabaseEntityType, EntityType> = {
    'client': EntityType.CLIENT,
    'supplier': EntityType.SUPPLIER,
    'employee': EntityType.EMPLOYEE,
    'site': EntityType.SITE,
    'internal': EntityType.INTERNAL
  };
  return mapping[dbType];
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
