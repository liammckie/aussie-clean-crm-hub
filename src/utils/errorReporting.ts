
import * as Sentry from '@sentry/browser';
import { isApiError, ApiResponse } from '@/types/api-response';
import { isApplicationError } from '@/utils/logging/error-types';
import { supabase } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';

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
    
    // Log to Supabase edge function
    this.logToSupabase('exception', { 
      error: formattedError.message || String(formattedError),
      stack: formattedError.stack,
      context: context || {}
    });
    
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
    
    // Log to Supabase edge function
    this.logToSupabase('message', { 
      message,
      level
    });
    
    if (this.isInitialized) {
      Sentry.captureMessage(message, level);
    }
  }

  /**
   * Send user feedback to the error tracking system
   */
  public static captureFeedback(feedback: string, category: string = 'general', metadata?: Record<string, any>): void {
    console.log(`[Feedback][${category}]`, feedback, metadata || {});
    
    // Log to Supabase edge function
    this.logToSupabase('feedback', { 
      feedback,
      category,
      metadata: metadata || {}
    });
    
    // Also log to Sentry as a breadcrumb if initialized
    if (this.isInitialized) {
      Sentry.addBreadcrumb({
        category: `feedback-${category}`,
        message: feedback,
        data: metadata,
        level: 'info'
      });
      
      // Send as a custom event
      Sentry.captureEvent({
        message: `User Feedback: ${feedback}`,
        level: 'info',
        tags: { 
          feedback_category: category 
        },
        extra: metadata
      });
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
   * Log to Supabase edge function
   * This sends the log to the Supabase edge function for storage and analysis
   */
  private static async logToSupabase(type: 'exception' | 'message' | 'feedback', data: Record<string, any>): Promise<void> {
    try {
      const payload = {
        type,
        timestamp: new Date().toISOString(),
        appVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
        environment: import.meta.env.VITE_ENVIRONMENT || 'development',
        data
      };
      
      // Log directly to database using Supabase client
      const { error } = await supabase
        .from('error_logs')
        .insert([payload]);
        
      if (error) {
        console.error('Failed to log to Supabase:', error);
        
        // Fall back to edge function if database insert fails
        const { error: fnError } = await supabase.functions.invoke('log-error', {
          body: payload
        });
        
        if (fnError) {
          console.error('Failed to log to edge function:', fnError);
        }
      }
    } catch (err) {
      console.error('Error logging to Supabase:', err);
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
