
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
    // Log in development mode
    if (!import.meta.env.PROD) {
      console.error("Error:", error);
      if (context) console.error("Context:", context);
    }

    // Create the error object if a string was passed
    const errorObj = typeof error === "string" ? new Error(error) : error;

    // Add a breadcrumb for the error
    Sentry.addBreadcrumb({
      category: 'error',
      message: errorObj.message,
      level: level as Sentry.SeverityLevel,
    });

    // Set the scope with additional context
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      // Add origin of error
      scope.setTag('error_origin', context?.source || 'application');
      
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      
      // Always capture to Sentry, even in development
      Sentry.captureException(errorObj);
    });

    return errorObj;
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
    if (!import.meta.env.PROD) {
      console.log("Message:", message);
      if (context) console.log("Context:", context);
    }

    // Add a breadcrumb for the message
    Sentry.addBreadcrumb({
      category: 'message',
      message: message,
      level: level as Sentry.SeverityLevel,
    });

    Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      
      // Always capture to Sentry, even in development
      Sentry.captureMessage(message);
    });
  }

  /**
   * Set user information for Sentry tracking
   * 
   * @param user User information including id, email, etc.
   */
  static setUser(user: Sentry.User | null) {
    if (user) {
      // Add a breadcrumb for user identification
      Sentry.addBreadcrumb({
        category: 'auth',
        message: `User identified: ${user.email || user.id}`,
        level: 'info',
      });
    } else {
      // Add a breadcrumb for user logout
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'User logged out',
        level: 'info',
      });
    }

    Sentry.setUser(user);
  }

  /**
   * Add breadcrumb to the current Sentry scope
   * 
   * @param breadcrumb The breadcrumb to add
   */
  static addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }

  /**
   * Start a new transaction for performance monitoring
   * 
   * @param name The name of the transaction
   * @param op The operation type
   * @param data Additional data for the transaction
   * @returns The transaction instance
   */
  static startTransaction(name: string, op: string, data?: Record<string, any>) {
    return Sentry.startTransaction({ name, op, data });
  }

  /**
   * Set tag for the current scope
   * 
   * @param key The tag key
   * @param value The tag value
   */
  static setTag(key: string, value: string) {
    Sentry.setTag(key, value);
  }

  /**
   * Set extra context data for the current scope
   * 
   * @param key The context key
   * @param value The context value
   */
  static setExtra(key: string, value: any) {
    Sentry.setExtra(key, value);
  }

  /**
   * Manually report a handled exception with user feedback
   * 
   * @param error The error to report
   * @param feedback User feedback about the error
   * @param context Additional context
   */
  static reportWithUserFeedback(error: Error, feedback: string, context?: Record<string, any>) {
    // Create a unique event ID
    const eventId = Sentry.captureException(error);
    
    // Submit user feedback
    Sentry.showReportDialog({
      eventId,
      user: {
        email: context?.userEmail || '',
        name: context?.userName || '',
      },
      title: 'Report This Issue',
      subtitle: 'Your feedback helps us improve',
      subtitle2: '',
      labelComments: 'What happened?',
      labelName: 'Name',
      labelEmail: 'Email',
      labelClose: 'Close',
      successMessage: 'Thank you for your feedback!',
      errorFormEntry: 'Some fields were invalid. Please correct the errors and try again.',
      errorGeneric: 'An unknown error occurred while submitting your report. Please try again.',
      onLoad: () => {
        // Any custom code to run when the dialog loads
      },
    });
    
    return eventId;
  }
}
