
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
