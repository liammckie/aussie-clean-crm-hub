
import { LogLevel, LogCategory, LogEntry } from './types';

// Enable or disable verbose logging based on environment
const VERBOSE = import.meta.env.DEV || import.meta.env.MODE === 'development';

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
 * Application logger
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
