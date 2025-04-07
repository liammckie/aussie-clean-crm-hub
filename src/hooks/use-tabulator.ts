
import { useState, useRef, useCallback } from 'react';
import Tabulator from 'tabulator-tables';
import { ColumnDefinition, TabulatorOptions } from '@/types/tabulator-types';

export function useTabulator() {
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  
  // Default columns can be moved to a constants file later
  const defaultColumns: ColumnDefinition[] = [
    { title: "Name", field: "name", sorter: "string", headerFilter: true },
    { title: "Status", field: "status", sorter: "string", headerFilter: true },
    { title: "Value", field: "value", sorter: "number", headerFilter: true },
    { title: "Date", field: "date", sorter: "date", headerFilter: true },
  ];

  // Default options
  const defaultOptions: TabulatorOptions = {
    height: "100%",
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    selectable: true,
    placeholder: "No data available",
    initialSort: [
      { column: "name", dir: "asc" }
    ]
  };
  
  // Initialize tabulator
  const initializeTabulator = useCallback(async (
    element: HTMLElement,
    columns: ColumnDefinition[] = defaultColumns,
    options: TabulatorOptions = defaultOptions
  ): Promise<Tabulator> => {
    // Clean up any existing instance
    if (tabulator) {
      tabulator.destroy();
    }

    const newTabulator = new Tabulator(element, {
      ...options,
      columns,
      reactiveData: true,
    });
    
    setTabulator(newTabulator);
    return newTabulator;
  }, [tabulator]);

  // Destroy tabulator instance
  const destroyTabulator = useCallback(() => {
    if (tabulator) {
      tabulator.destroy();
      setTabulator(null);
    }
  }, [tabulator]);

  // Refresh data
  const refreshData = useCallback((newData: any[]) => {
    if (tabulator) {
      tabulator.setData(newData);
    }
  }, [tabulator]);

  return {
    tabulator,
    initializeTabulator,
    destroyTabulator,
    refreshData,
    defaultColumns,
    defaultOptions
  };
}
