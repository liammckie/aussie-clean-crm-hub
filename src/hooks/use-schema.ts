
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  saveSchemaBaseline, 
  checkSchemaDrift, 
  getSchemaBaselineDate, 
  SchemaDiff 
} from '@/utils/schema/checkSchemaDrift';
import { updateSchemaDocumentation, getSchemaMarkdown } from '@/utils/schema/updateSchemaDoc';

// Define the types for the schema data
export interface Column {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

export interface TableSchema {
  table_name: string;
  columns: Column[];
}

export interface SchemaResponse {
  schema: TableSchema[];
}

export function useSchema() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schemaData, setSchemaData] = useState<TableSchema[]>([]);
  const [activeTable, setActiveTable] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [baselineDate, setBaselineDate] = useState<Date | null>(null);
  const [isCheckingDrift, setIsCheckingDrift] = useState(false);
  const [schemaDiff, setSchemaDiff] = useState<SchemaDiff | null>(null);
  const [diffView, setDiffView] = useState(false);
  
  const fetchSchema = useCallback(async () => {
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
      
      // Reset diff view when fetching new schema
      setDiffView(false);
      setSchemaDiff(null);
    } catch (err: any) {
      console.error('Error fetching schema:', err);
      setError(err.message);
      toast.error('Failed to fetch database schema');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const saveBaseline = async () => {
    const success = await saveSchemaBaseline();
    if (success) {
      setBaselineDate(new Date());
      toast.success('Schema baseline saved');
    }
  };
  
  const checkDrift = async () => {
    setIsCheckingDrift(true);
    
    try {
      const diff = await checkSchemaDrift();
      setSchemaDiff(diff);
      
      if (diff && diff.hasChanges) {
        toast.warning(`Schema drift detected: ${diff.addedTables.length} tables added, ${diff.removedTables.length} removed, ${diff.modifiedTables.length} modified`);
        setDiffView(true);
      } else {
        toast.success('No schema drift detected');
      }
    } finally {
      setIsCheckingDrift(false);
    }
  };
  
  const updateDocumentation = async () => {
    const result = await updateSchemaDocumentation();
    if (result.success) {
      toast.success('Schema documentation updated', {
        description: `File updated: ${result.filePath}`
      });
    } else {
      toast.error('Failed to update schema documentation', {
        description: result.error
      });
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

  const downloadAsMarkdown = async () => {
    try {
      const markdownContent = await getSchemaMarkdown();
      
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
  
  const hideDiffView = () => {
    setDiffView(false);
  };

  const loadBaselineDate = () => {
    const date = getSchemaBaselineDate();
    setBaselineDate(date);
  };

  return {
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
    loadBaselineDate,
  };
}
