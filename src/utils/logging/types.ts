
/**
 * Shared types for the logging system
 */

/**
 * Log levels for categorizing log messages
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Log categories for organizing logs by domain
 */
export enum LogCategory {
  CONTRACT = 'contract',
  CLIENT = 'client',
  SITE = 'site',
  API = 'api',
  UI = 'ui',
  AUTH = 'auth',
  DATA = 'data',
  PERFORMANCE = 'performance',
  CACHE = 'cache',
  SUPPLIER = 'supplier'
}

/**
 * Structure for a log entry
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  context?: Record<string, any>;
}
