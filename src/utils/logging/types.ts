
import { LogCategory } from './LogCategory';
import { LogLevel } from './LogLevel';

/**
 * Re-export LogCategory and LogLevel to ensure consistent usage
 */
export { LogCategory, LogLevel };

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
