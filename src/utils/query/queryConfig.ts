
import { QueryClient } from '@tanstack/react-query';
import { ErrorReporting } from "@/utils/errorReporting";
import { AppLogger, LogCategory } from "@/utils/logging";
import { toast } from 'sonner';

// Define global stale times for different types of data
export const STALE_TIMES = {
  NEVER: Infinity, // Never becomes stale
  SHORT: 1000 * 60 * 1, // 1 minute
  STANDARD: 1000 * 60 * 5, // 5 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
  VERY_LONG: 1000 * 60 * 60 * 24, // 24 hours
};

// Define global cache times
export const CACHE_TIMES = {
  STANDARD: 1000 * 60 * 10, // 10 minutes
  LONG: 1000 * 60 * 60, // 1 hour
  EXTENDED: 1000 * 60 * 60 * 3, // 3 hours
};

// Create and configure the query client
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIMES.STANDARD, // Default stale time is 5 minutes
        gcTime: CACHE_TIMES.STANDARD, // Default cache time is 10 minutes
        retry: (failureCount, error) => {
          // Don't retry for user validation errors (400s)
          if (error instanceof Error) {
            if (error.message?.includes('validation') || 
                error.message?.includes('not found') ||
                error.message?.includes('unauthorized')) {
              return false;
            }
          }
          
          // Retry for server/network errors (max 2 retries)
          return failureCount < 2;
        },
        refetchOnWindowFocus: import.meta.env.PROD, // Only in production
        refetchOnReconnect: true,
        refetchOnMount: true,
        keepPreviousData: true, // Keep previous data while fetching new data
        onError: (error: Error) => {
          // Log error details
          AppLogger.error(
            LogCategory.API, 
            `React Query error: ${error.message}`, 
            { error }
          );
          
          // Report error to monitoring
          ErrorReporting.captureException(error, { 
            source: 'react-query',
          });
          
          // Show toast notification for user-friendly errors
          if (!error.message?.includes('timeout') && 
              !error.message?.includes('network')) {
            toast.error('Failed to load data. Please try again.');
          }
        }
      },
      mutations: {
        retry: false, // Don't retry mutations by default
        onError: (error: Error) => {
          // Log mutation error details
          AppLogger.error(
            LogCategory.API, 
            `React Query mutation error: ${error.message}`, 
            { error }
          );
          
          // Report error to monitoring
          ErrorReporting.captureException(error, { 
            source: 'react-query-mutation',
          });
        }
      }
    }
  });
};
