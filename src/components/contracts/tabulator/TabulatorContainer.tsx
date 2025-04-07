
import React, { useRef, useEffect } from 'react';
import * as Tabulator from 'tabulator-tables';
import type { TabulatorOptions, TabulatorColumn, RowComponent } from '@/types/tabulator-types';

interface TabulatorContainerProps {
  options: Partial<TabulatorOptions>;
  columns: TabulatorColumn[];
  data?: any[];
  className?: string;
  onRowClick?: (e: Event, row: RowComponent) => void;
}

const TabulatorContainer: React.FC<TabulatorContainerProps> = ({ 
  options, 
  columns, 
  data = [], 
  className = "", 
  onRowClick 
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator.default | null>(null);

  useEffect(() => {
    // Initialize tabulator when the component mounts
    if (tableRef.current) {
      // Make sure options match the expected Tabulator options
      const tabulatorOptions = {
        ...options,
        columns,
        data
      };
      
      // Cast to any to avoid TypeScript errors with the complex Tabulator options
      const table = new Tabulator.default(tableRef.current, tabulatorOptions as any);
      
      tabulatorRef.current = table;
      
      // Set up row click handler if provided
      if (onRowClick) {
        table.on("rowClick", onRowClick);
      }
    }
    
    // Cleanup when component unmounts
    return () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.destroy();
        tabulatorRef.current = null;
      }
    };
  }, []);
  
  // Update data when it changes
  useEffect(() => {
    if (tabulatorRef.current && data) {
      tabulatorRef.current.setData(data);
    }
  }, [data]);
  
  return <div ref={tableRef} className={className} />;
};

export default TabulatorContainer;
