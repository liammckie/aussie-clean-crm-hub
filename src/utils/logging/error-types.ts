
import { LogCategory } from './types';

/**
 * Standard error categories for API responses
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  DATABASE = 'database',
  SERVER = 'server',
  NETWORK = 'network',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  category: ErrorCategory;
  message: string;
  details?: any;
  code?: string;
  status?: number;
}

/**
 * Standard API success response shape
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number; // Optional count for paginated responses
}

/**
 * Union type for API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if a response is an error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return 'category' in response;
}

/**
 * Type guard to check if a response is a success
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response;
}

/**
 * Helper for formatting errors into a standard API error response
 */
export function formatError(
  category: ErrorCategory | string, 
  message: string, 
  details?: any,
  status?: number
): ApiErrorResponse {
  // Convert string categories to enum values
  let errorCategory: ErrorCategory;
  if (typeof category === 'string') {
    switch (category.toLowerCase()) {
      case 'validation': errorCategory = ErrorCategory.VALIDATION; break;
      case 'authentication': errorCategory = ErrorCategory.AUTHENTICATION; break;
      case 'permission': errorCategory = ErrorCategory.PERMISSION; break;
      case 'not_found': errorCategory = ErrorCategory.NOT_FOUND; break;
      case 'database': errorCategory = ErrorCategory.DATABASE; break;
      case 'server': errorCategory = ErrorCategory.SERVER; break;
      case 'network': errorCategory = ErrorCategory.NETWORK; break;
      case 'client': errorCategory = ErrorCategory.CLIENT; break;
      default: errorCategory = ErrorCategory.UNKNOWN;
    }
  } else {
    errorCategory = category;
  }
  
  return {
    category: errorCategory,
    message,
    details,
    status
  };
}

/**
 * Maps an API error category to a log category
 */
export function mapErrorCategoryToLogCategory(errorCategory: ErrorCategory): LogCategory {
  switch (errorCategory) {
    case ErrorCategory.AUTHENTICATION: return LogCategory.AUTH;
    case ErrorCategory.DATABASE: return LogCategory.DATABASE;
    case ErrorCategory.VALIDATION: return LogCategory.GENERAL;
    case ErrorCategory.PERMISSION: return LogCategory.AUTH;
    case ErrorCategory.NOT_FOUND: return LogCategory.GENERAL;
    case ErrorCategory.NETWORK: return LogCategory.API;
    case ErrorCategory.SERVER: return LogCategory.API;
    case ErrorCategory.CLIENT: return LogCategory.UI;
    default: return LogCategory.ERROR;
  }
}
