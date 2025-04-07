
import React from 'react';
import { Card } from '@/components/ui/card';
import TabulatorContainer from './tabulator/TabulatorContainer';
import { TabulatorOptions, TabulatorColumn } from '@/types/tabulator-types';

interface TabulatorTableProps {
  columns: TabulatorColumn[];
  data: any[];
  options?: Partial<TabulatorOptions>;
  className?: string;
  onRowClick?: (e: Event, row: any) => void;
  title?: string;
  loading?: boolean;
}

function TabulatorTable({ 
  columns, 
  data, 
  options = {}, 
  className = "", 
  onRowClick,
  title,
  loading
}: TabulatorTableProps) {
  const defaultOptions: Partial<TabulatorOptions> = {
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 10,
    placeholder: loading ? 'Loading data...' : 'No Data Available',
    responsiveLayout: 'hide',
    height: '100%',
    movableColumns: true,
    tooltips: true,
  };
  
  const tableOptions: Partial<TabulatorOptions> = {
    ...defaultOptions,
    ...options
  };
  
  return (
    <Card className="overflow-hidden">
      {title && (
        <div className="p-4 border-b">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      <div className="p-0">
        <TabulatorContainer 
          columns={columns} 
          data={loading ? [] : data}
          options={tableOptions}
          className={`w-full ${className}`}
          onRowClick={onRowClick}
        />
      </div>
    </Card>
  );
}

export default TabulatorTable;

// Also export the named component for compatibility with older code
export { TabulatorTable };
