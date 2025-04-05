
import { supabase } from '@/integrations/supabase/client';
import { ErrorReporting } from '@/utils/errorReporting';
import { handleSupabaseError, logSuccess, ErrorCategory } from '@/utils/supabaseErrors';
import { validationService } from './validation.service';

// Client service for handling client data operations
export const clientService = {
  /**
   * Fetches all clients from the database
   */
  async getAllClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) {
        return handleSupabaseError(
          error,
          'Failed to fetch clients',
          { operation: 'getAllClients' }
        );
      }

      logSuccess('fetch', 'clients', { count: data.length });
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Unexpected error fetching clients',
        { operation: 'getAllClients' }
      );
    }
  },

  /**
   * Fetches a client by ID
   * @param clientId The ID of the client to fetch
   */
  async getClientById(clientId: string) {
    try {
      // Validate the input
      if (!clientId) {
        return {
          error: {
            message: 'Client ID is required',
            category: ErrorCategory.VALIDATION
          },
          data: null
        };
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        return handleSupabaseError(
          error,
          `Failed to fetch client ${clientId}`,
          { operation: 'getClientById', clientId }
        );
      }

      logSuccess('fetch', 'client', { clientId });
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Unexpected error fetching client ${clientId}`,
        { operation: 'getClientById', clientId }
      );
    }
  },

  /**
   * Creates a new client
   * @param clientData The client data to create
   */
  async createClient(clientData: any) {
    try {
      // Validate business identifiers
      const abnValidation = validationService.validateABN(clientData.abn);
      if (!abnValidation.valid) {
        return {
          error: {
            message: abnValidation.error || 'Invalid ABN',
            category: ErrorCategory.VALIDATION
          },
          data: null
        };
      }

      const acnValidation = validationService.validateACN(clientData.acn);
      if (!acnValidation.valid) {
        return {
          error: {
            message: acnValidation.error || 'Invalid ACN',
            category: ErrorCategory.VALIDATION
          },
          data: null
        };
      }

      // Format business identifiers for storage
      const formattedData = validationService.formatBusinessIdentifiers(clientData);

      // Create the client in the database
      const { data, error } = await supabase
        .from('clients')
        .insert(formattedData)
        .select()
        .single();

      if (error) {
        return handleSupabaseError(
          error,
          'Failed to create client',
          { operation: 'createClient', clientData }
        );
      }

      // Report successful operation
      logSuccess('create', 'client', { clientId: data.id });
      ErrorReporting.addBreadcrumb({
        category: 'client',
        message: 'Client created successfully',
        level: 'info',
        data: { clientId: data.id, name: data.name }
      });

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Unexpected error creating client',
        { operation: 'createClient', clientData }
      );
    }
  },

  /**
   * Updates an existing client
   * @param clientId The ID of the client to update
   * @param clientData The updated client data
   */
  async updateClient(clientId: string, clientData: any) {
    try {
      // Validate the input
      if (!clientId) {
        return {
          error: {
            message: 'Client ID is required',
            category: ErrorCategory.VALIDATION
          },
          data: null
        };
      }

      // Validate business identifiers
      const abnValidation = validationService.validateABN(clientData.abn);
      if (!abnValidation.valid) {
        return {
          error: {
            message: abnValidation.error || 'Invalid ABN',
            category: ErrorCategory.VALIDATION
          },
          data: null
        };
      }

      const acnValidation = validationService.validateACN(clientData.acn);
      if (!acnValidation.valid) {
        return {
          error: {
            message: acnValidation.error || 'Invalid ACN',
            category: ErrorCategory.VALIDATION
          },
          data: null
        };
      }

      // Format business identifiers for storage
      const formattedData = validationService.formatBusinessIdentifiers(clientData);

      // Update the client in the database
      const { data, error } = await supabase
        .from('clients')
        .update(formattedData)
        .eq('id', clientId)
        .select()
        .single();

      if (error) {
        return handleSupabaseError(
          error,
          `Failed to update client ${clientId}`,
          { operation: 'updateClient', clientId, clientData }
        );
      }

      // Report successful operation
      logSuccess('update', 'client', { clientId });
      
      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Unexpected error updating client ${clientId}`,
        { operation: 'updateClient', clientId, clientData }
      );
    }
  },

  /**
   * Deletes a client by ID
   * @param clientId The ID of the client to delete
   */
  async deleteClient(clientId: string) {
    try {
      // Validate the input
      if (!clientId) {
        return {
          error: {
            message: 'Client ID is required',
            category: ErrorCategory.VALIDATION
          },
          data: null
        };
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        return handleSupabaseError(
          error,
          `Failed to delete client ${clientId}`,
          { operation: 'deleteClient', clientId }
        );
      }

      // Report successful operation
      logSuccess('delete', 'client', { clientId });
      
      return { error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Unexpected error deleting client ${clientId}`,
        { operation: 'deleteClient', clientId }
      );
    }
  }
};
