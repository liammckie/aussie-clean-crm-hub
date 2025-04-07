
import { ApiErrorResponse, createErrorResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Error response structure for Supabase errors
 */
export interface ErrorResponse {
  message: string;
  category: ErrorCategory;
  details?: Record<string, any>;
  status?: number;
}

/**
 * Format Supabase error to standardized error response
 */
export function formatSupabaseError(error: any): ErrorResponse {
  // Handle Supabase errors with appropriate categorization
  let category = ErrorCategory.UNKNOWN;
  
  if (error?.code === 'PGRST116') {
    category = ErrorCategory.NOT_FOUND;
  } else if (error?.code === '23505') {
    category = ErrorCategory.CONFLICT;
  } else if (error?.code === '42501' || error?.message?.includes('permission')) {
    category = ErrorCategory.AUTHORIZATION;
  } else if (error?.code?.startsWith('23')) {
    category = ErrorCategory.VALIDATION;
  } else if (error?.code?.startsWith('42')) {
    category = ErrorCategory.DATABASE;
  }
  
  return {
    message: error?.message || 'An error occurred with the database operation',
    category,
    details: error?.details ? { ...error.details } : undefined,
    status: error?.status || 500
  };
}

/**
 * Handle Supabase error and return standardized error response
 * Updated to accept message and context parameters
 */
export function handleSupabaseError(
  error: any,
  message = 'An error occurred',
  context?: Record<string, any>
): ApiErrorResponse {
  const formattedError = formatSupabaseError(error);
  return createErrorResponse(
    formattedError.category,
    message || formattedError.message,
    { ...formattedError.details, ...context }
  );
}

/**
 * Log successful operation
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}
