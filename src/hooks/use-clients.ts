
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService, Client, ClientInsert, ClientUpdate, ClientWithContacts } from '@/services/client.service';
import { toast } from '@/components/ui/use-toast';

// Query keys for React Query
const QUERY_KEYS = {
  clients: 'clients',
  client: (id?: string) => ['client', id],
  clientSites: (clientId: string) => ['client', clientId, 'sites'],
  clientContracts: (clientId: string) => ['client', clientId, 'contracts'],
};

/**
 * Hook to fetch all clients using React Query
 */
export function useClients() {
  return useQuery({
    queryKey: [QUERY_KEYS.clients],
    queryFn: clientService.getClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single client by ID using React Query
 */
export function useClient(id?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.client(id),
    queryFn: () => id ? clientService.getClientById(id) : null,
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch client sites using React Query
 */
export function useClientSites(clientId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.clientSites(clientId || ''),
    queryFn: () => clientId ? clientService.getClientSites(clientId) : null,
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch client contracts using React Query
 */
export function useClientContracts(clientId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.clientContracts(clientId || ''),
    queryFn: () => clientId ? clientService.getClientContracts(clientId) : null,
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for client operations (create, update, delete) with React Query
 */
export function useClientOperations() {
  const queryClient = useQueryClient();

  // Create client mutation
  const createClient = useMutation({
    mutationFn: clientService.createClient,
    onSuccess: (data) => {
      if (data) {
        // Invalidate clients list to refresh data
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients] });
      }
    },
  });

  // Update client mutation
  const updateClient = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ClientUpdate }) => 
      clientService.updateClient(id, updates),
    onSuccess: (data, variables) => {
      if (data) {
        // Invalidate specific client and clients list
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.client(variables.id) });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients] });
      }
    },
  });

  // Delete client mutation
  const deleteClient = useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: (success, id) => {
      if (success) {
        // Remove client from cache and invalidate clients list
        queryClient.removeQueries({ queryKey: QUERY_KEYS.client(id) });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients] });
      }
    },
  });

  return {
    createClient: createClient.mutateAsync,
    updateClient: (id: string, updates: ClientUpdate) => updateClient.mutateAsync({ id, updates }),
    deleteClient: deleteClient.mutateAsync,
    isLoading: createClient.isPending || updateClient.isPending || deleteClient.isPending,
    isError: createClient.isError || updateClient.isError || deleteClient.isError,
    error: createClient.error || updateClient.error || deleteClient.error,
  };
}

// Legacy hooks for backward compatibility
/**
 * Legacy hook to fetch all clients
 * @deprecated Use useClients from React Query instead
 */
export function useClientsLegacy() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients
  };
}

/**
 * Legacy hook to fetch a single client by ID
 * @deprecated Use useClient from React Query instead
 */
export function useClientLegacy(id?: string) {
  const [client, setClient] = useState<ClientWithContacts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = async () => {
    if (!id) {
      setClient(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getClientById(id);
      setClient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching client');
      console.error('Error fetching client:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  return {
    client,
    loading,
    error,
    refetch: fetchClient
  };
}

/**
 * Legacy hook for client operations
 * @deprecated Use useClientOperations from React Query instead
 */
export function useClientOperationsLegacy() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (client: ClientInsert): Promise<Client | null> => {
    try {
      setLoading(true);
      setError(null);
      return await clientService.createClient(client);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating client';
      setError(errorMessage);
      console.error('Error creating client:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, updates: ClientUpdate): Promise<Client | null> => {
    try {
      setLoading(true);
      setError(null);
      return await clientService.updateClient(id, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating client';
      setError(errorMessage);
      console.error('Error updating client:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await clientService.deleteClient(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting client';
      setError(errorMessage);
      console.error('Error deleting client:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createClient,
    updateClient,
    deleteClient,
    loading,
    error
  };
}
