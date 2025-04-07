
/**
 * Re-export all logging utilities from the modular system
 */

export { LogLevel } from './logging/LogLevel';
export { LogCategory } from './logging/LogCategory';
export { AppLogger } from './logging/AppLogger';
export type { LogEntry } from './logging/types';
export { ErrorCategory } from './logging/error-types';
export { PerformanceTracker } from './logging/performance';
export { withCache, invalidateByTag, clearCache } from './logging/cache-wrapper';
export { Cache } from './caching/cache';

// Do not export cache-functions since cache-wrapper is the consolidated version
