
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteService } from '@/services/site';
import { SiteData, SiteInsertData, SiteUpdateData } from '@/services/site/types';
import { toast } from 'sonner';

/**
 * Hook to fetch all sites
 */
export const useSites = () => {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      return siteService.getAllSites();
    },
  });
};

/**
 * Hook to fetch sites for a specific client
 */
export const useClientSites = (clientId: string) => {
  return useQuery({
    queryKey: ['sites', 'client', clientId],
    queryFn: async () => {
      return siteService.getClientSites(clientId);
    },
    enabled: !!clientId,
  });
};

/**
 * Hook to fetch a single site by ID
 */
export const useSite = (siteId?: string) => {
  return useQuery({
    queryKey: ['sites', siteId],
    queryFn: async () => {
      if (!siteId) throw new Error('Site ID is required');
      return siteService.getSiteById(siteId);
    },
    enabled: !!siteId,
  });
};

/**
 * Hook to create a new site
 */
export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSite: SiteInsertData) => siteService.createSite(newSite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site created successfully');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error creating site: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook to update an existing site
 */
export const useUpdateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ siteId, siteData }: { siteId: string; siteData: SiteUpdateData }) =>
      siteService.updateSite(siteId, siteData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site updated successfully');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error updating site: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook to delete a site
 */
export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (siteId: string) => siteService.deleteSite(siteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site deleted successfully');
      return true;
    },
    onError: (error: Error) => {
      toast.error(`Error deleting site: ${error.message}`);
      throw error;
    },
  });
};
