
/**
 * Error categories for consistent error handling
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  AUTH = 'auth',
  AUTHORIZATION = 'authorization',
  DATABASE = 'database',
  NETWORK = 'network',
  SERVER = 'server',
  UNKNOWN = 'unknown',
  // Add missing category
  PERMISSION = 'permission'
}
