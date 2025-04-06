// TypeScript Interfaces for Database Tables
// Generated from database schema

// Audit Logs
export interface AuditLog {
  id: string; // uuid
  userId?: string; // uuid
  tableName: string; // text
  recordId: string; // uuid
  operation: string; // text
  oldValues?: object; // jsonb
  newValues?: object; // jsonb
  timestamp: Date; // timestamp with time zone
}

// Billing Line
export interface BillingLine {
  id: string; // uuid
  contractId?: string; // uuid
  siteId?: string; // uuid
  description: string; // text
  unit: string; // text
  frequency: number; // integer
  clientCharge: number; // numeric
  internalCost?: number; // numeric
  deliveryType?: string; // text
  isActive?: boolean; // boolean
  notes?: string; // text
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
  supplierCost?: number; // numeric
}

// Client Addresses
export interface ClientAddress {
  id: string; // uuid
  clientId: string; // uuid
  addressType: string; // text
  street: string; // text
  suburb: string; // text
  state: string; // text
  postcode: string; // text
  country: string; // text
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
}

// Client Contacts
export interface ClientContact {
  id: string; // uuid
  clientId: string; // uuid
  contactType: string; // public.contact_type
  name: string; // text
  position?: string; // text
  email: string; // text
  phone?: string; // text
  mobile?: string; // text
  isPrimary: boolean; // boolean
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
}

// Clients
export interface Client {
  id: string; // uuid
  businessName: string; // text
  tradingName?: string; // text
  abn?: string; // text
  acn?: string; // text
  industry?: string; // text
  status: string; // public.client_status
  onboardingDate: Date; // date
  source?: string; // text
  billingCycle?: string; // text
  paymentTerms?: string; // text
  paymentMethod?: string; // text
  creditLimit?: number; // numeric
  taxStatus?: string; // text
  accountManagerId?: string; // uuid
  relationshipRating?: number; // integer
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
  addressLine1?: string; // text
  addressLine2?: string; // text
  suburb?: string; // text
  state?: string; // text
  postcode?: string; // text
  country: string; // text
  phone?: string; // text
  address?: string; // text
}

// Contract Budget
export interface ContractBudget {
  id: string; // uuid
  contractId?: string; // uuid
  contractorId?: string; // uuid
  budgetAmount: number; // numeric
  notes?: string; // text
  createdAt?: Date; // timestamp with time zone
  updatedAt?: Date; // timestamp with time zone
}

// Contract Financial Entries
export interface ContractFinancialEntry {
  id: string; // uuid
  contractId: string; // uuid
  entryType: string; // text
  amount: number; // numeric
  entryDate: Date; // date
  description?: string; // text
  invoiceReference?: string; // text
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
}

// Contract Sites
export interface ContractSite {
  id: string; // uuid
  contractId: string; // uuid
  siteId: string; // uuid
  createdAt: Date; // timestamp with time zone
}

// Contracts
export interface Contract {
  id: string; // uuid
  clientId: string; // uuid
  contractCode: string; // text
  contractName: string; // text
  startDate: Date; // date
  endDate?: Date; // date
  status: string; // text
  valueTotal?: number; // numeric
  valueWeekly?: number; // numeric
  valueMonthly?: number; // numeric
  valueAnnual?: number; // numeric
  billingCycle?: string; // text
  paymentTerms?: string; // text
  paymentMethod?: string; // text
  notes?: string; // text
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
  description?: string; // text
  isOngoing?: boolean; // boolean
  serviceType?: string; // text
  billingFrequency?: string; // text
  billingType?: string; // text
  contractValue?: number; // numeric
  hourlyRate?: number; // numeric
  rateSchedule?: object; // jsonb
  slaRequirements?: string; // text
  documents?: object; // jsonb
  primaryManagerId?: string; // uuid
  clientRepresentativeName?: string; // text
  clientRepresentativeContact?: string; // text
  renewalNoticeDate?: Date; // date
  deliveryMode?: string; // text
  totalWeeklyValue?: number; // numeric
  totalMonthlyValue?: number; // numeric
  totalAnnualValue?: number; // numeric
  accountManager?: string; // text
  stateManager?: string; // text
  nationalManager?: string; // text
  supplierCostWeekly?: number; // numeric
  supplierCostMonthly?: number; // numeric
  supplierCostAnnual?: number; // numeric
  profitMarginPercentage?: number; // numeric
}

