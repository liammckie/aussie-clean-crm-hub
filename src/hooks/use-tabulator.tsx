
import { useMemo, useRef } from 'react';
import { TabulatorOptions, TabulatorColumn, SortDirection } from '@/types/tabulator-types';

// Type for Tabulator's sorter
export interface TabulatorSorter {
  column: string;
  dir: SortDirection;
}

export function useTabulator() {
  const defaultOptions = useMemo<Partial<TabulatorOptions>>(() => ({
    layout: "fitColumns",
    pagination: true,
    paginationSize: 10,
    selectable: true,
    selectableRangeMode: "click",
    placeholder: "No data available",
    headerFilterLiveFilterDelay: 300,
    responsiveLayout: 'hide',
    movableColumns: true,
    tooltips: true
  }), []);

  const defaultColumns: TabulatorColumn[] = useMemo(() => [
    { title: "Contract", field: "contract_name", sorter: "string", headerFilter: true },
    { title: "Client", field: "client_name", sorter: "string", headerFilter: true },
    { title: "Start Date", field: "start_date", sorter: "date", headerFilter: true },
    { title: "Status", field: "status", sorter: "string", headerFilter: true },
    { title: "Value", field: "value", sorter: "number", formatter: "money" }
  ], []);
  
  const tableInstanceRef = useRef<any>(null);
  
  // Initialize the tabulator instance with provided columns and options
  const initializeTabulator = async (
    element: HTMLElement,
    columns: TabulatorColumn[] = defaultColumns,
    options: Partial<TabulatorOptions> = {}
  ): Promise<any> => {
    // Only import Tabulator if we're in a browser environment
    if (typeof window !== 'undefined') {
      const { Tabulator } = await import('tabulator-tables');
      
      // Merge default options with provided options
      const mergedOptions: TabulatorOptions = {
        ...defaultOptions,
        ...options,
        columns: columns || defaultColumns,
      };
      
      tableInstanceRef.current = new Tabulator(element, mergedOptions);
      return tableInstanceRef.current;
    }
    
    return null;
  };

  return { 
    defaultColumns, 
    defaultOptions,
    initializeTabulator,
    tableInstance: tableInstanceRef.current
  };
}

export default useTabulator;
