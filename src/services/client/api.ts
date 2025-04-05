
import { supabase } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError } from '@/utils/supabaseErrors';
import { ClientFormData, ContactFormData, ValidationErrorResponse, ClientRecord } from './types';

/**
 * Client API service - handles raw Supabase calls for client data
 */
export const clientApi = {
  /**
   * Fetch all clients from the database
   */
  fetchAllClients: async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to fetch clients',
        { operation: 'fetchAllClients' }
      );
    }
  },

  /**
   * Fetch a single client by ID, including contacts
   */
  fetchClientById: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_contacts(*)
        `)
        .eq('id', clientId)
        .single();

      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch client with ID ${clientId}`,
        { operation: 'fetchClientById', clientId }
      );
    }
  },

  /**
   * Create a new client
   */
  createClient: async (clientData: ClientFormData) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create client',
        { operation: 'createClient', clientData }
      );
    }
  },

  /**
   * Update an existing client
   */
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>) => {
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

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to update client with ID ${clientId}`,
        { operation: 'updateClient', clientId, clientData }
      );
    }
  },

  /**
   * Delete a client by ID
   */
  deleteClient: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to delete client with ID ${clientId}`,
        { operation: 'deleteClient', clientId }
      );
    }
  },

  /**
   * Fetch client contacts
   */
  fetchClientContacts: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch contacts for client with ID ${clientId}`,
        { operation: 'fetchClientContacts', clientId }
      );
    }
  },

  /**
   * Create a client contact
   */
  createClientContact: async (contactData: ContactFormData) => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create client contact',
        { operation: 'createClientContact', contactData }
      );
    }
  }
};
