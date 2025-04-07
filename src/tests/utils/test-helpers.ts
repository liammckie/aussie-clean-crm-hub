
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, createErrorResponse, createSuccessResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Re-export the centralized API response types for tests
 */
export type {
  ApiResponse,
  ApiSuccessResponse as SuccessResponse,
  ApiErrorResponse as ErrorResponse
};

/**
 * Re-export the type guards from the centralized types
 */
export { isApiError as isErrorResponse, isApiSuccess as isSuccessResponse } from '@/types/api-response';

/**
 * Re-export the response creation helpers
 */
export { createSuccessResponse, createErrorResponse };
