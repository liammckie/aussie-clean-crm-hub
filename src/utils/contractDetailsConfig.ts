
export interface ContractField {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'boolean' | 'status';
}

export const contractDetailsFields: Record<string, ContractField[]> = {
  "General Information": [
    { key: "contract_name", label: "Contract Name" },
    { key: "contract_code", label: "Contract Code" },
    { key: "client_name", label: "Client" },
    { key: "status", label: "Status", type: "status" },
    { key: "description", label: "Description" }
  ],
  "Financial Details": [
    { key: "total_weekly_value", label: "Weekly Value", type: "currency" },
    { key: "total_monthly_value", label: "Monthly Value", type: "currency" },
    { key: "total_annual_value", label: "Annual Value", type: "currency" },
    { key: "supplier_cost_weekly", label: "Weekly Cost", type: "currency" },
    { key: "profit_margin_percentage", label: "Profit Margin" }
  ],
  "Contract Terms": [
    { key: "start_date", label: "Start Date", type: "date" },
    { key: "end_date", label: "End Date", type: "date" },
    { key: "is_ongoing", label: "Ongoing Contract", type: "boolean" },
    { key: "renewal_notice_date", label: "Renewal Notice Date", type: "date" },
    { key: "billing_cycle", label: "Billing Cycle" },
    { key: "billing_frequency", label: "Billing Frequency" }
  ],
  "Contact Information": [
    { key: "client_representative_name", label: "Client Representative" },
    { key: "client_representative_contact", label: "Representative Contact" },
    { key: "account_manager", label: "Account Manager" },
    { key: "state_manager", label: "State Manager" },
    { key: "national_manager", label: "National Manager" }
  ]
};
