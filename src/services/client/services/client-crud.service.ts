
import { validationService } from '@/services/validation.service';
import { clientApi } from '../api';
import { ClientFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';
import { prepareClientDataForSubmission } from '@/utils/clientUtils';
import { ClientStatus } from '@/types/database-schema';
import { clientSchema, validateWithZod } from '../validation';
import { ApiResponse, createSuccessResponse, isApiError, formatError, ErrorCategory } from '@/types/api-response';

/**
 * Client CRUD operations service
 */
export const clientCrudService = {
  // Get all clients with formatting
  getAllClients: async (): Promise<ApiResponse<any>> => {
    const response = await clientApi.fetchAllClients();
    
    // If there's an error, return as is
    if (isApiError(response)) {
      return response;
    }
    
    // Format business identifiers for display
    const formattedData = response.data.map(client => ({
      ...client,
      abn: client.abn ? validationService.formatABN(client.abn) : null,
      acn: client.acn ? validationService.formatACN(client.acn) : null
    }));

    logSuccess('fetch', 'clients', formattedData);
    return createSuccessResponse(formattedData, 'Clients retrieved successfully');
  },

  // Get client by ID with contacts
  getClientById: async (clientId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.fetchClientById(clientId);
    
    // If there's an error, return as is
    if (isApiError(response)) {
      return response;
    }
    
    // Format business identifiers for display
    const formattedData = {
      ...response.data,
      abn: response.data.abn ? validationService.formatABN(response.data.abn) : null,
      acn: response.data.acn ? validationService.formatACN(response.data.acn) : null
    };
    
    logSuccess('fetch', 'client', formattedData);
    return createSuccessResponse(formattedData, 'Client retrieved successfully');
  },

  // Create a new client
  createClient: async (client: ClientFormData): Promise<ApiResponse<any>> => {
    try {
      // Explicitly create a new object with required fields and default values
      const clientWithDefaults: ClientFormData = {
        // Ensure required fields have explicit non-nullable values
        business_name: client.business_name || '', 
        status: client.status || ClientStatus.PROSPECT,
        // Copy all other fields from the input
        ...client
      };

      // Validate client data using our Zod schema
      const validationResult = validateWithZod(clientSchema, clientWithDefaults);
      if ('category' in validationResult) {
        return formatError(
          ErrorCategory.VALIDATION, 
          validationResult.message, 
          validationResult.details
        );
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

      // Ensure business_name is not undefined (required field)
      if (!formattedClient.business_name) {
        return formatError(
          ErrorCategory.VALIDATION,
          'Business name is required',
          { field: 'business_name' }
        );
      }

      console.log('Submitting client data to Supabase:', formattedClient);
      const response = await clientApi.createClient(formattedClient);

      if (isApiError(response)) {
        console.error('Error during client creation:', response);
        return response;
      }

      logSuccess('create', 'client', response.data);
      return createSuccessResponse(response.data, 'Client created successfully');
    } catch (error) {
      console.error('Error in createClient:', error);
      if (typeof error === 'object' && error !== null && 'category' in error) {
        return error as ApiResponse<any>;
      }
      throw error; // Let the caller handle unexpected errors
    }
  },

  // Update an existing client
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>): Promise<ApiResponse<any>> => {
    // Validate partial client data
    const validationResult = validateWithZod(clientSchema.partial(), clientData);
    if ('category' in validationResult) {
      return formatError(
        ErrorCategory.VALIDATION, 
        validationResult.message, 
        validationResult.details
      );
    }

    // Format and prepare the data
    const formattedData = prepareClientDataForSubmission(validationResult.data as ClientFormData);

    const response = await clientApi.updateClient(clientId, formattedData);
    
    if (isApiError(response)) {
      return response;
    }

    logSuccess('update', 'client', response.data);
    return createSuccessResponse(response.data, 'Client updated successfully');
  },

  // Delete a client by ID
  deleteClient: async (clientId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.deleteClient(clientId);
    
    if (isApiError(response)) {
      return response;
    }

    logSuccess('delete', 'client', { clientId });
    return createSuccessResponse({ success: true }, 'Client deleted successfully');
  }
};
