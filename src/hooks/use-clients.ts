
import { useState, useEffect } from 'react';
import { clientService, Client, ClientInsert, ClientUpdate, ClientWithContacts } from '@/services/client.service';

type ClientsState = {
  clients: Client[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

type ClientState = {
  client: ClientWithContacts | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * Hook to fetch all clients
 */
export function useClients(): ClientsState {
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
 * Hook to fetch a single client by ID
 */
export function useClient(id?: string): ClientState {
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
 * Hook for client operations (create, update, delete)
 */
export function useClientOperations() {
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
