
import { useState, useEffect, useRef } from 'react';
import { Tabulator } from 'tabulator-tables';
import { TabulatorOptions } from '@/types/tabulator-types';

interface UseTabulatorProps {
  options: TabulatorOptions;
  tableRef: React.RefObject<HTMLDivElement>;
}

const useTabulator = ({ options, tableRef }: UseTabulatorProps) => {
  const [table, setTable] = useState<Tabulator | null>(null);
  const initialOptions = useRef(options);
  const configuredOptions = useRef<TabulatorOptions | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      // Combine initial options with current options
      const tabulatorConfiguration = {
        ...initialOptions.current,
        ...options,
      };
      
      configuredOptions.current = tabulatorConfiguration;

      // Cast as any to avoid type errors with Tabulator's complex options
      const newTable = new Tabulator(tableRef.current, tabulatorConfiguration as any);
      setTable(newTable);

      return () => {
        newTable.destroy();
        setTable(null);
      };
    }
  }, [tableRef]);

  useEffect(() => {
    if (table) {
      // Update data if it changed
      if (options.data && options.data !== configuredOptions.current?.data) {
        table.setData(options.data);
      }
      
      // Update height if changed
      if (options.height && options.height !== configuredOptions.current?.height) {
        table.setHeight(options.height);
      }
      
      // Update layout if changed
      if (options.layout && options.layout !== configuredOptions.current?.layout) {
        table.redraw(true);
      }
      
      // Update responsive columns
      if (JSON.stringify(options.columns) !== JSON.stringify(configuredOptions.current?.columns)) {
        table.setColumns(options.columns || []);
      }
      
      // Store the current options
      configuredOptions.current = { ...options };
    }
  }, [options, table]);

  return table;
};

export default useTabulator;
