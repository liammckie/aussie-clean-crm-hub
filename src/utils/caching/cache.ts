
import { AppLogger } from '../logging/logger';
import { LogCategory } from '../logging/types';

interface CacheOptions {
  /** Time-to-live in milliseconds */
  ttl?: number;
  /** Cache tag for grouping related items */
  tag?: string;
}

interface CacheItem<T> {
  value: T;
  expiry: number | null;
  tag?: string;
}

/**
 * Memory-based cache implementation with TTL and tag-based invalidation
 */
export class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private static instance: MemoryCache;
  
  private constructor() {}
  
  /**
   * Get singleton instance of cache
   */
  public static getInstance(): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache();
    }
    return MemoryCache.instance;
  }
  
  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const { ttl, tag } = options;
    
    const expiry = ttl ? Date.now() + ttl : null;
    
    this.cache.set(key, {
      value,
      expiry,
      tag
    });
    
    AppLogger.debug(LogCategory.CACHE, `Cache set: ${key}`, { 
      ttl, 
      tag, 
      expiryTime: expiry ? new Date(expiry).toISOString() : 'none' 
    });
  }
  
  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // If item doesn't exist
    if (!item) {
      AppLogger.debug(LogCategory.CACHE, `Cache miss: ${key}`);
      return undefined;
    }
    
    // If item is expired
    if (item.expiry !== null && item.expiry < Date.now()) {
      AppLogger.debug(LogCategory.CACHE, `Cache expired: ${key}`, { 
        expiredAt: new Date(item.expiry).toISOString() 
      });
      this.cache.delete(key);
      return undefined;
    }
    
    // Return valid item
    AppLogger.debug(LogCategory.CACHE, `Cache hit: ${key}`);
    return item.value as T;
  }
  
  /**
   * Delete a specific item from cache
   */
  delete(key: string): boolean {
    AppLogger.debug(LogCategory.CACHE, `Cache delete: ${key}`);
    return this.cache.delete(key);
  }
  
  /**
   * Clear all items from cache
   */
  clear(): void {
    AppLogger.info(LogCategory.CACHE, `Cache cleared: ${this.cache.size} items removed`);
    this.cache.clear();
  }
  
  /**
   * Clear all items with a specific tag
   */
  clearByTag(tag: string): number {
    let count = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.tag === tag) {
        this.cache.delete(key);
        count++;
      }
    }
    
    AppLogger.info(LogCategory.CACHE, `Cache tag cleared: ${tag}`, { itemsRemoved: count });
    return count;
  }
  
  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

/**
 * Helper function to wrap an async operation with caching
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cache = MemoryCache.getInstance();
  const cachedValue = cache.get<T>(key);
  
  if (cachedValue !== undefined) {
    return cachedValue;
  }
  
  const value = await fn();
  cache.set(key, value, options);
  return value;
}

/**
 * Export singleton cache instance
 */
export const Cache = MemoryCache.getInstance();
