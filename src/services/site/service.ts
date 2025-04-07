
import { siteApi } from './api';
import { SiteData, SiteInsertData, SiteUpdateData, SiteApiResponse, SitesApiResponse } from './types';
import { ApiResponse, isApiError } from '@/types/api-response';

/**
 * Site service with business logic for site management
 */
export const siteService = {
  /**
   * Get all sites with optional filtering and sorting
   */
  getAllSites: async (): Promise<SitesApiResponse> => {
    return siteApi.fetchAllSites();
  },
  
  /**
   * Get a specific site by ID
   */
  getSiteById: async (siteId: string): Promise<SiteApiResponse> => {
    return siteApi.fetchSiteById(siteId);
  },
  
  /**
   * Get all sites for a specific client
   */
  getClientSites: async (clientId: string): Promise<SitesApiResponse> => {
    return siteApi.fetchClientSites(clientId);
  },
  
  /**
   * Create a new site
   */
  createSite: async (siteData: SiteInsertData): Promise<SiteApiResponse> => {
    return siteApi.createSite(siteData);
  },
  
  /**
   * Update an existing site
   */
  updateSite: async (siteId: string, siteData: SiteUpdateData): Promise<SiteApiResponse> => {
    return siteApi.updateSite(siteId, siteData);
  },
  
  /**
   * Delete a site by ID
   */
  deleteSite: async (siteId: string): Promise<ApiResponse<{success: boolean}>> => {
    return siteApi.deleteSite(siteId);
  }
};
