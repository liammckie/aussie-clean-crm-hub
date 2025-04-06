
import { ErrorResponse } from '@/utils/supabaseErrors';

/**
 * Type definitions for API responses in tests
 */
export interface SuccessResponse<T = any> { 
  data: T; 
  error: null;
}

export interface ValidationErrorResponse {
  category: 'validation';
  message: string;
  details?: {
    field?: string;
    error?: string;
  };
}

/**
 * Union type for API responses
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Type guard to check if a response is a success response
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return 'data' in response && response.error === null;
}

/**
 * Type guard to check if a response is an error response
 */
export function isErrorResponse(response: ApiResponse<any>): response is ErrorResponse {
  return 'category' in response && 'message' in response;
}

/**
 * Creates a success response with the given data
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return { data, error: null };
}

/**
 * Creates an error response with the given details
 */
export function createErrorResponse(
  category: string,
  message: string,
  details?: any
): ErrorResponse {
  return { category, message, details };
}

/**
 * Helper to create a mock function that returns a success response
 */
export function createMockSuccessFunction<T>(data: T) {
  return jest.fn().mockResolvedValue(createSuccessResponse(data));
}

/**
 * Helper to create a mock function that returns an error response
 */
export function createMockErrorFunction(category: string, message: string, details?: any) {
  return jest.fn().mockResolvedValue(createErrorResponse(category, message, details));
}
