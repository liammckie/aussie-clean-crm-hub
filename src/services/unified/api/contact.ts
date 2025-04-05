
import { supabase, isAuthenticated } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError } from '@/utils/supabaseErrors';
import { UnifiedContactFormData } from '../types';

/**
 * API service for unified contacts management
 */
export const contactApi = {
  /**
   * Fetch contacts for an entity
   */
  fetchContacts: async (entityType: string, entityId: string) => {
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('unified_contacts')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch contacts for ${entityType} with ID ${entityId}`,
        { operation: 'fetchContacts', entityType, entityId }
      );
    }
  },

  /**
   * Create a new contact
   */
  createContact: async (contactData: UnifiedContactFormData) => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create contact',
        { operation: 'createContact', contactData }
      );
    }
  },

  /**
   * Update an existing contact
   */
  updateContact: async (contactId: string, contactData: Partial<UnifiedContactFormData>) => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .update(contactData)
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to update contact with ID ${contactId}`,
        { operation: 'updateContact', contactId, contactData }
      );
    }
  },

  /**
   * Delete a contact
   */
  deleteContact: async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to delete contact with ID ${contactId}`,
        { operation: 'deleteContact', contactId }
      );
    }
  }
};
