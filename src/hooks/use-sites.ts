
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { siteService, SiteData } from '@/services/site';
import { ErrorReporting } from '@/utils/errorReporting';

export const useSites = (clientId?: string) => {
  const queryClient = useQueryClient();
  
  // Query to fetch all sites for a client
  const { 
    data: sites, 
    isLoading: isLoadingSites,
    error: sitesError,
    refetch: refetchSites
  } = useQuery({
    queryKey: ['client-sites', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const response = await siteService.getClientSites(clientId);
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled: !!clientId,
  });

  // Query to fetch a single site by ID
  const useSiteDetails = (siteId: string | undefined) => {
    return useQuery({
      queryKey: ['site', siteId],
      queryFn: async () => {
        if (!siteId) throw new Error('Site ID is required');
        
        const response = await siteService.getSiteById(siteId);
        if ('category' in response) {
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: !!siteId,
    });
  };

  // Mutation to create a new site
  const createSiteMutation = useMutation({
    mutationFn: async (data: SiteData) => {
      const response = await siteService.createSite(data);
      
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-sites', clientId] });
      toast.success('Site created successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to create site');
    }
  });

  // Mutation to update an existing site
  const updateSiteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SiteData> }) => {
      const response = await siteService.updateSite(id, data);
      
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-sites', clientId] });
      queryClient.invalidateQueries({ queryKey: ['site', data.id] });
      toast.success('Site updated successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to update site');
    }
  });

  // Mutation to delete a site
  const deleteSiteMutation = useMutation({
    mutationFn: async (siteId: string) => {
      const response = await siteService.deleteSite(siteId);
      
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-sites', clientId] });
      toast.success('Site deleted successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to delete site');
    }
  });

  return {
    sites,
    isLoadingSites,
    sitesError,
    refetchSites,
    useSiteDetails,
    
    createSite: createSiteMutation.mutate,
    isCreatingSite: createSiteMutation.isPending,
    
    updateSite: updateSiteMutation.mutate,
    isUpdatingSite: updateSiteMutation.isPending,
    
    deleteSite: deleteSiteMutation.mutate,
    isDeletingSite: deleteSiteMutation.isPending,
  };
};
