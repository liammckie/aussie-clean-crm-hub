/**
 * Enum defining the different categories of log entries
 * for better filtering and organization
 */
export enum LogCategory {
  // General categories
  SYSTEM = 'System',
  UI = 'UI',
  API = 'API',
  DATA = 'Data',
  ERROR = 'Error',
  
  // Authentication
  AUTH = 'Auth',
  SESSION = 'Session',
  
  // Performance monitoring
  PERFORMANCE = 'Performance',
  NETWORK = 'Network',
  
  // Features
  CLIENT = 'Client',
  CONTRACT = 'Contract',
  SUPPLIER = 'Supplier',
  SITE = 'Site',
  SUPPLIER_CONTRACT = 'SupplierContract',
  
  // Database
  DATABASE = 'Database',
  
  // Caching
  CACHE = 'Cache',
  
  // Realtime
  REALTIME = 'Realtime',
  
  // Other
  UNKNOWN = 'Unknown',
}
