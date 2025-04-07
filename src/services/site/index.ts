
// Export types
export * from './types';

// Export individual functions from service.ts
export { getSites, getSiteById, getClientSites } from './service';

// Export individual functions from api.ts
export { fetchSites, fetchSiteById, fetchClientSites } from './api';

// Named export for backward compatibility
import * as siteService from './service';
export { siteService };
