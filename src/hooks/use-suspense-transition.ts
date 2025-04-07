
import { useState, useCallback, startTransition, useTransition } from 'react';
import { AppLogger, LogCategory } from '@/utils/logging';

/**
 * Hook to safely handle suspense with startTransition
 * This helps prevent the "suspended while responding to synchronous input" error
 */
export function useSuspenseTransition() {
  // Use React's built-in useTransition hook
  const [isPending, startLocalTransition] = useTransition();
  
  const startSuspenseTransition = useCallback((callback: () => void) => {
    AppLogger.debug(LogCategory.UI, 'Starting suspense transition');
    
    // Use React's built-in startTransition to prevent synchronous suspense errors
    startLocalTransition(() => {
      try {
        callback();
      } catch (error) {
        AppLogger.error(LogCategory.ERROR, 'Error in suspense transition', { error });
      }
    });
  }, [startLocalTransition]);
  
  return { isPending, startSuspenseTransition };
}

/**
 * Utility function to wrap async data loading in startTransition
 * @param dataFetchingFn The function that loads data and might cause suspense
 */
export const wrapWithTransition = <T,>(
  dataFetchingFn: () => Promise<T>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    AppLogger.debug(LogCategory.DATA, 'Wrapping data fetch with transition');
    
    // Use startTransition to wrap the data fetching
    startTransition(() => {
      dataFetchingFn()
        .then(result => {
          AppLogger.debug(LogCategory.DATA, 'Data fetch completed successfully');
          resolve(result);
        })
        .catch(error => {
          AppLogger.error(LogCategory.ERROR, 'Error in data fetch within transition', { error });
          reject(error);
        });
    });
  });
};

/**
 * Hook to provide a strongly typed wrapper for useTransition
 * This is a convenience hook for components that need to use transitions
 */
export function useTypedTransition<T>() {
  const [isPending, startTransitionRaw] = useTransition();
  
  const startTypedTransition = useCallback((callback: () => T): void => {
    startTransitionRaw(() => {
      try {
        callback();
      } catch (error) {
        AppLogger.error(LogCategory.ERROR, 'Error in typed transition', { error });
      }
    });
  }, [startTransitionRaw]);
  
  return { isPending, startTypedTransition };
}
