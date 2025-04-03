
import * as Sentry from "@sentry/react";

/**
 * Utility class for error reporting to Sentry
 */
export class ErrorReporting {
  /**
   * Capture and report an error to Sentry
   * 
   * @param error The error to report
   * @param context Additional context data for the error
   * @param level The severity level of the error
   */
  static captureException(
    error: Error | string, 
    context?: Record<string, any>, 
    level: Sentry.SeverityLevel = "error"
  ) {
    // Don't report in development mode
    if (!import.meta.env.PROD) {
      console.error("Error:", error);
      if (context) console.error("Context:", context);
      return;
    }

    // Create the error object if a string was passed
    const errorObj = typeof error === "string" ? new Error(error) : error;

    // Set the scope with additional context
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      
      Sentry.captureException(errorObj);
    });
  }

  /**
   * Capture a message in Sentry
   * 
   * @param message The message to capture
   * @param context Additional context data for the message
   * @param level The severity level of the message
   */
  static captureMessage(
    message: string, 
    context?: Record<string, any>, 
    level: Sentry.SeverityLevel = "info"
  ) {
    // Don't report in development mode
    if (!import.meta.env.PROD) {
      console.log("Message:", message);
      if (context) console.log("Context:", context);
      return;
    }

    Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      
      Sentry.captureMessage(message);
    });
  }

  /**
   * Set user information for Sentry tracking
   * 
   * @param user User information including id, email, etc.
   */
  static setUser(user: Sentry.User | null) {
    Sentry.setUser(user);
  }
}
