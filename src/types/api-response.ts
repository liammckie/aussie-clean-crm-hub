
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Successful API response
 */
export interface ApiSuccessResponse<T> {
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
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if response is successful
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response;
}

/**
 * Type guard to check if response is an error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return 'category' in response;
}

/**
 * Helper function to create a success response
 */
export function createSuccessResponse<T>(data: T, message: string, count?: number): ApiSuccessResponse<T> {
  return { data, message, ...(count !== undefined ? { count } : {}) };
}

/**
 * Helper function to create an error response
 */
export function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return { category, message, ...(details ? { details } : {}) };
}

/**
 * Helper to normalize API response for components
 * @param response API response object
 * @returns Normalized response for UI components
 */
export function normalizeApiResponse<T>(response: ApiResponse<T>) {
  if (isApiSuccess(response)) {
    return {
      data: response.data,
      error: null,
      isSuccess: true,
      message: response.message
    };
  } else {
    return {
      data: null,
      error: {
        category: response.category,
        message: response.message,
        details: response.details
      },
      isSuccess: false,
      message: response.message
    };
  }
}
