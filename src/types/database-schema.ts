
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
  MIXED_USE = 'mixed_use',
  OFFICE = 'office',       // Added this as it's used in tests
  WAREHOUSE = 'warehouse'  // Added this as it's used in tests
}

// Entity types for the unified API
export enum EntityType {
  CLIENT = 'client',
  CONTACT = 'contact',
  SITE = 'site',
  SUPPLIER = 'supplier',
  CONTRACT = 'contract',
  WORK_ORDER = 'work_order',
  EMPLOYEE = 'employee',
  FINANCIAL = 'financial'
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

// Client record type from the database with all required properties
export interface ClientRecord {
  id: string;
  business_name: string;
  trading_name?: string;
  abn?: string;
  acn?: string;
  industry?: string;
  status: ClientStatus;
  onboarding_date?: string;
  source?: string;
  billing_cycle?: string;
  payment_terms?: string;
  payment_method?: string;
  tax_status?: string;
  credit_limit?: number;
  created_at?: string;
  updated_at?: string;
  // Address fields - explicitly defined based on error messages
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  // Legacy fields
  phone?: string;
  address?: string;
  // Relationships
  client_contacts?: any[];
}

// Error category enum
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTH = 'auth',
  SERVER = 'server',
  DATABASE = 'database',
  NOT_FOUND = 'not_found',
  BUSINESS_LOGIC = 'business_logic',
  PERMISSION = 'permission'
}
