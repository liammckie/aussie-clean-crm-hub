
import { validationService } from '@/services/validation.service';
import { clientApi } from '../api';
import { ClientFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';
import { prepareClientDataForSubmission, validateBusinessIdentifiers } from '@/utils/clientUtils';
import { ClientStatus } from '@/types/database-schema';

/**
 * Client CRUD operations service
 */
export const clientCrudService = {
  // Get all clients with formatting
  getAllClients: async () => {
    const response = await clientApi.fetchAllClients();
    
    // If there's an error, return as is
    if ('category' in response) {
      return response;
    }
    
    // Format business identifiers for display
    const formattedData = response.data.map(client => ({
      ...client,
      abn: client.abn ? validationService.formatABN(client.abn) : null,
      acn: client.acn ? validationService.formatACN(client.acn) : null
    }));

    logSuccess('fetch', 'clients', formattedData);
    return { data: formattedData, error: null };
  },

  // Get client by ID with contacts
  getClientById: async (clientId: string) => {
    const response = await clientApi.fetchClientById(clientId);
    
    // If there's an error, return as is
    if ('category' in response) {
      return response;
    }
    
    // Format business identifiers for display
    const formattedData = {
      ...response.data,
      abn: response.data.abn ? validationService.formatABN(response.data.abn) : null,
      acn: response.data.acn ? validationService.formatACN(response.data.acn) : null
    };
    
    logSuccess('fetch', 'client', formattedData);
    return { data: formattedData, error: null };
  },

  // Create a new client
  createClient: async (client: ClientFormData) => {
    try {
      // Format and validate business identifiers
      const formattedClient = prepareClientDataForSubmission(client);
      
      // Validate business identifiers
      const validationError = validateBusinessIdentifiers({
        abn: formattedClient.abn as string | undefined,
        acn: formattedClient.acn as string | undefined
      });
      
      // Return validation error if found
      if (validationError) {
        return validationError;
      }

      // Validate required fields
      if (!formattedClient.business_name?.trim()) {
        return {
          category: 'validation' as const,
          message: 'Business name is required',
          details: { field: 'business_name' }
        };
      }

      // Ensure required fields that have database constraints are set
      if (!formattedClient.status) {
        formattedClient.status = ClientStatus.PROSPECT;
      }

      if (!formattedClient.onboarding_date) {
        formattedClient.onboarding_date = new Date().toISOString().split('T')[0];
      }

      console.log('Submitting client data to Supabase:', formattedClient);
      const response = await clientApi.createClient(formattedClient);

      if ('category' in response) {
        console.error('Error during client creation:', response);
        return response;
      }

      logSuccess('create', 'client', response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error in createClient:', error);
      if (typeof error === 'object' && error !== null && 'category' in error) {
        return error;
      }
      throw error; // Let the caller handle unexpected errors
    }
  },

  // Update an existing client
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>) => {
    // Format and validate business identifiers
    const formattedData = {
      ...clientData,
      abn: clientData.abn ? validationService.cleanBusinessIdentifier(clientData.abn) : undefined,
      acn: clientData.acn ? validationService.cleanBusinessIdentifier(clientData.acn) : undefined
    };
    
    // Validate business identifiers
    const validationError = validateBusinessIdentifiers({
      abn: formattedData.abn as string | undefined,
      acn: formattedData.acn as string | undefined
    });
    
    // Return validation error if found
    if (validationError) {
      return validationError;
    }

    // Validate date format if present
    if (formattedData.onboarding_date) {
      try {
        const date = new Date(formattedData.onboarding_date);
        if (isNaN(date.getTime())) {
          return {
            category: 'validation' as const,
            message: 'Invalid date format for onboarding date',
            details: { field: 'onboarding_date' }
          };
        }
        // Ensure consistent date format YYYY-MM-DD
        formattedData.onboarding_date = date.toISOString().split('T')[0];
      } catch (e) {
        return {
          category: 'validation' as const,
          message: 'Invalid date format for onboarding date',
          details: { field: 'onboarding_date' }
        };
      }
    }

    const response = await clientApi.updateClient(clientId, formattedData);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('update', 'client', response.data);
    return { data: response.data, error: null };
  },

  // Delete a client by ID
  deleteClient: async (clientId: string) => {
    const response = await clientApi.deleteClient(clientId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('delete', 'client', { clientId });
    return { success: true, error: null };
  }
};
