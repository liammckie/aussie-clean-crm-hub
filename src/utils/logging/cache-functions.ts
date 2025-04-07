
import { appCache } from '@/utils/caching/cache';
import { AppLogger } from './AppLogger';
import { LogCategory } from './LogCategory';

interface CacheOptions {
  ttl?: number;
  tag?: string;
}

/**
 * Utility function to wrap operations with caching
 * @param key Cache key
 * @param fn Function to execute if cache miss
 * @param options Cache options
 * @returns Result from cache or function execution
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cachedValue = appCache.get<T>(key);
  
  if (cachedValue !== undefined) {
    AppLogger.debug(LogCategory.CACHE, `Cache hit: ${key}`, { key, tag: options.tag });
    return cachedValue;
  }
  
  // Execute the function to get fresh data
  AppLogger.debug(LogCategory.CACHE, `Cache miss: ${key}`, { key, tag: options.tag });
  const result = await fn();
  
  // Store in cache
  appCache.set(key, result);
  
  return result;
}

/**
 * Invalidate cache entries by tag
 * @param tag Cache tag
 */
export function invalidateByTag(tag: string): void {
  AppLogger.debug(LogCategory.CACHE, `Invalidating cache by tag: ${tag}`);
  appCache.deletePattern(tag);
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
  AppLogger.debug(LogCategory.CACHE, 'Clearing entire cache');
  appCache.clear();
}
