
import { ErrorCategory } from '@/utils/supabaseErrors';
import { 
  contactValidationSchema,
  addressValidationSchema
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
 * Validate contact data
 */
export function validateContactData<T>(contactData: T) {
  try {
    const result = contactValidationSchema.safeParse(contactData);

    if (!result.success) {
      // Get first validation error
      const formattedErrors = result.error.format();
      const firstErrorField = Object.keys(formattedErrors).find(
        key => key !== '_errors' && formattedErrors[key]?._errors?.length
      );
      
      const firstErrorMessage = firstErrorField 
        ? formattedErrors[firstErrorField]?._errors?.[0] 
        : 'Invalid contact data';
      
      return {
        isValid: false,
        error: {
          message: firstErrorMessage,
          category: ErrorCategory.VALIDATION,
          details: { field: firstErrorField }
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
 * Validate address data
 */
export function validateAddressData<T>(addressData: T) {
  try {
    const result = addressValidationSchema.safeParse(addressData);

    if (!result.success) {
      // Get first validation error
      const formattedErrors = result.error.format();
      const firstErrorField = Object.keys(formattedErrors).find(
        key => key !== '_errors' && formattedErrors[key]?._errors?.length
      );
      
      const firstErrorMessage = firstErrorField 
        ? formattedErrors[firstErrorField]?._errors?.[0] 
        : 'Invalid address data';
      
      return {
        isValid: false,
        error: {
          message: firstErrorMessage,
          category: ErrorCategory.VALIDATION,
          details: { field: firstErrorField }
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
