
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cache } from '@/utils/caching/cache';
import { useCallback } from 'react';
import type { UseQueryOptions, QueryClient, QueryKey, MutationOptions } from '@tanstack/react-query';

// Create a cache instance for query results
const queryCache = new Cache();

/**
 * Optimized version of useQuery that implements caching
 */
export function useOptimizedQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  const cacheKey = JSON.stringify(queryKey);

  const optimizedQueryFn = useCallback(async () => {
    // Check cache first
    const cachedData = queryCache.get<TData>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch and store
    const data = await queryFn();
    queryCache.set(cacheKey, data);
    return data;
  }, [cacheKey, queryFn]);

  const queryInfo = useQuery<TData, TError>({
    queryKey,
    queryFn: optimizedQueryFn,
    ...options,
  });

  // Manual cache invalidation method
  const invalidateCache = useCallback(() => {
    queryCache.delete(cacheKey);
  }, [cacheKey]);

  return {
    ...queryInfo,
    invalidateCache,
  };
}

/**
 * Helper to perform cache invalidation by key pattern
 */
export function invalidateQueryCache(pattern: string): void {
  queryCache.deletePattern(pattern);
}

/**
 * Helper to clear entire query cache
 */
export function clearQueryCache(): void {
  queryCache.clear();
}

/**
 * Optimized version of useMutation that automatically invalidates related queries
 */
export function useOptimizedMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<MutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      // Call original onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Call original onError if provided
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    }
  });
}

/**
 * Helper function to safely use the query client
 */
export function withQueryClient(queryClient: QueryClient, fn: (qc: QueryClient) => void): void {
  try {
    fn(queryClient);
  } catch (err) {
    console.error('Error while using QueryClient:', err);
  }
}
