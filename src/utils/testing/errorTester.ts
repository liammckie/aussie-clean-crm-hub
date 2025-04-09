
import { AppLogger, LogCategory } from "@/utils/logging";
import { ErrorReporting } from "@/utils/errorReporting";

/**
 * Utility to test error reporting and handling in the application
 */
export class ErrorTester {
  /**
   * Generate a test error to verify error handling
   * @param message Custom error message
   * @param context Additional context for the error
   */
  static generateTestError(message = "This is a test error", context?: Record<string, any>): void {
    try {
      AppLogger.info(LogCategory.SYSTEM, "Generating test error for validation", {
        message,
        context,
        timestamp: new Date().toISOString()
      });
      
      // Generate an error to test error handling
      throw new Error(message);
    } catch (error) {
      if (error instanceof Error) {
        // Report the error to ErrorReporting system
        ErrorReporting.captureException(error, {
          testError: true,
          context: context || {},
          source: "ErrorTester.generateTestError"
        });
        
        // Log the test error
        AppLogger.error(LogCategory.SYSTEM, `Test error generated: ${error.message}`, {
          stack: error.stack,
          context
        });
      }
    }
  }
  
  /**
   * Generate a test message to verify message logging
   * @param message Custom message text
   * @param level Message severity level
   */
  static generateTestMessage(
    message = "This is a test message", 
    level: "info" | "warning" | "error" = "info"
  ): void {
    AppLogger.info(LogCategory.SYSTEM, "Sending test message", { message, level });
    ErrorReporting.captureMessage(message, level);
  }
  
  /**
   * Generate test feedback to verify feedback logging
   * @param feedback Feedback text
   * @param category Feedback category
   */
  static generateTestFeedback(
    feedback = "This is test feedback", 
    category = "test"
  ): void {
    AppLogger.info(LogCategory.SYSTEM, "Sending test feedback", { feedback, category });
    ErrorReporting.captureFeedback(feedback, category, {
      source: "ErrorTester",
      timestamp: new Date().toISOString()
    });
  }
}
