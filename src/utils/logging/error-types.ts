
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
  AUTHENTICATION = 'authentication'
}

// Add a helper function to convert enum to string type
export function toErrorCategory(category: ErrorCategory): string {
  return category.toString();
}
