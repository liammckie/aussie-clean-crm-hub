
import React, { useEffect, useState } from 'react';
import { useSchema } from '@/hooks/use-schema';
import { Card } from '@/components/ui/card';
import { SchemaSearch } from '@/components/schema/SchemaSearch';
import { SchemaHeader } from '@/components/schema/SchemaHeader';
import { SchemaLoadingState } from '@/components/schema/SchemaLoadingState';
import { SchemaErrorState } from '@/components/schema/SchemaErrorState';
import { SchemaDriftView } from '@/components/schema/SchemaDriftView';
import { TablesList } from '@/components/schema/TablesList';
import { TableDetailsView } from '@/components/schema/TableDetailsView';

export default function Schema() {
  const {
    isLoading,
    error,
    schemaData,
    activeTable,
    lastUpdated,
    baselineDate,
    isCheckingDrift,
    schemaDiff,
    diffView,
    setActiveTable,
    fetchSchema,
    saveBaseline,
    checkDrift,
    updateDocumentation,
    downloadAsJson,
    downloadAsMarkdown,
    hideDiffView,
    loadBaselineDate
  } = useSchema();

  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchSchema();
    loadBaselineDate();
  }, [fetchSchema]);

  const tableHasColumn = (table: any, searchTerm: string) => {
    return table.columns.some((col: any) => 
      col.column_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.data_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredTables = searchTerm.length > 0 
    ? schemaData.filter(table => 
        table.table_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tableHasColumn(table, searchTerm)
      )
    : schemaData;

  if (isLoading) {
    return <SchemaLoadingState />;
  }

  if (error) {
    return <SchemaErrorState error={error} onRetry={fetchSchema} />;
  }

  const activeTableData = schemaData.find((t) => t.table_name === activeTable);

  return (
    <div className="container mx-auto py-6">
      <SchemaHeader
        lastUpdated={lastUpdated}
        baselineDate={baselineDate}
        isCheckingDrift={isCheckingDrift}
        onRefreshSchema={fetchSchema}
        onSaveBaseline={saveBaseline}
        onCheckDrift={checkDrift}
        onDownloadJson={downloadAsJson}
        onDownloadMarkdown={downloadAsMarkdown}
        onUpdateDocumentation={updateDocumentation}
      />
      
      {diffView && schemaDiff && (
        <SchemaDriftView schemaDiff={schemaDiff} onHideDiff={hideDiffView} />
      )}

      <SchemaSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredTables.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No tables found in the database.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TablesList 
            tables={filteredTables} 
            activeTable={activeTable}
            onSelectTable={setActiveTable}
          />

          {activeTableData && (
            <TableDetailsView table={activeTableData} />
          )}
        </div>
      )}
    </div>
  );
}
