
import { ZodSchema, ZodError } from 'zod';
import { toast } from 'sonner';

/**
 * Interface for validation errors
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Type guard to check if an object is a field error with _errors array
 */
function isFieldError(obj: any): obj is { _errors: string[] } {
  return obj && 
    typeof obj === 'object' && 
    '_errors' in obj && 
    Array.isArray(obj._errors);
}

/**
 * Validates data against a given schema
 */
export function validateFormData<T>(
  schema: ZodSchema, 
  data: unknown
): ValidationResult<T> {
  try {
    const validData = schema.parse(data);
    return {
      success: true,
      data: validData as T
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });

      return {
        success: false,
        errors: fieldErrors,
        message: "Validation failed. Please check the form for errors."
      };
    }
    
    return {
      success: false,
      message: "An unexpected error occurred during validation."
    };
  }
}

/**
 * Applies validation errors to a form
 */
export function applyValidationErrorsToForm(
  form: any,
  errors: Record<string, string>
): void {
  Object.entries(errors).forEach(([field, message]) => {
    try {
      form.setError(field, {
        type: 'manual',
        message
      });
    } catch (e) {
      console.error(`Error setting form error for field ${field}:`, e);
    }
  });
}

/**
 * Extracts the first validation error from formatted Zod error
 */
export function extractFirstZodError(formattedErrors: any): string {
  try {
    // Try to find the first field with errors
    for (const [key, value] of Object.entries(formattedErrors)) {
      if (key !== '_errors' && typeof value === 'object' && value !== null) {
        if (isFieldError(value) && value._errors.length > 0) {
          return `${key}: ${value._errors[0]}`;
        }
      }
    }
    
    // Check for root errors
    if ('_errors' in formattedErrors && Array.isArray(formattedErrors._errors) && formattedErrors._errors.length > 0) {
      return formattedErrors._errors[0];
    }
    
    return 'Validation failed. Please check your input.';
  } catch (e) {
    console.error('Error extracting Zod error:', e);
    return 'Validation error occurred';
  }
}

/**
 * Handles validation errors from API responses
 */
export function handleValidationErrors(
  form: any,
  error: any
): boolean {
  if (error?.category === 'validation') {
    // Handle validation errors from API
    if (error.details?.field) {
      form.setError(error.details.field, {
        type: 'manual',
        message: error.message
      });
      toast.error(error.message);
      return true;
    } else {
      // General validation error
      toast.error(error.message || 'Validation failed');
      return true;
    }
  }
  return false;
}

/**
 * Type guard to check if an object is a ValidationResult
 */
export function isValidationResult(obj: any): obj is ValidationResult<unknown> {
  return obj && typeof obj === 'object' && 'success' in obj;
}
