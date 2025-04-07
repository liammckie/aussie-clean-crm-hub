
import { useOptimizedQuery } from './use-optimized-query';
import { clientService } from '@/services/client';
import { isApiSuccess } from '@/types/api-response';

// Constants for stale times and cache times
const STALE_TIMES = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  STANDARD: 1000 * 60 * 15, // 15 minutes
  LONG: 1000 * 60 * 60 // 1 hour
};

const CACHE_TIMES = {
  STANDARD: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60 * 24 // 24 hours
};

/**
 * Hook for fetching clients with optimized caching
 */
export function useOptimizedClients(options = {}) {
  return useOptimizedQuery(
    ['clients'], 
    async () => {
      const response = await clientService.getAllClients();
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      return response.data;
    },
    {
      staleTime: STALE_TIMES.SHORT, // Clients data should be relatively fresh
      gcTime: CACHE_TIMES.STANDARD,
      ...options
    }
  );
}

/**
 * Hook for fetching a single client with optimized caching
 */
export function useOptimizedClientById(clientId: string | undefined, options = {}) {
  return useOptimizedQuery(
    ['client', clientId],
    async () => {
      if (!clientId) return null;
      const response = await clientService.getClientById(clientId);
      if (!isApiSuccess(response)) {
        throw new Error(response.message);
      }
      return response.data;
    },
    {
      enabled: !!clientId,
      staleTime: STALE_TIMES.SHORT,
      gcTime: CACHE_TIMES.STANDARD,
      ...options
    }
  );
}
