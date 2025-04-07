
import { useState, useEffect, useRef } from 'react';
import Tabulator from 'tabulator-tables';
import { TabulatorOptions } from '@/types/tabulator-types';

interface UseTabulatorProps {
  options: TabulatorOptions;
  tableRef: React.RefObject<HTMLDivElement>;
}

const useTabulator = ({ options, tableRef }: UseTabulatorProps) => {
  const [table, setTable] = useState<Tabulator | null>(null);
  const initialOptions = useRef(options);

  useEffect(() => {
    if (tableRef.current) {
      const tabulatorConfiguration = {
        ...initialOptions.current,
        ...options,
      };

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
      // Update any options that can be changed after initialization
      if (options.data) {
        table.setData(options.data);
      }
      
      // Handle other option updates depending on what Tabulator supports
      if (options.height) {
        table.setHeight(options.height);
      }
      
      // Additional option updates can be added as needed
    }
  }, [options, table]);

  return table;
};

export default useTabulator;
