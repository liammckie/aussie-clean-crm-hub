
import React, { useRef, useEffect } from 'react';
import Tabulator from 'tabulator-tables';
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
  const tabulatorRef = useRef<Tabulator | null>(null);

  useEffect(() => {
    // Initialize tabulator when the component mounts
    if (tableRef.current) {
      const tabulatorOptions: TabulatorOptions = {
        ...options,
        columns,
        data,
        reactiveData: true
      };
      
      const table = new Tabulator(tableRef.current, tabulatorOptions);
      
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
