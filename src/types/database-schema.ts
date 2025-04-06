
/**
 * Database schema enums and types
 * This file contains type definitions that match the database schema
 */

// Client status enum
export enum ClientStatus {
  ACTIVE = 'Active',
  PROSPECT = 'Prospect',
  INACTIVE = 'Inactive',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled'
}

// Site status enum
export enum SiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_ACTIVATION = 'pending_activation'
}

// Site type enum
export enum SiteType {
  RESIDENTIAL = 'residential',
  INDUSTRIAL = 'industrial',
  RETAIL = 'retail',
  HOSPITALITY = 'hospitality',
  OFFICE = 'office',
  WAREHOUSE = 'warehouse',
  EDUCATIONAL = 'educational',
  MEDICAL = 'medical'
}

// Contract status enum
export enum ContractStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

// Supplier status enum
export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

// Work order status enum
export enum WorkOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Work order priority enum
export enum WorkOrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
