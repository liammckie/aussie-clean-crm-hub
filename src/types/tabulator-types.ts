
// Import Tabulator correctly
import type Tabulator from 'tabulator-tables';
import type { ColumnDefinition as TabulatorColumnDefinition, ColumnComponent, CellComponent, RowComponent } from 'tabulator-tables';

// Define types correctly - these should match what's exported by the library
export type ColumnDefinition = TabulatorColumnDefinition;
export type { ColumnComponent, CellComponent, RowComponent };

// Define proper sorter type
export type TabulatorSorter = {
  column: string;
  dir: 'asc' | 'desc';
};

export type SortDirection = 'asc' | 'desc';

// Column type definition
export type TabulatorColumn = ColumnDefinition;

// Define proper options interface that matches the Tabulator library
export interface TabulatorOptions {
  height?: string | number;
  layout?: 'fitColumns' | 'fitData' | 'fitDataFill' | 'fitDataStretch' | 'fitDataTable';
  selectable?: boolean | number;
  movableRows?: boolean;
  pagination?: boolean; // Fixed pagination type to be just boolean
  paginationMode?: 'local' | 'remote'; // Added separate property for pagination mode
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
