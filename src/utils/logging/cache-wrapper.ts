
import { AppLogger } from './AppLogger';
import { LogCategory } from './LogCategory';
import { Cache } from '../caching/cache';

/**
 * Cache wrapper utility options
 */
export interface CacheOptions {
  ttl: number;
  tag: string;
}

/**
 * Wrapper function to handle caching data with a function that returns a promise
 */
export async function withCache<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  // Try to get data from cache first
  const cachedData = Cache.get<T>(cacheKey);
  
  if (cachedData !== null) {
    AppLogger.debug(
      LogCategory.CACHE,
      `Cache hit for ${cacheKey} (tag: ${options.tag})`
    );
    return cachedData;
  }

  AppLogger.debug(
    LogCategory.CACHE,
    `Cache miss for ${cacheKey} (tag: ${options.tag}), fetching data`
  );

  // Execute the function to get fresh data
  const data = await fn();
  
  // Store in cache with the provided TTL
  Cache.set(cacheKey, data, options.ttl, options.tag);

  return data;
}
