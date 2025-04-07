
import { LogCategory as AppLogCategory } from './LogCategory';

/**
 * Re-export LogCategory to ensure consistent usage
 */
export type LogCategory = AppLogCategory;

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
