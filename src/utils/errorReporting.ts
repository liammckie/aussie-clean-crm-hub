
import { isApiError, ApiResponse } from '@/types/api-response';
import { isApplicationError } from '@/utils/logging/error-types';
import { supabase } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';

/**
 * Enhanced error reporting service
 */
export class ErrorReporting {
  private static _isInitialized = false;
  private static loggingEnabled = true;
  private static appVersion = import.meta.env.VITE_APP_VERSION || 'development';
  private static environment = import.meta.env.VITE_ENVIRONMENT || 'development';
  private static userContext: { id: string; email?: string; username?: string } | null = null;

  /**
   * Check if error reporting is initialized
   */
  public static get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Initialize error reporting
   */
  public static init(): void {
    if (this._isInitialized) return;
    
    // In development, we might want to skip some types of logging
    if (import.meta.env.DEV) {
      console.log('🔍 Error reporting initialized in development mode');
    }
    
    this._isInitialized = true;
    console.log('🔍 Error reporting system initialized');
  }

  /**
   * Enable or disable error reporting
   */
  public static setEnabled(enabled: boolean): void {
    this.loggingEnabled = enabled;
    AppLogger.info(LogCategory.SYSTEM, 
      `Error reporting ${enabled ? 'enabled' : 'disabled'}`
    );
  }

  /**
   * Report an exception to the error tracking service
   */
  public static captureException(error: unknown, context?: Record<string, any>): void {
    if (!this.loggingEnabled) return;

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
  }

  /**
   * Log an informational message
   */
  public static captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.loggingEnabled) return;

    console.log(`[${level}]`, message);
    
    // Log to Supabase edge function
    this.logToSupabase('message', { 
      message,
      level
    });
  }

  /**
   * Send user feedback to the error tracking system
   */
  public static captureFeedback(feedback: string, category: string = 'general', metadata?: Record<string, any>): void {
    if (!this.loggingEnabled) return;

    console.log(`[Feedback][${category}]`, feedback, metadata || {});
    
    // Log to Supabase edge function
    this.logToSupabase('feedback', { 
      feedback,
      category,
      metadata: metadata || {}
    });
  }

  /**
   * Set user context for error reporting
   */
  public static setUser(user: { id: string; email?: string; username?: string } | null): void {
    this.userContext = user;
    
    if (user) {
      AppLogger.info(LogCategory.SYSTEM, "User context set for error reporting", {
        userId: user.id
      });
    } else {
      AppLogger.info(LogCategory.SYSTEM, "User context cleared from error reporting");
    }
  }

  /**
   * Get the current user context
   */
  public static getUser(): { id: string; email?: string; username?: string } | null {
    return this.userContext;
  }

  /**
   * Log to Supabase edge function or directly to the database
   */
  private static async logToSupabase(type: 'exception' | 'message' | 'feedback', data: Record<string, any>): Promise<void> {
    try {
      const payload = {
        type,
        timestamp: new Date().toISOString(),
        appVersion: this.appVersion,
        environment: this.environment,
        data: {
          ...data,
          // Include user context if available
          user: this.userContext ? {
            id: this.userContext.id,
            // Only include email in non-production environments
            ...(this.environment !== 'production' ? { email: this.userContext.email } : {}),
            username: this.userContext.username
          } : null
        }
      };
      
      // Log directly to database using Supabase client
      const { error } = await supabase
        .from('error_logs')
        .insert([payload]);
        
      if (error) {
        console.error('Failed to log to Supabase database:', error);
        
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
  
  /**
   * Add debugging information to use in development
   */
  public static debug(message: string, data?: any): void {
    if (!import.meta.env.DEV) return;
    
    console.log(`[Debug] ${message}`, data);
  }
}
