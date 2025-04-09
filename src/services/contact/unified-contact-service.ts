
import { supabase } from '@/lib/supabase';
import { handleSupabaseError } from '@/utils/supabaseErrors';
import { ApiResponse, createSuccessResponse, isApiError } from '@/types/api-response';
import { UnifiedContactRecord } from '@/services/unified/types';
import { EntityType, ContactType } from '@/types/database-schema';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Service for managing unified contacts
 */
export class UnifiedContactService {
  /**
   * Get contacts for an entity
   * @param entityType Type of entity (client, site, etc.)
   * @param entityId Entity ID
   * @returns Promise with the contacts
   */
  async getEntityContacts(entityType: string, entityId: string): Promise<ApiResponse<UnifiedContactRecord[]>> {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Contacts fetched successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to fetch contacts', {
        entity_type: entityType,
        entity_id: entityId,
        operation: 'getEntityContacts'
      });
    }
  }

  /**
   * Get contact by ID
   * @param contactId Contact ID
   * @returns Promise with the contact
   */
  async getContactById(contactId: string): Promise<ApiResponse<UnifiedContactRecord>> {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Contact fetched successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to fetch contact', {
        contact_id: contactId,
        operation: 'getContactById'
      });
    }
  }

  /**
   * Create contact
   * @param entityType Type of entity
   * @param entityId ID of the entity
   * @param contactData Contact data
   * @returns Promise with the created contact
   */
  async createContact(
    entityType: string,
    entityId: string,
    contactData: any
  ): Promise<ApiResponse<UnifiedContactRecord>> {
    try {
      const preparedData = {
        entity_type: entityType,
        entity_id: entityId,
        ...contactData
      };

      const { data, error } = await supabase
        .from('unified_contacts')
        .insert(preparedData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Contact created successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to create contact', {
        entity_type: entityType,
        entity_id: entityId,
        operation: 'createContact'
      });
    }
  }

  /**
   * Update a contact
   */
  async updateContact(
    contactId: string,
    contactData: any
  ): Promise<ApiResponse<UnifiedContactRecord>> {
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

      return createSuccessResponse(data, 'Contact updated successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to update contact', {
        contact_id: contactId,
        operation: 'updateContact'
      });
    }
  }

  /**
   * Delete a contact
   */
  async deleteContact(contactId: string): Promise<ApiResponse<{ success: boolean; id: string }>> {
    try {
      const { error } = await supabase
        .from('unified_contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        throw error;
      }

      return createSuccessResponse({ success: true, id: contactId }, 'Contact deleted successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to delete contact', {
        contact_id: contactId,
        operation: 'deleteContact'
      });
    }
  }
}

// Export singleton instance
export const unifiedContactService = new UnifiedContactService();
