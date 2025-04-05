
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientFormData, ValidationErrorResponse, clientService, AddressFormData, ContactFormData } from '@/services/client';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';
import { useClientsRealtimeSync, useClientRealtimeSync, useClientContactsRealtimeSync, useClientAddressesRealtimeSync } from './use-realtime-sync';
import { ErrorResponse } from '@/utils/supabaseErrors';

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
      console.log('Fetching all clients...');
      const response = await clientService.getAllClients();
      if ('category' in response) {
        console.error('Error fetching clients:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      console.log('Fetched clients successfully:', response.data);
      return response.data || []; // Ensure we always return an array even if data is null
    }
  });

  // Query to fetch a single client by ID
  const useClientDetails = (clientId: string | undefined) => {
    // Set up realtime sync for this client's data when the hook is used
    useClientRealtimeSync(clientId);
    
    return useQuery({
      queryKey: ['client', clientId],
      queryFn: async () => {
        if (!clientId) throw new Error('Client ID is required');
        
        console.log(`Fetching client details for id ${clientId}...`);
        const response = await clientService.getClientById(clientId);
        if ('category' in response) {
          console.error(`Error fetching client ${clientId}:`, response);
          toast.error(`Error: ${response.message}`);
          throw new Error(response.message);
        }
        console.log(`Fetched client ${clientId} successfully:`, response.data);
        return response.data;
      },
      enabled: !!clientId,
    });
  };

  // Mutation to create a new client
  const createClientMutation = useMutation({
    mutationFn: async (clientData: ClientFormData) => {
      console.log('Creating new client with data:', clientData);
      const response = await clientService.createClient(clientData);
      
      // Handle validation errors specially by returning the error response
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during client creation:', response);
        return response as ValidationErrorResponse;
      }
      
      // Handle other types of errors by throwing
      if ('category' in response) {
        console.error('Error creating client:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Client created successfully:', response.data);
      // Return the successful data
      return response.data;
    },
    onSuccess: (data) => {
      // Only invalidate queries and show success if not a validation error
      if (!data || !('category' in data)) {
        console.log('Invalidating clients query after successful creation');
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        toast.success('Client created successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      // Error toast handled in component
    }
  });

  // Mutation to update an existing client
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClientFormData> }) => {
      console.log(`Updating client ${id} with data:`, data);
      const response = await clientService.updateClient(id, data);
      
      // Handle validation errors
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during client update:', response);
        return response as ValidationErrorResponse;
      }
      
      if ('category' in response) {
        console.error('Error updating client:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      console.log('Client updated successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Only invalidate queries if not a validation error
      if (!data || !('category' in data)) {
        console.log('Invalidating client queries after successful update');
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
        toast.success('Client updated successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      // Error is handled in component
    }
  });

  // Mutation to delete a client
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      console.log(`Deleting client ${clientId}`);
      const response = await clientService.deleteClient(clientId);
      if ('category' in response) {
        console.error('Error deleting client:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      console.log('Client deleted successfully');
      return true;
    },
    onSuccess: () => {
      console.log('Invalidating clients query after successful deletion');
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
    // Set up realtime sync for this client's contacts when the hook is used
    useClientContactsRealtimeSync(clientId);
    
    return useQuery({
      queryKey: ['client-contacts', clientId],
      queryFn: async () => {
        if (!clientId) throw new Error('Client ID is required');
        
        console.log(`Fetching contacts for client ${clientId}...`);
        const response = await clientService.getClientContacts(clientId);
        if ('category' in response) {
          console.error(`Error fetching contacts for client ${clientId}:`, response);
          throw new Error(response.message);
        }
        console.log(`Fetched contacts for client ${clientId} successfully:`, response.data);
        return response.data || []; // Ensure we always return an array
      },
      enabled: !!clientId,
    });
  };

  // Query to fetch client addresses
  const useClientAddresses = (clientId: string | undefined) => {
    // Set up realtime sync for this client's addresses when the hook is used
    useClientAddressesRealtimeSync(clientId);
    
    return useQuery({
      queryKey: ['client-addresses', clientId],
      queryFn: async () => {
        if (!clientId) throw new Error('Client ID is required');
        
        console.log(`Fetching addresses for client ${clientId}...`);
        const response = await clientService.getClientAddresses(clientId);
        if ('category' in response) {
          console.error(`Error fetching addresses for client ${clientId}:`, response);
          throw new Error(response.message);
        }
        console.log(`Fetched addresses for client ${clientId} successfully:`, response.data);
        return response.data || []; // Ensure we always return an array
      },
      enabled: !!clientId,
    });
  };

  // Mutation to create a client contact
  const createContactMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      contactData 
    }: { 
      clientId: string; 
      contactData: Omit<ContactFormData, 'client_id'> 
    }) => {
      console.log(`Creating contact for client ${clientId} with data:`, contactData);
      const response = await clientService.createClientContact(clientId, contactData);
      
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during contact creation:', response);
        return response as ValidationErrorResponse;
      }
      
      if ('category' in response) {
        console.error('Error creating contact:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Contact created successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (!data || !('category' in data)) {
        console.log('Invalidating client contacts query after successful creation');
        queryClient.invalidateQueries({ queryKey: ['client-contacts', variables.clientId] });
        queryClient.invalidateQueries({ queryKey: ['client', variables.clientId] });
        toast.success('Contact created successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to create a client address
  const createAddressMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      addressData 
    }: { 
      clientId: string; 
      addressData: Omit<AddressFormData, 'client_id'> 
    }) => {
      console.log(`Creating address for client ${clientId} with data:`, addressData);
      const response = await clientService.createClientAddress(clientId, addressData);
      
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during address creation:', response);
        return response as ValidationErrorResponse;
      }
      
      if ('category' in response) {
        console.error('Error creating address:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Address created successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (!data || !('category' in data)) {
        console.log('Invalidating client addresses query after successful creation');
        queryClient.invalidateQueries({ queryKey: ['client-addresses', variables.clientId] });
        queryClient.invalidateQueries({ queryKey: ['client', variables.clientId] });
        toast.success('Address created successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  return {
    // Data queries
    clients,
    isLoadingClients,
    clientsError,
    refetchClients,
    useClientDetails,
    useClientContacts,
    useClientAddresses,
    
    // Mutations
    createClient: createClientMutation.mutate,
    isCreatingClient: createClientMutation.isPending,
    createClientError: createClientMutation.error,
    
    updateClient: updateClientMutation.mutate,
    isUpdatingClient: updateClientMutation.isPending,
    updateClientError: updateClientMutation.error,
    
    deleteClient: deleteClientMutation.mutate,
    isDeletingClient: deleteClientMutation.isPending,
    deleteClientError: deleteClientMutation.error,
    
    createContact: createContactMutation.mutate,
    isCreatingContact: createContactMutation.isPending,
    
    createAddress: createAddressMutation.mutate,
    isCreatingAddress: createAddressMutation.isPending
  };
};
