
import { useEffect, useRef, useState } from 'react';
import { createGroupHeader } from '@/components/contracts/tabulator/formatters';
import { getColumnDefinitions, handleCellEdit } from '@/components/contracts/tabulator/column-definitions';
import { toast } from 'sonner';

interface UseTabulatorOptions {
  element: React.RefObject<HTMLDivElement>;
  data: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
}

export const useTabulator = ({ element, data, onSelectionChange }: UseTabulatorOptions) => {
  const tabulatorRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Selection change handler
  const handleSelectionChange = () => {
    if (!tabulatorRef.current) return;
    const selectedData = tabulatorRef.current.getSelectedData();
    onSelectionChange?.(selectedData);
  };

  // Initialize Tabulator
  const initializeTabulator = async () => {
    if (!element.current || !data || data.length === 0) return;
    
    try {
      // Dynamic import of Tabulator
      const Tabulator = (await import('tabulator-tables')).default;

      // Define the table
      const table = new Tabulator(element.current, {
        data: data,
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

        groupHeader: createGroupHeader,
        columns: getColumnDefinitions(handleCellEdit),
        rowSelectionChanged: handleSelectionChange,
        cellEdited: handleCellEdit,
      });

      // Store the table instance
      tabulatorRef.current = table;
      setIsInitialized(true);

    } catch (error) {
      console.error("Error initializing Tabulator:", error);
      toast.error("Failed to initialize contracts table");
    }
  };

  // Cleanup function
  const destroyTabulator = () => {
    if (tabulatorRef.current && tabulatorRef.current.destroy) {
      tabulatorRef.current.destroy();
      tabulatorRef.current = null;
    }
  };

  return {
    tabulator: tabulatorRef.current,
    isInitialized,
    initializeTabulator,
    destroyTabulator
  };
};
