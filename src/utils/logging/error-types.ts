
export enum ErrorCategory {
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  SERVER = 'server',
  NOT_FOUND = 'not_found',
  AUTH = 'auth',
  DATABASE = 'database',
  BUSINESS_RULE = 'business_rule',
  UNKNOWN = 'unknown',
  CONFLICT = 'conflict',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization'
}

// Add a helper function to convert enum to string type
export function toErrorCategory(category: ErrorCategory): string {
  return category.toString();
}

/**
 * Standard error structure for application errors
 */
export interface ApplicationError {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
  originalError?: unknown;
}

/**
 * Create a standard application error
 */
export function createAppError(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>,
  originalError?: unknown
): ApplicationError {
  return {
    category,
    message,
    details,
    originalError
  };
}

/**
 * Type guard to check if an error is an ApplicationError
 */
export function isApplicationError(error: unknown): error is ApplicationError {
  return typeof error === 'object' && 
         error !== null && 
         'category' in error && 
         'message' in error;
}
