
import { ErrorCategory } from '@/utils/logging/error-types';

export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number;
}

export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if an API response is a success response
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response && response.data !== undefined;
}

/**
 * Type guard to check if an API response is an error response
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return 'category' in response && response.category !== undefined;
}

/**
 * Create a success response with the given data and message
 */
export function createSuccessResponse<T>(data: T, message = 'Operation successful'): ApiSuccessResponse<T> {
  return {
    data,
    message
  };
}

/**
 * Create an error response with the given category, message and details
 */
export function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return {
    category,
    message,
    details
  };
}

