
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

interface TableSchema {
  table_name: string;
  columns: Column[];
}

interface TableDetailsViewProps {
  table: TableSchema;
}

export function TableDetailsView({ table }: TableDetailsViewProps) {
  return (
    <Card className="col-span-1 md:col-span-3 p-4 h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">
        Table: {table.table_name}
      </h2>
      <Tabs defaultValue="columns">
        <TabsList>
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="columns">
          <div className="rounded-lg border mt-4">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Column</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Nullable</th>
                  <th className="p-2 text-left">Default</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((column) => (
                  <tr key={column.column_name} className="border-t">
                    <td className="p-2 font-medium">
                      {column.column_name}
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {column.data_type}
                    </td>
                    <td className="p-2">
                      {column.is_nullable ? (
                        <span className="text-muted-foreground">Yes</span>
                      ) : (
                        <span className="text-destructive">No</span>
                      )}
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {column.column_default || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="relationships">
          <div className="mt-4 p-4 border rounded">
            <p className="text-muted-foreground">
              Relationship information will be added in a future update.
              This will show foreign keys and references to other tables.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <div className="mt-4 space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Table Information</h3>
              <p className="text-sm text-muted-foreground">
                The {table.table_name} table contains {table.columns.length} columns. 
                Additional metadata about constraints, indexes, and triggers
                will be added in a future update.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
