
import { z, ZodSchema } from 'zod';
import { ValidationErrorResponse } from '@/services/unified/types';

/**
 * Creates a schema validator for a specific form type
 * @param schema The Zod schema to validate against
 * @returns A validator function for the specified schema and type
 */
export function createSchemaValidator<T>(schema: ZodSchema) {
  return (data: unknown): { data: T } | ValidationErrorResponse => {
    try {
      const validData = schema.parse(data);
      return { data: validData as T };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return {
          category: 'validation',
          message: firstError.message,
          details: {
            field: firstError.path.join('.'),
            error: firstError.message,
            code: 'invalid_input'  // Now properly typed
          }
        };
      }
      
      return {
        category: 'validation',
        message: 'Invalid form data provided'
      };
    }
  };
}

/**
 * Formats a validation error with a specific field and message
 * @param field The name of the field with the error
 * @param message The error message
 * @returns A ValidationErrorResponse object
 */
export function createValidationError(
  field: string, 
  message: string, 
  code: string = 'invalid_input'
): ValidationErrorResponse {
  return {
    category: 'validation',
    message,
    details: {
      field,
      error: message,
      code // Now properly typed
    }
  };
}

/**
 * Checks if all required fields are present in an object
 * @param data The data object to check
 * @param requiredFields Array of required field names
 * @returns A validation error if any fields are missing, otherwise null
 */
export function checkRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): ValidationErrorResponse | null {
  for (const field of requiredFields) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      const fieldName = String(field);
      const readableField = fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      return createValidationError(
        fieldName,
        `${readableField} is required`,
        'required_field' // Now properly typed
      );
    }
  }
  
  return null;
}

/**
 * Ensures boolean fields have a default value
 * @param value The boolean value or undefined
 * @param defaultValue The default boolean value to use
 * @returns A boolean value, never undefined or null
 */
export function ensureBooleanValue(value: boolean | undefined | null, defaultValue = false): boolean {
  return value === undefined || value === null ? defaultValue : value;
}

/**
 * Ensures string fields have a default value
 * @param value The string value or undefined
 * @param defaultValue The default string value to use
 * @returns A string value, never undefined or null
 */
export function ensureStringValue(value: string | undefined | null, defaultValue = ''): string {
  return value === undefined || value === null ? defaultValue : value;
}
