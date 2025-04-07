
import { z, ZodSchema } from 'zod';
import { ValidationErrorResponse } from '@/services/unified/types';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Server-side validation utility for validating form data
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or validation error
 */
export function validateServerData<T>(
  schema: ZodSchema, 
  data: unknown
): { data: T } | ValidationErrorResponse {
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
          code: 'VALIDATION_ERROR'
        }
      };
    }
    
    return {
      category: 'validation',
      message: 'Invalid form data provided'
    };
  }
}

/**
 * Check if an object is a validation error response
 */
export function isValidationError(obj: any): obj is ValidationErrorResponse {
  return obj && 
    typeof obj === 'object' && 
    obj.category === 'validation' && 
    typeof obj.message === 'string';
}

/**
 * Creates a data validator function for a specific schema
 */
export function createValidator<T>(schema: ZodSchema) {
  return (data: unknown) => validateServerData<T>(schema, data);
}
