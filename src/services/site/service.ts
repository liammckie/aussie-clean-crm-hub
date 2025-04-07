
import { ApiResponse, createApiErrorResponse, createApiSuccessResponse } from "@/types/api-response";
import { fetchSiteById, fetchSites, createSite, updateSite, deleteSite } from "./api";
import { SiteApiResponse, SitesApiResponse, SiteInsertData, SiteUpdateData, SiteData, SiteRecord } from "./types";

export const getSites = async (): Promise<ApiResponse<SiteData[]>> => {
  try {
    const response = await fetchSites();
    return createApiSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createApiErrorResponse('server', error.message);
  }
};

export const getSiteById = async (id: string): Promise<ApiResponse<SiteData>> => {
  try {
    const response = await fetchSiteById(id);
    return createApiSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createApiErrorResponse('server', error.message);
  }
};

export const addSite = async (site: SiteInsertData): Promise<ApiResponse<SiteData>> => {
  try {
    const response = await createSite(site);
    return createApiSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createApiErrorResponse('server', error.message);
  }
};

export const editSite = async (id: string, site: SiteUpdateData): Promise<ApiResponse<SiteData>> => {
  try {
    const response = await updateSite(id, site);
    return createApiSuccessResponse(response.data, response.message);
  } catch (error: any) {
    return createApiErrorResponse('server', error.message);
  }
};

export const removeSite = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await deleteSite(id);
    return createApiSuccessResponse(undefined, response.message);
  } catch (error: any) {
    return createApiErrorResponse('server', error.message);
  }
};
