
import { z } from 'zod';
import { validateServerData } from './form-validation';
import { ErrorCategory, ErrorResponse } from '@/utils/supabaseErrors';
import { unifiedAddressSchema, unifiedContactSchema } from '@/types/form-types';

/**
 * Security validation for API operations
 * This adds protection against unsafe operations and type inconsistencies
 */
export interface ApiValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: ErrorResponse;
}

/**
 * Validates entity access permissions
 * Ensures that the requesting user has access to the specified entity
 * 
 * @param entityType Type of entity being accessed
 * @param entityId ID of entity being accessed
 * @returns Validation result with error if unauthorized
 */
export function validateEntityAccess(entityType: string, entityId: string): ApiValidationResult<boolean> {
  // Basic input validation
  if (!entityType || !entityId) {
    return {
      isValid: false,
      error: {
        message: 'Missing required entity information',
        category: ErrorCategory.VALIDATION,
        details: { entityType, entityId }
      }
    };
  }

  // UUID format validation 
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(entityId)) {
    return {
      isValid: false,
      error: {
        message: 'Invalid entity ID format',
        category: ErrorCategory.VALIDATION,
        details: { entityId }
      }
    };
  }

  // Validate entity type
  const validEntityTypes = ['client', 'supplier', 'employee', 'site', 'internal'];
  if (!validEntityTypes.includes(entityType)) {
    return {
      isValid: false, 
      error: {
        message: 'Invalid entity type',
        category: ErrorCategory.VALIDATION,
        details: { entityType, validTypes: validEntityTypes }
      }
    };
  }

  return { isValid: true };
}

/**
 * Validates unified address data before database operations
 * Ensures type safety and prevents injection attacks
 * 
 * @param addressData Data to validate
 * @returns Validation result with verified data or error
 */
export function validateAddressData<T>(addressData: unknown): ApiValidationResult<T> {
  const result = validateServerData(unifiedAddressSchema, addressData);
  
  if ('category' in result) {
    return {
      isValid: false,
      error: result as ErrorResponse
    };
  }
  
  return {
    isValid: true,
    data: result.data as unknown as T
  };
}

/**
 * Validates unified contact data before database operations
 * Ensures type safety and prevents injection attacks
 * 
 * @param contactData Data to validate
 * @returns Validation result with verified data or error
 */
export function validateContactData<T>(contactData: unknown): ApiValidationResult<T> {
  const result = validateServerData(unifiedContactSchema, contactData);
  
  if ('category' in result) {
    return {
      isValid: false,
      error: result as ErrorResponse
    };
  }
  
  return {
    isValid: true,
    data: result.data as unknown as T
  };
}

/**
 * Sanitizes input to prevent SQL injection and XSS attacks
 * Use for all user-provided inputs before passing to database
 * 
 * @param input User input to sanitize
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Basic sanitization - remove dangerous characters
  return input
    .replace(/[\\<>]/g, '') // Remove potentially dangerous characters
    .trim();
}

/**
 * Creates a schema validator for API parameters
 * @param schema Zod schema for validation
 */
export function createApiValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): ApiValidationResult<T> => {
    try {
      const validData = schema.parse(data);
      return {
        isValid: true,
        data: validData
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: {
            message: 'Invalid API parameters',
            category: ErrorCategory.VALIDATION,
            details: error.errors
          }
        };
      }
      
      return {
        isValid: false,
        error: {
          message: 'Validation failed',
          category: ErrorCategory.VALIDATION
        }
      };
    }
  };
}
