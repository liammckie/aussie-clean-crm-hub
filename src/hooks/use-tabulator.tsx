
import { useMemo } from 'react';
import Tabulator, { TabulatorColumn, TabulatorOptions } from 'tabulator-tables';

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

  const initializeTable = (
    element: HTMLElement, 
    data: Record<string, unknown>[], 
    columns: TabulatorColumn[] = defaultColumns, 
    options: Partial<TabulatorOptions> = {}
  ): Tabulator => {
    return new Tabulator(element, {
      ...defaultOptions,
      ...options,
      data,
      columns
    });
  };

  return { initializeTable, defaultColumns, defaultOptions };
}
