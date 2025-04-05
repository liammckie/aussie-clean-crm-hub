
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService, ClientFormData } from '@/services/client.service';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';
import { useClientsRealtimeSync } from './use-realtime-sync';

/**
 * Hook for accessing client data and operations
 */
export const useClients = () => {
  const queryClient = useQueryClient();
  
  // Enable real-time sync for clients
  useClientsRealtimeSync();
  
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
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      return response.data;
    }
  });

  // Query to fetch a single client by ID
  const useClientDetails = (clientId: string | undefined) => {
    return useQuery({
      queryKey: ['client', clientId],
      queryFn: async () => {
        if (!clientId) throw new Error('Client ID is required');
        
        const response = await clientService.getClientById(clientId);
        if ('category' in response) {
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: !!clientId,
    });
  };

  // Mutation to create a new client
  const createClientMutation = useMutation({
    mutationFn: async (clientData: ClientFormData) => {
      const response = await clientService.createClient(clientData);
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to create client');
    }
  });

  // Mutation to update an existing client
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClientFormData> }) => {
      const response = await clientService.updateClient(id, data);
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
      toast.success('Client updated successfully!');
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to update client');
    }
  });

  // Mutation to delete a client
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const response = await clientService.deleteClient(clientId);
      if ('category' in response) {
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client deleted successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to delete client');
    }
  });

  // Query to fetch client contacts
  const useClientContacts = (clientId: string | undefined) => {
    return useQuery({
      queryKey: ['client-contacts', clientId],
      queryFn: async () => {
        if (!clientId) throw new Error('Client ID is required');
        
        const response = await clientService.getClientContacts(clientId);
        if ('category' in response) {
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: !!clientId,
    });
  };

  return {
    // Data queries
    clients,
    isLoadingClients,
    clientsError,
    refetchClients,
    useClientDetails,
    useClientContacts,
    
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
