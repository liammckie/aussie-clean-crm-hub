
/**
 * Standard error categories for consistent error handling across the application
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  PERMISSION = 'permission',
  SERVER = 'server',
  DATABASE = 'database',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  STORAGE = 'storage',
  UNKNOWN = 'unknown'
}

// String literal types for backward compatibility
export type ErrorCategoryString = 
  | 'validation'
  | 'not_found'
  | 'permission'
  | 'server'
  | 'database'
  | 'network'
  | 'authentication'
  | 'storage'
  | 'unknown';

// Helper to convert string to enum
export function toErrorCategory(category: string): ErrorCategory {
  switch (category) {
    case 'validation': return ErrorCategory.VALIDATION;
    case 'not_found': return ErrorCategory.NOT_FOUND;
    case 'permission': return ErrorCategory.PERMISSION;
    case 'server': return ErrorCategory.SERVER;
    case 'database': return ErrorCategory.DATABASE;
    case 'network': return ErrorCategory.NETWORK;
    case 'authentication': return ErrorCategory.AUTHENTICATION;
    case 'storage': return ErrorCategory.STORAGE;
    default: return ErrorCategory.UNKNOWN;
  }
}
