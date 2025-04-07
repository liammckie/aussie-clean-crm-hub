
import { AppLogger } from './logger';
import { LogCategory } from './LogCategory';

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
  static end(operationName: string, additionalData: Record<string, any> = {}): void {
    const startTime = this.timers[operationName];
    if (startTime === undefined) {
      AppLogger.warn(
        LogCategory.PERFORMANCE,
        `Cannot end timing for '${operationName}' - no start time recorded`
      );
      return;
    }
    
    const duration = performance.now() - startTime;
    delete this.timers[operationName];
    
    AppLogger.info(
      LogCategory.PERFORMANCE,
      `Operation '${operationName}' completed in ${duration.toFixed(2)}ms`,
      { ...additionalData, duration }
    );
  }
  
  /**
   * Wrap a function with performance tracking
   */
  static track<T>(name: string, fn: () => T): T {
    this.start(name);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name, { error });
      throw error;
    }
  }
  
  /**
   * Wrap an async function with performance tracking
   */
  static async trackAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name, { error });
      throw error;
    }
  }
  
  /**
   * Clear all timers
   */
  static clearAll(): void {
    this.timers = {};
  }
}
