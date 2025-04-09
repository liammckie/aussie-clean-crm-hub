
/**
 * Error reporting utility for sending errors to monitoring tools
 */
export class ErrorReporting {
  static isInitialized = false;
  
  /**
   * Set user context for error reports
   */
  static setUser(user: { id: string; email?: string; username?: string } | null): void {
    if (user) {
      console.info('Setting user context for error reporting', { userId: user.id });
    } else {
      console.info('Clearing user context for error reporting');
    }
    
    // In a real implementation, this would set user context in Sentry or similar
  }
  
  /**
   * Initialize the error reporting system
   */
  static init(config?: { 
    environment?: string;
    release?: string;
    dsn?: string;
    debug?: boolean;
  }): void {
    console.info('Initializing error reporting', config);
    ErrorReporting.isInitialized = true;
    // In a real implementation, this would initialize Sentry or similar
  }
  
  /**
   * Enable or disable error reporting
   */
  static setEnabled(enabled: boolean): void {
    console.info(`${enabled ? 'Enabling' : 'Disabling'} error reporting`);
    // In a real implementation, this would enable/disable Sentry or similar
  }
  
  /**
   * Capture an exception for reporting
   */
  static captureException(error: Error, context?: Record<string, any>): void {
    console.error('Error captured:', error, context || {});
    
    // In a real implementation, this would send the error to Sentry or similar
  }
  
  /**
   * Capture user feedback
   */
  static captureFeedback(feedback: {
    name?: string;
    email?: string;
    comments: string;
  }): void {
    console.info('Feedback captured:', feedback);
    
    // In a real implementation, this would send the feedback to Sentry or similar
  }
  
  /**
   * Capture a message for reporting
   */
  static captureMessage(message: string, level?: 'info' | 'warning' | 'error', context?: Record<string, any>): void {
    console[level || 'info']('Message captured:', message, context || {});
    
    // In a real implementation, this would send the message to Sentry or similar
  }
}
