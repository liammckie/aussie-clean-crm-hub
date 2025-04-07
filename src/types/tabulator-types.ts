
// Import Tabulator types correctly
import type { ColumnDefinition, SorterFromTable } from 'tabulator-tables';

// Use proper type imports
export type { ColumnDefinition } from 'tabulator-tables';

// Define custom component types based on Tabulator types
export interface ColumnComponent {
  getField(): string;
  getDefinition(): ColumnDefinition;
  getElement(): HTMLElement;
}

export interface CellComponent {
  getValue(): any;
  getElement(): HTMLElement;
  getRow(): RowComponent;
  getColumn(): ColumnComponent;
  getData(): any;
}

export interface RowComponent {
  getData(): any;
  getElement(): HTMLElement;
  getCells(): CellComponent[];
  getCell(column: string): CellComponent;
}

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
  pagination?: boolean; 
  paginationMode?: 'local' | 'remote'; 
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
