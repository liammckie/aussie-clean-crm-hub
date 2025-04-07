
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Successful API response
 */
export interface ApiSuccessResponse<T = any> {
  data: T;
  message: string;
  count?: number;
}

/**
 * Error API response
 */
export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
}

/**
 * Combined API response type
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Format error for consistent API responses
 */
export const formatError = (error: unknown, defaultMessage = 'An error occurred'): ApiErrorResponse => {
  if (typeof error === 'string') {
    return {
      category: ErrorCategory.UNKNOWN,
      message: error
    };
  }

  if (error instanceof Error) {
    return {
      category: ErrorCategory.UNKNOWN,
      message: error.message
    };
  }

  return {
    category: ErrorCategory.UNKNOWN,
    message: defaultMessage
  };
};

/**
 * Check if response is an API error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return 'category' in response;
}

/**
 * Check if response is a success response
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response;
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(data: T, message = 'Success'): ApiSuccessResponse<T> {
  return {
    data,
    message
  };
}

/**
 * Create an error response (this was missing)
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
 * Normalize API response for consistent format
 */
export function normalizeApiResponse<T>(response: any): ApiResponse<T> {
  // If the response already has the correct structure
  if ((response && 'data' in response && 'message' in response) || 
      (response && 'category' in response && 'message' in response)) {
    return response;
  }
  
  // If it's a plain data object, wrap it in a success response
  if (response && typeof response === 'object') {
    return {
      data: response,
      message: 'Success'
    };
  }
  
  // Default error response
  return {
    category: ErrorCategory.UNKNOWN,
    message: 'Unknown response format'
  };
}
