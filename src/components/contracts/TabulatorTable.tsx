
import React from 'react';
import { TabulatorContainer } from './tabulator/TabulatorContainer';

interface TabulatorTableProps {
  contracts: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
}

export function TabulatorTable({ contracts, onSelectionChange }: TabulatorTableProps) {
  return (
    <div className="space-y-4">
      <TabulatorContainer 
        data={contracts} 
        onSelectionChange={onSelectionChange} 
      />
    </div>
  );
}
