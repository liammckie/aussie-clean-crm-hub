
declare module 'tabulator-tables' {
  export interface TabulatorOptions {
    height?: string | number;
    layout?: string;
    data?: Record<string, unknown>[];
    columns?: TabulatorColumn[];
    pagination?: boolean;
    paginationSize?: number;
    selectable?: boolean | number;
    selectableRangeMode?: string;
    initialSort?: TabulatorSorter[];
    movableColumns?: boolean;
    movableRows?: boolean;
    resizableRows?: boolean;
    resizableColumns?: boolean;
    autoResize?: boolean;
    placeholder?: string;
    headerFilterLiveFilterDelay?: number;
    headerVisible?: boolean;
    rowFormatter?: (row: TabulatorRow) => void;
    rowClick?: (e: Event, row: TabulatorRow) => void;
    rowSelectionChanged?: (data: Record<string, unknown>[], rows: TabulatorRow[]) => void;
    dataFiltered?: (filters: TabulatorFilter[], rows: TabulatorRow[]) => void;
    ajaxURL?: string;
    ajaxParams?: Record<string, unknown>;
    ajaxConfig?: Record<string, unknown>;
    paginationCounter?: string;
    footerElement?: string | HTMLElement;
    downloadConfig?: Record<string, unknown>;
  }

  export interface TabulatorColumn {
    title: string;
    field?: string;
    formatter?: string | ((cell: TabulatorCell, formatterParams: Record<string, unknown>, onRendered: Function) => string | HTMLElement);
    headerFilter?: string | boolean;
    headerFilterPlaceholder?: string;
    headerFilterParams?: Record<string, unknown>;
    headerFilterFunc?: (headerValue: string, rowValue: any, rowData: Record<string, unknown>, filterParams: Record<string, unknown>) => boolean;
    headerFilterLiveFilter?: boolean;
    sorter?: string | ((a: any, b: any, aRow: TabulatorRow, bRow: TabulatorRow, column: TabulatorColumn, dir: string, sorterParams: Record<string, unknown>) => number);
    sorterParams?: Record<string, unknown>;
    width?: string | number;
    minWidth?: number;
    maxWidth?: number;
    resizable?: boolean;
    frozen?: boolean;
    responsive?: number;
    visible?: boolean;
    hozAlign?: string;
    vertAlign?: string;
    cssClass?: string;
    tooltip?: string | ((cell: TabulatorCell) => string);
    headerTooltip?: string;
    clickMenu?: TabulatorMenuItem[];
    contextMenu?: TabulatorMenuItem[];
    editable?: boolean | ((cell: TabulatorCell) => boolean);
    editor?: string | ((cell: TabulatorCell, onRendered: Function, success: Function, cancel: Function, editorParams: Record<string, unknown>) => HTMLElement);
    editorParams?: Record<string, unknown>;
    cellClick?: (e: Event, cell: TabulatorCell) => void;
    cellDblClick?: (e: Event, cell: TabulatorCell) => void;
    cellContext?: (e: Event, cell: TabulatorCell) => void;
    cellTap?: (e: Event, cell: TabulatorCell) => void;
    cellDblTap?: (e: Event, cell: TabulatorCell) => void;
    cellTapHold?: (e: Event, cell: TabulatorCell) => void;
    cellMouseEnter?: (e: Event, cell: TabulatorCell) => void;
    cellMouseLeave?: (e: Event, cell: TabulatorCell) => void;
    cellMouseOver?: (e: Event, cell: TabulatorCell) => void;
    cellMouseOut?: (e: Event, cell: TabulatorCell) => void;
    cellMouseMove?: (e: Event, cell: TabulatorCell) => void;
  }

  export interface TabulatorFilter {
    field: string;
    type: string;
    value: unknown;
  }

  export interface TabulatorSorter {
    column: string;
    dir: 'asc' | 'desc';
  }

  export interface TabulatorMenuItem {
    label: string;
    action: (e: Event, cell: TabulatorCell) => void;
    disabled?: boolean;
    menu?: TabulatorMenuItem[];
  }

  export interface TabulatorCell {
    getValue(): any;
    getOldValue(): any;
    setValue(value: any): void;
    getElement(): HTMLElement;
    getRow(): TabulatorRow;
    getColumn(): TabulatorColumn;
    getField(): string;
    getData(): Record<string, unknown>;
    getTable(): Tabulator;
    checkHeight(): void;
    delete(): void;
    nav(): {
      next: () => TabulatorCell;
      prev: () => TabulatorCell;
      left: () => TabulatorCell;
      right: () => TabulatorCell;
      up: () => TabulatorCell;
      down: () => TabulatorCell;
    };
  }

  export interface TabulatorRow {
    getData(): Record<string, unknown>;
    getElement(): HTMLElement;
    getTable(): Tabulator;
    getPosition(active?: boolean): number;
    delete(): Promise<void>;
    scrollTo(): Promise<void>;
    pageTo(): Promise<void>;
    move(to: number, after: boolean): Promise<void>;
    update(data: Record<string, unknown>): Promise<void>;
    select(): void;
    deselect(): void;
    toggleSelect(): void;
    isSelected(): boolean;
    getCell(column: string | TabulatorColumn): TabulatorCell;
    getCells(): TabulatorCell[];
    getIndex(): number;
    getNextRow(): TabulatorRow | false;
    getPrevRow(): TabulatorRow | false;
  }

  export default class Tabulator {
    constructor(selector: string | HTMLElement, options: TabulatorOptions);
    
    setData(data: Record<string, unknown>[], params?: Record<string, unknown>): Promise<void>;
    getData(): Record<string, unknown>[];
    getSelectedRows(): TabulatorRow[];
    selectRow(row: TabulatorRow | number | number[]): void;
    deselectRow(row?: TabulatorRow | number | number[]): void;
    redraw(force?: boolean): void;
    addRow(rowData: Record<string, unknown>, position?: boolean | string, index?: number): Promise<TabulatorRow>;
    updateRow(row: TabulatorRow | number, data: Record<string, unknown>): Promise<void>;
    deleteRow(row: TabulatorRow | number | number[]): Promise<void>;
    clearData(): Promise<void>;
    on(event: string, callback: Function): void;
    getElement(): HTMLElement;
    setColumns(columns: TabulatorColumn[]): void;
    getColumns(): TabulatorColumn[];
    getRowFromPosition(position: number, activeOnly?: boolean): TabulatorRow;
    getRowPosition(row: TabulatorRow, activeOnly?: boolean): number;
    setPage(page: number): Promise<void>;
    getPage(): number;
    getPageMax(): number;
    setHeight(height: number | string): void;
    setSort(sorters: string | TabulatorSorter[]): void;
    setFilter(filters: TabulatorFilter[]): void;
    clearFilter(trigger?: boolean): void;
    destroy(): void;
  }
}
