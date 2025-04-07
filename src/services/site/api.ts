
import { supabase } from "../supabase";
import { SiteData, SiteInsertData, SiteUpdateData, SiteApiResponse, SitesApiResponse } from "./types";

export const fetchSites = async (): Promise<SitesApiResponse> => {
  const { data, error } = await supabase
    .from('sites')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data as SiteData[],
    message: "Sites fetched successfully"
  };
};

export const fetchSiteById = async (id: string): Promise<SiteApiResponse> => {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data as SiteData,
    message: "Site fetched successfully"
  };
};

export const createSite = async (site: SiteInsertData): Promise<SiteApiResponse> => {
  const { data, error } = await supabase
    .from('sites')
    .insert([site])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data as SiteData,
    message: "Site created successfully"
  };
};

export const updateSite = async (id: string, site: SiteUpdateData): Promise<SiteApiResponse> => {
  const { data, error } = await supabase
    .from('sites')
    .update(site)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data as SiteData,
    message: "Site updated successfully"
  };
};

export const deleteSite = async (id: string): Promise<{ success: boolean; message: string }> => {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    message: "Site deleted successfully"
  };
};
