
import { supabase } from '@/integrations/supabase/client';
import { SiteData } from './types';
import { ErrorResponse, handleSupabaseError, logSuccess } from '@/utils/supabaseErrors';

/**
 * Get all sites
 */
export async function getAllSites() {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'sites', data);
    return { data: data as SiteData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch sites');
  }
}

/**
 * Get sites for a specific client
 */
export async function getClientSites(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    logSuccess('Retrieved', 'client sites', data);
    return { data: data as SiteData[] };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch client sites');
  }
}

/**
 * Get a site by ID
 */
export async function getSiteById(siteId: string) {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single();

    if (error) throw error;

    logSuccess('Retrieved', 'site', data);
    return { data: data as SiteData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to fetch site details');
  }
}

/**
 * Create a new site
 */
export async function createSite(siteData: Omit<SiteData, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('sites')
      .insert([siteData])
      .select()
      .single();

    if (error) throw error;

    logSuccess('Created', 'site', data);
    return { data: data as SiteData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to create site');
  }
}

/**
 * Update an existing site
 */
export async function updateSite(siteId: string, siteData: Partial<SiteData>) {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update(siteData)
      .eq('id', siteId)
      .select()
      .single();

    if (error) throw error;

    logSuccess('Updated', 'site', data);
    return { data: data as SiteData };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to update site');
  }
}

/**
 * Delete a site
 */
export async function deleteSite(siteId: string) {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId);

    if (error) throw error;

    logSuccess('Deleted', 'site', { id: siteId });
    return { data: true };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to delete site');
  }
}
