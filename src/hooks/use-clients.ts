
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/client';
import { useOptimizedQuery } from './use-optimized-query';
import { ClientFormData, ClientRecord, prepareClientDataForSubmission } from '@/types/clients';
import { isApiSuccess } from '@/types/api-response';
import { toast } from 'sonner';

/**
 * Custom hook for clients data and operations
 */
export function useClients() {
  const queryClient = useQueryClient();
  
  /**
   * Query to fetch all clients
   */
  const useAllClients = () => {
    return useQuery({
      queryKey: ['clients'],
      queryFn: async () => {
        const response = await clientService.getAllClients();
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      }
    });
  };
  
  /**
   * Optimized query to fetch all clients
   */
  const useOptimizedClients = () => {
    return useOptimizedQuery(
      ['clients'], 
      async () => {
        const response = await clientService.getAllClients();
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      }
    );
  };
  
  /**
   * Query to fetch a client by ID
   */
  const useClientDetails = (clientId: string | undefined) => {
    return useQuery({
      queryKey: ['clients', clientId],
      queryFn: async () => {
        if (!clientId) return null;
        
        const response = await clientService.getClientById(clientId);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: !!clientId
    });
  };
  
  /**
   * Mutation to create a new client
   */
  const useCreateClient = () => {
    return useMutation({
      mutationFn: async (clientData: ClientFormData) => {
        // Convert data to proper format for API submission
        const processedData = prepareClientDataForSubmission(clientData);
        
        const response = await clientService.createClient(processedData);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        toast.success('Client created successfully');
      },
      onError: (error: Error) => {
        toast.error(`Failed to create client: ${error.message}`);
      }
    });
  };
  
  /**
   * Mutation to update a client
   */
  const useUpdateClient = () => {
    return useMutation({
      mutationFn: async ({ clientId, clientData }: { clientId: string, clientData: Partial<ClientFormData> }) => {
        // Convert data to proper format for API submission
        const processedData = prepareClientDataForSubmission(clientData);
        
        const response = await clientService.updateClient(clientId, processedData);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId] });
        toast.success('Client updated successfully');
      },
      onError: (error: Error) => {
        toast.error(`Failed to update client: ${error.message}`);
      }
    });
  };
  
  /**
   * Mutation to delete a client
   */
  const useDeleteClient = () => {
    return useMutation({
      mutationFn: async (clientId: string) => {
        const response = await clientService.deleteClient(clientId);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        toast.success('Client deleted successfully');
      },
      onError: (error: Error) => {
        toast.error(`Failed to delete client: ${error.message}`);
      }
    });
  };
  
  /**
   * Query to fetch client contacts
   */
  const useClientContacts = (clientId: string | undefined) => {
    return useQuery({
      queryKey: ['clients', clientId, 'contacts'],
      queryFn: async () => {
        if (!clientId) return [];
        
        const response = await clientService.getClientContacts(clientId);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: !!clientId
    });
  };
  
  /**
   * Mutation to create a client contact
   */
  const useCreateContact = () => {
    return useMutation({
      mutationFn: async (params: { clientId: string, contactData: any }) => {
        const { clientId, contactData } = params;
        const response = await clientService.createClientContact(clientId, contactData);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId, 'contacts'] });
        queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId] });
        toast.success('Contact created successfully');
      },
      onError: (error: Error) => {
        toast.error(`Failed to create contact: ${error.message}`);
      }
    });
  };
  
  /**
   * Query to fetch client addresses
   */
  const useClientAddresses = (clientId: string | undefined) => {
    return useQuery({
      queryKey: ['clients', clientId, 'addresses'],
      queryFn: async () => {
        if (!clientId) return [];
        
        const response = await clientService.getClientAddresses(clientId);
        if (!isApiSuccess(response)) {
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: !!clientId
    });
  };

  // Return a highly structured object with all clients hooks
  const allClients = useAllClients();
  
  return {
    // The actual hook functions
    useAllClients,
    useOptimizedClients,
    useClientDetails,
    useCreateClient,
    useUpdateClient,
    useDeleteClient,
    useClientContacts,
    useCreateContact,
    useClientAddresses,
    
    // Direct access to client data (for backward compatibility)
    clients: allClients.data || [],
    isLoading: allClients.isLoading,
    isLoadingClients: allClients.isLoading,
    clientsError: allClients.error as Error,
    refetchClients: allClients.refetch
  };
}
