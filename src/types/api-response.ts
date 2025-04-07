
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
  code?: string;
  status?: number;
}

/**
 * Standard API success response shape
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number; // Optional for pagination results
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
  return 'data' in response && 'message' in response;
}

/**
 * Helper for creating a standardized success response
 */
export function createSuccessResponse<T>(data: T, message: string = 'Operation successful', count?: number): ApiSuccessResponse<T> {
  const response: ApiSuccessResponse<T> = {
    data,
    message
  };
  
  if (count !== undefined) {
    response.count = count;
  }
  
  return response;
}

/**
 * Helper for creating a standardized error response
 */
export function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>,
  code?: string,
  status?: number
): ApiErrorResponse {
  const response: ApiErrorResponse = {
    category,
    message
  };
  
  if (details) {
    response.details = details;
  }
  
  if (code) {
    response.code = code;
  }
  
  if (status) {
    response.status = status;
  }
  
  return response;
}

/**
 * Helper for formatting an error with a specific category
 */
export function formatError(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return createErrorResponse(category, message, details);
}

// Re-export ErrorCategory for convenience
export { ErrorCategory };
