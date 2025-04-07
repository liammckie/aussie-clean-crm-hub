
import React, { useRef, useEffect, useState } from 'react';
import useTabulator from '@/hooks/use-tabulator';
import type { TabulatorOptions, TabulatorColumn, RowComponent } from '@/types/tabulator-types';
import 'tabulator-tables/dist/css/tabulator.min.css';

interface TabulatorContainerProps {
  options?: Partial<TabulatorOptions>;
  columns: TabulatorColumn[];
  data?: any[];
  className?: string;
  onRowClick?: (e: Event, row: RowComponent) => void;
}

const TabulatorContainer: React.FC<TabulatorContainerProps> = ({ 
  options = {}, 
  columns, 
  data = [], 
  className = "",
  onRowClick
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableInstance, setTableInstance] = useState<any>(null);
  const { initializeTabulator } = useTabulator();
  
  const tabulatorOptions: Partial<TabulatorOptions> = {
    ...options,
    columns,
    data,
    layout: options.layout || 'fitColumns',
    pagination: options.pagination ?? true,
    paginationSize: options.paginationSize ?? 10,
    placeholder: options.placeholder || 'No Data Available',
    responsiveLayout: options.responsiveLayout || 'hide',
    height: options.height || '100%',
    columnDefaults: {
      resizable: true,
      ...(options.columnDefaults || {})
    }
  };
  
  // Initialize the table
  useEffect(() => {
    if (tableRef.current) {
      initializeTabulator(tableRef.current, columns, tabulatorOptions)
        .then(instance => {
          setTableInstance(instance);
        });
    }
    
    return () => {
      if (tableInstance) {
        tableInstance.destroy();
      }
    };
  }, [tableRef.current]);  // Only run on mount
  
  // Register row click handler
  useEffect(() => {
    if (tableInstance && onRowClick) {
      tableInstance.on('rowClick', onRowClick);
      
      return () => {
        tableInstance.off('rowClick', onRowClick);
      };
    }
  }, [tableInstance, onRowClick]);
  
  // Update data when it changes
  useEffect(() => {
    if (tableInstance && data) {
      tableInstance.setData(data);
    }
  }, [data, tableInstance]);
  
  return <div ref={tableRef} className={className} />;
};

export default TabulatorContainer;
