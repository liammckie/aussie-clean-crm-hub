
import Tabulator from 'tabulator-tables';
import { useEffect, useState } from 'react';

type TabulatorOptions = {
  element: React.RefObject<HTMLDivElement>;
  data: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
};

export function useTabulator({ element, data, onSelectionChange }: TabulatorOptions) {
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);

  // Initialize Tabulator with the given options
  const initializeTabulator = async () => {
    // Make sure the element is available
    if (!element.current) {
      console.error("Tabulator container element is not available");
      return;
    }

    try {
      console.log("Initializing Tabulator...");
      
      // Check if Tabulator is globally available
      if (typeof Tabulator !== 'function') {
        console.error("Tabulator is not available as a constructor");
        throw new Error("Tabulator is not available");
      }

      const tabulatorInstance = new Tabulator(element.current, {
        data: data || [],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 25, 50, 100],
        movableColumns: true,
        columns: [
          { title: "Select", formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, width: 60 },
          { title: "Client", field: "client_name", headerFilter: "input" },
          { title: "Contract Name", field: "contract_name", headerFilter: "input" },
          { title: "Service Type", field: "service_type", headerFilter: "input" },
          { title: "Status", field: "status", headerFilter: "input" },
          { title: "Account Manager", field: "account_manager", headerFilter: "input", editor: "input" },
          { title: "State Manager", field: "state_manager", headerFilter: "input", editor: "input" },
          { title: "National Manager", field: "national_manager", headerFilter: "input", editor: "input" },
          { title: "Start Date", field: "start_date", headerFilter: "input" },
          { title: "Annual Value", field: "total_annual_value", formatter: "money", formatterParams: { symbol: "$", precision: 2 } }
        ],
        selectable: true,
        selectableRangeMode: "click",
      });

      // Handle row selection events
      if (onSelectionChange) {
        tabulatorInstance.on("rowSelectionChanged", function(data, rows) {
          onSelectionChange(data);
        });
      }
      
      setTabulator(tabulatorInstance);
      console.log("Tabulator initialized successfully");
      return tabulatorInstance;
    } catch (error) {
      console.error("Error initializing Tabulator:", error);
      throw error;
    }
  };

  // Destroy Tabulator instance when component unmounts
  const destroyTabulator = () => {
    if (tabulator) {
      console.log("Destroying Tabulator instance");
      tabulator.destroy();
      setTabulator(null);
    }
  };

  return {
    tabulator,
    initializeTabulator,
    destroyTabulator
  };
}
