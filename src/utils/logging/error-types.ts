
/**
 * Error categories for standardized error responses
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  PERMISSION = 'permission', // Add this for backward compatibility
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  SERVER = 'server',
  DATABASE = 'database',
  INPUT = 'input',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
  EXTERNAL_SERVICE = 'external_service'
}
