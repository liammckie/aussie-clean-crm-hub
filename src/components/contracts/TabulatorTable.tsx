
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { contractService } from '@/services/contract';
import { toast } from 'sonner';

// Import Tabulator styles and create the component
import "tabulator-tables/dist/css/tabulator_semanticui.min.css";

// We need to import Tabulator dynamically because it relies on browser APIs
interface TabulatorTableProps {
  contracts: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
}

export function TabulatorTable({ contracts, onSelectionChange }: TabulatorTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Format financial values to currency
  const formatMoney = (cell: any) => {
    const value = cell.getValue();
    return value ? `$${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "$0.00";
  };

  // Handle row selection changes
  const handleSelectionChange = () => {
    if (!tabulatorRef.current) return;
    const selectedData = tabulatorRef.current.getSelectedData();
    onSelectionChange?.(selectedData);
  };

  // Only render on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Tabulator when contracts data is available
  useEffect(() => {
    if (!isClient || !tableRef.current || !contracts || contracts.length === 0) return;

    const initTable = async () => {
      try {
        // Dynamic import of Tabulator
        const Tabulator = (await import('tabulator-tables')).default;

        // Define the table
        const table = new Tabulator(tableRef.current!, {
          data: contracts,
          layout: "fitColumns",
          responsiveLayout: "collapse",
          movableColumns: true,
          selectable: true,
          selectableRangeMode: "click",
          pagination: true,
          paginationSize: 10,
          paginationSizeSelector: [10, 25, 50, 100],

          groupBy: "service_type",
          groupStartOpen: false,

          groupHeader: function(value, count, data, group) {
            let totalWeekly = 0;
            let totalMonthly = 0;
            let totalAnnual = 0;

            data.forEach((row: any) => {
              totalWeekly += parseFloat(row.total_weekly_value || 0);
              totalMonthly += parseFloat(row.total_monthly_value || 0);
              totalAnnual += parseFloat(row.total_annual_value || 0);
            });

            return `${value || 'Not Specified'} 
                    | Contracts: ${count} 
                    | Weekly: $${totalWeekly.toFixed(2)} 
                    | Monthly: $${totalMonthly.toFixed(2)} 
                    | Annual: $${totalAnnual.toFixed(2)}`;
          },

          columns: [
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
              formatter: formatMoney,
              bottomCalc: "sum",
              bottomCalcFormatter: formatMoney,
              hozAlign: "right",
              resizable: true
            },
            {
              title: "Monthly Value",
              field: "total_monthly_value",
              formatter: formatMoney,
              bottomCalc: "sum",
              bottomCalcFormatter: formatMoney,
              hozAlign: "right",
              resizable: true
            },
            {
              title: "Annual Value",
              field: "total_annual_value",
              formatter: formatMoney,
              bottomCalc: "sum",
              bottomCalcFormatter: formatMoney,
              hozAlign: "right",
              resizable: true
            }
          ],

          rowSelectionChanged: handleSelectionChange,
          
          // Handle cell edits
          cellEdited: function(cell: any) {
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
          },
        });

        // Store the table instance
        tabulatorRef.current = table;

      } catch (error) {
        console.error("Error initializing Tabulator:", error);
        toast.error("Failed to initialize contracts table");
      }
    };

    initTable();

    return () => {
      // Clean up Tabulator instance
      if (tabulatorRef.current && tabulatorRef.current.destroy) {
        tabulatorRef.current.destroy();
        tabulatorRef.current = null;
      }
    };
  }, [isClient, contracts, onSelectionChange]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div ref={tableRef} className="tabulator-container"></div>
      </div>
    </div>
  );
}
