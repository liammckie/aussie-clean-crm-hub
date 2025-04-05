import { isSupabaseError } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError, logSuccess } from '@/utils/supabaseErrors';

// Get all clients from the database
export const clientService = {
  // Get all clients
  getAllClients: async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) {
        throw error;
      }

      logSuccess('fetch', 'clients', data);
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to fetch clients',
        { operation: 'getAllClients' }
      );
    }
  },

  // Get client by ID
  getClientById: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        throw error;
      }
      
      logSuccess('fetch', 'client', data);
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch client with ID ${clientId}`,
        { operation: 'getClientById', clientId }
      );
    }
  },

  // Create a new client
  createClient: async (client: any) => {
    try {
      // Format ABN/ACN if provided
      let formattedClient = client;
      
      if (client.abn || client.acn) {
        formattedClient = {
          ...client,
          abn: client.abn ? client.abn.replace(/\s/g, '') : null,
          acn: client.acn ? client.acn.replace(/\s/g, '') : null
        };
      }

      const { data, error } = await supabase
        .from('clients')
        .insert(formattedClient)
        .select()
        .single();

      if (error) {
        throw error;
      }

      logSuccess('create', 'client', data);
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create client',
        { operation: 'createClient', client }
      );
    }
  },

  // Update an existing client
  updateClient: async (clientId: string, clientData: any) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      logSuccess('update', 'client', data);
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to update client with ID ${clientId}`,
        { operation: 'updateClient', clientId, clientData }
      );
    }
  },

  // Delete a client by ID
  deleteClient: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      logSuccess('delete', 'client', { clientId });
      return { success: true, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to delete client with ID ${clientId}`,
        { operation: 'deleteClient', clientId }
      );
    }
  },

  // Format business identifiers (ABN, ACN) before saving
  formatBusinessIdentifiers: (data: { abn?: string, acn?: string }) => {
    // This function has issues with a missing required field
    // We need to use a different approach or ensure business_name is provided
    // For now, we'll just return the data unchanged
    return data;
  }
};
