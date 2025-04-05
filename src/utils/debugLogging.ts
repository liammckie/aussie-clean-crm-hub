
/**
 * Utility for enhanced debugging and logging
 */

// Enable or disable verbose logging based on environment
const VERBOSE = import.meta.env.DEV || import.meta.env.MODE === 'development';

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
  PERFORMANCE = 'performance'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  context?: Record<string, any>;
}

// Store recent logs in memory for debugging
const recentLogs: LogEntry[] = [];
const MAX_LOG_ENTRIES = 100;

/**
 * Format a log entry for display
 */
const formatLogEntry = (entry: LogEntry): string => {
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`;
};

/**
 * Add an entry to the recent logs array
 */
const addLogEntry = (entry: LogEntry): void => {
  // Add to recent logs with limited size
  recentLogs.push(entry);
  if (recentLogs.length > MAX_LOG_ENTRIES) {
    recentLogs.shift();
  }
  
  // Output to console based on level
  const formattedMessage = formatLogEntry(entry);
  
  switch (entry.level) {
    case LogLevel.DEBUG:
      if (VERBOSE) console.debug(formattedMessage, entry.data || '');
      break;
    case LogLevel.INFO:
      console.info(formattedMessage, entry.data || '');
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage, entry.data || '');
      break;
    case LogLevel.ERROR:
      console.error(formattedMessage, entry.data || '');
      break;
  }
};

/**
 * Create a log entry
 */
const createLog = (
  level: LogLevel,
  category: LogCategory,
  message: string,
  data?: any,
  context?: Record<string, any>
): LogEntry => {
  return {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    data,
    context
  };
};

/**
 * Debug logger object
 */
export const AppLogger = {
  debug: (category: LogCategory, message: string, data?: any, context?: Record<string, any>) => {
    addLogEntry(createLog(LogLevel.DEBUG, category, message, data, context));
  },
  
  info: (category: LogCategory, message: string, data?: any, context?: Record<string, any>) => {
    addLogEntry(createLog(LogLevel.INFO, category, message, data, context));
  },
  
  warn: (category: LogCategory, message: string, data?: any, context?: Record<string, any>) => {
    addLogEntry(createLog(LogLevel.WARN, category, message, data, context));
  },
  
  error: (category: LogCategory, message: string, data?: any, context?: Record<string, any>) => {
    addLogEntry(createLog(LogLevel.ERROR, category, message, data, context));
  },
  
  getRecentLogs: (): LogEntry[] => {
    return [...recentLogs];
  },
  
  getRecentLogsByCategory: (category: LogCategory): LogEntry[] => {
    return recentLogs.filter(log => log.category === category);
  },
  
  getRecentLogsByLevel: (level: LogLevel): LogEntry[] => {
    return recentLogs.filter(log => log.level === level);
  },
  
  clearLogs: (): void => {
    recentLogs.length = 0;
  }
};

/**
 * Performance tracking utility
 */
export class PerformanceTracker {
  private static timers: Record<string, number> = {};
  
  /**
   * Start timing an operation
   */
  static start(operationName: string): void {
    AppLogger.debug(LogCategory.PERFORMANCE, `Starting operation: ${operationName}`);
    this.timers[operationName] = performance.now();
  }
  
  /**
   * End timing an operation and log the result
   */
  static end(operationName: string, additionalContext?: Record<string, any>): number {
    if (!this.timers[operationName]) {
      AppLogger.warn(
        LogCategory.PERFORMANCE, 
        `Attempted to end timing for operation that was never started: ${operationName}`
      );
      return 0;
    }
    
    const startTime = this.timers[operationName];
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    AppLogger.info(
      LogCategory.PERFORMANCE, 
      `Operation ${operationName} completed in ${duration.toFixed(2)}ms`,
      { duration, ...additionalContext }
    );
    
    delete this.timers[operationName];
    return duration;
  }
  
  /**
   * Track the execution time of an async function
   */
  static async trackAsync<T>(
    operationName: string, 
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    this.start(operationName);
    try {
      const result = await fn();
      this.end(operationName, context);
      return result;
    } catch (error) {
      this.end(operationName, { ...context, error: true });
      throw error;
    }
  }
  
  /**
   * Track the execution time of a synchronous function
   */
  static track<T>(
    operationName: string, 
    fn: () => T,
    context?: Record<string, any>
  ): T {
    this.start(operationName);
    try {
      const result = fn();
      this.end(operationName, context);
      return result;
    } catch (error) {
      this.end(operationName, { ...context, error: true });
      throw error;
    }
  }
}
