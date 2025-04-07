
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/utils/supabaseErrors';
import { SiteData, SiteInsertData, SiteUpdateData, SiteApiResponse, SitesApiResponse } from './types';
import { ApiResponse, createSuccessResponse } from '@/types/api-response';

/**
 * Site API methods for direct Supabase interactions
 */
export const siteApi = {
  /**
   * Fetch all sites
   */
  fetchAllSites: async (): Promise<SitesApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('site_name', { ascending: true });

      if (error) throw error;

      return createSuccessResponse(data, 'Sites fetched successfully');
    } catch (error) {
      return handleSupabaseError(
        error, 
        'Failed to fetch sites',
        { operation: 'fetchAllSites' }
      );
    }
  },

  /**
   * Fetch a single site by ID
   */
  fetchSiteById: async (siteId: string): Promise<SiteApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select(`
          *
        `)
        .eq('id', siteId)
        .single();

      if (error) throw error;

      return createSuccessResponse(data, `Site with ID ${siteId} fetched successfully`);
    } catch (error) {
      return handleSupabaseError(
        error, 
        `Failed to fetch site with ID ${siteId}`,
        { operation: 'fetchSiteById', siteId }
      );
    }
  },

  /**
   * Fetch sites for a specific client
   */
  fetchClientSites: async (clientId: string): Promise<SitesApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('client_id', clientId)
        .order('site_name', { ascending: true });

      if (error) throw error;

      return createSuccessResponse(data, `Sites for client ${clientId} fetched successfully`);
    } catch (error) {
      return handleSupabaseError(
        error, 
        `Failed to fetch sites for client with ID ${clientId}`,
        { operation: 'fetchClientSites', clientId }
      );
    }
  },

  /**
   * Create a new site
   */
  createSite: async (siteData: SiteInsertData): Promise<SiteApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .insert(siteData)
        .select()
        .single();

      if (error) throw error;

      return createSuccessResponse(data, 'Site created successfully');
    } catch (error) {
      return handleSupabaseError(
        error, 
        'Failed to create site',
        { operation: 'createSite', siteData }
      );
    }
  },

  /**
   * Update an existing site
   */
  updateSite: async (siteId: string, siteData: SiteUpdateData): Promise<SiteApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .update(siteData)
        .eq('id', siteId)
        .select()
        .single();

      if (error) throw error;

      return createSuccessResponse(data, `Site with ID ${siteId} updated successfully`);
    } catch (error) {
      return handleSupabaseError(
        error, 
        `Failed to update site with ID ${siteId}`,
        { operation: 'updateSite', siteId, siteData }
      );
    }
  },

  /**
   * Delete a site
   */
  deleteSite: async (siteId: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

      if (error) throw error;

      return createSuccessResponse({ success: true }, `Site with ID ${siteId} deleted successfully`);
    } catch (error) {
      return handleSupabaseError(
        error, 
        `Failed to delete site with ID ${siteId}`,
        { operation: 'deleteSite', siteId }
      );
    }
  }
};
