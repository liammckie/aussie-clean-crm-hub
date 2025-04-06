
// Configuration for the contract details view
export const contractDetailsFields = {
  'Basic Information': [
    { key: 'contract_name', label: 'Contract Name' },
    { key: 'contract_code', label: 'Contract Code' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'description', label: 'Description' },
  ],
  'Timeframe': [
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'is_ongoing', label: 'Ongoing Contract', type: 'boolean' },
  ],
  'Contract Value': [
    { key: 'total_weekly_value', label: 'Weekly Value', type: 'currency' },
    { key: 'total_monthly_value', label: 'Monthly Value', type: 'currency' },
    { key: 'total_annual_value', label: 'Annual Value', type: 'currency' },
  ],
  'Supplier Costs': [
    { key: 'supplier_cost_weekly', label: 'Weekly Cost', type: 'currency' },
    { key: 'supplier_cost_monthly', label: 'Monthly Cost', type: 'currency' },
    { key: 'supplier_cost_annual', label: 'Annual Cost', type: 'currency' },
    { key: 'profit_margin_percentage', label: 'Target Profit Margin', type: 'percentage' },
  ],
  'Billing': [
    { key: 'billing_frequency', label: 'Billing Frequency' },
    { key: 'billing_type', label: 'Billing Type' },
    { key: 'payment_terms', label: 'Payment Terms' },
    { key: 'payment_method', label: 'Payment Method' },
  ],
  'Management': [
    { key: 'delivery_mode', label: 'Delivery Mode' },
    { key: 'account_manager', label: 'Account Manager' },
    { key: 'state_manager', label: 'State Manager' },
    { key: 'national_manager', label: 'National Manager' },
  ],
  'Client Representative': [
    { key: 'client_representative_name', label: 'Name' },
    { key: 'client_representative_contact', label: 'Contact' },
  ],
  'Requirements': [
    { key: 'sla_requirements', label: 'SLA Requirements' },
  ],
  'Notes': [
    { key: 'notes', label: 'Additional Notes' },
  ],
};