// Sites
export interface Site {
  id: string; // uuid
  clientId: string; // uuid
  siteCode: string; // text
  siteName: string; // text
  status: string; // public.site_status
  region?: string; // text
  businessUnit?: string; // text
  addressLine1: string; // text
  addressLine2?: string; // text
  suburb: string; // text
  state: string; // text
  postcode: string; // text
  country: string; // text
  latitude?: number; // numeric
  longitude?: number; // numeric
  siteType?: string; // public.site_type
  squareMeters?: number; // numeric
  inductionRequired?: boolean; // boolean
  siteTags?: string[]; // text[]
  cleaningFrequency?: string; // public.cleaning_frequency
  cleaningDaysSchedule?: object; // jsonb
  siteContactName?: string; // text
  siteContactEmail?: string; // text
  siteContactPhone?: string; // text
  siteContacts?: object; // jsonb
  areaManagerId?: string; // uuid
  defaultCalendarId?: string; // uuid
  notes?: string; // text
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
  accessInstructions?: string; // text
  emergencyInstructions?: string; // text
  description?: string; // text
}

// Supplier Compliance Documents
export interface SupplierComplianceDocument {
  id: string; // uuid
  supplierId: string; // uuid
  documentType: string; // text
  documentName: string; // text
  expiryDate?: Date; // date
  fileUrl?: string; // text
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
}

// Supplier Contract
export interface SupplierContract {
  link_id: string; // uuid
  supplier_id: string; // uuid
  contract_id: string; // uuid
  role: string; // text
  status: string; // text
  services?: string; // text
  percentage?: number; // integer
  assigned_at?: Date; // timestamp with time zone
  assigned_by?: string; // uuid
  notes?: string; // text
  created_at?: Date; // timestamp with time zone
  updated_at?: Date; // timestamp with time zone
}

// Supplier Services
export interface SupplierService {
  id: string; // uuid
  supplierId: string; // uuid
  serviceType: string; // text
  createdAt: Date; // timestamp with time zone
}

// Suppliers
export interface Supplier {
  id: string; // uuid
  businessName: string; // text
  abn?: string; // text
  status: string; // text
  primaryContactName?: string; // text
  primaryContactEmail?: string; // text
  primaryContactPhone?: string; // text
  complianceStatus?: string; // text
  lastReviewDate?: Date; // date
  notes?: string; // text
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
}

// Unified Addresses
export interface UnifiedAddress {
  id: string; // uuid
  entityType: string; // text
  entityId: string; // uuid
  name?: string; // text
  addressLine1: string; // text
  addressLine2?: string; // text
  suburb: string; // text
  state: string; // text
  postcode: string; // text
  country: string; // text
  addressType: string; // text
  isPrimary?: boolean; // boolean
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
}

// Unified Contacts
export interface UnifiedContact {
  id: string; // uuid
  entityType: string; // text
  entityId: string; // uuid
  name: string; // text
  email: string; // text
  phone: string; // text
  mobile: string; // text
  position?: string; // text
  company?: string; // text
  contactType: string; // text
  isPrimary: boolean; // boolean
  createdAt: Date; // timestamp with time zone
  updatedAt: Date; // timestamp with time zone
  accountManager?: string; // text
  stateManager?: string; // text
  nationalManager?: string; // text
}

// Work Order Tasks
export interface WorkOrderTask {
  id: string; // uuid
  workOrderId: string; // uuid
  taskName: string; // text
  description?: string; // text
  estimatedTime?: number; // numeric
  actualTime?: number; // numeric
  status: string; // text
  completedAt?: Date; // timestamp with time zone
  completedBy?: string; // uuid
  createdAt?: Date; // timestamp with time zone
  updatedAt?: Date; // timestamp with time zone
}

// Work Orders
export interface WorkOrder {
  id: string; // uuid
  workOrderNumber: string; // text
  title: string; // text
  description?: string; // text
  clientId: string; // uuid
  contractId: string; // uuid
  siteId: string; // uuid
  status: string; // text
  priority: string; // text
  serviceType: string; // text
  scheduledStart?: Date; // timestamp with time zone
  scheduledEnd?: Date; // timestamp with time zone
  actualStart?: Date; // timestamp with time zone
  actualEnd?: Date; // timestamp with time zone
  supplierId?: string; // uuid
  estimatedCost?: number; // numeric
  actualCost?: number; // numeric
  specialInstructions?: string; // text
  billingMethod?: string; // text
  createdBy?: string; // uuid
  updatedBy?: string; // uuid
  createdAt?: Date; // timestamp with time zone
  updatedAt?: Date; // timestamp with time zone
}

// Workbills
export interface Workbill {
  id: string; // uuid
  workOrderId: string; // uuid
  supplierId?: string; // uuid
  amount: number; // numeric
  hoursWorked?: number; // numeric
  payRate?: number; // numeric
  status: string; // text
  invoiceNumber?: string; // text
  invoiceDate?: Date; // date
  paymentDate?: Date; // date
  paymentReference?: string; // text
  notes?: string; // text
  createdAt?: Date; // timestamp with time zone
  updatedAt?: Date; // timestamp with time zone
}
