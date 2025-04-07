
import Tabulator from 'tabulator-tables';

// Use proper types for Tabulator - use type imports to avoid direct dependency issues
type ColumnDefinition = Tabulator.ColumnDefinitionSorterParams;
type ColumnComponent = Tabulator.ColumnComponent;  
type CellComponent = Tabulator.CellComponent;

// Re-export the types we're using
export type { ColumnDefinition, ColumnComponent, CellComponent };

// Define custom types for our Tabulator implementation
export interface TabulatorOptions {
  columns: TabulatorColumn[];
  data?: any[];
  layout?: string;
  height?: string | number;
  pagination?: boolean;
  paginationSize?: number;
  ajaxURL?: string;
  ajaxParams?: Record<string, any>;
  placeholder?: string;
  headerFilterLiveFilterDelay?: number;
  selectable?: boolean;
  selectableRangeMode?: string;
  index?: string;
  [key: string]: any;
}

export interface TabulatorColumn {
  title: string;
  field: string;
  sorter?: string;
  formatter?: string | ((cell: CellComponent, formatterParams: {}, onRendered: Function) => any);
  headerFilter?: boolean | string;
  headerFilterPlaceholder?: string;
  headerFilterFunc?: string;
  headerFilterParams?: Record<string, any>;
  headerFilterLiveFilter?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  widthGrow?: number;
  widthShrink?: number;
  resizable?: boolean;
  frozen?: boolean;
  responsive?: number;
  align?: string;
  editor?: boolean | string;
  editorParams?: Record<string, any>;
  cellClick?: (e: UIEvent, cell: CellComponent) => void;
  [key: string]: any;
}

// Define a proper type for the sort direction
export type SortDirection = "asc" | "desc";

// Type for Tabulator's sorter
export interface TabulatorSorter {
  column: string;
  dir: SortDirection;
}
