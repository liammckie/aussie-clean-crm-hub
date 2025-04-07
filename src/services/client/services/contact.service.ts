
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
    // Create a complete contact object with all required fields explicitly set
    const contact: ContactFormData = {
      // Required fields with explicit non-nullable values
      client_id: clientId,
      name: contactData.name || '',
      email: contactData.email || '',
      contact_type: contactData.contact_type || 'Primary',
      is_primary: contactData.is_primary !== undefined ? contactData.is_primary : false,
      
      // Optional fields passed through
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
