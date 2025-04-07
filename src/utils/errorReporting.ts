import * as Sentry from '@sentry/browser';
import { isApiError, ApiResponse } from '@/types/api-response';
import { isApplicationError } from '@/utils/logging/error-types';

/**
 * Enhanced error reporting service
 */
export class ErrorReporting {
  private static isInitialized = false;

  /**
   * Initialize error reporting
   */
  public static init(): void {
    if (this.isInitialized) return;

    // Only initialize in production or if explicitly enabled in other environments
    if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_ERROR_REPORTING) {
      const dsn = import.meta.env.VITE_SENTRY_DSN;
      if (dsn) {
        Sentry.init({
          dsn,
          environment: import.meta.env.VITE_ENVIRONMENT || 'development',
          tracesSampleRate: 0.2,
          ignoreErrors: [
            // Ignore network errors that are typically not actionable
            'Network Error',
            'Failed to fetch',
            'NetworkError',
            'ChunkLoadError',
          ],
        });
        this.isInitialized = true;
        console.log('Error reporting initialized');
      } else {
        console.warn('Error reporting DSN not provided');
      }
    }
  }

  /**
   * Report an exception to the error tracking service
   */
  public static captureException(error: unknown, context?: Record<string, any>): void {
    // Always log to console for development visibility
    console.error('Error captured:', error, context || {});

    // Format the error message for consistent reporting
    const formattedError = this.formatError(error);
    
    // Report to Sentry if initialized
    if (this.isInitialized) {
      if (context) {
        Sentry.withScope(scope => {
          Object.entries(context).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
          Sentry.captureException(formattedError);
        });
      } else {
        Sentry.captureException(formattedError);
      }
    }
  }

  /**
   * Log an informational message
   */
  public static captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    console.log(`[${level}]`, message);
    
    if (this.isInitialized) {
      Sentry.captureMessage(message, level);
    }
  }

  /**
   * Set user context for error reporting
   */
  public static setUser(user: { id: string; email?: string; username?: string } | null): void {
    if (this.isInitialized) {
      Sentry.setUser(user);
    }
  }

  /**
   * Format error for consistent reporting
   */
  private static formatError(error: unknown): Error {
    // If it's already an Error instance, return it
    if (error instanceof Error) {
      return error;
    }
    
    // If it's an API error response, create an Error with the message
    if (error && typeof error === 'object' && 'category' in error && 'message' in error) {
      const formattedError = new Error((error as any).message);
      formattedError.name = `ApiError:${(error as any).category}`;
      return Object.assign(formattedError, { details: (error as any).details });
    }
    
    // If it's an application error, create an Error with the message
    if (isApplicationError(error)) {
      const formattedError = new Error(error.message);
      formattedError.name = `AppError:${error.category}`;
      return Object.assign(formattedError, { details: error.details });
    }
    
    // For other object types, stringify them for the error message
    if (error !== null && typeof error === 'object') {
      try {
        return new Error(`Unknown error object: ${JSON.stringify(error)}`);
      } catch (e) {
        // In case JSON.stringify fails (e.g., circular references)
        return new Error('Unknown error object (non-serializable)');
      }
    }
    
    // For primitive values
    return new Error(`Unknown error: ${String(error)}`);
  }
}
