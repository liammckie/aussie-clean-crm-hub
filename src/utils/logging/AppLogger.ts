
import { LogCategory } from './LogCategory';
import { LogLevel } from './LogLevel';

export type LogMetadata = Record<string, any>;

/**
 * Application logger - centralized logging utility
 */
export class AppLogger {
  private static logs: Array<{
    level: LogLevel;
    category: LogCategory;
    message: string;
    metadata?: LogMetadata;
    timestamp: string;
  }> = [];

  /**
   * Log debug level message
   */
  static debug(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log(LogLevel.DEBUG, category, message, metadata);
  }

  /**
   * Log info level message
   */
  static info(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log(LogLevel.INFO, category, message, metadata);
  }

  /**
   * Log warn level message
   */
  static warn(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log(LogLevel.WARN, category, message, metadata);
  }

  /**
   * Log error level message
   */
  static error(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log(LogLevel.ERROR, category, message, metadata);
  }

  /**
   * Internal logging method
   */
  private static log(level: LogLevel, category: LogCategory, message: string, metadata?: LogMetadata): void {
    const timestamp = new Date().toISOString();
    
    // Add to memory logs
    AppLogger.logs.push({
      level,
      category,
      message,
      metadata,
      timestamp
    });
    
    // Console output for development
    const logData = metadata ? { metadata } : {};
    const colorMap = {
      [LogLevel.DEBUG]: 'color: #6c757d',
      [LogLevel.INFO]: 'color: #0d6efd',
      [LogLevel.WARN]: 'color: #fd7e14',
      [LogLevel.ERROR]: 'color: #dc3545'
    };
    
    console.groupCollapsed(
      `%c${level} | ${category} | ${timestamp}`, 
      colorMap[level]
    );
    console.log(`📝 ${message}`);
    if (metadata) {
      console.log('📊 Metadata:', metadata);
    }
    console.groupEnd();
    
    // In production, this would send to a logging service
  }

  /**
   * Get all logs
   */
  static getLogs() {
    return [...AppLogger.logs];
  }
  
  /**
   * Clear logs - used for testing
   */
  static clearLogs(): void {
    AppLogger.logs = [];
  }
}
