import { supabase } from '@/lib/supabase';
import { ContactFormData } from '@/services/client/types';

/**
 * Service for managing client contacts
 */
export const clientContactService = {
  /**
   * Get all contacts for a client
   * @param clientId The ID of the client
   * @returns An array of contact records
   */
  getClientContacts: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId);

      if (error) {
        console.error("Error fetching client contacts:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to get client contacts:", error);
      throw error;
    }
  },

  /**
   * Create a new contact for a client
   * @param clientId The ID of the client
   * @param data The contact data to insert
   * @returns The newly created contact record
   */
  createClientContact: async (clientId: string, data: any) => {
    try {
      const contactData: ContactFormData = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone,
        mobile: data.mobile,
        position: data.position,
        is_primary: Boolean(data.is_primary),
        contact_type: data.contact_type || 'Primary',
        client_id: data.client_id || clientId
      };
      const { data: newContact, error } = await supabase
        .from('client_contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) {
        console.error("Error creating client contact:", error);
        throw error;
      }

      return newContact;
    } catch (error) {
      console.error("Failed to create client contact:", error);
      throw error;
    }
  }
};
