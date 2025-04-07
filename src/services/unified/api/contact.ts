import { supabase } from '@/lib/supabase';
import { ApiResponse, ApiSuccessResponse, ApiErrorResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { UnifiedContactRecord } from '../types';
import { UnifiedContactFormData, EntityType } from '@/types/form-types';
import { ErrorCategory } from '@/utils/logging/error-types';

export const contactApi = {
  /**
   * Create a new contact for an entity
   */
  createContact: async (
    entityType: EntityType,
    entityId: string,
    contactData: Omit<UnifiedContactFormData, 'entity_type' | 'entity_id'>
  ) => {
    try {
      // Validate required fields
      if (!contactData.name) {
        return createErrorResponse(
          ErrorCategory.VALIDATION, 
          'Contact name is required',
          { field: 'name' }
        );
      }

      if (!contactData.email) {
        return createErrorResponse(
          ErrorCategory.VALIDATION, 
          'Email is required',
          { field: 'email' }
        );
      }

      // Check if this is set as primary and handle accordingly
      if (contactData.is_primary) {
        // If this is set as primary, update other contacts to not be primary
        if (entityId) {
          const { error: updateError } = await supabase
            .from('unified_contacts')
            .update({ is_primary: false })
            .match({ entity_type: entityType, entity_id: entityId });

          if (updateError) {
            console.warn('Error updating existing primary contacts:', updateError);
          }
        }
      }

      // Create the contact record
      const { data, error } = await supabase
        .from('unified_contacts')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          mobile: contactData.mobile,
          position: contactData.position,
          contact_type: contactData.contact_type,
          is_primary: Boolean(contactData.is_primary),
          company: contactData.company,
          account_manager: contactData.account_manager,
          state_manager: contactData.state_manager,
          national_manager: contactData.national_manager,
          notes: contactData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating contact:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        data,
        'Contact created successfully'
      );
    } catch (err) {
      console.error('Unexpected error creating contact:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while creating the contact'
      );
    }
  },

  /**
   * Get all contacts for an entity
   */
  getEntityContacts: async (entityType: EntityType, entityId: string) => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);

      if (error) {
        console.error('Error fetching contacts:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        data,
        'Contacts fetched successfully'
      );
    } catch (err) {
      console.error('Unexpected error fetching contacts:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while fetching contacts'
      );
    }
  },

  /**
   * Update an existing contact
   */
  updateContact: async (
    contactId: string,
    contactData: Partial<UnifiedContactFormData>
  ) => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .update(contactData)
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        console.error('Error updating contact:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        data,
        'Contact updated successfully'
      );
    } catch (err) {
      console.error('Unexpected error updating contact:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while updating the contact'
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
        console.error('Error deleting contact:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        { success: true },
        'Contact deleted successfully'
      );
    } catch (err) {
      console.error('Unexpected error deleting contact:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while deleting the contact'
      );
    }
  }
};
