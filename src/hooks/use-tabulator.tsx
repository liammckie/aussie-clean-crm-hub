
import { useMemo } from 'react';
import Tabulator, { TabulatorOptions, TabulatorColumn, ColumnDefinition, SorterFromTable } from 'tabulator-tables';

// Define a proper type for the sort direction
type SortDirection = "asc" | "desc";

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

  return { defaultColumns, defaultOptions };
}
