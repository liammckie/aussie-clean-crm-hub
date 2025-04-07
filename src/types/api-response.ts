
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  category: ErrorCategory | string;
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
export function isApiError<T>(response: ApiResponse<T> | any): response is ApiErrorResponse {
  return response && 'category' in response;
}

/**
 * Type guard to check if a response is a success
 */
export function isApiSuccess<T>(response: ApiResponse<T> | any): response is ApiSuccessResponse<T> {
  return response && 'data' in response && 'message' in response;
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
  category: ErrorCategory | string,
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
 * Normalize any API response to a standard ApiResponse format
 */
export function normalizeApiResponse<T>(
  response: { data: T, error?: any, message?: string } | { error: any } | ApiResponse<T> | any
): ApiResponse<T> {
  // If it's already a proper API response with category, return it
  if ('category' in response) {
    // Make sure it has a message
    if (!('message' in response)) {
      return {
        ...response,
        message: 'An error occurred'
      };
    }
    return response as ApiErrorResponse;
  }
  
  // If it's already a proper success response with data and message, return it
  if ('data' in response && 'message' in response) {
    return response as ApiSuccessResponse<T>;
  }
  
  // If it has data but no message, add a default message
  if ('data' in response) {
    return {
      data: response.data,
      message: 'Operation successful'
    };
  }
  
  // If it has an error, convert to error response
  if ('error' in response) {
    return {
      category: ErrorCategory.UNKNOWN,
      message: response.error?.message || 'An error occurred',
      details: response.error
    };
  }
  
  // Return unknown error if response doesn't match any pattern
  return {
    category: ErrorCategory.UNKNOWN,
    message: 'Invalid response format',
    details: { response }
  };
}

/**
 * Helper function to safely access data from any API response
 */
export function safeGetData<T>(response: ApiResponse<T> | any): T | undefined {
  if (response && 'data' in response) {
    return response.data;
  }
  return undefined;
}

// Re-export ErrorCategory for convenience
export { ErrorCategory };
