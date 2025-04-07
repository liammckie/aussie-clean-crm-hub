
import React, { useEffect, useRef } from 'react';
import Tabulator from 'tabulator-tables';
import { useTabulator } from '@/hooks/use-tabulator';
import { RowComponent, ColumnDefinition, TabulatorOptions } from '@/types/tabulator-types';

// Make sure to import styles in your main CSS file
// import 'tabulator-tables/dist/css/tabulator.min.css';

type TabulatorContainerProps = {
  data: any[];
  columns?: ColumnDefinition[];
  options?: Partial<TabulatorOptions>;
  onRowClick?: (e: UIEvent, row: RowComponent) => void;
};

const TabulatorContainer: React.FC<TabulatorContainerProps> = ({ 
  data, 
  columns,
  options,
  onRowClick 
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const { initializeTabulator, destroyTabulator } = useTabulator();
  const tabulatorRef = useRef<Tabulator | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      const initTable = async () => {
        // Initialize with provided or default columns and options
        tabulatorRef.current = await initializeTabulator(tableRef.current!);
        
        // Configure the table with provided options
        if (columns) {
          tabulatorRef.current.setColumns(columns);
        }
        
        if (options) {
          // Apply any custom options
          Object.entries(options).forEach(([key, value]) => {
            // @ts-expect-error - Tabulator options are dynamic
            tabulatorRef.current?.setOption(key, value);
          });
        }
        
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
      destroyTabulator();
      tabulatorRef.current = null;
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
};

export default TabulatorContainer;
