
import { supabase } from '@/lib/supabase';
import { handleApiError } from '@/utils/api-utils';
import { SiteApiResponse, SitesApiResponse, SiteInsertData, SiteUpdateData, SiteRecord, SiteData } from './types';
import { createSuccessResponse } from '@/types/api-response';
import { AppLogger } from '@/utils/logging/AppLogger';
import { LogCategory } from '@/utils/logging/LogCategory';

// Site service with CRUD operations
export const siteService = {
  // Get all sites
  getAllSites: async (): Promise<SitesApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('site_name', { ascending: true });

      if (error) throw error;

      return createSuccessResponse(data, 'Sites retrieved successfully');
    } catch (error) {
      AppLogger.error(LogCategory.SITE, 'Error getting all sites', { error });
      return handleApiError(error, 'Failed to get sites');
    }
  },

  // Get site by ID - used by both getSite and getSiteById for backwards compatibility
  getSiteById: async (siteId: string): Promise<SiteApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) throw error;

      return createSuccessResponse(data, 'Site retrieved successfully');
    } catch (error) {
      AppLogger.error(LogCategory.SITE, `Error getting site ${siteId}`, { error });
      return handleApiError(error, 'Failed to get site');
    }
  },

  // Alias for backward compatibility
  getSite: async (siteId: string): Promise<SiteApiResponse> => {
    return siteService.getSiteById(siteId);
  },

  // Get sites for a specific client
  getClientSites: async (clientId: string): Promise<SitesApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('client_id', clientId)
        .order('site_name', { ascending: true });

      if (error) throw error;

      return createSuccessResponse(data, 'Client sites retrieved successfully');
    } catch (error) {
      AppLogger.error(LogCategory.SITE, `Error getting sites for client ${clientId}`, { error });
      return handleApiError(error, 'Failed to get client sites');
    }
  },

  // Create a new site
  createSite: async (siteData: SiteInsertData): Promise<SiteApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .insert([siteData])
        .select()
        .single();

      if (error) throw error;

      return createSuccessResponse(data, 'Site created successfully');
    } catch (error) {
      AppLogger.error(LogCategory.SITE, 'Error creating site', { error, siteData });
      return handleApiError(error, 'Failed to create site');
    }
  },

  // Update an existing site
  updateSite: async (siteId: string, siteData: SiteUpdateData): Promise<SiteApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .update(siteData)
        .eq('id', siteId)
        .select()
        .single();

      if (error) throw error;

      return createSuccessResponse(data, 'Site updated successfully');
    } catch (error) {
      AppLogger.error(LogCategory.SITE, `Error updating site ${siteId}`, { error, siteData });
      return handleApiError(error, 'Failed to update site');
    }
  },

  // Delete a site
  deleteSite: async (siteId: string): Promise<SiteApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId)
        .select()
        .single();

      if (error) throw error;

      return createSuccessResponse(data, 'Site deleted successfully');
    } catch (error) {
      AppLogger.error(LogCategory.SITE, `Error deleting site ${siteId}`, { error });
      return handleApiError(error, 'Failed to delete site');
    }
  }
};
