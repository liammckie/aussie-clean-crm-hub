
/**
 * Utility for monitoring schema drift
 * 
 * This tool compares the current database schema with a known-good snapshot
 * to detect when tables or columns have been added, removed, or modified.
 */

import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

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

export interface SchemaDiff {
  addedTables: string[];
  removedTables: string[];
  modifiedTables: {
    tableName: string;
    addedColumns: string[];
    removedColumns: string[];
    modifiedColumns: {
      columnName: string;
      changes: {
        field: string;
        oldValue: any;
        newValue: any;
      }[];
    }[];
  }[];
  timestamp: string;
  hasChanges: boolean;
}

/**
 * Compares two schema snapshots and identifies differences
 */
export function compareSchemas(
  currentSchema: TableSchema[], 
  baselineSchema: TableSchema[]
): SchemaDiff {
  const currentTables = new Set(currentSchema.map(t => t.table_name));
  const baselineTables = new Set(baselineSchema.map(t => t.table_name));
  
  const addedTables = [...currentTables].filter(t => !baselineTables.has(t));
  const removedTables = [...baselineTables].filter(t => !currentTables.has(t));
  
  const modifiedTables: SchemaDiff['modifiedTables'] = [];
  
  // Check tables that exist in both schemas for column changes
  [...currentTables].filter(t => baselineTables.has(t)).forEach(tableName => {
    const currentTable = currentSchema.find(t => t.table_name === tableName)!;
    const baselineTable = baselineSchema.find(t => t.table_name === tableName)!;
    
    const currentColumns = new Map(currentTable.columns.map(c => [c.column_name, c]));
    const baselineColumns = new Map(baselineTable.columns.map(c => [c.column_name, c]));
    
    const addedColumns = [...currentColumns.keys()].filter(c => !baselineColumns.has(c));
    const removedColumns = [...baselineColumns.keys()].filter(c => !currentColumns.has(c));
    
    const modifiedColumns: SchemaDiff['modifiedTables'][0]['modifiedColumns'] = [];
    
    // Check columns that exist in both tables for property changes
    [...currentColumns.keys()].filter(c => baselineColumns.has(c)).forEach(columnName => {
      const currentColumn = currentColumns.get(columnName)!;
      const baselineColumn = baselineColumns.get(columnName)!;
      
      const changes: SchemaDiff['modifiedTables'][0]['modifiedColumns'][0]['changes'] = [];
      
      // Compare data_type
      if (currentColumn.data_type !== baselineColumn.data_type) {
        changes.push({
          field: 'data_type',
          oldValue: baselineColumn.data_type,
          newValue: currentColumn.data_type
        });
      }
      
      // Compare is_nullable
      if (currentColumn.is_nullable !== baselineColumn.is_nullable) {
        changes.push({
          field: 'is_nullable',
          oldValue: baselineColumn.is_nullable,
          newValue: currentColumn.is_nullable
        });
      }
      
      // Compare column_default
      if (currentColumn.column_default !== baselineColumn.column_default) {
        changes.push({
          field: 'column_default',
          oldValue: baselineColumn.column_default,
          newValue: currentColumn.column_default
        });
      }
      
      if (changes.length > 0) {
        modifiedColumns.push({
          columnName,
          changes
        });
      }
    });
    
    if (addedColumns.length > 0 || removedColumns.length > 0 || modifiedColumns.length > 0) {
      modifiedTables.push({
        tableName,
        addedColumns,
        removedColumns,
        modifiedColumns
      });
    }
  });
  
  const result = {
    addedTables,
    removedTables,
    modifiedTables,
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    hasChanges: addedTables.length > 0 || removedTables.length > 0 || modifiedTables.length > 0
  };
  
  return result;
}

/**
 * Formats the schema diff into a readable string
 */
