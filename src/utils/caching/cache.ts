
/**
 * Cache utility for storing data with TTL
 */

type CachedItem<T> = {
  data: T;
  expiry: number;
  tag?: string;
};

export class Cache {
  private static cache = new Map<string, CachedItem<any>>();

  /**
   * Get an item from the cache
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Return null if expired
    if (item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set an item in the cache
   */
  static set<T>(key: string, data: T, ttl: number, tag?: string): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry, tag });
  }

  /**
   * Clear all items with a specific tag
   */
  static clearByTag(tag: string): void {
    this.cache.forEach((value, key) => {
      if (value.tag === tag) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clear a specific item from the cache
   */
  static clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  static clearAll(): void {
    this.cache.clear();
  }
}
