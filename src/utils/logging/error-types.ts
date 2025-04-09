
// Define error categories for consistent error handling throughout the application
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTH = 'auth',
  SERVER = 'server',
  DATABASE = 'database',
  NOT_FOUND = 'not_found',
  BUSINESS_LOGIC = 'business_logic',
  PERMISSION = 'permission',
  CONFLICT = 'conflict',  // Added for Supabase unique constraint errors
  AUTHORIZATION = 'authorization', // Added for permission-related errors
  UNKNOWN = 'unknown'  // Added for unclassified errors
}

// Interface for application errors with consistent structure
export interface ApplicationError {
  category: ErrorCategory;
  message: string;
  details?: Record<string, any>;
}

/**
 * Type guard to check if an unknown value is an ApplicationError
 * @param error The value to check
 * @returns true if the value conforms to the ApplicationError interface
 */
export function isApplicationError(error: unknown): error is ApplicationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    'message' in error &&
    typeof (error as ApplicationError).message === 'string' &&
    Object.values(ErrorCategory).includes((error as ApplicationError).category)
  );
}
