
/**
 * Re-export all logging utilities from the modular system
 */

export * from './logging/types';
export * from './logging/logger';
export * from './logging/performance';
export * from './logging/cache-wrapper';
export { Cache } from './caching/cache';

/**
 * Application logging categories
 */
export enum LogCategory {
  GENERAL = 'general',
  AUTH = 'auth',
  CLIENT = 'client',
  CONTRACT = 'contract',
  SITE = 'site',
  SUPPLIER = 'supplier',
  SUPPLIER_CONTRACT = 'supplier_contract',
  FINANCIAL = 'financial',
  WORK_ORDER = 'work_order',
  API = 'api',
  ERROR = 'error'
}
