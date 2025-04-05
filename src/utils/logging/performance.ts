
import { AppLogger } from './logger';
import { LogCategory } from './types';

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
