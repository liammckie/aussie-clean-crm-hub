
/**
 * Cache wrapper with logging capabilities
 */

// Create a proper cache implementation that doesn't rely on browser Cache API
class CacheWrapper {
  private cacheStore = new Map<string, any>();
  private logger: any;

  constructor(logger?: any) {
    this.logger = logger;
  }

  /**
   * Get value from cache
   * @param key Cache key
   * @returns Cached value or undefined
   */
  get<T>(key: string): T | undefined {
    const value = this.cacheStore.get(key);
    if (this.logger) {
      this.logger.debug(`Cache get: ${key}`, { hit: value !== undefined });
    }
    return value as T;
  }

  /**
   * Store value in cache
   * @param key Cache key
   * @param value Value to store
   */
  set<T>(key: string, value: T): void {
    this.cacheStore.set(key, value);
    if (this.logger) {
      this.logger.debug(`Cache set: ${key}`);
    }
  }

  /**
   * Delete entry from cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cacheStore.delete(key);
    if (this.logger) {
      this.logger.debug(`Cache delete: ${key}`);
    }
  }

  /**
   * Delete entries matching pattern
   * @param pattern Pattern to match against keys
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const deletedKeys: string[] = [];
    
    this.cacheStore.forEach((_, key) => {
      if (regex.test(key)) {
        this.cacheStore.delete(key);
        deletedKeys.push(key);
      }
    });
    
    if (this.logger && deletedKeys.length > 0) {
      this.logger.debug(`Cache deletePattern: ${pattern}`, { deletedKeys });
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    const size = this.cacheStore.size;
    this.cacheStore.clear();
    if (this.logger) {
      this.logger.debug(`Cache cleared. Entries removed: ${size}`);
    }
  }
}

// Export a singleton instance
export const cache = new CacheWrapper();
