
/**
 * Standard API response types
 */

// Error categories for consistent error handling
export type ErrorCategory = 'validation' | 'permission' | 'server' | 'not_found' | 'auth' | 'database';

// Success response structure
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number; // Optional count for collections
}

// Error response structure
export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
}

// Unified API response type
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper function to create a success response
export function createSuccessResponse<T>(data: T, message: string, count?: number): ApiSuccessResponse<T> {
  return {
    data,
    message,
    ...(count !== undefined ? { count } : {})
  };
}

// Helper function to create an error response
export function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return {
    category,
    message,
    ...(details ? { details } : {})
  };
}

// Type guard to check if a response is a success
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response;
}

// Type guard to check if a response is an error
export function isApiError(response: ApiResponse<any>): response is ApiErrorResponse {
  return 'category' in response;
}
