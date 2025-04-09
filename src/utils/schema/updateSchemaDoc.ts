
/**
 * Utility to help maintain schema documentation
 * 
 * This script can be used to automatically generate schema documentation
 * based on the actual database structure. It requires appropriate permissions
 * to query the database schema information.
 */

import { supabase } from '@/integrations/supabase/client';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { format } from 'date-fns';

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
  references?: {
    table: string;
    column: string;
  };
  description?: string;
}

interface TableSchema {
  table_name: string;
  columns: ColumnInfo[];
  relations?: {
    outgoing: { table: string; column: string; foreignTable: string; foreignColumn: string }[];
    incoming: { table: string; column: string; foreignTable: string; foreignColumn: string }[];
  };
}

interface SchemaResponse {
  schema: TableSchema[];
}

/**
 * Generates markdown documentation from the database schema
 */
export async function generateSchemaMarkdown(): Promise<string> {
  try {
    console.log('Fetching schema information...');

    // Call the schema function we have in Supabase
    const { data, error } = await supabase.functions.invoke('get-schema');

    if (error) {
      throw new Error(`Error fetching schema: ${error.message}`);
    }

    const schemaResponse = data as SchemaResponse;
    const schema = schemaResponse.schema;
    
    // Generate Markdown
    let markdown = '# Auto-generated Database Schema\n\n';
    markdown += `This document was auto-generated on ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} and contains the current schema information for all tables in the database.\n\n`;
    
    // Add table of contents
    markdown += '## Table of Contents\n\n';
    schema.forEach(table => {
      markdown += `- [${table.table_name}](#${table.table_name})\n`;
    });
    markdown += '\n\n';
    
    // Generate detailed table information
    for (const table of schema) {
      markdown += `<a name="${table.table_name}"></a>\n`;
      markdown += `## Table: ${table.table_name}\n\n`;
      markdown += '| Column | Type | Nullable | Default | Notes |\n';
      markdown += '|--------|------|----------|---------|-------|\n';
      
      for (const column of table.columns) {
        const notes = column.references 
          ? `References ${column.references.table}.${column.references.column}` 
          : column.description || '';
          
        markdown += `| ${column.column_name} | ${column.data_type} | ${column.is_nullable ? 'YES' : 'NO'} | ${column.column_default || ''} | ${notes} |\n`;
      }
      
      markdown += '\n\n';
    }

    // Add generation metadata
    markdown += '---\n\n';
    markdown += `*This documentation was automatically generated on ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}.*\n`;
    markdown += '*To update this documentation, use the Schema page in the application or run the `updateSchemaDocumentation` function.*\n';
    
    return markdown;
  } catch (error) {
    console.error('Failed to generate schema documentation:', error);
    return `# Schema Documentation Error\n\nFailed to generate schema documentation: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Updates the schema documentation file with the latest database schema
 */
export async function updateSchemaDocumentation(): Promise<{
  success: boolean;
  filePath?: string;
  error?: string;
}> {
  try {
    const markdown = await generateSchemaMarkdown();
    const filePath = join(process.cwd(), 'src', 'docs', 'AUTO_GENERATED_SCHEMA.md');
    
    writeFileSync(filePath, markdown, 'utf8');
    console.log(`Schema documentation updated at ${filePath}`);
    
    // Also update the timestamp in the index file
    try {
      const indexPath = join(process.cwd(), 'src', 'docs', 'DATABASE_SCHEMA_INDEX.md');
      const indexContent = await import('fs').then(fs => fs.readFileSync(indexPath, 'utf8'));
      const updatedContent = indexContent.replace(
        /Last updated: .*$/m,
        `Last updated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`
      );
      writeFileSync(indexPath, updatedContent, 'utf8');
    } catch (indexError) {
      console.warn('Could not update the index file timestamp:', indexError);
    }
    
    return { success: true, filePath };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to update schema documentation file:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * For browser environments where filesystem access isn't available
 */
export async function getSchemaMarkdown(): Promise<string> {
  return await generateSchemaMarkdown();
}

/**
 * Create or update the schema changelog entry based on detected changes
 */
export async function updateSchemaChangelog(changes: any): Promise<boolean> {
  if (!changes || !Object.keys(changes).length) {
    console.log('No schema changes detected, skipping changelog update.');
    return false;
  }
  
  try {
    // Implementation would depend on filesystem access
    // In a browser environment, this could display a form for the user to document the changes
    console.log('Schema changes detected:', changes);
    console.log('Please document these changes in the SCHEMA_CHANGELOG.md file.');
    return true;
  } catch (error) {
    console.error('Failed to update schema changelog:', error);
    return false;
  }
}
