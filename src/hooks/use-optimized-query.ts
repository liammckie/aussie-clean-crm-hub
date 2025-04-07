
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { startTransition } from 'react';
import { AppLogger, LogCategory } from '@/utils/logging';
import { useTypedTransition } from './use-suspense-transition';

/**
 * Wrapper around useQuery that optimizes the query with default settings
 * and error handling, and uses React's startTransition to avoid suspense issues
 */
export function useOptimizedQuery<TData, TError = Error>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, readonly unknown[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  const { startTypedTransition } = useTypedTransition<void>();

  // Create a wrapped query function that uses startTransition
  const wrappedQueryFn = async (): Promise<TData> => {
    AppLogger.debug(LogCategory.DATA, `Starting optimized query for: ${String(queryKey[0])}`);
    
    return new Promise<TData>((resolve, reject) => {
      startTypedTransition(() => {
        queryFn()
          .then((data) => {
            AppLogger.debug(LogCategory.DATA, `Query successful for key: ${String(queryKey[0])}`);
            resolve(data);
          })
          .catch((error) => {
            AppLogger.error(LogCategory.DATA, `Query error for key: ${String(queryKey[0])}`, { error });
            reject(error);
          });
      });
    });
  };
  
  return useQuery({
    // Base properties
    queryKey,
    queryFn: wrappedQueryFn,
    
    // Default options for all queries
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
    
    // Advanced options with defaults
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    
    // Spread the user options at the end to allow overriding defaults
    ...options,
  });
}
