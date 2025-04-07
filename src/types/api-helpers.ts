
import { ApiResponse, ApiErrorResponse, ApiSuccessResponse, isApiError } from '@/types/api-response';

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
export function safelyGetResponseData<T>(response: ApiResponse<T> | { data: T } | { error: any }): T | undefined {
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
  response: { data: T, error?: any } | { error: any } | ApiResponse<T>
): ApiResponse<T> {
  if ('category' in response) {
    return response as ApiErrorResponse;
  }
  
  if ('data' in response && 'message' in response) {
    return response as ApiSuccessResponse<T>;
  }
  
  if ('data' in response) {
    return {
      data: response.data,
      message: 'Operation successful'
    };
  }
  
  if ('error' in response) {
    return {
      category: 'server',
      message: response.error?.message || 'An error occurred',
      details: response.error
    };
  }
  
  return {
    category: 'unknown',
    message: 'Invalid response format',
    details: { response }
  };
}
