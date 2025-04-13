
import { QueryClient } from '@tanstack/react-query';
import { AppLogger, LogCategory } from '@/utils/logging';

/**
 * Creates a configured query client with optimized settings
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        onError: (error) => {
          if (error instanceof Error) {
            AppLogger.info(LogCategory.UI, 'React Query error: ' + error.message);
          }
        },
      },
      mutations: {
        onError: (error) => {
          if (error instanceof Error) {
            AppLogger.error(LogCategory.UI, 'Mutation error', { error });
          }
        },
      },
    },
  });
}
