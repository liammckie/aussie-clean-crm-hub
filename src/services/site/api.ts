
import { supabase, isAuthenticated } from '@/integrations/supabase/client';
import { SiteData, SiteInsertData, SiteUpdateData, SiteResponse, SitesResponse } from './types';

/**
 * Site API service - handles raw Supabase calls for site data
 */
export const siteApi = {
  /**
   * Fetch all sites from the database
   */
  fetchAllSites: async (): Promise<SitesResponse> => {
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('site_name', { ascending: true });

      if (error) {
        throw error;
      }

      return { data: data as SiteData[], error: null };
    } catch (error) {
      console.error('Error fetching sites:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Fetch a single site by ID
   */
  fetchSiteById: async (siteId: string): Promise<SiteResponse> => {
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) {
        throw error;
      }
      
      return { data: data as SiteData, error: null };
    } catch (error) {
      console.error('Error fetching site:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Create a new site
   */
  createSite: async (siteData: SiteInsertData): Promise<SiteResponse> => {
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('sites')
        .insert(siteData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: data as SiteData, error: null };
    } catch (error) {
      console.error('Error creating site:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Update an existing site
   */
  updateSite: async (siteId: string, siteData: SiteUpdateData): Promise<SiteResponse> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .update(siteData)
        .eq('id', siteId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: data as SiteData, error: null };
    } catch (error) {
      console.error('Error updating site:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Delete a site
   */
  deleteSite: async (siteId: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting site:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};
