
import { ErrorCategory } from '@/utils/logging/error-types';

export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number;
}

export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function isApiErrorResponse(response: any): response is ApiErrorResponse {
  return response && 'category' in response;
}

export function isApiSuccessResponse<T>(response: any): response is ApiSuccessResponse<T> {
  return response && 'data' in response;
}

export function createSuccessResponse<T>(
  data: T,
  message = 'Operation successful',
  count?: number
): ApiSuccessResponse<T> {
  return {
    data,
    message,
    ...(count !== undefined ? { count } : {})
  };
}

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
