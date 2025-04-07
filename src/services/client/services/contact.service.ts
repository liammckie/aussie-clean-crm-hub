
import { ApiResponse } from '@/types/api-response';
import { ContactRecord } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling client contacts
 */
export const contactService = {
  /**
   * Fetch contacts for a client
   * @param clientId Client ID
   * @returns ApiResponse<ContactRecord[]>
   */
  fetchClientContacts: async (clientId: string): Promise<ApiResponse<ContactRecord[]>> => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId);

      if (error) {
        return {
          category: 'database',
          message: error.message,
          details: error
        };
      }

      return {
        data: data || [],
        message: 'Client contacts retrieved successfully'
      };
    } catch (error: any) {
      return {
        category: 'server',
        message: `Error retrieving client contacts: ${error.message}`,
        details: error
      };
    }
  },

  /**
   * Create a client contact
   * @param clientId Client ID
   * @param contactData Contact data
   * @returns ApiResponse<ContactRecord>
   */
  createClientContact: async (clientId: string, contactData: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .insert({ ...contactData, client_id: clientId })
        .select('*')
        .single();

      if (error) {
        return {
          category: 'database',
          message: error.message,
          details: error
        };
      }

      return {
        data: data,
        message: 'Contact created successfully'
      };
    } catch (error: any) {
      return {
        category: 'server',
        message: `Error creating contact: ${error.message}`,
        details: error
      };
    }
  },

  /**
   * Update a client contact
   * @param contactId Contact ID
   * @param contactData Contact data
   * @returns ApiResponse<ContactRecord>
   */
  updateClientContact: async (contactId: string, contactData: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .update(contactData)
        .eq('id', contactId)
        .select('*')
        .single();

      if (error) {
        return {
          category: 'database',
          message: error.message,
          details: error
        };
      }

      return {
        data: data,
        message: 'Contact updated successfully'
      };
    } catch (error: any) {
      return {
        category: 'server',
        message: `Error updating contact: ${error.message}`,
        details: error
      };
    }
  },

  /**
   * Delete a client contact
   * @param contactId Contact ID
   * @returns ApiResponse<boolean>
   */
  deleteClientContact: async (contactId: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('client_contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        return {
          category: 'database',
          message: error.message,
          details: error
        };
      }

      return {
        data: true,
        message: 'Contact deleted successfully'
      };
    } catch (error: any) {
      return {
        category: 'server',
        message: `Error deleting contact: ${error.message}`,
        details: error
      };
    }
  }
};
