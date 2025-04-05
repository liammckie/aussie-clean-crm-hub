
import { isSupabaseError } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError, logSuccess } from '@/utils/supabaseErrors';
import { validationService } from './validation.service';
import { Tables } from '@/integrations/supabase/types';

// Client status type to match database enum
export type ClientStatus = 'Active' | 'Prospect' | 'On Hold' | 'Cancelled';

// Client data types
export interface ClientFormData {
  business_name: string;
  trading_name?: string | null;
  abn?: string | null;
  acn?: string | null;
  industry?: string | null;
  status: ClientStatus;
  onboarding_date?: string | null;
  source?: string | null;
  // Billing fields
  billing_cycle?: string | null;
  payment_terms?: string | null;
  payment_method?: string | null;
  tax_status?: string | null;
  credit_limit?: number | null;
}

// Error response for validation errors
export interface ValidationErrorResponse {
  category: 'validation';
  message: string;
  details?: { field?: string };
}

// Client service containing all client-related operations
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

      // Format business identifiers for display
      const formattedData = data.map(client => ({
        ...client,
        abn: client.abn ? validationService.formatABN(client.abn) : null,
        acn: client.acn ? validationService.formatACN(client.acn) : null
      }));

      logSuccess('fetch', 'clients', formattedData);
      return { data: formattedData, error: null };
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
        .select(`
          *,
          client_contacts(*)
        `)
        .eq('id', clientId)
        .single();

      if (error) {
        throw error;
      }
      
      // Format business identifiers for display
      const formattedData = {
        ...data,
        abn: data.abn ? validationService.formatABN(data.abn) : null,
        acn: data.acn ? validationService.formatACN(data.acn) : null
      };
      
      logSuccess('fetch', 'client', formattedData);
      return { data: formattedData, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch client with ID ${clientId}`,
        { operation: 'getClientById', clientId }
      );
    }
  },

  // Create a new client
  createClient: async (client: ClientFormData): Promise<{ data: Tables<'clients'> | null; error: null } | ValidationErrorResponse | ErrorResponse> => {
    try {
      // Format and validate business identifiers
      const formattedClient = {
        ...client,
        abn: client.abn ? validationService.cleanBusinessIdentifier(client.abn) : null,
        acn: client.acn ? validationService.cleanBusinessIdentifier(client.acn) : null
      };
      
      // ABN validation (if provided)
      if (formattedClient.abn && !validationService.isValidABN(formattedClient.abn)) {
        return {
          category: 'validation',
          message: 'Invalid ABN provided. Please check and try again.',
          details: { field: 'abn' }
        };
      }
      
      // ACN validation (if provided)
      if (formattedClient.acn && !validationService.isValidACN(formattedClient.acn)) {
        return {
          category: 'validation',
          message: 'Invalid ACN provided. Please check and try again.',
          details: { field: 'acn' }
        };
      }

      console.log('Submitting client data to Supabase:', formattedClient);
      const { data, error } = await supabase
        .from('clients')
        .insert(formattedClient)
        .select()
        .single();

      if (error) {
        console.error('Supabase error during client creation:', error);
        throw error;
      }

      logSuccess('create', 'client', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in createClient:', error);
      return handleSupabaseError(
        error,
        'Failed to create client',
        { operation: 'createClient', client }
      );
    }
  },

  // Update an existing client
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>) => {
    try {
      // Format and validate business identifiers
      const formattedData = {
        ...clientData,
        abn: clientData.abn ? validationService.cleanBusinessIdentifier(clientData.abn) : undefined,
        acn: clientData.acn ? validationService.cleanBusinessIdentifier(clientData.acn) : undefined
      };
      
      // ABN validation
      if (formattedData.abn && !validationService.isValidABN(formattedData.abn)) {
        return {
          category: 'validation',
          message: 'Invalid ABN provided. Please check and try again.',
          details: { field: 'abn' }
        };
      }
      
      // ACN validation (if provided)
      if (formattedData.acn && !validationService.isValidACN(formattedData.acn)) {
        return {
          category: 'validation',
          message: 'Invalid ACN provided. Please check and try again.',
          details: { field: 'acn' }
        };
      }

      const { data, error } = await supabase
        .from('clients')
        .update(formattedData)
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

  // Get client contacts by client ID
  getClientContacts: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });

      if (error) {
        throw error;
      }

      logSuccess('fetch', 'client_contacts', data);
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch contacts for client with ID ${clientId}`,
        { operation: 'getClientContacts', clientId }
      );
    }
  },

  // Create a new client contact
  createClientContact: async (clientId: string, contactData: any) => {
    try {
      // Add client ID to contact data
      const contact = {
        ...contactData,
        client_id: clientId
      };

      const { data, error } = await supabase
        .from('client_contacts')
        .insert(contact)
        .select()
        .single();

      if (error) {
        throw error;
      }

      logSuccess('create', 'client_contact', data);
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create client contact',
        { operation: 'createClientContact', clientId, contactData }
      );
    }
  }
};
