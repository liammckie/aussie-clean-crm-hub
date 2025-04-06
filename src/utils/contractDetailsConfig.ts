
export const contractDetailsFields = {
  'Basic Information': [
    { key: 'contract_name', label: 'Contract Name' },
    { key: 'contract_code', label: 'Contract Code' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'description', label: 'Description' },
  ],
  'Timeline': [
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'is_ongoing', label: 'Ongoing Contract', type: 'boolean' },
  ],
  'Financial Details': [
    { key: 'total_weekly_value', label: 'Weekly Value', type: 'currency' },
    { key: 'total_monthly_value', label: 'Monthly Value', type: 'currency' },
    { key: 'total_annual_value', label: 'Annual Value', type: 'currency' },
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
    { key: 'client_representative_name', label: 'Client Representative' },
    { key: 'client_representative_contact', label: 'Client Representative Contact' },
  ],
  'Other Information': [
    { key: 'sla_requirements', label: 'SLA Requirements' },
    { key: 'notes', label: 'Notes' },
  ],
};
