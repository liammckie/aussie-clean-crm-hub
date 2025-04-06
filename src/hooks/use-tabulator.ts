
import { useCallback, useState } from 'react';
import Tabulator from 'tabulator-tables';

interface TabulatorOptions {
  element: React.RefObject<HTMLDivElement>;
  data: any[];
  columns?: any[];
  layout?: string;
  pagination?: boolean;
  paginationSize?: number;
  movableColumns?: boolean;
  resizableRows?: boolean;
  selectable?: boolean;
  selectableRangeMode?: string;
  onSelectionChange?: (rows: any[]) => void;
  initialSort?: { column: string, dir: string }[];
}

export const useTabulator = ({
  element,
  data,
  columns = [],
  layout = 'fitColumns',
  pagination = true,
  paginationSize = 10,
  movableColumns = true,
  resizableRows = false,
  selectable = true,
  selectableRangeMode = 'click',
  onSelectionChange,
  initialSort = []
}: TabulatorOptions) => {
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);

  const initializeTabulator = useCallback(async () => {
    if (!element.current) {
      console.error('Table element not found');
      return;
    }

    try {
      // Ensure global Tabulator exists
      if (typeof Tabulator !== 'function') {
        console.error('Tabulator is not available');
        throw new Error('Tabulator is not available');
      }
      
      // Create a new instance with default options
      const table = new Tabulator(element.current, {
        data: data || [],
        columns: columns.length > 0 ? columns : [
          { title: 'ID', field: 'id', visible: false },
          { title: 'Name', field: 'name', sorter: 'string' }
        ],
        layout,
        pagination,
        paginationSize,
        movableColumns,
        resizableRows,
        selectable,
        selectableRangeMode,
        initialSort,
        
        rowSelectionChanged: function(data, rows) {
          if (onSelectionChange) {
            onSelectionChange(data);
          }
        }
      });

      setTabulator(table);
      return table;
    } catch (error) {
      console.error('Error initializing Tabulator:', error);
      throw error;
    }
  }, [element, data, columns, layout, pagination, paginationSize, movableColumns, resizableRows, selectable, selectableRangeMode, onSelectionChange, initialSort]);

  const destroyTabulator = useCallback(() => {
    if (tabulator) {
      try {
        tabulator.destroy();
        setTabulator(null);
      } catch (error) {
        console.error('Error destroying Tabulator:', error);
      }
    }
  }, [tabulator]);

  const refreshData = useCallback((newData: any[]) => {
    if (tabulator) {
      tabulator.setData(newData);
    }
  }, [tabulator]);

  return { 
    tabulator,
    initializeTabulator,
    destroyTabulator,
    refreshData
  };
};
