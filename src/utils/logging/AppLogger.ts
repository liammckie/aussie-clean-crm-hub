
import { LogCategory } from './LogCategory';
import { LogLevel } from './LogLevel';

export type LogEntry = {
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  context?: Record<string, any>;
};

// Create a standard logger that can be used across the application
class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  constructor() {
    // Initialize logger
    console.info('Logger initialized');
  }

  /**
   * Log a debug message
   */
  debug(category: LogCategory, message: string, data?: any, context?: Record<string, any>): void {
    this.logWithLevel(LogLevel.DEBUG, category, message, data, context);
  }

  /**
   * Log an info message
   */
  info(category: LogCategory, message: string, data?: any, context?: Record<string, any>): void {
    this.logWithLevel(LogLevel.INFO, category, message, data, context);
  }

  /**
   * Log a warning message
   */
  warn(category: LogCategory, message: string, data?: any, context?: Record<string, any>): void {
    this.logWithLevel(LogLevel.WARN, category, message, data, context);
  }

  /**
   * Log an error message
   */
  error(category: LogCategory, message: string, data?: any, context?: Record<string, any>): void {
    this.logWithLevel(LogLevel.ERROR, category, message, data, context);
  }

  /**
   * Log a critical message
   */
  critical(category: LogCategory, message: string, data?: any, context?: Record<string, any>): void {
    this.logWithLevel(LogLevel.CRITICAL, category, message, data, context);
  }
  
  /**
   * Main log method (compatible with older code)
   */
  log(category: LogCategory, message: string, data?: any, context?: Record<string, any>): void {
    this.logWithLevel(LogLevel.INFO, category, message, data, context);
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Log with specific level
   */
  private logWithLevel(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any,
    context?: Record<string, any>
  ): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      context
    };

    // Add to in-memory logs
    this.logs.push(entry);

    // Trim logs if they exceed max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console
    this.consoleLog(entry);

    // TODO: In a production app, we might send critical logs to a monitoring service
  }

  /**
   * Format log for console
   */
  private consoleLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level}] [${entry.category}]:`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(prefix, entry.message, entry.data || '');
        break;
    }
  }
}

// Export a singleton instance of the logger
export const AppLogger = new Logger();
