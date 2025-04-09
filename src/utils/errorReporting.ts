
// Error reporting utility to capture and report errors to monitoring services

/**
 * Categories for error reporting
 */
export type ErrorSeverity = 'info' | 'warning' | 'error';

/**
 * User information for error context
 */
export interface ErrorUserInfo {
  id?: string;
  email?: string;
  username?: string;
}

/**
 * Utility class for reporting errors to monitoring services
 */
export class ErrorReporting {
  private static initialized = false;
  private static userInfo: ErrorUserInfo | null = null;

  /**
   * Initialize error reporting with your monitoring service
   * @param options Configuration options for error reporting
   */
  static init(options?: any): void {
    this.initialized = true;
    console.log('Error reporting initialized', options);
  }

  /**
   * Check if error reporting is initialized
   */
  static get isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Set whether error reporting is enabled
   * @param enabled Whether error reporting is enabled
   */
  static setEnabled(enabled: boolean): void {
    console.log(`Error reporting ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Set user information for error context
   * @param user User information or null to clear user context
   */
  static setUser(user: ErrorUserInfo | null): void {
    this.userInfo = user;
    console.log('Error reporting user context updated:', user ? user.id : 'cleared');
  }

  /**
   * Capture an exception for reporting
   * @param error The error to capture
   * @param context Additional context data to include
   */
  static captureException(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) {
      console.warn('Error reporting not initialized. Error not reported:', error);
      return;
    }

    console.error('Error captured:', error, {
      ...context,
      user: this.userInfo
    });
  }

  /**
   * Capture a message for reporting
   * @param message The message to capture
   * @param level The severity level of the message
   */
  static captureMessage(message: string, level: ErrorSeverity = 'info'): void {
    if (!this.initialized) {
      console.warn('Error reporting not initialized. Message not reported:', message);
      return;
    }

    console.log(`[${level.toUpperCase()}] Message captured:`, message, {
      user: this.userInfo
    });
  }

  /**
   * Capture user feedback
   * @param feedback The feedback text
   */
  static captureFeedback(feedback: string): void {
    if (!this.initialized) {
      console.warn('Error reporting not initialized. Feedback not captured:', feedback);
      return;
    }

    console.log('Feedback captured:', feedback, {
      user: this.userInfo
    });
  }
}

export default ErrorReporting;
