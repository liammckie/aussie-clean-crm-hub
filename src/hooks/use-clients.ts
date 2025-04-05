
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/client.service';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * Hook for accessing client data and operations
 */
export const useClients = () => {
  const queryClient = useQueryClient();
  
  // Query to fetch all clients
  const { 
    data: clients, 
    isLoading: isLoadingClients,
    error: clientsError,
    refetch: refetchClients
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientService.getAllClients();
      if ('category' in response) {
        throw new Error(response.message);
      }
      return response.data;
    }
  });

  // Query to fetch a single client by ID
  const getClientById = (clientId: string) => {
    return useQuery({
      queryKey: ['client', clientId],
      queryFn: async () => {
        const response = await clientService.getClientById(clientId);
        if ('category' in response) {
          throw new Error(response.message);
        }
        return response.data;
      }
    });
  };

  // Mutation to create a new client
  const createClientMutation = useMutation({
    mutationFn: async (clientData: any) => {
      const response = await clientService.createClient(clientData);
      if ('category' in response) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  // Mutation to update an existing client
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await clientService.updateClient(id, data);
      if ('category' in response) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
    }
  });

  // Mutation to delete a client
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const response = await clientService.deleteClient(clientId);
      if ('category' in response) {
        throw new Error(response.message);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  return {
    // Data queries
    clients,
    isLoadingClients,
    clientsError,
    refetchClients,
    getClientById,
    
    // Mutations
    createClient: createClientMutation.mutate,
    isCreatingClient: createClientMutation.isPending,
    createClientError: createClientMutation.error,
    
    updateClient: updateClientMutation.mutate,
    isUpdatingClient: updateClientMutation.isPending,
    updateClientError: updateClientMutation.error,
    
    deleteClient: deleteClientMutation.mutate,
    isDeletingClient: deleteClientMutation.isPending,
    deleteClientError: deleteClientMutation.error
  };
};
