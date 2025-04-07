
import type { ColumnDefinitionSorterParams, Options } from 'tabulator-tables';

// Re-export the types properly
export type ColumnDefinition = any;  // Using any for now until we define our own complete type
export type ColumnComponent = any;
export type CellComponent = any;
export type RowComponent = any;

// Define proper sorter type
export type TabulatorSorter = {
  column: string;
  dir: 'asc' | 'desc';
};

export type SortDirection = 'asc' | 'desc';

// Column type definition
export type TabulatorColumn = ColumnDefinition;

// Define proper options interface that matches the Tabulator library
export interface TabulatorOptions extends Partial<Options> {
  height?: string | number;
  layout?: 'fitColumns' | 'fitData' | 'fitDataFill' | 'fitDataStretch' | 'fitDataTable';
  selectable?: boolean | number;
  movableRows?: boolean;
  pagination?: boolean | 'local' | 'remote';
  paginationSize?: number;
  initialSort?: TabulatorSorter[];
  placeholder?: string;
  columns?: TabulatorColumn[];
  data?: any[];
  index?: string;
  headerFilterLiveFilterDelay?: number;
  selectableRangeMode?: string;
  reactiveData?: boolean;
}
