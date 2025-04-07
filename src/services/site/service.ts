
import { ApiResponse, createSuccessResponse, createErrorResponse } from "@/types/api-response";
import { fetchSiteById, fetchSites, createSite, updateSite, deleteSite, fetchClientSites } from "./api";
import { SiteInsertData, SiteUpdateData, SiteData, SiteApiResponse, SitesApiResponse } from "./types";

export const getSites = async (): Promise<ApiResponse<SiteData[]>> => {
  try {
    const response = await fetchSites();
    return createSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createErrorResponse('server', error.message);
  }
};

export const getSiteById = async (id: string): Promise<ApiResponse<SiteData>> => {
  try {
    const response = await fetchSiteById(id);
    return createSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createErrorResponse('server', error.message);
  }
};

export const addSite = async (site: SiteInsertData): Promise<ApiResponse<SiteData>> => {
  try {
    const response = await createSite(site);
    return createSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createErrorResponse('server', error.message);
  }
};

export const editSite = async (id: string, site: SiteUpdateData): Promise<ApiResponse<SiteData>> => {
  try {
    const response = await updateSite(id, site);
    return createSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createErrorResponse('server', error.message);
  }
};

export const removeSite = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await deleteSite(id);
    return createSuccessResponse(undefined, response.message);
  } catch (error: any) {
    return createErrorResponse('server', error.message);
  }
};

export const getClientSites = async (clientId: string): Promise<ApiResponse<SiteData[]>> => {
  try {
    const response = await fetchClientSites(clientId);
    return createSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createErrorResponse('server', error.message);
  }
};
