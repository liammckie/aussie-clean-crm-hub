
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

// Type definitions for Client data
export type Client = Database['public']['Tables']['clients']['Row'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];

// Type definition for ClientWithContacts
export type ClientWithContacts = Client & {
  contacts: Database['public']['Tables']['client_contacts']['Row'][];
};

// Error handling wrapper
const handleError = (error: unknown, customMessage: string) => {
  console.error(`${customMessage}:`, error);
  toast({
    title: 'Error',
    description: customMessage,
    variant: 'destructive',
  });
  return null;
};

/**
 * Client Service - Handles all client-related operations with Supabase
 */
export const clientService = {
  /**
   * Get all clients
   * @returns Array of clients or null on error
   */
  async getClients(): Promise<Client[] | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Failed to fetch clients');
    }
  },

  /**
   * Get client by ID
   * @param id The client ID
   * @returns Client object or null if not found/error
   */
  async getClientById(id: string): Promise<ClientWithContacts | null> {
    try {
      // Get the client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (clientError) throw clientError;

      // Get the client contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', id);
      
      if (contactsError) throw contactsError;
      
      return { ...client, contacts: contacts || [] };
    } catch (error) {
      return handleError(error, 'Failed to fetch client details');
    }
  },

  /**
   * Create a new client
   * @param client The client data to insert
   * @returns The created client or null on error
   */
  async createClient(client: ClientInsert): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Client created successfully',
      });
      
      return data;
    } catch (error) {
      return handleError(error, 'Failed to create client');
    }
  },

  /**
   * Update an existing client
   * @param id The client ID
   * @param updates The client data to update
   * @returns The updated client or null on error
   */
  async updateClient(id: string, updates: ClientUpdate): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });
      
      return data;
    } catch (error) {
      return handleError(error, 'Failed to update client');
    }
  },

  /**
   * Delete a client
   * @param id The client ID to delete
   * @returns True if successful, false on error
   */
  async deleteClient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to delete client');
      return false;
    }
  },

  /**
   * Get client sites
   * @param clientId The client ID
   * @returns Array of sites or null on error
   */
  async getClientSites(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Failed to fetch client sites');
    }
  },

  /**
   * Get client contracts
   * @param clientId The client ID
   * @returns Array of contracts or null on error
   */
  async getClientContracts(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Failed to fetch client contracts');
    }
  },
};
