
import { z } from 'zod';

// Contract status options
export type ContractStatus = 'draft' | 'active' | 'expired' | 'cancelled' | 'pending_approval' | 'on_hold';

// Delivery mode options
export type DeliveryMode = 'employee' | 'contractor' | 'hybrid' | 'other';

// Billing types
export type BillingType = 'fixed' | 'variable' | 'time_materials' | 'retainer';

// Billing frequency options
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// Payment methods
export type PaymentMethod = 'direct_debit' | 'credit_card' | 'bank_transfer' | 'cheque' | 'cash';

// Service types
export type ServiceType = 'commercial_cleaning' | 'industrial_cleaning' | 'residential_cleaning' | 
                         'window_cleaning' | 'carpet_cleaning' | 'waste_management' | 
                         'grounds_maintenance' | 'pest_control' | 'other';

// Contract form schema
export const contractFormSchema = z.object({
  contract_name: z.string().min(1, { message: 'Contract name is required' }),
  contract_code: z.string().min(1, { message: 'Contract code is required' }),
  client_id: z.string().uuid({ message: 'Valid client ID is required' }),
  description: z.string().optional(),
  service_type: z.string(),
  status: z.string().default('draft'),
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().optional(),
  is_ongoing: z.boolean().default(false),
  delivery_mode: z.string().optional(),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
  billing_frequency: z.string().optional(),
  billing_type: z.string().optional(),
  payment_terms: z.string().optional(),
  payment_method: z.string().optional(),
  total_weekly_value: z.number().optional(),
  total_monthly_value: z.number().optional(),
  total_annual_value: z.number().optional(),
  sla_requirements: z.string().optional(),
  client_representative_name: z.string().optional(),
  client_representative_contact: z.string().optional(),
  notes: z.string().optional(),
});

export type ContractFormData = z.infer<typeof contractFormSchema>;

// Helper to create default contract values
export function createDefaultContractValues(
  initialValues: Partial<ContractFormData> = {},
): ContractFormData {
  return {
    contract_name: initialValues.contract_name || '',
    contract_code: initialValues.contract_code || '',
    client_id: initialValues.client_id || '',
    description: initialValues.description || '',
    service_type: initialValues.service_type || 'commercial_cleaning',
    status: initialValues.status || 'draft',
    start_date: initialValues.start_date || new Date().toISOString().split('T')[0],
    end_date: initialValues.end_date || '',
    is_ongoing: initialValues.is_ongoing !== undefined ? initialValues.is_ongoing : false,
    delivery_mode: initialValues.delivery_mode || '',
    account_manager: initialValues.account_manager || '',
    state_manager: initialValues.state_manager || '',
    national_manager: initialValues.national_manager || '',
    billing_frequency: initialValues.billing_frequency || '',
    billing_type: initialValues.billing_type || '',
    payment_terms: initialValues.payment_terms || '',
    payment_method: initialValues.payment_method || '',
    total_weekly_value: initialValues.total_weekly_value,
    total_monthly_value: initialValues.total_monthly_value,
    total_annual_value: initialValues.total_annual_value,
    sla_requirements: initialValues.sla_requirements || '',
    client_representative_name: initialValues.client_representative_name || '',
    client_representative_contact: initialValues.client_representative_contact || '',
    notes: initialValues.notes || '',
  };
}
