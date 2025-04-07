
// Define types based on Tabulator library
// We need to define our own because Tabulator's type exports are not consistent
import type Tabulator from 'tabulator-tables';

// Column definition is a common pattern, define it directly
export interface ColumnDefinition {
  title: string; // Changed from optional to required
  field?: string;
  headerFilter?: boolean | string;
  headerFilterParams?: any;
  headerFilterPlaceholder?: string;
  headerFilterLiveFilter?: boolean;
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
  bottomCalc?: string | Function;
  bottomCalcFormatter?: string | Function;
  bottomCalcParams?: any;
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
  getOldValue(): any;
  setValue(value: any): void;
  getElement(): HTMLElement;
  getRow(): RowComponent;
  getColumn(): ColumnComponent;
  getData(): any;
  restoreOldValue(): void;
}

export interface RowComponent {
  getData(): any;
  getElement(): HTMLElement;
  getCells(): CellComponent[];
  getCell(column: string): CellComponent;
  getPosition(active?: boolean): number;
  delete(): Promise<void>;
}

// Define proper sorter type
export type TabulatorSorter = {
  column: string;
  dir: SortDirection;
};

export type SortDirection = 'asc' | 'desc';

// Column type definition
export type TabulatorColumn = ColumnDefinition;

// Define proper options interface that matches the Tabulator library
export interface TabulatorOptions {
  height?: string | number;
  layout?: 'fitColumns' | 'fitData' | 'fitDataFill' | 'fitDataStretch' | 'fitDataTable';
  selectable?: boolean | number;
  selectableRangeMode?: string;
  movableRows?: boolean;
  movableColumns?: boolean;
  pagination?: boolean; 
  paginationMode?: 'local' | 'remote'; 
  paginationSize?: number;
  paginationCounter?: string;
  initialSort?: TabulatorSorter[];
  placeholder?: string;
  columns?: TabulatorColumn[];
  data?: any[];
  index?: string;
  headerFilterLiveFilterDelay?: number;
  reactiveData?: boolean;
  responsiveLayout?: 'hide' | 'collapse';
  tooltips?: boolean;
  groupBy?: string | string[];
  groupHeader?: (value: any, count: number, data: any[], group: any) => string;
  columnDefaults?: Partial<ColumnDefinition>;
}
