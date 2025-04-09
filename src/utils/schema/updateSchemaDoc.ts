
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

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

interface TableSchema {
  table_name: string;
  columns: ColumnInfo[];
}

export async function generateSchemaMarkdown(): Promise<string> {
  try {
    console.log('Fetching schema information...');

    // Call the schema function we have in Supabase
    const { data, error } = await supabase.functions.invoke('get-schema');

    if (error) {
      throw new Error(`Error fetching schema: ${error.message}`);
    }

    const schema = (data as any).schema as TableSchema[];
    
    // Generate Markdown
    let markdown = '# Auto-generated Database Schema\n\n';
    markdown += 'This document is auto-generated and contains the current schema information for all tables in the database.\n\n';
    
    for (const table of schema) {
      markdown += `## Table: ${table.table_name}\n\n`;
      markdown += '| Column | Type | Nullable | Default |\n';
      markdown += '|--------|------|----------|--------|\n';
      
      for (const column of table.columns) {
        markdown += `| ${column.column_name} | ${column.data_type} | ${column.is_nullable ? 'YES' : 'NO'} | ${column.column_default || ''} |\n`;
      }
      
      markdown += '\n';
    }
    
    return markdown;
  } catch (error) {
    console.error('Failed to generate schema documentation:', error);
    return `# Schema Documentation Error\n\nFailed to generate schema documentation: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Updates the schema documentation file with the latest database schema
 */
export async function updateSchemaDocumentation(): Promise<boolean> {
  try {
    const markdown = await generateSchemaMarkdown();
    const filePath = join(process.cwd(), 'src', 'docs', 'AUTO_GENERATED_SCHEMA.md');
    
    writeFileSync(filePath, markdown, 'utf8');
    console.log(`Schema documentation updated at ${filePath}`);
    return true;
  } catch (error) {
    console.error('Failed to update schema documentation file:', error);
    return false;
  }
}

/**
 * For browser environments where filesystem access isn't available
 */
export async function getSchemaMarkdown(): Promise<string> {
  return await generateSchemaMarkdown();
}
