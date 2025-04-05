
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
            code: 'invalid_input'
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
export function createValidationError(field: string, message: string): ValidationErrorResponse {
  return {
    category: 'validation',
    message,
    details: {
      field,
      code: 'invalid_input'
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
        `${readableField} is required`
      );
    }
  }
  
  return null;
}

/**
 * Updates the service/validation/index.ts file to export our new utilities
 */
