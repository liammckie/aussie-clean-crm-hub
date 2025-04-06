
export interface ContractData {
  id: string;
  client_id: string;
  contract_name: string;
  contract_code: string;
  description?: string;
  service_type?: string;
  status: string;
  start_date: string;
  end_date?: string;
  is_ongoing?: boolean;
  delivery_mode?: string;
  account_manager?: string;
  state_manager?: string;
  national_manager?: string;
  billing_frequency?: string;
  billing_type?: string;
  payment_terms?: string;
  payment_method?: string;
  total_weekly_value?: number;
  total_monthly_value?: number;
  total_annual_value?: number;
  created_at?: string;
  updated_at?: string;
  sla_requirements?: string;
  billing_cycle?: string;
  client_representative_name?: string;
  client_representative_contact?: string;
  notes?: string;
  // New fields for supplier costs tracking
  supplier_cost_weekly?: number;
  supplier_cost_monthly?: number;
  supplier_cost_annual?: number;
  profit_margin_percentage?: number;
}

export interface BillingLineData {
  id: string;
  contract_id: string;
  site_id?: string;
  description: string;
  client_charge: number;
  internal_cost?: number;
  frequency: number;
  unit: string;
  delivery_type?: string;
  is_active?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // New field for supplier cost
  supplier_cost?: number;
}

export interface ContractBudgetData {
  id: string;
  contract_id: string;
  budget_amount: number;
  contractor_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Contract view mode enum
export type ContractViewMode = 'view' | 'edit' | 'create';
