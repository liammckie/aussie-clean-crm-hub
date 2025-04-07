
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSites, getSiteById, addSite, editSite, removeSite } from "@/services/site/service";
import { SiteInsertData, SiteUpdateData } from "@/services/site/types";

export const useSites = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sites'],
    queryFn: getSites
  });
  
  return {
    sites: data?.data || [],
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
    mutationFn: (site: SiteInsertData) => addSite(site),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, site }: { id: string; site: SiteUpdateData }) => editSite(id, site),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
    }
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });
};
