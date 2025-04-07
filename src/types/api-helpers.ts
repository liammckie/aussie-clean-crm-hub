
import { ApiResponse, ApiErrorResponse, ApiSuccessResponse, isApiError } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Type guard to safely check if a response has data
 */
export function hasApiResponseData<T>(response: any): response is ApiSuccessResponse<T> {
  return response && 'data' in response && response.data !== undefined;
}

/**
 * Type guard for checking API response error
 */
export function isResponseWithError(response: any): response is { error: any } {
  return response && 'error' in response && response.error !== null;
}

/**
 * Safely extract data from API responses, returning undefined if not available
 */
export function safelyGetResponseData<T>(response: ApiResponse<T> | { data: T } | { error: any } | any): T | undefined {
  if ('data' in response) {
    return response.data;
  }
  return undefined;
}

/**
 * Apply interface augmentation to add missing methods to Array-like responses
 */
export function ensureArrayMethods<T>(response: any): T[] {
  if (!response) return [];
  
  if (Array.isArray(response)) {
    return response;
  }
  
  if ('data' in response) {
    return Array.isArray(response.data) ? response.data : [];
  }
  
  return [];
}

/**
 * Convert any API response to a standard ApiResponse format
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
      category: ErrorCategory.SERVER,
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
