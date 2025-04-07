import { PostgrestError } from '@supabase/supabase-js';
import { ApiErrorResponse, createErrorResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';
import { AppLogger } from '@/utils/logging';
import { LogCategory } from '@/utils/logging/LogCategory';

// Mapping of Postgres error codes to more user-friendly messages
const ERROR_CODE_MESSAGES: Record<string, string> = {
  '23505': 'This record already exists.',
  '23503': 'The referenced record does not exist.',
  '23502': 'A required field is missing.',
  '22P02': 'Invalid input syntax.',
  '42P01': 'Table does not exist.',
  '42703': 'Column does not exist.',
  '42601': 'Syntax error in the query.',
  '28000': 'Invalid authorization.',
  '3F000': 'Schema does not exist.',
  '40001': 'Serialization failure.',
  '40P01': 'Deadlock detected.',
  '53300': 'Too many connections.',
  '53400': 'Configuration limit exceeded.',
  '57P01': 'Database unavailable.',
  '58P01': 'System error.',
  '66000': 'SQL feature not supported.'
};

/**
 * Parse detailed error message from Postgres error
 */
export const parsePostgresErrorMessage = (
  error: PostgrestError
): string => {
  const code = error.code;
  const defaultMessage = error.message || 'A database error occurred';
  
  if (!code) {
    return defaultMessage;
  }
  
  return ERROR_CODE_MESSAGES[code] || defaultMessage;
};

/**
 * Handle auth error
 */
export const handleAuthError = (
  error: { message: string; status?: number },
  defaultMessage: string,
  context: Record<string, any> = {}
): ApiErrorResponse => {
  AppLogger.error(LogCategory.AUTH, `Auth error: ${error.message}`, {
    context,
    error
  });
  
  return createErrorResponse(
    ErrorCategory.AUTH,
    error.message || defaultMessage,
    {
      status: error.status,
      ...context
    }
  );
};

/**
 * Log success responses for debugging
 */
export const logSuccess = (
  message: string,
  data?: any,
  context?: Record<string, any>
): void => {
  AppLogger.info(LogCategory.API, message, { 
    data: data ? (typeof data === 'object' ? { ...data } : data) : undefined,
    context
  });
};

/**
 * Handle database error 
 */
export const handleDatabaseError = (
  error: Error,
  defaultMessage: string,
  context: Record<string, any> = {}
): ApiErrorResponse => {
  AppLogger.error(LogCategory.DATABASE, `Database error: ${error.message}`, {
    context,
    error
  });
  
  return createErrorResponse(
    ErrorCategory.DATABASE,
    error.message || defaultMessage,
    {
      ...context,
      originalError: error.message
    }
  );
};

/**
 * Handle Postgrest error
 */
export const handlePostgrestError = (
  error: PostgrestError,
  defaultMessage: string,
  context: Record<string, any> = {}
): ApiErrorResponse => {
  const message = parsePostgresErrorMessage(error);
  
  AppLogger.error(LogCategory.DATABASE, `Postgrest error: ${message}`, {
    code: error.code,
    details: error.details,
    hint: error.hint,
    context
  });
  
  return createErrorResponse(
    ErrorCategory.DATABASE,
    message || defaultMessage,
    {
      code: error.code,
      details: error.details,
      hint: error.hint,
      ...context
    }
  );
};

/**
 * Handle generic error
 */
export const handleGenericError = (
  error: unknown,
  defaultMessage: string,
  context: Record<string, any> = {}
): ApiErrorResponse => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  AppLogger.error(LogCategory.ERROR, `Error: ${errorMessage}`, {
    context,
    error
  });
  
  return createErrorResponse(
    ErrorCategory.UNKNOWN,
    errorMessage || defaultMessage,
    context
  );
};
