
// Import types correctly from Tabulator
import Tabulator from 'tabulator-tables';
import type { ColumnDefinition as TabulatorColumnDefinition } from 'tabulator-tables';
import type { ColumnComponent as TabulatorColumnComponent } from 'tabulator-tables';
import type { CellComponent as TabulatorCellComponent } from 'tabulator-tables';
import type { RowComponent as TabulatorRowComponent } from 'tabulator-tables';

// Re-export the types properly
export type ColumnDefinition = TabulatorColumnDefinition;
export type ColumnComponent = TabulatorColumnComponent;
export type CellComponent = TabulatorCellComponent;
export type RowComponent = TabulatorRowComponent;

// Define proper sorter type
export type TabulatorSorter = {
  column: string;
  dir: 'asc' | 'desc';
};

export type SortDirection = 'asc' | 'desc';

// Column type definition
export type TabulatorColumn = TabulatorColumnDefinition;

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
