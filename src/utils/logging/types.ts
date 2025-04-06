
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
  DEBUG = 'debug',
  APPLICATION = 'application',
  UI = 'ui',
  DATABASE = 'database',
  STORAGE = 'storage',
  CACHE = 'cache',
  WORK_ORDER = 'work_order',
  FINANCIAL = 'financial'
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
  data?: any;
  details?: any;
  userId?: string;
  context?: Record<string, any>;
}
