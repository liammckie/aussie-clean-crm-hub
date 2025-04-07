import { AppLogger, LogCategory } from '@/utils/logging';
import { ErrorReporting } from '@/utils/errorReporting';
import { isSupabaseError } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ErrorCategory } from '@/utils/logging/error-types';
import { 
  ApiErrorResponse, 
  ApiSuccessResponse, 
  ApiResponse, 
  isApiError, 
  isApiSuccess, 
  createSuccessResponse, 
  createErrorResponse
} from '@/types/api-response';

// Re-export types and utilities from centralized file
export { ErrorCategory };
export type { ApiErrorResponse, ApiSuccessResponse, ApiResponse };
export { isApiError, isApiSuccess, createSuccessResponse, createErrorResponse };

/**
 * Helper for formatting an error with a specific category
 */
export function formatError(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return createErrorResponse(category, message, details);
}

/**
 * Helper for categorizing Supabase errors
 */
function categorizeError(error: any): ErrorCategory {
  if (!error) return ErrorCategory.UNKNOWN;
  
  // Handle Supabase-specific errors
  if (isSupabaseError(error)) {
    const code = error?.code || '';
    const message = error?.message || '';
    
    // Authentication errors
    if (code.includes('auth/') || message.includes('JWT') || message.includes('token')) {
      return ErrorCategory.AUTHENTICATION;
    }
    
    // Permission errors
    if (code === 'PGRST116' || code === '42501' || message.includes('permission')) {
      return ErrorCategory.PERMISSION;
    }
    
    // Not found errors
    if (code === '42P01' || message.includes('does not exist')) {
      return ErrorCategory.NOT_FOUND;
    }
    
    // Validation errors
    if (code.startsWith('22') || code.startsWith('23')) {
      return ErrorCategory.VALIDATION;
    }
    
    // Database errors
    if (code.startsWith('P') || code.startsWith('42')) {
      return ErrorCategory.DATABASE;
    }
    
    return ErrorCategory.SERVER;
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('not authenticated') || message.includes('jwt') || message.includes('token')) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (message.includes('not found') || message.includes('404')) {
      return ErrorCategory.NOT_FOUND;
    }
    if (message.includes('permission') || message.includes('forbidden') || message.includes('403')) {
      return ErrorCategory.PERMISSION;
    }
  }
  
  return ErrorCategory.UNKNOWN;
}

/**
 * Helper for handling API errors in a consistent manner
 * 
 * @param error The error object from Supabase or other source
 * @param message A user-friendly error message
 * @param context Additional context for logging
 * @param category The log category
 * @returns A standardized error response object
 */
export function handleApiError(
  error: any, 
  message: string, 
  context?: Record<string, any>,
  category: LogCategory = LogCategory.API
): ApiErrorResponse {
  // Log the error with context
  AppLogger.error(category, message, { error, ...context });
  
  // Capture exception for monitoring
  ErrorReporting.captureException(error);
  
  // Determine error category based on the error object
  const errorCategory = categorizeError(error);
  
  let errorMessage = message;
  let errorCode: string | undefined;
  
  // Extract more specific information from error if available
  if (isSupabaseError(error)) {
    errorCode = error.code;
    
    // Add more specific details to error message when available
    if (error.message) {
      errorMessage = `${message}: ${error.message}`;
    } else if (error.error) {
      errorMessage = `${message}: ${error.error}`;
    }
  } else if (error instanceof Error) {
    errorMessage = `${message}: ${error.message}`;
  }
  
  // Show toast for critical errors
  if (errorCategory === ErrorCategory.AUTHENTICATION) {
    toast.error("Authentication error", {
      description: "Please log in to continue"
    });
    
    // Could add auto-redirect to login page after delay
    // setTimeout(() => window.location.href = '/login', 2000);
  } else if (errorCategory === ErrorCategory.PERMISSION) {
    toast.error("Permission denied", {
      description: "You don't have permission to perform this action"
    });
  }
  
  // Return standardized error response
  return createErrorResponse(errorCategory, errorMessage, error);
}
