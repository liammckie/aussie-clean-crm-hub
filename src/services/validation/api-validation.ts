
import { ErrorCategory } from '@/utils/supabaseErrors';
import { 
  contactValidationSchema,
  addressValidationSchema,
  loginValidationSchema
} from './form-validation';
import { ZodError } from 'zod';

/**
 * Validate entity access 
 */
export function validateEntityAccess(
  entityType: string | undefined, 
  entityId: string | undefined
) {
  if (!entityType || !entityId) {
    return {
      isValid: false,
      error: {
        message: 'Entity type and ID are required',
        category: ErrorCategory.VALIDATION
      }
    };
  }

  // Validate entity type
  const validEntityTypes = ['client', 'supplier', 'employee', 'site', 'internal'];
  if (!validEntityTypes.includes(entityType)) {
    return {
      isValid: false,
      error: {
        message: `Invalid entity type: ${entityType}`,
        category: ErrorCategory.VALIDATION
      }
    };
  }
  
  // Validate entity ID format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(entityId)) {
    return {
      isValid: false,
      error: {
        message: 'Invalid entity ID format',
        category: ErrorCategory.VALIDATION
      }
    };
  }
  
  return { isValid: true, error: null };
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
 * Safely extracts the first field error from a Zod validation error object
 */
function extractFirstValidationError(formattedErrors: any): { field: string | null, message: string } {
  try {
    // Find first field with errors that's not the root _errors
    for (const [key, value] of Object.entries(formattedErrors)) {
      if (key !== '_errors' && typeof value === 'object' && value !== null) {
        if (isFieldError(value) && value._errors.length > 0) {
          return {
            field: key,
            message: value._errors[0]
          };
        }
      }
    }
    
    // Fallback to global _errors if available
    if ('_errors' in formattedErrors && 
        Array.isArray(formattedErrors._errors) && 
        formattedErrors._errors.length > 0) {
      return {
        field: null,
        message: formattedErrors._errors[0]
      };
    }
    
    return {
      field: null,
      message: 'Invalid data format'
    };
  } catch (err) {
    console.error("Error extracting validation error:", err);
    return {
      field: null,
      message: 'Validation error occurred'
    };
  }
}

/**
 * Validate contact data with improved error handling
 */
export function validateContactData<T>(contactData: T) {
  try {
    const result = contactValidationSchema.safeParse(contactData);

    if (!result.success) {
      // Get first validation error with safer extraction
      const formattedErrors = result.error.format();
      const { field, message } = extractFirstValidationError(formattedErrors);
      
      return {
        isValid: false,
        error: {
          message,
          category: ErrorCategory.VALIDATION,
          details: field ? { field } : undefined
        }
      };
    }
    
    return { isValid: true, data: result.data, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Contact validation failed',
        category: ErrorCategory.VALIDATION
      }
    };
  }
}

/**
 * Validate address data with improved error handling
 */
export function validateAddressData<T>(addressData: T) {
  try {
    const result = addressValidationSchema.safeParse(addressData);

    if (!result.success) {
      // Get first validation error with safer extraction
      const formattedErrors = result.error.format();
      const { field, message } = extractFirstValidationError(formattedErrors);
      
      return {
        isValid: false,
        error: {
          message,
          category: ErrorCategory.VALIDATION,
          details: field ? { field } : undefined
        }
      };
    }
    
    return { isValid: true, data: result.data, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Address validation failed',
        category: ErrorCategory.VALIDATION
      }
    };
  }
}

/**
 * Validate login data with improved error handling
 */
export function validateLoginData<T extends { email: string; password: string; rememberMe?: boolean }>(loginData: T) {
  try {
    const result = loginValidationSchema.safeParse(loginData);

    if (!result.success) {
      // Get first validation error with safer extraction
      const formattedErrors = result.error.format();
      const { field, message } = extractFirstValidationError(formattedErrors);
      
      return {
        isValid: false,
        error: {
          message,
          category: ErrorCategory.AUTHENTICATION,
          details: field ? { field } : undefined
        }
      };
    }
    
    return { isValid: true, data: result.data, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Login validation failed',
        category: ErrorCategory.AUTHENTICATION
      }
    };
  }
}
