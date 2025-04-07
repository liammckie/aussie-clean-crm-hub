
import { useMemo } from 'react';
import { Tabulator } from 'tabulator-tables';
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
    headerFilterLiveFilterDelay: 300
  }), []);

  const defaultColumns: TabulatorColumn[] = useMemo(() => [
    { title: "Contract", field: "contract_name", sorter: "string", headerFilter: true },
    { title: "Client", field: "client_name", sorter: "string", headerFilter: true },
    { title: "Start Date", field: "start_date", sorter: "date", headerFilter: true },
    { title: "Status", field: "status", sorter: "string", headerFilter: true },
    { title: "Value", field: "value", sorter: "number", formatter: "money" }
  ], []);
  
  // Initialize the tabulator instance with provided columns and options
  const initializeTabulator = async (
    element: HTMLElement,
    columns: TabulatorColumn[] = defaultColumns,
    options: Partial<TabulatorOptions> = {}
  ): Promise<Tabulator> => {
    // Merge default options with provided options
    const mergedOptions: TabulatorOptions = {
      ...defaultOptions,
      ...options,
      columns: columns || defaultColumns,
    };
    
    return new Tabulator(element, mergedOptions);
  };

  return { 
    defaultColumns, 
    defaultOptions,
    initializeTabulator 
  };
}
