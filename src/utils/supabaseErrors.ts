
import { isSupabaseError } from '@/integrations/supabase/client';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';

/**
 * Error categories for better error handling
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NETWORK = 'network',
  DATABASE = 'database',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

/**
 * Structured error response for API operations
 */
export interface ErrorResponse {
  message: string;
  category: ErrorCategory;
  code?: string;
  details?: unknown;
}

// Define a more specific type for Supabase errors
interface SupabaseErrorWithCode {
  code?: string;
  message?: string;
  error?: string;
  details?: string | object;
  hint?: string;
  errorMessage?: string;
}

/**
 * Helper to categorize Supabase errors
 */
export function categorizeError(error: unknown): ErrorCategory {
  if (!isSupabaseError(error)) {
    // Check for authentication error messages in non-Supabase errors
    if (error instanceof Error) {
      if (error.message.includes('Not authenticated') || 
          error.message.includes('JWT') ||
          error.message.includes('token') ||
          error.message.includes('login')) {
        return ErrorCategory.AUTHENTICATION;
      }
    }
    return ErrorCategory.UNKNOWN;
  }

  // Safe type assertion since we've verified it's a Supabase error
  const supabaseError = error as SupabaseErrorWithCode;
  const code = supabaseError?.code;
  
  // Check for error messages related to authentication
  const errorMsg = supabaseError?.message || supabaseError?.error || '';
  if (typeof errorMsg === 'string' && 
      (errorMsg.toLowerCase().includes('jwt') || 
       errorMsg.toLowerCase().includes('token') || 
       errorMsg.toLowerCase().includes('auth') ||
       errorMsg.toLowerCase().includes('login'))) {
    return ErrorCategory.AUTHENTICATION;
  }

  // Authentication errors
  if (code?.startsWith('auth/') || code === 'unauthorized') {
    return ErrorCategory.AUTHENTICATION;
  }

  // Permission errors
  if (code === 'PGRST116' || code === '42501' || code?.includes('permission')) {
    return ErrorCategory.PERMISSION;
  }

  // Validation errors
  if (code?.startsWith('22') || code?.startsWith('23')) {
    return ErrorCategory.VALIDATION;
  }

  // Network errors
  if (code === 'connection_error' || code === 'timeout') {
    return ErrorCategory.NETWORK;
  }

  // Database errors
  if (code?.startsWith('P') || code?.startsWith('42')) {
    return ErrorCategory.DATABASE;
  }

  // Default to server error for other codes
  return ErrorCategory.SERVER;
}

/**
 * Process and handle Supabase errors in a consistent way
 * 
 * @param error The error object
 * @param customMessage User-friendly message to display
 * @param context Additional context for logging
 * @returns Structured error response
 */
export function handleSupabaseError(
  error: unknown,
  customMessage: string,
  context?: Record<string, any>
): ErrorResponse {
  // Create user-friendly error message
  let message = customMessage;
  let category = ErrorCategory.UNKNOWN;
  let code: string | undefined;
  let details: unknown;

  if (isSupabaseError(error)) {
    const supabaseError = error as SupabaseErrorWithCode;
    category = categorizeError(error);
    code = supabaseError?.code;
    details = error;
    
    // Special handling for authentication and permission errors
    if (category === ErrorCategory.AUTHENTICATION) {
      message = `Authentication required: Please log in to continue.`;
      // Add clear details for debugging
      details = { 
        ...supabaseError, 
        hint: "Check if user is logged in and has a valid session" 
      };
    } else if (category === ErrorCategory.PERMISSION) {
      message = `Permission error: You don't have access to perform this action.`;
      // Add clear details for debugging
      details = { 
        ...supabaseError, 
        hint: "Check RLS policies and user permissions" 
      };
    } 
    // Add specific details based on error type
    else if (category === ErrorCategory.VALIDATION && supabaseError?.message) {
      message = `${customMessage}: ${supabaseError.message}`;
    } else if (supabaseError?.error) {
      message = `${customMessage}: ${supabaseError.error}`;
    } else if (supabaseError?.errorMessage) {
      message = `${customMessage}: ${supabaseError.errorMessage}`;
    } else if (supabaseError?.details) {
      message = `${customMessage}: ${typeof supabaseError.details === 'string' ? supabaseError.details : JSON.stringify(supabaseError.details)}`;
    }
  } else if (error instanceof Error) {
    // Check for authentication messages
    if (error.message.includes('Not authenticated')) {
      category = ErrorCategory.AUTHENTICATION;
      message = `Authentication required: Please log in to continue.`;
    } else {
      message = `${customMessage}: ${error.message}`;
    }
    details = error;
  } else if (typeof error === 'string') {
    message = `${customMessage}: ${error}`;
    details = { error };
  } else if (error && typeof error === 'object') {
    message = `${customMessage}: ${JSON.stringify(error)}`;
    details = error;
  }

  // Report to error monitoring
  ErrorReporting.captureException(
    error instanceof Error ? error : new Error(message),
    {
      ...context,
      category,
      code,
      customMessage
    }
  );

  // Special handling for authentication errors to guide the user
  if (category === ErrorCategory.AUTHENTICATION) {
    toast.error("Please log in to continue", {
      description: "Your session may have expired"
    });
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  } else {
    // Show user-friendly toast for other errors
    toast.error(message);
  }

  // Return structured error response
  return {
    message,
    category,
    code,
    details
  };
}

/**
 * Log successful operations for auditing and debugging
 */
export function logSuccess(
  operation: string,
  entity: string,
  data?: unknown,
  context?: Record<string, any>
): void {
  // Add breadcrumb for tracking successful operations
  ErrorReporting.addBreadcrumb({
    category: 'operation',
    message: `${operation} ${entity} successful`,
    level: 'info',
    data: {
      ...context,
      entity,
      operation,
      timestamp: new Date().toISOString()
    }
  });

  // Optional debug logging in development
  if (typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.PROD) {
    console.log(`${operation} ${entity} successful:`, data);
  }
}
