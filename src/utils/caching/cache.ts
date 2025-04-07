
/**
 * Simple cache implementation for storing query results
 */
export class Cache {
  private cacheStore: Map<string, { data: any; timestamp: number }>;
  private ttl: number;

  constructor(ttlMilliseconds = 5 * 60 * 1000) { // Default 5 minutes TTL
    this.cacheStore = new Map();
    this.ttl = ttlMilliseconds;
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cacheStore.get(key);
    
    if (!item) {
      return undefined;
    }
    
    // Check if the cache entry is expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cacheStore.delete(key);
      return undefined;
    }
    
    return item.data as T;
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param data Data to store
   */
  set(key: string, data: any): void {
    this.cacheStore.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Delete a value from the cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cacheStore.delete(key);
  }

  /**
   * Delete all keys matching a pattern
   * @param pattern String pattern to match against keys
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    
    for (const key of this.cacheStore.keys()) {
      if (regex.test(key)) {
        this.cacheStore.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cacheStore.clear();
  }

  /**
   * Get the number of items in the cache
   */
  get size(): number {
    return this.cacheStore.size;
  }

  /**
   * Get all keys in the cache
   */
  get keys(): string[] {
    return Array.from(this.cacheStore.keys());
  }
}

// Create a singleton instance for the application to use
export const appCache = new Cache();
