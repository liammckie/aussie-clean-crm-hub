
import { supabase, isAuthenticated } from '@/integrations/supabase/client';
import { Tables } from '@/types/supabase';
import { SiteStatus } from '@/types/database-schema';

export interface SiteData extends Tables<'sites'> {
  // Additional properties can be added here
}

interface SiteResponse {
  data: SiteData | null;
  error: string | null;
}

export const siteService = {
  /**
   * Creates a new site
   * @param siteData The site data to create
   * @returns The created site or error
   */
  createSite: async (siteData: Omit<SiteData, 'id' | 'created_at' | 'updated_at'>): Promise<SiteData> => {
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

      return data as SiteData;
    } catch (error) {
      console.error('Error creating site:', error);
      throw error;
    }
  },

  /**
   * Gets a site by ID
   * @param siteId The ID of the site to get
   * @returns The site or error
   */
  getSite: async (siteId: string): Promise<SiteData> => {
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

      return data as SiteData;
    } catch (error) {
      console.error('Error getting site:', error);
      throw error;
    }
  },

  /**
   * Gets all sites
   * @returns All sites or error
   */
  getAllSites: async (): Promise<SiteData[]> => {
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as SiteData[];
    } catch (error) {
      console.error('Error getting sites:', error);
      throw error;
    }
  },

  /**
   * Updates a site
   * @param siteId The ID of the site to update
   * @param siteData The site data to update
   * @returns The updated site or error
   */
  updateSite: async (siteId: string, siteData: Partial<SiteData>): Promise<SiteData> => {
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

      return data as SiteData;
    } catch (error) {
      console.error('Error updating site:', error);
      throw error;
    }
  },

  /**
   * Deletes a site
   * @param siteId The ID of the site to delete
   * @returns True if successful, otherwise throws an error
   */
  deleteSite: async (siteId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting site:', error);
      throw error;
    }
  }
};
