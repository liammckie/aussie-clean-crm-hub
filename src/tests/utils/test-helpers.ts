
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Re-export the centralized API response types for tests
 */
export type {
  ApiResponse,
  ApiSuccessResponse as SuccessResponse,
  ApiErrorResponse as ErrorResponse
};

/**
 * Re-export the type guards from the centralized types
 */
export { isApiError as isErrorResponse, isApiSuccess as isSuccessResponse } from '@/types/api-response';

/**
 * Helper to create a success response for tests
 */
export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
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
): ApiErrorResponse {
  return {
    category,
    message,
    details
  };
}
