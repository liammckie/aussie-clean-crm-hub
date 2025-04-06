
import { validationService } from '@/services/validation.service';
import { clientApi } from '../api';
import { ClientFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';
import { prepareClientDataForSubmission } from '@/utils/clientUtils';
import { ClientStatus } from '@/types/database-schema';
import { clientSchema, validateWithZod } from '../validation';
import { ApiResponse, createSuccessResponse } from '@/types/api-response';

/**
 * Client CRUD operations service
 */
export const clientCrudService = {
  // Get all clients with formatting
  getAllClients: async (): Promise<ApiResponse<any>> => {
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
    return createSuccessResponse(formattedData);
  },

  // Get client by ID with contacts
  getClientById: async (clientId: string): Promise<ApiResponse<any>> => {
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
    return createSuccessResponse(formattedData);
  },

  // Create a new client
  createClient: async (client: ClientFormData): Promise<ApiResponse<any>> => {
    try {
      // Validate client data using our Zod schema
      const validationResult = validateWithZod(clientSchema, client);
      if ('category' in validationResult) {
        return validationResult;
      }

      // Format and validate business identifiers
      const formattedClient = prepareClientDataForSubmission(validationResult.data);
      
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
      return createSuccessResponse(response.data);
    } catch (error) {
      console.error('Error in createClient:', error);
      if (typeof error === 'object' && error !== null && 'category' in error) {
        return error;
      }
      throw error; // Let the caller handle unexpected errors
    }
  },

  // Update an existing client
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>): Promise<ApiResponse<any>> => {
    // Validate partial client data
    const validationResult = validateWithZod(clientSchema.partial(), clientData);
    if ('category' in validationResult) {
      return validationResult;
    }

    // Format and prepare the data
    const formattedData = prepareClientDataForSubmission(validationResult.data);

    const response = await clientApi.updateClient(clientId, formattedData);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('update', 'client', response.data);
    return createSuccessResponse(response.data);
  },

  // Delete a client by ID
  deleteClient: async (clientId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.deleteClient(clientId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('delete', 'client', { clientId });
    return createSuccessResponse({ success: true });
  }
};
