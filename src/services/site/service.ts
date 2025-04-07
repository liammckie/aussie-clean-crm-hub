
import { SiteInsertData, SiteData, SiteUpdateData } from './types';
import { siteApi } from './api';
import { createErrorResponse, createSuccessResponse } from '@/types/api-response';
import { ApiResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

export async function getSites(): Promise<ApiResponse<SiteData[]>> {
  try {
    const sites = await siteApi.fetchAllSites();
    return createSuccessResponse(sites.data, 'Sites retrieved successfully');
  } catch (error) {
    return createErrorResponse(ErrorCategory.SERVER, 'Failed to retrieve sites', { error });
  }
}

export async function getSiteById(siteId: string): Promise<ApiResponse<SiteData>> {
  try {
    const site = await siteApi.fetchSiteById(siteId);
    return createSuccessResponse(site.data, 'Site retrieved successfully');
  } catch (error) {
    return createErrorResponse(ErrorCategory.SERVER, 'Failed to retrieve site', { error });
  }
}

export async function getClientSites(clientId: string): Promise<ApiResponse<SiteData[]>> {
  try {
    const sites = await siteApi.fetchClientSites(clientId);
    return createSuccessResponse(sites.data, 'Client sites retrieved successfully');
  } catch (error) {
    return createErrorResponse(ErrorCategory.SERVER, 'Failed to retrieve client sites', { error });
  }
}

export async function createSite(siteData: SiteInsertData): Promise<ApiResponse<SiteData>> {
  try {
    const site = await siteApi.createSite(siteData);
    return createSuccessResponse(site.data, 'Site created successfully');
  } catch (error) {
    return createErrorResponse(ErrorCategory.SERVER, 'Failed to create site', { error });
  }
}

export async function updateSite(siteId: string, siteData: SiteUpdateData): Promise<ApiResponse<SiteData>> {
  try {
    const site = await siteApi.updateSite(siteId, siteData);
    return createSuccessResponse(site.data, 'Site updated successfully');
  } catch (error) {
    return createErrorResponse(ErrorCategory.SERVER, 'Failed to update site', { error });
  }
}

export async function deleteSite(siteId: string): Promise<ApiResponse<boolean>> {
  try {
    await siteApi.deleteSite(siteId);
    return createSuccessResponse(true, 'Site deleted successfully');
  } catch (error) {
    return createErrorResponse(ErrorCategory.SERVER, 'Failed to delete site', { error });
  }
}

// Add aliases for backward compatibility with existing code
export const addSite = createSite;
export const editSite = updateSite;
export const removeSite = deleteSite;
