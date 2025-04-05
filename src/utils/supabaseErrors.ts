
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
    return ErrorCategory.UNKNOWN;
  }

  // Safe type assertion since we've verified it's a Supabase error
  const supabaseError = error as SupabaseErrorWithCode;
  const code = supabaseError.code;

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
    code = supabaseError.code;
    details = error;
    
    // Add specific details based on error type
    if (category === ErrorCategory.VALIDATION && supabaseError.message) {
      message = `${customMessage}: ${supabaseError.message}`;
    } else if (supabaseError.error) {
      message = `${customMessage}: ${supabaseError.error}`;
    } else if (supabaseError.errorMessage) {
      message = `${customMessage}: ${supabaseError.errorMessage}`;
    } else if (supabaseError.details) {
      message = `${customMessage}: ${typeof supabaseError.details === 'string' ? supabaseError.details : JSON.stringify(supabaseError.details)}`;
    }
  } else if (error instanceof Error) {
    message = `${customMessage}: ${error.message}`;
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

  // Show user-friendly toast (using sonner instead of shadcn/ui)
  toast.error(message);

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
