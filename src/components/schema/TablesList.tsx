
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TableSchema {
  table_name: string;
  columns: any[];
}

interface TablesListProps {
  tables: TableSchema[];
  activeTable: string;
  onSelectTable: (tableName: string) => void;
}

export function TablesList({ tables, activeTable, onSelectTable }: TablesListProps) {
  return (
    <Card className="col-span-1 p-4 h-[calc(100vh-200px)] overflow-y-auto">
      <h3 className="font-medium mb-4">Tables ({tables.length})</h3>
      <ul className="space-y-1">
        {tables.map((table) => (
          <li key={table.table_name}>
            <Button
              variant={activeTable === table.table_name ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectTable(table.table_name)}
            >
              {table.table_name}
              <Badge variant="outline" className="ml-2">
                {table.columns.length}
              </Badge>
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
