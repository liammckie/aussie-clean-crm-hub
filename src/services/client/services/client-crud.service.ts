import { supabase } from '@/lib/supabase';
import { ClientRecord, ClientFormData } from '../types';
import { validateWithZod, clientSchema } from '../validation';
import { handleApiError } from '@/utils/api-utils';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ClientStatus } from '@/types/database-schema';

/**
 * Client CRUD service with methods for basic client management
 */
export const clientCrudService = {
  /**
   * Get all clients with optional filtering and sorting
   */
  getAllClients: async (): Promise<{ data: ClientRecord[] } | { error: any }> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) {
        return { error: handleApiError(error, 'Failed to fetch clients') };
      }

      return { data: data as ClientRecord[] };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error fetching clients') };
    }
  },

  /**
   * Get a specific client by ID
   */
  getClientById: async (clientId: string): Promise<{ data: ClientRecord } | { error: any }> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        return { error: handleApiError(error, 'Failed to fetch client', { clientId }) };
      }

      return { data: data as ClientRecord };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error fetching client', { clientId }) };
    }
  },

  /**
   * Create a new client
   */
  createClient: async (data: ClientFormData): Promise<{ data: ClientRecord } | { error: any }> => {
    const result = validateWithZod(clientSchema, data);

    if (!('data' in result)) {
      return { error: result };
    }

    try {
      const { data: createdClient, error } = await supabase
        .from('clients')
        .insert([result.data])
        .select()
        .single();

      if (error) {
        return { error: handleApiError(error, 'Failed to create client', { data }) };
      }

      AppLogger.log(LogCategory.API, 'Client created successfully', { clientId: createdClient.id });
      return { data: createdClient as ClientRecord };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error creating client', { data }) };
    }
  },

  /**
   * Update an existing client
   */
  updateClient: async (clientId: string, data: Partial<ClientFormData>): Promise<{ data: ClientRecord } | { error: any }> => {
    try {
      // Fetch the existing client data
      const { data: existingClient, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (fetchError) {
        return { error: handleApiError(fetchError, 'Failed to fetch existing client', { clientId }) };
      }

      if (!existingClient) {
        return { error: handleApiError(null, 'Client not found', { clientId }) };
      }

      // Ensure required fields like business_name are included
      const updatedClientData: ClientFormData = {
        business_name: data.business_name || existingClient.business_name, // Ensure business_name is available
        trading_name: data.trading_name || existingClient.trading_name,
        abn: data.abn || existingClient.abn,
        acn: data.acn || existingClient.acn,
        industry: data.industry || existingClient.industry,
        status: data.status || (existingClient.status as ClientStatus),
        onboarding_date: data.onboarding_date || existingClient.onboarding_date,
        source: data.source || existingClient.source,
        address_line_1: data.address_line_1 || existingClient.address_line_1,
        address_line_2: data.address_line_2 || existingClient.address_line_2,
        suburb: data.suburb || existingClient.suburb,
        state: data.state || existingClient.state,
        postcode: data.postcode || existingClient.postcode,
        country: data.country || existingClient.country || 'Australia',
        address: data.address || existingClient.address,
        phone: data.phone || existingClient.phone,
        billing_cycle: data.billing_cycle || existingClient.billing_cycle,
        payment_terms: data.payment_terms || existingClient.payment_terms,
        payment_method: data.payment_method || existingClient.payment_method,
        tax_status: data.tax_status || existingClient.tax_status,
        credit_limit: data.credit_limit || existingClient.credit_limit,
      };

      // Validate the updated client data
      const validationResult = validateWithZod(clientSchema, updatedClientData);
      if (!('data' in validationResult)) {
        return { error: validationResult };
      }

      // Update the client record
      const { data: updatedClient, error: updateError } = await supabase
        .from('clients')
        .update(validationResult.data)
        .eq('id', clientId)
        .select()
        .single();

      if (updateError) {
        return { error: handleApiError(updateError, 'Failed to update client', { clientId, data }) };
      }

      AppLogger.log(LogCategory.API, 'Client updated successfully', { clientId });
      return { data: updatedClient as ClientRecord };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error updating client', { clientId, data }) };
    }
  },

  /**
   * Delete a client by ID
   */
  deleteClient: async (clientId: string): Promise<{ data: boolean } | { error: any }> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        return { error: handleApiError(error, 'Failed to delete client', { clientId }) };
      }

      AppLogger.log(LogCategory.API, 'Client deleted successfully', { clientId });
      return { data: true };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error deleting client', { clientId }) };
    }
  }
};
