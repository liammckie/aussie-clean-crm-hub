
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { startTransition } from 'react';
import { AppLogger, LogCategory } from '@/utils/logging';

/**
 * Wrapper around useQuery that optimizes the query with default settings
 * and error handling, and uses React's startTransition to avoid suspense issues
 */
export function useOptimizedQuery<TData, TError = Error>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, readonly unknown[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery({
    // Base properties
    queryKey,
    queryFn: () => {
      return new Promise<TData>((resolve, reject) => {
        // Use startTransition to avoid suspense errors with synchronous state updates
        startTransition(() => {
          queryFn()
            .then((data) => {
              AppLogger.debug(LogCategory.DATA, `Query successful for key: ${queryKey[0]}`);
              resolve(data);
            })
            .catch((error) => {
              AppLogger.error(LogCategory.DATA, `Query error for key: ${queryKey[0]}`, { error });
              reject(error);
            });
        });
      });
    },
    
    // Default options for all queries
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
    
    // Advanced options with defaults
    refetchOnWindowFocus: false,
    
    // Spread the user options at the end to allow overriding defaults
    ...options,
  });
}
