
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
