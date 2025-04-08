
/**
 * Configuration for contract details display
 * This file defines how contract fields are grouped and displayed in the ContractDetailsTab
 */

export const contractDetailsFields = {
  'Basic Information': [
    { key: 'contract_name', label: 'Contract Name' },
    { key: 'contract_code', label: 'Contract Code' },
    { key: 'client_name', label: 'Client' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'description', label: 'Description' },
  ],
  'Dates & Duration': [
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'is_ongoing', label: 'Ongoing Contract', type: 'boolean' },
  ],
  'Financial Details': [
    { key: 'total_weekly_value', label: 'Weekly Value', type: 'currency' },
    { key: 'total_monthly_value', label: 'Monthly Value', type: 'currency' },
    { key: 'total_annual_value', label: 'Annual Value', type: 'currency' },
    { key: 'billing_frequency', label: 'Billing Frequency' },
    { key: 'payment_terms', label: 'Payment Terms' },
  ],
  'Management': [
    { key: 'account_manager', label: 'Account Manager' },
    { key: 'state_manager', label: 'State Manager' },
    { key: 'national_manager', label: 'National Manager' },
    { key: 'client_representative_name', label: 'Client Representative' },
    { key: 'client_representative_contact', label: 'Client Contact' },
    { key: 'delivery_mode', label: 'Delivery Mode' },
  ],
  'Requirements': [
    { key: 'sla_requirements', label: 'SLA Requirements' },
    { key: 'notes', label: 'Notes' },
  ]
};

export default contractDetailsFields;
