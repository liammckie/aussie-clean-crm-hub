
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: any;
  code?: string;
  status?: number;
}

/**
 * Standard API success response shape
 */
export interface ApiSuccessResponse<T> {
  data: T;
  error: null;
}

/**
 * Union type for API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if a response is an error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return 'category' in response && !('error' in response);
}

/**
 * Type guard to check if a response is a success
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response && 'error' in response && response.error === null;
}

/**
 * Helper for creating a standardized success response
 */
export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    data,
    error: null
  };
}

/**
 * Helper for creating a standardized error response
 */
export function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: any
): ApiErrorResponse {
  return {
    category,
    message,
    details
  };
}
