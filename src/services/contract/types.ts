
export type ContractStatus = 'draft' | 'pending' | 'active' | 'completed' | 'terminated';
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'ad_hoc';
export type BillingType = 'fixed_price' | 'hourly' | 'schedule_of_rates';
export type DeliveryMode = 'employee' | 'contractor' | 'hybrid';
export type ServiceType = 'cleaning' | 'security' | 'maintenance' | 'gardening' | 'other';

export interface ContractData {
  id: string;
  client_id: string;
  contract_name: string;
  contract_code: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_ongoing?: boolean;
  service_type?: ServiceType;
  status: ContractStatus;
  billing_frequency?: BillingFrequency;
  billing_type?: BillingType;
  contract_value?: number;
  hourly_rate?: number;
  rate_schedule?: Record<string, any>;
  sla_requirements?: string;
  documents?: Record<string, any>;
  primary_manager_id?: string;
  client_representative_name?: string;
  client_representative_contact?: string;
  renewal_notice_date?: string;
  delivery_mode?: DeliveryMode;
  total_weekly_value?: number;
  total_monthly_value?: number;
  total_annual_value?: number;
  created_at: string;
  updated_at: string;
}

export type DeliveryType = 'employee' | 'contractor';

export interface BillingLineData {
  id: string;
  contract_id: string;
  site_id?: string;
  description: string;
  unit: string;  // e.g., per week, per day, etc.
  frequency: number;
  client_charge: number;
  internal_cost?: number;
  delivery_type?: DeliveryType;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractBudgetData {
  id: string;
  contract_id: string;
  contractor_id?: string;
  budget_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
