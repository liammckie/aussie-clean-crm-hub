
// Import ErrorCategory enum from error-types.ts
import { ErrorCategory } from '@/utils/logging/error-types';

// Use the ErrorCategory enum type
export type ErrorCategoryType = ErrorCategory;

/**
 * Interface for successful API responses
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number;
}

/**
 * Interface for error API responses
 */
export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Function to create a successful API response
 */
export function createSuccessResponse<T>(data: T, message: string, count?: number): ApiSuccessResponse<T> {
  return { data, message, count };
}

/**
 * Function to create an error API response
 */
export function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return { category, message, details };
}

/**
 * Type guard to check if a response is an error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return 'category' in response;
}

/**
 * Type guard to check if a response is successful
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response;
}
