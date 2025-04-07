
import { useState, useCallback, startTransition } from 'react';

/**
 * Hook to safely handle suspense with startTransition
 * This helps prevent the "suspended while responding to synchronous input" error
 */
export function useSuspenseTransition() {
  const [isPending, setIsPending] = useState(false);
  
  const startSuspenseTransition = useCallback((callback: () => void) => {
    setIsPending(true);
    startTransition(() => {
      try {
        callback();
      } finally {
        setIsPending(false);
      }
    });
  }, []);
  
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
    startTransition(() => {
      dataFetchingFn()
        .then(resolve)
        .catch(reject);
    });
  });
};
