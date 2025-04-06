
import { supabase } from '@/integrations/supabase/client';
import { SiteData, SiteInsertData, SiteUpdateData, SiteResponse, SitesResponse, SiteApiResponse, SitesApiResponse } from './types';
import { prepareForDb } from '@/utils/db-type-helpers';

export const siteService = {
  /**
   * Create a new site
   */
  createSite: async (siteData: SiteInsertData): Promise<SiteData> => {
    // Prepare the data for insertion
    const preparedData = prepareForDb(siteData);
    
    const { data, error } = await supabase
      .from('sites')
      .insert(preparedData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating site:', error);
      throw new Error(`Failed to create site: ${error.message}`);
    }
    
    return data as SiteData;
  },

  /**
   * Get a site by ID - legacy method, use getSiteById instead
   */
  getSite: async (siteId: string): Promise<SiteData> => {
    return siteService.getSiteById(siteId);
  },

  /**
   * Get a site by ID
   */
  getSiteById: async (siteId: string): Promise<SiteData> => {
    const { data, error } = await supabase
      .from('sites')
      .select()
      .eq('id', siteId)
      .single();
    
    if (error) {
      console.error('Error fetching site:', error);
      throw new Error(`Site not found: ${error.message}`);
    }
    
    return data as SiteData;
  },

  /**
   * Get all sites
   */
  getAllSites: async (): Promise<SiteData[]> => {
    const { data, error } = await supabase
      .from('sites')
      .select()
      .order('site_name');
    
    if (error) {
      console.error('Error fetching sites:', error);
      throw new Error(`Failed to fetch sites: ${error.message}`);
    }
    
    return data as SiteData[];
  },

  /**
   * Get sites for a specific client
   */
  getClientSites: async (clientId: string): Promise<SiteData[]> => {
    const { data, error } = await supabase
      .from('sites')
      .select()
      .eq('client_id', clientId)
      .order('site_name');
    
    if (error) {
      console.error('Error fetching client sites:', error);
      throw new Error(`Failed to fetch client sites: ${error.message}`);
    }
    
    return data as SiteData[];
  },

  /**
   * Update a site
   */
  updateSite: async (siteId: string, siteData: SiteUpdateData): Promise<SiteData> => {
    // Prepare the data for update
    const preparedData = prepareForDb(siteData);
    
    const { data, error } = await supabase
      .from('sites')
      .update(preparedData)
      .eq('id', siteId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating site:', error);
      throw new Error(`Failed to update site: ${error.message}`);
    }
    
    return data as SiteData;
  },

  /**
   * Delete a site
   */
  deleteSite: async (siteId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId);
    
    if (error) {
      console.error('Error deleting site:', error);
      throw new Error(`Failed to delete site: ${error.message}`);
    }
    
    return true;
  }
};
