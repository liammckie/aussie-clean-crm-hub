
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Interface for API success response structure
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number;
}

/**
 * Interface for API error response structure
 */
export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
}

/**
 * Union type for API response
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: any): response is ApiErrorResponse {
  return response && 'category' in response && typeof response.category === 'string';
}

/**
 * Type guard to check if response is a success
 */
export function isApiSuccess<T>(response: any): response is ApiSuccessResponse<T> {
  return response && 'data' in response && !('category' in response);
}

/**
 * Helper to create standardized success response
 */
export function createSuccessResponse<T>(data: T, message: string): ApiSuccessResponse<T> {
  return {
    data,
    message
  };
}

/**
 * Helper to create standardized error response
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

/**
 * Helper to normalize inconsistent API responses to standard format
 */
export function normalizeApiResponse<T>(response: any): ApiResponse<T> {
  // Handle success responses
  if ('data' in response) {
    return {
      data: response.data,
      message: response.message || 'Operation successful'
    };
  }
  
  // Handle error responses
  if ('category' in response) {
    return {
      category: response.category,
      message: response.message || 'An error occurred',
      details: response.details
    };
  }
  
  // Handle legacy error responses
  if ('error' in response) {
    return {
      category: ErrorCategory.UNKNOWN,
      message: response.error || 'Unknown error occurred',
      details: response
    };
  }
  
  // Fall back for unrecognized responses
  return {
    category: ErrorCategory.UNKNOWN,
    message: 'Unexpected response format',
    details: { response }
  };
}
