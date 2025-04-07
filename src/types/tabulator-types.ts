
import { ColumnDefinition, ColumnComponent, CellComponent } from 'tabulator-tables';

/**
 * Type definitions for Tabulator options and methods
 */

export type SortDirection = "asc" | "desc";

export interface TabulatorSorter {
  column: string;
  dir: SortDirection;
}

// Custom formatter function type
export type FormatterFunction = (
  cell: CellComponent, 
  formatterParams: any, 
  onRendered: (callback: () => void) => void
) => string | HTMLElement;

// Custom editor function type
export type EditorFunction = (
  cell: CellComponent, 
  onRendered: (callback: () => void) => void, 
  success: (value: any) => void, 
  cancel: () => void, 
  editorParams: any
) => HTMLElement;

// Enhanced column definition with improved typing
export interface EnhancedColumnDefinition extends ColumnDefinition {
  formatter?: string | FormatterFunction;
  editor?: string | EditorFunction;
  headerFilter?: boolean | string;
  headerFilterPlaceholder?: string;
  headerFilterParams?: any;
  headerSort?: boolean;
  sorter?: string | ((a: any, b: any, aRow: any, bRow: any, column: ColumnComponent, dir: SortDirection, sorterParams: any) => number);
  sorterParams?: any;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  widthGrow?: number;
  widthShrink?: number;
  resizable?: boolean;
  frozen?: boolean;
  responsive?: number;
  tooltip?: string | ((cell: CellComponent) => string);
  cssClass?: string;
  rowHandle?: boolean;
  editable?: boolean | ((cell: CellComponent) => boolean);
  validator?: string | ((cell: CellComponent, value: any, validators: any) => boolean | string);
  mutator?: (value: any, data: any, type: "data" | "edit" | "clipboard", mutatorParams: any, cell?: CellComponent) => any;
  accessor?: (value: any, data: any, type: "data" | "download" | "clipboard", accessorParams: any, column?: ColumnComponent) => any;
}
