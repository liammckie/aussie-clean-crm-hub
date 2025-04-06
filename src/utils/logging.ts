import { ErrorReporting } from './errorReporting';

/**
 * Application-wide logger with categories and levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LogCategory {
  UI = 'UI',
  API = 'API',
  AUTH = 'AUTH',
  PERFORMANCE = 'PERFORMANCE',
  CLIENT = 'CLIENT',
  SITE = 'SITE',
  CONTRACT = 'CONTRACT',
  SUPPLIER = 'SUPPLIER',
}

export class AppLogger {
  private static log(level: LogLevel, category: LogCategory, message: string, context?: any) {
    const logMessage = `[${new Date().toISOString()}] ${level.toUpperCase()} - ${category}: ${message}`;

    if (context) {
      console.log(logMessage, context);
    } else {
      console.log(logMessage);
    }

    if (level === LogLevel.ERROR) {
      ErrorReporting.captureException(new Error(message), {
        contexts: {
          category: category,
          context: context,
        },
      });
    }
  }

  static debug(category: LogCategory, message: string, context?: any) {
    if (process.env.NODE_ENV === 'development') {
      AppLogger.log(LogLevel.DEBUG, category, message, context);
    }
  }

  static info(category: LogCategory, message: string, context?: any) {
    AppLogger.log(LogLevel.INFO, category, message, context);
  }

  static warn(category: LogCategory, message: string, context?: any) {
    AppLogger.log(LogLevel.WARN, category, message, context);
  }

  static error(category: LogCategory, message: string, context?: any) {
    AppLogger.log(LogLevel.ERROR, category, message, context);
  }
}

/**
 * Performance tracking utility
 */
export class PerformanceTracker {
  private startTime: number;
  private category: LogCategory;
  private operationName: string;

  constructor(category: LogCategory, operationName: string) {
    this.startTime = performance.now();
    this.category = category;
    this.operationName = operationName;

    AppLogger.debug(
      LogCategory.PERFORMANCE,
      `Starting performance tracking for ${operationName}`
    );
  }

  stop() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    AppLogger.info(
      LogCategory.PERFORMANCE,
      `Performance: ${this.operationName} took ${duration.toFixed(2)}ms`,
      { duration }
    );
  }
}

/**
 * Cache wrapper utility
 */
interface CacheOptions {
  ttl: number;
  tag: string;
}

const cache = new Map<string, { data: any; expiry: number }>();

export async function withCache<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const cachedData = cache.get(cacheKey);

  if (cachedData && cachedData.expiry > Date.now()) {
    AppLogger.debug(
      LogCategory.PERFORMANCE,
      `Cache hit for ${cacheKey} (tag: ${options.tag})`
    );
    return cachedData.data as T;
  }

  AppLogger.debug(
    LogCategory.PERFORMANCE,
    `Cache miss for ${cacheKey} (tag: ${options.tag}), fetching data`
  );

  const data = await fn();
  cache.set(cacheKey, { data, expiry: Date.now() + options.ttl });

  // Basic cache invalidation (remove all entries with a given tag)
  // In a real-world scenario, use Redis/Memcached with proper pub/sub
  const invalidateCache = (tag: string) => {
    cache.forEach((value, key) => {
      if (key.includes(tag)) {
        cache.delete(key);
        AppLogger.info(
          LogCategory.PERFORMANCE,
          `Invalidated cache entry ${key} (tag: ${tag})`
        );
      }
    });
  };

  return data;
}
