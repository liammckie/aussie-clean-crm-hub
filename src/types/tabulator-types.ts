
// Define types based on Tabulator library
// We need to define our own because Tabulator's type exports are not consistent
import type Tabulator from 'tabulator-tables';

// Define custom interfaces instead of importing from tabulator-tables
// This avoids the import errors

// Column definition is a common pattern, define it directly
export interface ColumnDefinition {
  title?: string;
  field?: string;
  headerFilter?: boolean | string;
  hozAlign?: string;
  formatter?: string | ((cell: any, params: any) => any);
  formatterParams?: any;
  width?: number | string;
  minWidth?: number;
  widthGrow?: number;
  headerSort?: boolean;
  sorter?: string | ((a: any, b: any, aRow: any, bRow: any, column: any, dir: any, sorterParams: any) => number);
  sorterParams?: any;
  cssClass?: string;
  cellClick?: (e: any, cell: any) => void;
  resizable?: boolean;
  frozen?: boolean;
  responsive?: number;
  headerTooltip?: string;
  tooltip?: boolean | string;
  editable?: boolean | ((cell: any) => boolean);
  editor?: string;
  editorParams?: any;
  visible?: boolean;
  download?: boolean;
  [key: string]: any;
}

// Define custom component types to avoid import issues
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
