
import React, { useEffect, useRef, useState } from 'react';
import Tabulator from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { useTabulator } from '@/hooks';

interface TabulatorContainerProps {
  data: Record<string, unknown>[];
  onSelectionChange?: (selectedRows: Record<string, unknown>[]) => void;
  tableClass?: string;
}

export function TabulatorContainer({ 
  data, 
  onSelectionChange,
  tableClass = "table-striped"
}: TabulatorContainerProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [table, setTable] = useState<Tabulator | null>(null);
  const { initializeTable } = useTabulator();

  useEffect(() => {
    if (tableRef.current) {
      // Initialize the table
      const newTable = initializeTable(tableRef.current, data);
      
      // Register selection change callback if provided
      if (onSelectionChange) {
        newTable.on("rowSelectionChanged", (_data, rows) => {
          const selectedData = rows.map(row => row.getData());
          onSelectionChange(selectedData);
        });
      }
      
      setTable(newTable);
      
      // Clean up
      return () => {
        newTable.destroy();
      };
    }
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (table) {
      table.setData(data);
    }
  }, [data]);

  return <div ref={tableRef} className={tableClass}></div>;
}
