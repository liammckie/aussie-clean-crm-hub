
import React, { useRef, useEffect } from 'react';
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
  
  const tabulatorOptions: TabulatorOptions = {
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
  
  const table = useTabulator({
    options: tabulatorOptions,
    tableRef
  });
  
  // Register row click handler
  useEffect(() => {
    if (table && onRowClick) {
      table.on('rowClick', onRowClick);
      
      return () => {
        table.off('rowClick', onRowClick);
      };
    }
  }, [table, onRowClick]);
  
  // Update data when it changes
  useEffect(() => {
    if (table && data) {
      table.setData(data);
    }
  }, [data, table]);
  
  return <div ref={tableRef} className={className} />;
};

export default TabulatorContainer;
