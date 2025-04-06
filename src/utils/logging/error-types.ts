
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
