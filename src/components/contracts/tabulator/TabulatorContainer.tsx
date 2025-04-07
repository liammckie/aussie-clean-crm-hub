
import React, { useEffect, useRef } from 'react';
import Tabulator from 'tabulator-tables';
import { useTabulator } from '@/hooks/use-tabulator';

// Make sure to import styles in your main CSS file
// import 'tabulator-tables/dist/css/tabulator.min.css';

type TabulatorContainerProps = {
  data: any[];
  onRowClick?: (e: UIEvent, row: Tabulator.RowComponent) => void;
};

export default function TabulatorContainer({ data, onRowClick }: TabulatorContainerProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const { defaultColumns, defaultOptions, initializeTabulator } = useTabulator();
  const tabulatorRef = useRef<Tabulator | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      const initTable = async () => {
        // Initialize with defaultColumns and defaultOptions
        tabulatorRef.current = await initializeTabulator(tableRef.current!, defaultColumns, defaultOptions);
        
        // Set data
        if (data && data.length > 0) {
          tabulatorRef.current.setData(data);
        }

        // Set row click handler if provided
        if (onRowClick && tabulatorRef.current) {
          tabulatorRef.current.on('rowClick', onRowClick);
        }
      };

      initTable();
    }

    return () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.destroy();
      }
    };
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (tabulatorRef.current && data) {
      tabulatorRef.current.setData(data);
    }
  }, [data]);

  return (
    <div className="tabulator-container">
      <div ref={tableRef} className="tabulator"></div>
    </div>
  );
}
