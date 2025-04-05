
import * as Sentry from "@sentry/react";

/**
 * Utility class for error reporting to Sentry
 */
export class ErrorReporting {
  /**
   * Check if Sentry is initialized and ready to capture errors
   */
  static isInitialized(): boolean {
    return !!Sentry.getCurrentHub().getClient();
  }

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
    // Log in development mode
    if (typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.PROD) {
      console.error("Error:", error);
      if (context) console.error("Context:", context);
    }

    // Create the error object if a string was passed
    const errorObj = typeof error === "string" ? new Error(error) : error;

    // Check if Sentry is initialized before attempting to capture
    if (!ErrorReporting.isInitialized()) {
      console.warn("Sentry not initialized, error not reported to monitoring service");
      return;
    }

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
    // Log in development mode
    if (typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.PROD) {
      console.log("Message:", message);
      if (context) console.log("Context:", context);
    }

    // Check if Sentry is initialized before attempting to capture
    if (!ErrorReporting.isInitialized()) {
      console.warn("Sentry not initialized, message not reported to monitoring service");
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
    if (ErrorReporting.isInitialized()) {
      Sentry.setUser(user);
    }
  }

  /**
   * Add breadcrumb to the current Sentry scope
   * 
   * @param breadcrumb The breadcrumb to add
   */
  static addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
    if (ErrorReporting.isInitialized()) {
      Sentry.addBreadcrumb(breadcrumb);
    }
  }

  /**
   * Start a new transaction for performance monitoring
   * 
   * @param name The name of the transaction
   * @param op The operation type
   * @param data Additional data for the transaction
   * @returns The transaction instance or null if Sentry is not initialized
   */
  static startTransaction(name: string, op: string, data?: Record<string, any>) {
    if (ErrorReporting.isInitialized()) {
      return Sentry.startTransaction({ name, op, data });
    }
    return null;
  }
}
