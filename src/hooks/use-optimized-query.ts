
import { useQuery, useMutation, QueryKey, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { STALE_TIMES, CACHE_TIMES } from '@/utils/query/queryConfig';
import { PerformanceTracker } from '@/utils/logging';

/**
 * Hook for optimized data fetching with built-in performance tracking
 */
export function useOptimizedQuery<TQueryFnData = unknown, TError = Error, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'> & {
    /**
     * Performance tracking options
     */
    performance?: {
      /** Enable performance tracking */
      track?: boolean;
      /** Custom operation name for tracking */
      operationName?: string;
    };
    /**
     * Caching strategy options
     */
    caching?: {
      /** Custom stale time */
      staleTime?: number;
      /** Custom cache time */
      gcTime?: number;
    }
  }
) {
  const {
    performance = { track: true },
    caching = {},
    ...queryOptions
  } = options || {};
  
  const operationName = performance?.operationName || `query:${queryKey.join(':')}`;
  const trackPerformance = performance?.track !== false;
  
  // Wrap query function with performance tracking
  const wrappedQueryFn = async () => {
    if (!trackPerformance) {
      return queryFn();
    }
    
    return PerformanceTracker.trackAsync(
      operationName,
      queryFn,
      { queryKey }
    );
  };
  
  return useQuery({
    queryKey,
    queryFn: wrappedQueryFn,
    staleTime: caching?.staleTime || STALE_TIMES.STANDARD,
    gcTime: caching?.gcTime || CACHE_TIMES.STANDARD,
    ...queryOptions
  });
}

/**
 * Hook for optimized data mutations with built-in performance tracking
 */
export function useOptimizedMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> & {
    /**
     * Performance tracking options
     */
    performance?: {
      /** Enable performance tracking */
      track?: boolean;
      /** Custom operation name for tracking */
      operationName?: string;
    };
  }
) {
  const {
    performance = { track: true },
    ...mutationOptions
  } = options || {};
  
  const operationName = performance?.operationName || 'mutation';
  const trackPerformance = performance?.track !== false;
  
  // Wrap mutation function with performance tracking
  const wrappedMutationFn = async (variables: TVariables) => {
    if (!trackPerformance) {
      return mutationFn(variables);
    }
    
    return PerformanceTracker.trackAsync(
      operationName,
      () => mutationFn(variables),
      { variables }
    );
  };
  
  return useMutation({
    mutationFn: wrappedMutationFn,
    ...mutationOptions
  });
}
