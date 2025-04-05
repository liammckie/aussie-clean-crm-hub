
import { supabase, isAuthenticated } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError } from '@/utils/supabaseErrors';
import { UnifiedAddressFormData, UnifiedContactFormData } from './types';

/**
 * Unified Addresses & Contacts API service - handles raw Supabase calls
 */
export const unifiedApi = {
  /**
   * Fetch addresses for an entity
   */
  fetchAddresses: async (entityType: string, entityId: string) => {
    try {
      // First check if the user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('unified_addresses')
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
        `Failed to fetch addresses for ${entityType} with ID ${entityId}`,
        { operation: 'fetchAddresses', entityType, entityId }
      );
    }
  },

  /**
   * Create a new address
   */
  createAddress: async (addressData: UnifiedAddressFormData) => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .insert(addressData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create address',
        { operation: 'createAddress', addressData }
      );
    }
  },

  /**
   * Update an existing address
   */
  updateAddress: async (addressId: string, addressData: Partial<UnifiedAddressFormData>) => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .update(addressData)
        .eq('id', addressId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to update address with ID ${addressId}`,
        { operation: 'updateAddress', addressId, addressData }
      );
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (addressId: string) => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to delete address with ID ${addressId}`,
        { operation: 'deleteAddress', addressId }
      );
    }
  },

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
