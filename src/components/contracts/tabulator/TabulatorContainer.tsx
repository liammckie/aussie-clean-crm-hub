
import React, { useEffect, useRef, useState } from 'react';
import Tabulator from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { useTabulator } from '@/hooks/use-tabulator';

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
  const { defaultColumns, defaultOptions } = useTabulator();

  useEffect(() => {
    if (tableRef.current) {
      // Initialize the table with correct options
      const newTable = new Tabulator(tableRef.current, {
        ...defaultOptions,
        data,
        columns: defaultColumns,
        rowSelectionChanged: function(data, rows) {
          if (onSelectionChange) {
            const selectedData = rows.map(row => row.getData());
            onSelectionChange(selectedData);
          }
        }
      });
      
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
