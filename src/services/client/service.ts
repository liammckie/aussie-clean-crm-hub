
import { clientApi } from './api';
import { ClientFormData, ValidationErrorResponse, ContactFormData } from './types';
import { validationService } from '@/services/validation.service';
import { logSuccess } from '@/utils/supabaseErrors';
import { prepareClientDataForSubmission, validateBusinessIdentifiers } from '@/utils/clientUtils';

/**
 * Client service containing all client-related operations with business logic
 */
export const clientService = {
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
        return error as ValidationErrorResponse;
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
  },

  // Get client contacts by client ID
  getClientContacts: async (clientId: string) => {
    const response = await clientApi.fetchClientContacts(clientId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('fetch', 'client_contacts', response.data);
    return { data: response.data, error: null };
  },

  // Create a new client contact
  createClientContact: async (clientId: string, contactData: Omit<ContactFormData, 'client_id'>) => {
    // Add client ID to contact data
    const contact: ContactFormData = {
      ...contactData,
      client_id: clientId
    };

    const response = await clientApi.createClientContact(contact);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('create', 'client_contact', response.data);
    return { data: response.data, error: null };
  }
};
