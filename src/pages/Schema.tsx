
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';

interface SchemaColumn {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

interface SchemaTable {
  table_name: string;
  columns: SchemaColumn[];
}

const Schema = () => {
  const [schema, setSchema] = useState<SchemaTable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchema = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-schema', {
        method: 'POST',
        body: {}
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.schema) {
        setSchema(data.schema);
      }
    } catch (err: any) {
      console.error('Error fetching schema:', err);
      toast.error('Failed to fetch schema: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  const downloadSchemaAsJson = () => {
    const dataStr = JSON.stringify(schema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataUri);
    downloadAnchorNode.setAttribute('download', 'schema.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadSchemaAsMarkdown = () => {
    let markdown = '# Database Schema\n\n';
    
    schema.forEach(table => {
      markdown += `## ${table.table_name}\n\n`;
      markdown += '| Column Name | Data Type | Nullable | Default Value |\n';
      markdown += '|-------------|-----------|----------|---------------|\n';
      
      table.columns.forEach(column => {
        markdown += `| ${column.column_name} | ${column.data_type} | ${column.is_nullable ? 'Yes' : 'No'} | ${column.column_default || 'NULL'} |\n`;
      });
      
      markdown += '\n';
    });
    
    const dataUri = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataUri);
    downloadAnchorNode.setAttribute('download', 'schema.md');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Database Schema</h1>
          <p className="text-muted-foreground">View all tables and columns in the public schema</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadSchemaAsJson}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
          <Button 
            variant="outline" 
            onClick={downloadSchemaAsMarkdown}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Markdown
          </Button>
          <Button 
            onClick={fetchSchema}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Refresh Schema
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>
            Showing {schema.length} tables from the public schema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {schema.map((table) => (
                <AccordionItem key={table.table_name} value={table.table_name}>
                  <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                    <div className="flex items-center gap-2 text-left">
                      <span className="font-semibold">{table.table_name}</span>
                      <Badge variant="outline" className="ml-2">
                        {table.columns.length} columns
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[400px] rounded-md border">
                      <div className="p-4">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="py-2 px-4">Column Name</th>
                              <th className="py-2 px-4">Data Type</th>
                              <th className="py-2 px-4">Nullable</th>
                              <th className="py-2 px-4">Default</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns.map((column, idx) => (
                              <tr 
                                key={`${table.table_name}-${column.column_name}`}
                                className={idx % 2 === 0 ? 'bg-muted/30' : ''}
                              >
                                <td className="py-2 px-4 font-medium">{column.column_name}</td>
                                <td className="py-2 px-4">
                                  <Badge variant="secondary">{column.data_type}</Badge>
                                </td>
                                <td className="py-2 px-4">
                                  {column.is_nullable ? (
                                    <Badge variant="outline">Yes</Badge>
                                  ) : (
                                    <Badge variant="default">No</Badge>
                                  )}
                                </td>
                                <td className="py-2 px-4 font-mono text-xs">
                                  {column.column_default || 'NULL'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Schema;
