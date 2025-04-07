
import { ApiErrorResponse, ApiResponse, createErrorResponse, isApiError, createSuccessResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Format an error for API responses (replacement for formatError)
 */
export function formatError(error: any, message = 'An error occurred'): ApiErrorResponse {
  // If it's already an ApiErrorResponse, return it
  if (error && 'category' in error) {
    return error as ApiErrorResponse;
  }
  
  // Create a new error response
  return createErrorResponse(
    ErrorCategory.UNKNOWN,
    error?.message || message,
    { error }
  );
}

/**
 * Handles Supabase API errors and converts them to consistent error responses
 */
export function handleApiError(
  error: Error | PostgrestError | unknown,
  message: string,
  context: Record<string, any> = {}
): ApiErrorResponse {
  // If it's a PostgrestError from Supabase
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    
    // Handle specific PostgreSQL error codes
    switch (pgError.code) {
      case '23505': // Unique violation
        return createErrorResponse(
          ErrorCategory.VALIDATION,
          'Record already exists with this value',
          { supabase_error: pgError, ...context }
        );
      case '23503': // Foreign key violation
        return createErrorResponse(
          ErrorCategory.VALIDATION,
          'Referenced record does not exist',
          { supabase_error: pgError, ...context }
        );
      case '42P01': // Undefined table
        return createErrorResponse(
          ErrorCategory.DATABASE,
          'Database configuration error',
          { supabase_error: pgError, ...context }
        );
      case '42501': // Permission denied
      case '42503': // Permission denied
        return createErrorResponse(
          ErrorCategory.PERMISSION,
          'You do not have permission to perform this action',
          { supabase_error: pgError, ...context }
        );
      case '28P01': // Invalid password
        return createErrorResponse(
          ErrorCategory.AUTHENTICATION,
          'Invalid credentials',
          { supabase_error: pgError, ...context }
        );
      default:
        return createErrorResponse(
          ErrorCategory.SERVER,
          message || 'An error occurred with the database',
          { supabase_error: pgError, ...context }
        );
    }
  }
  
  // If it's an Error object
  if (error instanceof Error) {
    return createErrorResponse(
      ErrorCategory.SERVER,
      message || error.message,
      { error: error.message, stack: error.stack, ...context }
    );
  }
  
  // Fallback for unknown error types
  return createErrorResponse(
    ErrorCategory.UNKNOWN,
    message || 'An unknown error occurred',
    { error, ...context }
  );
}

/**
 * Type guard for checking API responses with possible data property
 */
export function hasData<T>(response: unknown): response is { data: T } {
  return typeof response === 'object' && 
         response !== null && 
         'data' in response && 
         response.data !== undefined && 
         response.data !== null;
}

/**
 * Safe way to handle API responses - useful for component code
 */
export function handleApiResponse<T, R>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => R,
  onError?: (error: ApiErrorResponse) => R
): R | undefined {
  if (isApiError(response)) {
    return onError ? onError(response) : undefined;
  }
  return onSuccess(response.data);
}

// Re-export the functions from api-response
export { createSuccessResponse, createErrorResponse, isApiError };
