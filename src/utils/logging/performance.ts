
import { AppLogger } from './AppLogger';
import { LogCategory } from './LogCategory';

/**
 * Performance tracking utility
 */
export class PerformanceTracker {
  private startTime: number;
  private name: string;
  private thresholdMs: number;
  private data?: Record<string, any>;

  /**
   * Initialize a new performance tracker
   * @param name Name of the operation being tracked
   * @param thresholdMs Threshold in milliseconds after which to log a warning
   * @param data Additional data to include in the log
   */
  constructor(name: string, thresholdMs = 100, data?: Record<string, any>) {
    this.name = name;
    this.startTime = performance.now();
    this.thresholdMs = thresholdMs;
    this.data = data;
  }

  /**
   * End tracking and log the result
   * @param additionalData Additional data to include in the log
   */
  end(additionalData?: Record<string, any>): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    const logData = {
      ...this.data,
      ...additionalData,
      durationMs: duration,
      operation: this.name,
    };

    // Log as warning if duration exceeds threshold
    if (duration > this.thresholdMs) {
      AppLogger.warn(
        LogCategory.PERFORMANCE,
        `⚠️ Slow operation: ${this.name} took ${duration.toFixed(2)}ms`, 
        logData
      );
    } else {
      AppLogger.debug(
        LogCategory.PERFORMANCE,
        `✓ Operation completed: ${this.name} took ${duration.toFixed(2)}ms`, 
        logData
      );
    }

    return duration;
  }

  /**
   * Static method to track an async function
   * @param name Name of the operation being tracked
   * @param fn Function to track
   * @param thresholdMs Threshold in milliseconds
   * @param data Additional data to include in the log
   */
  static async trackAsync<T>(
    name: string, 
    fn: () => Promise<T>, 
    thresholdMs = 100, 
    data?: Record<string, any>
  ): Promise<T> {
    const tracker = new PerformanceTracker(name, thresholdMs, data);
    try {
      const result = await fn();
      tracker.end({ success: true });
      return result;
    } catch (error) {
      tracker.end({ success: false, error });
      throw error;
    }
  }
}
