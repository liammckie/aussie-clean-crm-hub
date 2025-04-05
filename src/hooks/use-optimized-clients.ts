
import { useOptimizedQuery } from './use-optimized-query';
import { clientService } from '@/services/client';
import { STALE_TIMES, CACHE_TIMES } from '@/utils/query/queryConfig';

/**
 * Hook for fetching clients with optimized caching and performance tracking
 */
export function useOptimizedClients(options = {}) {
  return useOptimizedQuery(
    ['clients'],
    () => clientService.getAll(),
    {
      performance: {
        operationName: 'fetch-all-clients',
      },
      caching: {
        staleTime: STALE_TIMES.SHORT, // Clients data should be relatively fresh
        gcTime: CACHE_TIMES.STANDARD,
      },
      ...options
    }
  );
}

/**
 * Hook for fetching a single client with optimized caching and performance tracking
 */
export function useOptimizedClientById(clientId: string | undefined, options = {}) {
  return useOptimizedQuery(
    ['client', clientId],
    () => clientId ? clientService.getById(clientId) : Promise.resolve(null),
    {
      enabled: !!clientId,
      performance: {
        operationName: 'fetch-client-by-id',
      },
      caching: {
        staleTime: STALE_TIMES.SHORT,
        gcTime: CACHE_TIMES.STANDARD,
      },
      ...options
    }
  );
}
