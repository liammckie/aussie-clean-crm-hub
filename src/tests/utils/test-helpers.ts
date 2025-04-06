
import { ErrorCategory } from '@/utils/supabaseErrors';

/**
 * Types for API responses used in tests
 */
export interface SuccessResponse<T> {
  data: T;
  error: null;
}

export interface ErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: {
    field?: string;
    error?: string;
  };
}

// Union type for API responses
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Type guard to check if a response is an ErrorResponse
 */
export function isErrorResponse(response: ApiResponse<any>): response is ErrorResponse {
  return 'category' in response && 'message' in response;
}

/**
 * Type guard to check if a response is a SuccessResponse
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return 'data' in response && 'error' in response && response.error === null;
}

/**
 * Helper to create a success response for tests
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    data,
    error: null
  };
}

/**
 * Helper to create an error response for tests
 */
export function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: { field?: string; error?: string }
): ErrorResponse {
  return {
    category,
    message,
    details
  };
}
