
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSites, getSiteById, getClientSites, createSite, updateSite, deleteSite } from "@/services/site/service";
import { SiteInsertData, SiteUpdateData } from "@/services/site/types";
import { ApiResponse, isApiError } from "@/types/api-response";

export const useSites = () => {
  const query = useQuery({
    queryKey: ['sites'],
    queryFn: getSites
  });
  
  // Extract data safely
  const sites = query.data && !isApiError(query.data) ? query.data.data : [];
  
  return {
    sites,
    isLoadingSites: query.isLoading,
    errorSites: query.error,
    refetchSites: query.refetch,
    query
  };
};

export const useClientSites = (clientId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sites', 'client', clientId],
    queryFn: () => getClientSites(clientId),
    enabled: !!clientId
  });
  
  // Safely extract sites from the API response
  const sites = data && !isApiError(data) ? data.data : [];
  
  return {
    sites,
    isLoadingSites: isLoading,
    errorSites: error,
    refetchSites: refetch
  };
};

export const useSiteById = (id: string) => {
  return useQuery({
    queryKey: ['site', id],
    queryFn: () => getSiteById(id),
    enabled: !!id
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (site: SiteInsertData) => createSite(site),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, site }: { id: string; site: SiteUpdateData }) => updateSite(id, site),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
    }
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });
};
