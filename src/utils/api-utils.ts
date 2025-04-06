
import { AppLogger, LogCategory } from '@/utils/logging';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  category: 'validation' | 'permission' | 'not_found' | 'server';
  message: string;
  details?: any;
}

/**
 * Standard API success response shape
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}

/**
 * Union type for API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if a response is an error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return 'category' in response;
}

/**
 * Type guard to check if a response is a success
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response;
}

/**
 * Helper for handling Supabase errors in a consistent manner
 * 
 * @param error The error object from Supabase or other source
 * @param message A user-friendly error message
 * @param context Additional context for logging
 * @param category The log category
 * @returns A standardized error response object
 */
export function handleApiError(
  error: any, 
  message: string, 
  context?: Record<string, any>,
  category: LogCategory = LogCategory.API
): ApiErrorResponse {
  // Log the error with context
  AppLogger.error(category, message, { error, ...context });
  
  // Capture exception for monitoring
  ErrorReporting.captureException(error);
  
  // Determine error category based on the error object
  let errorCategory: ApiErrorResponse['category'] = 'server';
  
  // Handle Supabase-specific error codes
  if (error?.code) {
    if (error.code === '42P01') {
      errorCategory = 'permission';
    } else if (error.code === 'PGRST116') {
      errorCategory = 'not_found';
    }
  }
  
  // Return standardized error response
  return {
    category: errorCategory,
    message: message,
    details: error
  };
}
