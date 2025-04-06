
import { z } from 'zod';

/**
 * Utility functions for mapping between database types and application types
 */

/**
 * Convert a database date string to a JavaScript Date object
 * @param dateString The ISO date string from the database
 * @returns A JavaScript Date object or undefined if the input is null/undefined
 */
export function toDate(dateString: string | null | undefined): Date | undefined {
  if (!dateString) return undefined;
  return new Date(dateString);
}

/**
 * Convert a JavaScript Date to an ISO string for database storage
 * @param date The JavaScript Date object
 * @returns An ISO date string or undefined if the input is null/undefined
 */
export function toISOString(date: Date | null | undefined): string | undefined {
  if (!date) return undefined;
  return date.toISOString();
}

/**
 * Prepare a database object for API submission by ensuring proper types
 * @param obj The object to prepare
 * @returns The properly formatted object for database submission
 */
export function prepareForDb<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined values
    if (value === undefined) continue;
    
    // Convert Date objects to ISO strings
    if (value instanceof Date) {
      result[key] = value.toISOString();
      continue;
    }
    
    // Handle arrays (check if array items need conversion)
    if (Array.isArray(value)) {
      result[key] = value.map(item => 
        item instanceof Date ? item.toISOString() : item
      );
      continue;
    }
    
    // Handle nested objects (recursive conversion)
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = prepareForDb(value);
      continue;
    }
    
    // Pass other values as-is
    result[key] = value;
  }
  
  return result;
}

/**
 * Create a Zod validation schema for database date fields
 * Accepts ISO strings and converts them to Date objects
 */
export const dbDateSchema = z.preprocess(
  (val) => val ? new Date(String(val)) : undefined,
  z.date().optional()
);

/**
 * Generic typing helper to map database response to application types
 * @param data The database response data
 * @returns Properly typed application data
 */
export function mapDbResponse<T>(data: any): T {
  return data as T;
}

/**
 * Map snake_case database field names to camelCase for frontend use
 * @param obj The database object with snake_case keys
 * @returns A new object with camelCase keys
 */
export function snakeToCamel<T extends Record<string, any>>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert key from snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Handle nested objects
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = snakeToCamel(value);
      continue;
    }
    
    // Handle arrays of objects
    if (Array.isArray(value)) {
      result[camelKey] = value.map(item => 
        item && typeof item === 'object' ? snakeToCamel(item) : item
      );
      continue;
    }
    
    // Pass primitive values as-is
    result[camelKey] = value;
  }
  
  return result as T;
}

/**
 * Map camelCase frontend field names to snake_case for database use
 * @param obj The frontend object with camelCase keys
 * @returns A new object with snake_case keys
 */
export function camelToSnake<T extends Record<string, any>>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Handle nested objects
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = camelToSnake(value);
      continue;
    }
    
    // Handle arrays of objects
    if (Array.isArray(value)) {
      result[snakeKey] = value.map(item => 
        item && typeof item === 'object' ? camelToSnake(item) : item
      );
      continue;
    }
    
    // Pass primitive values as-is
    result[snakeKey] = value;
  }
  
  return result as T;
}
