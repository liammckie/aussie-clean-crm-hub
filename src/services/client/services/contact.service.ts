
import { clientApi } from '../api';
import { ContactFormData, ContactRecord } from '../types';
import { ApiResponse, ApiErrorResponse, createSuccessResponse } from '@/types/api-response';
import { AppLogger } from '@/utils/logging/AppLogger';
import { handleValidation } from '../validation';
import { isApiError } from '@/types/api-response';

/**
 * Client contact service with business logic for contact management
 */
export const clientContactService = {
  /**
   * Get all contacts for a client
   */
  getClientContacts: async (clientId: string): Promise<ApiResponse<ContactRecord[]>> => {
    try {
      const response = await clientApi.fetchClientContacts(clientId);
      if (isApiError(response)) {
        return response;
      }
      
      // Add computed name property to each contact for display purposes
      const contactsWithNames = response.data.map(contact => ({
        ...contact,
        name: `${contact.first_name} ${contact.last_name}`
      }));
      
      return createSuccessResponse(contactsWithNames, response.message);
    } catch (error) {
      console.error('Error in getClientContacts:', error);
      return {
        category: 'server',
        message: 'Failed to get client contacts',
        details: { error }
      };
    }
  },

  /**
   * Create a new client contact
   */
  createClientContact: async (clientId: string, contactData: Omit<ContactFormData, 'client_id'>): Promise<ApiResponse<ContactRecord>> => {
    try {
      // Validate required fields
      const validationResult = handleValidation({
        first_name: contactData.first_name,
        last_name: contactData.last_name,
      });
      
      if (!validationResult.success) {
        return {
          category: 'validation',
          message: validationResult.message || 'Validation error',
          details: { errors: validationResult.errors }
        };
      }
      
      // Format contact data for API
      const apiContactData: ContactFormData = {
        client_id: clientId,
        first_name: contactData.first_name,
        last_name: contactData.last_name,
        email: contactData.email,
        phone: contactData.phone,
        mobile: contactData.mobile,
        position: contactData.position,
        is_primary: contactData.is_primary || false,
        contact_type: contactData.contact_type,
        notes: contactData.notes
      };
      
      const response = await clientApi.createClientContact(apiContactData);
      return response;
    } catch (error) {
      console.error('Error in createClientContact:', error);
      return {
        category: 'server',
        message: 'Failed to create client contact',
        details: { error }
      };
    }
  }
};
