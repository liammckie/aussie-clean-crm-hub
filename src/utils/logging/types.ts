
/**
 * Log categories for application logging
 */
export enum LogCategory {
  GENERAL = 'general',
  AUTH = 'auth',
  USER = 'user',
  CLIENT = 'client',
  SITE = 'site',
  CONTRACT = 'contract',
  SUPPLIER = 'supplier',
  SUPPLIER_CONTRACT = 'supplier_contract',
  BILLING = 'billing',
  API = 'api',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  DEBUG = 'debug'
}

/**
 * Log levels for application logging
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Log entry interface for application logging
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: any;
  userId?: string;
}
