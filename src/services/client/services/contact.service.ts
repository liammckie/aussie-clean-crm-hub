
import { clientApi } from '../api';
import { ContactFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';
import { clientContactSchema, validateWithZod } from '../validation';
import { ApiResponse, createSuccessResponse, isApiError, formatError, ErrorCategory } from '@/types/api-response';

/**
 * Client contact management service
 */
export const clientContactService = {
  // Get client contacts by client ID
  getClientContacts: async (clientId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.fetchClientContacts(clientId);
    
    if (isApiError(response)) {
      return response;
    }

    logSuccess('fetch', 'client_contacts', response.data);
    return createSuccessResponse(response.data, 'Client contacts retrieved successfully');
  },

  // Create a new client contact
  createClientContact: async (clientId: string, contactData: Omit<ContactFormData, 'client_id'>): Promise<ApiResponse<any>> => {
    // Add client ID to contact data and ensure required fields have values
    const contact: ContactFormData = {
      client_id: clientId,
      name: contactData.name || '',     // Ensure required field has a value
      email: contactData.email || '',   // Ensure required field has a value
      contact_type: contactData.contact_type || 'Primary', // Ensure required field has a value
      is_primary: contactData.is_primary !== undefined ? contactData.is_primary : false,
      position: contactData.position,
      phone: contactData.phone,
      mobile: contactData.mobile
    };

    // Validate the contact data using Zod schema
    const validationResult = validateWithZod(clientContactSchema, contact);
    if ('category' in validationResult) {
      return formatError(
        ErrorCategory.VALIDATION, 
        validationResult.message, 
        validationResult.details
      );
    }

    const response = await clientApi.createClientContact(validationResult.data);
    
    if (isApiError(response)) {
      return response;
    }

    logSuccess('create', 'client_contact', response.data);
    return createSuccessResponse(response.data, 'Contact created successfully');
  }
};
