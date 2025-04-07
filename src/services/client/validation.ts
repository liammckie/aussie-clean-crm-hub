import { ClientFormData } from './types';
import { z } from 'zod';
import { ApiErrorResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Validate client form data
 */
export const validateClientData = (data: ClientFormData): ApiErrorResponse | null => {
  try {
    const clientSchema = z.object({
      business_name: z.string().min(1, { message: "Business name is required" }),
      // Other validations can be added here
    });

    clientSchema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        category: ErrorCategory.VALIDATION,
        message: firstError.message,
        details: {
          field: firstError.path.join('.'),
          error: firstError.message
        }
      };
    }

    return {
      category: ErrorCategory.VALIDATION,
      message: 'Invalid client data',
    };
  }
};

/**
 * Handle validation errors uniformly
 */
export const handleValidationError = (error: unknown, defaultMessage = 'Validation error'): ApiErrorResponse => {
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0];
    return {
      category: ErrorCategory.VALIDATION,
      message: firstError.message,
      details: {
        field: firstError.path.join('.'),
        error: firstError.message
      }
    };
  }

  return {
    category: ErrorCategory.VALIDATION,
    message: defaultMessage,
  };
};

/**
 * Common method to handle validation
 * This is the function that was missing
 */
export const handleValidation = handleValidationError;
