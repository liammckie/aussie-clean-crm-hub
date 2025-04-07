
/**
 * Database schema types
 */

// Client status enum
export enum ClientStatus {
  PROSPECT = 'Prospect',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ARCHIVED = 'Archived',
  LEAD = 'Lead'
}

// Site status enum
export enum SiteStatus {
  PENDING_ACTIVATION = 'pending_activation',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived'
}

// Site type enum
export enum SiteType {
  COMMERCIAL = 'commercial',
  RESIDENTIAL = 'residential',
  INDUSTRIAL = 'industrial',
  RETAIL = 'retail',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  GOVERNMENT = 'government',
  MIXED_USE = 'mixed_use'
}

// Entity types for the unified API
export enum EntityType {
  CLIENT = 'client',
  CONTACT = 'contact',
  SITE = 'site',
  SUPPLIER = 'supplier',
  CONTRACT = 'contract',
  WORK_ORDER = 'work_order'
}

// Contact types
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

// Address types
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
