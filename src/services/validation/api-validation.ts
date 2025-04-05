
import { ErrorCategory } from '@/utils/supabaseErrors';
import { 
  contactValidationSchema,
  addressValidationSchema,
  loginValidationSchema
} from './form-validation';

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
 * Safely extracts the first field error from a Zod validation error object
 */
function extractFirstValidationError(formattedErrors: any): { field: string | null, message: string } {
  try {
    // Find first field with errors that's not the root _errors
    const firstErrorField = Object.keys(formattedErrors).find(
      key => key !== '_errors' && 
        typeof formattedErrors[key] === 'object' &&
        '_errors' in formattedErrors[key] &&
        Array.isArray(formattedErrors[key]._errors) &&
        formattedErrors[key]._errors.length > 0
    );
    
    if (firstErrorField && typeof formattedErrors[firstErrorField] === 'object') {
      return {
        field: firstErrorField,
        message: formattedErrors[firstErrorField]._errors[0] || 'Invalid data'
      };
    }
    
    // Fallback to global _errors if available
    if (formattedErrors._errors && formattedErrors._errors.length) {
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
