
import * as siteApi from './api';
import { SiteData } from './types';

/**
 * Service wrapper for site-related operations
 */
export const siteService = {
  /**
   * Get all sites
   */
  getAllSites: async () => {
    return siteApi.getAllSites();
  },

  /**
   * Get sites for a specific client
   */
  getClientSites: async (clientId: string) => {
    return siteApi.getClientSites(clientId);
  },

  /**
   * Get a site by ID
   */
  getSiteById: async (siteId: string) => {
    return siteApi.getSiteById(siteId);
  },

  /**
   * Create a new site
   */
  createSite: async (siteData: Omit<SiteData, 'id' | 'created_at' | 'updated_at'>) => {
    return siteApi.createSite(siteData);
  },

  /**
   * Update an existing site
   */
  updateSite: async (siteId: string, siteData: Partial<SiteData>) => {
    return siteApi.updateSite(siteId, siteData);
  },

  /**
   * Delete a site
   */
  deleteSite: async (siteId: string) => {
    return siteApi.deleteSite(siteId);
  }
};