export function formatSchemaDiff(diff: SchemaDiff): string {
  if (!diff.hasChanges) {
    return "No schema changes detected.";
  }
  
  let result = `# Schema Changes (${diff.timestamp})\n\n`;
  
  if (diff.addedTables.length > 0) {
    result += `## Added Tables\n\n`;
    diff.addedTables.forEach(table => {
      result += `- \`${table}\`\n`;
    });
    result += "\n";
  }
  
  if (diff.removedTables.length > 0) {
    result += `## Removed Tables\n\n`;
    diff.removedTables.forEach(table => {
      result += `- \`${table}\`\n`;
    });
    result += "\n";
  }
  
  if (diff.modifiedTables.length > 0) {
    result += `## Modified Tables\n\n`;
    diff.modifiedTables.forEach(table => {
      result += `### ${table.tableName}\n\n`;
      
      if (table.addedColumns.length > 0) {
        result += `**Added Columns:**\n\n`;
        table.addedColumns.forEach(col => {
          result += `- \`${col}\`\n`;
        });
        result += "\n";
      }
      
      if (table.removedColumns.length > 0) {
        result += `**Removed Columns:**\n\n`;
        table.removedColumns.forEach(col => {
          result += `- \`${col}\`\n`;
        });
        result += "\n";
      }
      
      if (table.modifiedColumns.length > 0) {
        result += `**Modified Columns:**\n\n`;
        table.modifiedColumns.forEach(col => {
          result += `- \`${col.columnName}\`:\n`;
          col.changes.forEach(change => {
            result += `  - \`${change.field}\`: \`${change.oldValue}\` → \`${change.newValue}\`\n`;
          });
        });
        result += "\n";
      }
    });
  }
  
  return result;
}

/**
 * Fetches current schema and compares to baseline
 */
export async function checkSchemaDrift(baselineSchema?: TableSchema[]): Promise<SchemaDiff | null> {
  try {
    // Fetch current schema
    const { data, error } = await supabase.functions.invoke('get-schema');
    
    if (error) {
      console.error('Error fetching schema:', error);
      return null;
    }
    
    const schemaResponse = data as SchemaResponse;
    const currentSchema = schemaResponse.schema;
    
    // If no baseline was provided, fetch from local storage or return null
    if (!baselineSchema) {
      const savedSchema = localStorage.getItem('schema-baseline');
      if (!savedSchema) {
        return null;
      }
      baselineSchema = JSON.parse(savedSchema);
    }
    
    // Compare and return differences
    const diff = compareSchemas(currentSchema, baselineSchema);
    
    if (diff.hasChanges) {
      console.log('Schema drift detected:', diff);
    }
    
    return diff;
  } catch (err) {
    console.error('Error checking schema drift:', err);
    return null;
  }
}

/**
 * Save current schema as baseline
 */
export async function saveSchemaBaseline(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('get-schema');
    
    if (error) {
      console.error('Error fetching schema for baseline:', error);
      toast.error('Failed to save schema baseline');
      return false;
    }
    
    const schema = (data as SchemaResponse).schema;
    localStorage.setItem('schema-baseline', JSON.stringify(schema));
    localStorage.setItem('schema-baseline-date', new Date().toISOString());
    toast.success('Schema baseline saved successfully');
    
    return true;
  } catch (err) {
    console.error('Error saving schema baseline:', err);
    toast.error('Failed to save schema baseline');
    return false;
  }
}

/**
 * Get the date when baseline was last saved
 */
export function getSchemaBaselineDate(): Date | null {
  const dateStr = localStorage.getItem('schema-baseline-date');
  return dateStr ? new Date(dateStr) : null;
}

/**
 * Check if the current schema has drifted from the baseline and notify user
 */
export async function checkAndNotifySchemaDrift(): Promise<void> {
  const baselineDate = getSchemaBaselineDate();
  if (!baselineDate) {
    // No baseline saved yet, don't check
    return;
  }
  
  const diff = await checkSchemaDrift();
  if (diff && diff.hasChanges) {
    toast.warning(
      'Schema drift detected', 
      {
        description: `${diff.addedTables.length} tables added, ${diff.removedTables.length} removed, ${diff.modifiedTables.length} modified`,
        duration: 10000,
        action: {
          label: 'View Details',
          onClick: () => {
            // This would ideally navigate to the schema page
            window.location.href = '/schema';
          }
        }
      }
    );
  }
}
