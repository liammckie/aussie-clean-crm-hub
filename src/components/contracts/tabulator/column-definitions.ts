
import { formatMoneyColumn } from './formatters';
import { contractService } from '@/services/contract';
import { toast } from 'sonner';

/**
 * Define column configurations for the Tabulator
 */
export const getColumnDefinitions = (onCellEdited: (cell: any) => void) => [
  {
    title: "Client", 
    field: "client_name", 
    headerFilter: "input",
    headerFilterLiveFilter: true,
    formatter: "text",
    resizable: true
  },
  {
    title: "Contract",
    field: "contract_name",
    headerFilter: "input",
    headerFilterLiveFilter: true,
    formatter: "text",
    resizable: true
  },
  {
    title: "Status",
    field: "status",
    headerFilter: "select",
    headerFilterParams: { valuesLookup: true },
    formatter: "text",
    width: 120,
    resizable: true
  },
  {
    title: "Type",
    field: "service_type",
    headerFilter: "select",
    headerFilterParams: { valuesLookup: true },
    formatter: "text",
    width: 120,
    resizable: true
  },
  {
    title: "Delivery Mode",
    field: "delivery_mode",
    headerFilter: "select", 
    headerFilterParams: {
      values: {"employee": "Employee", "contractor": "Contractor", "hybrid": "Hybrid"}
    },
    editor: "select",
    editorParams: {
      values: {"employee": "Employee", "contractor": "Contractor", "hybrid": "Hybrid"}
    },
    width: 150,
    resizable: true
  },
  {
    title: "Account Manager",
    field: "account_manager",
    headerFilter: "input",
    editor: "input", 
    resizable: true
  },
  {
    title: "State Manager",
    field: "state_manager",
    headerFilter: "input",
    editor: "input",
    resizable: true
  },
  {
    title: "National Manager",
    field: "national_manager",
    headerFilter: "input",
    editor: "input",
    resizable: true
  },
  {
    title: "Weekly Value",
    field: "total_weekly_value", 
    formatter: formatMoneyColumn,
    bottomCalc: "sum",
    bottomCalcFormatter: formatMoneyColumn,
    hozAlign: "right",
    resizable: true
  },
  {
    title: "Monthly Value",
    field: "total_monthly_value",
    formatter: formatMoneyColumn,
    bottomCalc: "sum",
    bottomCalcFormatter: formatMoneyColumn,
    hozAlign: "right",
    resizable: true
  },
  {
    title: "Annual Value",
    field: "total_annual_value",
    formatter: formatMoneyColumn,
    bottomCalc: "sum",
    bottomCalcFormatter: formatMoneyColumn,
    hozAlign: "right",
    resizable: true
  }
];

/**
 * Handle cell edit events
 */
export const handleCellEdit = (cell: any) => {
  const row = cell.getRow();
  const rowData = row.getData();
  const column = cell.getColumn().getField();
  const value = cell.getValue();
  
  // Update contract in database
  contractService.updateContract(rowData.id, { [column]: value })
    .then(() => {
      toast.success(`Updated ${column} for ${rowData.contract_name}`);
    })
    .catch(() => {
      toast.error(`Failed to update ${column}`);
      cell.restoreOldValue();
    });
};
