
/**
 * Standard API response types
 */

import { ErrorCategory } from '@/utils/logging/error-types';

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

// Function to normalize different response formats to a standard ApiResponse
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
