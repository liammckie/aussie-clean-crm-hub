
import { LogCategory } from './LogCategory';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

/**
 * Application logger that provides consistent logging with categories
 * and filtering capabilities
 */
export class AppLogger {
  /**
   * Log a debug message
   */
  static debug(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log('debug', category, message, metadata);
  }
  
  /**
   * Log an info message
   */
  static info(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log('info', category, message, metadata);
  }
  
  /**
   * Log a warning message
   */
  static warn(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log('warn', category, message, metadata);
  }
  
  /**
   * Log an error message
   */
  static error(category: LogCategory, message: string, metadata?: LogMetadata): void {
    AppLogger.log('error', category, message, metadata);
  }
  
  /**
   * Internal logging method with consistent formatting
   */
  private static log(level: LogLevel, category: LogCategory, message: string, metadata?: LogMetadata): void {
    const timestamp = new Date().toISOString();
    const logObject = {
      timestamp,
      level,
      category,
      message,
      ...(metadata || {})
    };
    
    switch (level) {
      case 'debug':
        console.debug(`[${timestamp}] [${level.toUpperCase()}] [${category}]`, message, metadata || '');
        break;
      case 'info':
        console.info(`[${timestamp}] [${level.toUpperCase()}] [${category}]`, message, metadata || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] [${level.toUpperCase()}] [${category}]`, message, metadata || '');
        break;
      case 'error':
        console.error(`[${timestamp}] [${level.toUpperCase()}] [${category}]`, message, metadata || '');
        break;
    }
  }
}
