
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/spinner';
import { FileJson, FileDown, RefreshCw, Database, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Define the types for the schema data
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

interface SchemaResponse {
  schema: TableSchema[];
}

export default function Schema() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schemaData, setSchemaData] = useState<TableSchema[]>([]);
  const [activeTable, setActiveTable] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('get-schema');

      if (error) {
        throw new Error(`Error fetching schema: ${error.message}`);
      }

      const schemaResponse = data as SchemaResponse;
      setSchemaData(schemaResponse.schema);
      
      // Set active table to first table if exists
      if (schemaResponse.schema.length > 0) {
        setActiveTable(schemaResponse.schema[0].table_name);
      }
      
      setLastUpdated(new Date());
      console.log('Schema fetched successfully:', schemaResponse.schema);
    } catch (err: any) {
      console.error('Error fetching schema:', err);
      setError(err.message);
      toast.error('Failed to fetch database schema');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAsJson = () => {
    try {
      const jsonString = JSON.stringify(schemaData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'database-schema.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Schema downloaded as JSON');
    } catch (err) {
      console.error('Error downloading JSON:', err);
      toast.error('Failed to download schema as JSON');
    }
  };

  const downloadAsMarkdown = () => {
    try {
      let markdownContent = '# Database Schema\n\n';
      markdownContent += 'This document is auto-generated and contains the schema information for all tables in the public schema of the database. It is updated through the Schema page in the application.\n\n';
      
      schemaData.forEach((table) => {
        markdownContent += `## Table: ${table.table_name}\n\n`;
        markdownContent += '| Column | Type | Nullable | Default |\n';
        markdownContent += '|--------|------|----------|--------|\n';
        
        table.columns.forEach((col) => {
          markdownContent += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable ? 'YES' : 'NO'} | ${col.column_default || ''} |\n`;
        });
        
        markdownContent += '\n';
      });
      
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DATABASE_SCHEMA.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Schema downloaded as Markdown');
    } catch (err) {
      console.error('Error downloading Markdown:', err);
      toast.error('Failed to download schema as Markdown');
    }
  };

  const filteredTables = schemaData.filter(table => 
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHasColumn = (table: TableSchema, searchTerm: string) => {
    return table.columns.some(col => 
      col.column_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.data_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const allFilteredTables = searchTerm.length > 0 
    ? schemaData.filter(table => 
        table.table_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tableHasColumn(table, searchTerm)
      )
    : schemaData;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading database schema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card className="max-w-lg p-6">
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertTriangle />
            <h2 className="text-xl font-semibold">Error Loading Schema</h2>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchSchema}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Database Schema</h1>
          <p className="text-muted-foreground">
            View and explore the database structure
            {lastUpdated && (
              <span className="ml-2 text-xs">
                Last updated: {lastUpdated.toLocaleString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchSchema}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Schema
          </Button>
          <Button variant="outline" onClick={downloadAsJson}>
            <FileJson className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
          <Button variant="default" onClick={downloadAsMarkdown}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Markdown
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tables and columns..."
            className="w-full p-2 pl-10 border rounded bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {allFilteredTables.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No tables found in the database.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="col-span-1 p-4 h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="font-medium mb-4">Tables ({allFilteredTables.length})</h3>
            <ul className="space-y-1">
              {allFilteredTables.map((table) => (
                <li key={table.table_name}>
                  <Button
                    variant={activeTable === table.table_name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTable(table.table_name)}
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

          <Card className="col-span-1 md:col-span-3 p-4 h-[calc(100vh-200px)] overflow-y-auto">
            {activeTable && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Table: {activeTable}
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
                          {schemaData
                            .find((t) => t.table_name === activeTable)
                            ?.columns.map((column) => (
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
                          The {activeTable} table contains {
                            schemaData.find(t => t.table_name === activeTable)?.columns.length || 0
                          } columns. Additional metadata about constraints, indexes, and triggers
                          will be added in a future update.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
