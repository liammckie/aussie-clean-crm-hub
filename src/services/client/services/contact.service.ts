
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { ContactRecord } from '../types';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Service for client contact operations
 */
export const contactService = {
  /**
   * Fetch contacts for a client
   */
  fetchClientContacts: async (clientId: string): Promise<ApiResponse<ContactRecord[]>> => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(data || [], `Contacts for client ID ${clientId} fetched successfully`);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to fetch contacts for client with ID ${clientId}`,
        { error: error.message }
      );
    }
  },

  /**
   * Create a contact for a client
   */
  createClientContact: async (clientId: string, contactData: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> => {
    try {
      // Ensure clientId is included
      const dataWithClientId = {
        ...contactData,
        client_id: clientId
      };

      const { data, error } = await supabase
        .from('client_contacts')
        .insert(dataWithClientId)
        .select()
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(data, 'Contact created successfully');
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        'Failed to create client contact',
        { error: error.message }
      );
    }
  },

  /**
   * Update a client contact
   */
  updateClientContact: async (contactId: string, contactData: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .update(contactData)
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(data, `Contact with ID ${contactId} updated successfully`);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to update contact with ID ${contactId}`,
        { error: error.message }
      );
    }
  },

  /**
   * Delete a client contact
   */
  deleteClientContact: async (contactId: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('client_contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(true, `Contact with ID ${contactId} deleted successfully`);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to delete contact with ID ${contactId}`,
        { error: error.message }
      );
    }
  }
};
