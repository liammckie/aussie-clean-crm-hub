
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, createErrorResponse, createSuccessResponse } from '@/types/api-response';
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
 * Type guard to check if response is a success
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response && !('category' in response);
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(response: any): response is ApiErrorResponse {
  return 'category' in response;
}

/**
 * Re-export the response creation helpers
 */
export { createSuccessResponse, createErrorResponse };
