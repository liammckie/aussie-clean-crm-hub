
import { clientApi } from '../api';
import { ContactFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';

/**
 * Client contact management service
 */
export const clientContactService = {
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

    // Validate required fields
    if (!contact.name?.trim()) {
      return {
        category: 'validation' as const,
        message: 'Contact name is required',
        details: { field: 'name' }
      };
    }

    if (!contact.email?.trim()) {
      return {
        category: 'validation' as const,
        message: 'Contact email is required',
        details: { field: 'email' }
      };
    }

    const response = await clientApi.createClientContact(contact);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('create', 'client_contact', response.data);
    return { data: response.data, error: null };
  }
};
