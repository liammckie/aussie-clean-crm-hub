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

      const newTable = new Tabulator(tableRef.current, tabulatorConfiguration);
      setTable(newTable);

      return () => {
        newTable.destroy();
        setTable(null);
      };
    }
  }, [tableRef]);

  useEffect(() => {
    if (table) {
      table.setOptions(options);
    }
  }, [options, table]);

  return table;
};

export default useTabulator;
