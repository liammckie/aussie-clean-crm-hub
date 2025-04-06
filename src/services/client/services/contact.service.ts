
import { clientApi } from '../api';
import { ContactFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';
import { clientContactSchema, validateWithZod } from '../validation';
import { ApiResponse, createSuccessResponse } from '@/types/api-response';

/**
 * Client contact management service
 */
export const clientContactService = {
  // Get client contacts by client ID
  getClientContacts: async (clientId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.fetchClientContacts(clientId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('fetch', 'client_contacts', response.data);
    return createSuccessResponse(response.data);
  },

  // Create a new client contact
  createClientContact: async (clientId: string, contactData: Omit<ContactFormData, 'client_id'>): Promise<ApiResponse<any>> => {
    // Add client ID to contact data
    const contact: ContactFormData = {
      ...contactData,
      client_id: clientId
    };

    // Validate the contact data using Zod schema
    const validationResult = validateWithZod(clientContactSchema, contact);
    if ('category' in validationResult) {
      return validationResult;
    }

    const response = await clientApi.createClientContact(validationResult.data);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('create', 'client_contact', response.data);
    return createSuccessResponse(response.data);
  }
};
