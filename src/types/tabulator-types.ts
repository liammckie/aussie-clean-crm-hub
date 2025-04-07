
import Tabulator from 'tabulator-tables';

// Properly import and re-export Tabulator types
export type ColumnDefinition = Tabulator.ColumnDefinition;
export type ColumnComponent = Tabulator.ColumnComponent;
export type CellComponent = Tabulator.CellComponent;
export type RowComponent = Tabulator.RowComponent;

// Define proper sorter type
export type TabulatorSorter = {
  column: string;
  dir: 'asc' | 'desc';
};

export type SortDirection = 'asc' | 'desc';

// Column type definition
export type TabulatorColumn = Tabulator.ColumnDefinition;

// Define proper options interface that matches the Tabulator library
export interface TabulatorOptions {
  height?: string | number;
  layout?: 'fitColumns' | 'fitData' | 'fitDataFill' | 'fitDataStretch' | 'fitDataTable';
  selectable?: boolean | number;
  movableRows?: boolean;
  pagination?: boolean | 'local' | 'remote';
  paginationSize?: number;
  initialSort?: TabulatorSorter[];
  placeholder?: string;
  reactiveData?: boolean;
  columns?: TabulatorColumn[];
  data?: any[];
  index?: string;
  headerFilterLiveFilterDelay?: number;
  selectableRangeMode?: string;
}
