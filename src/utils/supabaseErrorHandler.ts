import { isSupabaseError } from '@/integrations/supabase/client';
import { ErrorCategory } from '@/utils/logging/error-types';
import { ApiErrorResponse, createErrorResponse } from '@/types/api-response';
import { AppLogger } from '@/utils/logging/AppLogger';

/**
 * Specialized handler for Supabase authentication errors
 */
export function handleAuthError(error: any, operation: string): ApiErrorResponse {
  // Add authentication-specific context
  const context = {
    operation,
    auth: true
  };
  
  // Special handling for auth errors to provide more user-friendly messages
  let message = `Authentication error during ${operation}`;
  
  if (isSupabaseError(error)) {
    // Match common Supabase auth error codes with user-friendly messages
    switch(error.code) {
      case 'auth/invalid-email':
        message = 'The email address is not valid';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'An account already exists with this email address';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      default:
        if (error.message) {
          message = error.message;
        }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Log the specific auth error
  AppLogger.error('auth', message, { error, operation });
  
  return createErrorResponse(ErrorCategory.AUTHENTICATION, message, { ...context });
}

/**
 * Specialized handler for Supabase database errors
 */
export function handleDatabaseError(
  error: any, 
  operation: string, 
  table?: string
): ApiErrorResponse {
  // Add database-specific context
  const context = {
    operation,
    table
  };
  
  let message = `Database error during ${operation}`;
  
  // Special handling for common database errors
  if (isSupabaseError(error)) {
    // Extract the constraint name for more specific error messages
    const constraintMatch = error.message?.match(/violates\s+(\w+)\s+constraint\s+"([^"]+)"/i);
    const constraint = constraintMatch ? constraintMatch[2] : null;
    
    // Match common database error codes with user-friendly messages
    switch(error.code) {
      case '23505': // unique_violation
        message = constraint 
          ? `A record with this ${constraint.replace(/_/g, ' ')} already exists`
          : 'A record with these details already exists';
        break;
      case '23503': // foreign_key_violation
        message = constraint
          ? `This record is linked to ${constraint.replace(/_/g, ' ')} and cannot be modified`
          : 'This record is linked to other data and cannot be modified';
        break;
      case '23502': // not_null_violation
        message = 'Required fields are missing';
        break;
      case '42P01': // undefined_table
        message = `The table ${table || 'requested'} does not exist`;
        break;
      default:
        if (error.message) {
          message = `Database error: ${error.message}`;
        }
    }
  }

  // Log the specific database error
  AppLogger.error('database', message, { error, operation, table });
  
  return createErrorResponse(ErrorCategory.DATABASE, message, { ...context });
}

/**
 * Helper for handling different types of Supabase errors
 */
export function handleSupabaseError(
  error: any,
  operation: string,
  context?: { 
    table?: string; 
    type?: 'auth' | 'database' | 'storage' | 'api';
  }
): ApiErrorResponse {
  // Route to specialized handlers based on error type
  if (context?.type === 'auth') {
    return handleAuthError(error, operation);
  } else if (context?.type === 'database' || context?.table) {
    return handleDatabaseError(error, operation, context.table);
  } else {
    // Use general handler for other types of errors
    return createErrorResponse(
      determineErrorCategory(context?.type),
      `Error during ${operation}`,
      { ...context, error }
    );
  }
}

/**
 * Determine appropriate error category based on operation type
 */
function determineErrorCategory(type?: string): ErrorCategory {
  switch (type) {
    case 'auth': return ErrorCategory.AUTHENTICATION;
    case 'database': return ErrorCategory.DATABASE;
    case 'storage': return ErrorCategory.STORAGE;
    case 'api': return ErrorCategory.NETWORK;
    default: return ErrorCategory.UNKNOWN;
  }
}
