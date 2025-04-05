
/**
 * Utility for enhanced debugging and logging
 * @deprecated Use modules from src/utils/logging instead
 */

import { AppLogger, LogLevel, LogCategory, PerformanceTracker } from './logging';

// Re-export for backward compatibility
export { LogLevel, LogCategory, PerformanceTracker };

// Re-export the logger for backward compatibility
export { AppLogger };
