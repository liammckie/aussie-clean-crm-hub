declare module 'tabulator-tables' {
  export default class Tabulator {
    constructor(selector: string | HTMLElement, options: any);
    
    // Common Tabulator methods
    setData(data: any[], params?: any): Promise<void>;
    getData(): any[];
    getSelectedRows(): any[];
    selectRow(row: any): void;
    deselectRow(row: any): void;
    redraw(force?: boolean): void;
    addRow(rowData: any, position?: boolean | string, index?: number): void;
    updateRow(row: any, data: any): void;
    deleteRow(row: any): void;
    clearData(): void;
    
    // Event registration
    on(event: string, callback: Function): void;
    
    // Element access
    getElement(): HTMLElement;
    
    // Column operations
    setColumns(columns: any[]): void;
    getColumns(): any[];
    
    // Row operations
    getRowFromPosition(position: number, activeOnly?: boolean): any;
    getRowPosition(row: any, activeOnly?: boolean): number;
    
    // Pagination
    setPage(page: number): Promise<void>;
    getPage(): number;
    getPageMax(): number;
    
    // Other common methods
    setHeight(height: number | string): void;
    setSort(sorters: string | any[]): void;
    setFilter(filters: any[]): void;
    clearFilter(trigger?: boolean): void;
    destroy(): void;
  }
}
