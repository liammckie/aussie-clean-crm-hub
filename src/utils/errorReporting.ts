
// Error reporting utility to capture and report errors to monitoring services

/**
 * Categories for error reporting
 */
export type ErrorSeverity = 'info' | 'warning' | 'error';

/**
 * Utility class for reporting errors to monitoring services
 */
export class ErrorReporting {
  private static initialized = false;

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
   * Capture an exception for reporting
   * @param error The error to capture
   * @param context Additional context data to include
   */
  static captureException(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) {
      console.warn('Error reporting not initialized. Error not reported:', error);
      return;
    }

    console.error('Error captured:', error, context);
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

    console.log(`[${level.toUpperCase()}] Message captured:`, message);
  }

  /**
   * Capture user feedback
   * @param feedback The feedback text
   * @param category The feedback category
   */
  static captureFeedback(feedback: string): void {
    if (!this.initialized) {
      console.warn('Error reporting not initialized. Feedback not captured:', feedback);
      return;
    }

    console.log('Feedback captured:', feedback);
  }
}

export default ErrorReporting;
