
import { LogCategory } from './LogCategory';
import { LogLevel } from './LogLevel';
import type { LogEntry } from './types';

/**
 * Application logger service
 */
export class AppLogger {
  private static logs: LogEntry[] = [];
  
  /**
   * Log at debug level
   */
  static debug(category: LogCategory, message: string, data?: any): void {
    AppLogger.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Log at info level
   */
  static info(category: LogCategory, message: string, data?: any): void {
    AppLogger.log(LogLevel.INFO, category, message, data);
  }

  /**
   * Log at warn level
   */
  static warn(category: LogCategory, message: string, data?: any): void {
    AppLogger.log(LogLevel.WARN, category, message, data);
  }

  /**
   * Log at error level
   */
  static error(category: LogCategory, message: string, data?: any): void {
    AppLogger.log(LogLevel.ERROR, category, message, data);
  }

  /**
   * Generic log method
   */
  static log(level: LogLevel, category: LogCategory, message: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data
    };

    // Add to internal logs array for testing purposes
    AppLogger.logs.push(logEntry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(logEntry);
        break;
      case LogLevel.WARN:
        console.warn(logEntry);
        break;
      case LogLevel.DEBUG:
        console.debug(logEntry);
        break;
      case LogLevel.INFO:
      default:
        console.info(logEntry);
    }
  }

  /**
   * Clear all logs (useful for testing)
   */
  static clearLogs(): void {
    AppLogger.logs = [];
  }

  /**
   * Get all logs (useful for testing)
   */
  static getLogs(): LogEntry[] {
    return [...AppLogger.logs];
  }
}
