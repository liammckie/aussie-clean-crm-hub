
import { supabase } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError } from '@/utils/supabaseErrors';

// Define types for site data aligned with the database schema
export type SiteStatus = 'active' | 'inactive' | 'pending_activation' | 'archived';
export type SiteType = 'office' | 'retail' | 'warehouse' | 'industrial' | 'residential' | 'educational' | 'medical' | 'hospitality';

export interface SiteData {
  id?: string;
  client_id: string;
  site_name: string;
  site_code: string;
  address_line_1: string;
  address_line_2?: string | null;
  suburb: string;
  state: string;
  postcode: string;
  country?: string;
  site_contact_name?: string | null;
  site_contact_email?: string | null;
  site_contact_phone?: string | null;
  status: SiteStatus;
  site_type?: SiteType | null;
  square_meters?: number | null;
  region?: string | null;
  notes?: string | null;
  induction_required?: boolean;
}

// Site service for interacting with the sites table
export const siteService = {
  // Get all sites for a client
  getClientSites: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('client_id', clientId)
        .order('site_name', { ascending: true });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch sites for client ${clientId}`,
        { operation: 'getClientSites', clientId }
      );
    }
  },

  // Get a single site
  getSiteById: async (siteId: string) => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch site with ID ${siteId}`,
        { operation: 'getSiteById', siteId }
      );
    }
  },

  // Create a new site
  createSite: async (siteData: SiteData) => {
    try {
      const siteToInsert = {
        ...siteData,
        country: siteData.country || 'Australia', // Default to Australia if not specified
      };
      
      const { data, error } = await supabase
        .from('sites')
        .insert(siteToInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create site',
        { operation: 'createSite', siteData }
      );
    }
  },

  // Update an existing site
  updateSite: async (siteId: string, siteData: Partial<SiteData>) => {
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

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to update site with ID ${siteId}`,
        { operation: 'updateSite', siteId, siteData }
      );
    }
  },

  // Delete a site
  deleteSite: async (siteId: string) => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to delete site with ID ${siteId}`,
        { operation: 'deleteSite', siteId }
      );
    }
  },
};
