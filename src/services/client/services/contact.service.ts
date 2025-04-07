
import { clientApi } from '../api';
import { ContactFormData, ContactApiResponse, ContactsApiResponse } from '../types';
import { handleValidationError } from '../validation';
import { AppLogger } from '@/utils/logging';
import { LogCategory } from '@/utils/logging/LogCategory';

/**
 * Contact-related service functions
 */
export const clientContactService = {
  /**
   * Get contacts for a client
   */
  getClientContacts: async (clientId: string): Promise<ContactsApiResponse> => {
    try {
      AppLogger.info(LogCategory.CLIENT, `Fetching contacts for client ${clientId}`);
      return await clientApi.fetchClientContacts(clientId);
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, `Error fetching contacts for client ${clientId}`, { error });
      throw error;
    }
  },

  /**
   * Create a new client contact
   */
  createClientContact: async (contactData: ContactFormData): Promise<ContactApiResponse> => {
    try {
      AppLogger.info(LogCategory.CLIENT, `Creating contact for client ${contactData.client_id}`);
      return await clientApi.createClientContact(contactData);
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, `Error creating contact for client ${contactData.client_id}`, { error });
      throw error;
    }
  }
};
