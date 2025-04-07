
/**
 * Standardized error categories for the application
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  AUTHENTICATION = 'authentication',
  SERVER = 'server',
  DATABASE = 'database',
  NOT_FOUND = 'not_found',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
  CLIENT = 'client',
  CONFLICT = 'conflict',
  AUTHORIZATION = 'authorization'
}

/**
 * Type guard to check if a string is a valid ErrorCategory
 * @param value The string to check
 * @returns Whether the string is a valid ErrorCategory
 */
export function isValidErrorCategory(value: string): value is ErrorCategory {
  return Object.values(ErrorCategory).includes(value as ErrorCategory);
}

/**
 * Map error status codes to error categories
 * @param statusCode HTTP status code
 * @returns Appropriate ErrorCategory
 */
export function getErrorCategoryFromStatus(statusCode: number): ErrorCategory {
  switch (true) {
    case statusCode >= 400 && statusCode < 500:
      if (statusCode === 401 || statusCode === 403) {
        return ErrorCategory.AUTHENTICATION;
      } else if (statusCode === 404) {
        return ErrorCategory.NOT_FOUND;
      } else if (statusCode === 422) {
        return ErrorCategory.VALIDATION;
      } else if (statusCode === 409) {
        return ErrorCategory.CONFLICT;
      }
      return ErrorCategory.PERMISSION;
    case statusCode >= 500:
      return ErrorCategory.SERVER;
    default:
      return ErrorCategory.UNKNOWN;
  }
}

/**
 * Standardized application error class
 */
export class AppError extends Error {
  category: ErrorCategory;
  details?: Record<string, any>;
  
  constructor(
    message: string, 
    category: ErrorCategory = ErrorCategory.UNKNOWN, 
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.category = category;
    this.details = details;
  }
}
