
import { supabase, isAuthenticated, checkAuthentication } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError, ErrorCategory } from '@/utils/supabaseErrors';
import { UnifiedContactFormData } from '../types';
import { validateEntityAccess, validateContactData } from '@/services/validation';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * API service for unified contacts management with enhanced security
 */
export const contactApi = {
  /**
   * Fetch contacts for an entity with security validations
   */
  fetchContacts: async (entityType: string, entityId: string) => {
    try {
      // Ensure user is authenticated
      await checkAuthentication();

      // Validate entity access
      const accessValidation = validateEntityAccess(entityType, entityId);
      if (!accessValidation.isValid) {
        return { data: null, error: accessValidation.error };
      }

      // Log security-relevant operation for audit trail
      ErrorReporting.addBreadcrumb({
        category: 'security',
        message: `Fetch contacts requested for ${entityType} ${entityId}`,
        level: 'info'
      });

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
   * Create a new contact with enhanced security validation
   */
  createContact: async (contactData: UnifiedContactFormData) => {
    try {
      // Ensure user is authenticated
      await checkAuthentication();
      
      // Validate and sanitize contact data
      const validation = validateContactData<UnifiedContactFormData>(contactData);
      if (!validation.isValid) {
        return { data: null, error: validation.error };
      }
      
      // Verify entity access
      const accessValidation = validateEntityAccess(
        validation.data!.entity_type || '', 
        validation.data!.entity_id || ''
      );
      
      if (!accessValidation.isValid) {
        return { data: null, error: accessValidation.error };
      }

      const { data, error } = await supabase
        .from('unified_contacts')
        .insert(validation.data)
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
   * Update an existing contact with security checks
   */
  updateContact: async (contactId: string, contactData: Partial<UnifiedContactFormData>) => {
    try {
      // Ensure user is authenticated
      await checkAuthentication();
      
      // Validate contact ID format
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contactId)) {
        return {
          data: null,
          error: {
            message: 'Invalid contact ID format',
            category: ErrorCategory.VALIDATION
          }
        };
      }
      
      // Validate input data to prevent injection
      const validation = validateContactData<Partial<UnifiedContactFormData>>(contactData);
      if (!validation.isValid) {
        return { data: null, error: validation.error };
      }
      
      // Prevent tampering with entity relationships
      const secureData = { ...validation.data };
      delete secureData.entity_id;
      delete secureData.entity_type;

      const { data, error } = await supabase
        .from('unified_contacts')
        .update(secureData)
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
   * Delete a contact with security validation
   */
  deleteContact: async (contactId: string) => {
    try {
      // Ensure user is authenticated
      await checkAuthentication();
      
      // Validate contact ID format
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contactId)) {
        return {
          success: false,
          error: {
            message: 'Invalid contact ID format',
            category: ErrorCategory.VALIDATION
          }
        };
      }
      
      // First fetch the contact to verify ownership - security best practice
      const { data: contactData, error: fetchError } = await supabase
        .from('unified_contacts')
        .select('entity_type, entity_id')
        .eq('id', contactId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Log security-sensitive operation
      ErrorReporting.addBreadcrumb({
        category: 'security',
        message: `Contact deletion requested: ${contactId}`,
        level: 'warning',
        data: { contactId, entityType: contactData.entity_type, entityId: contactData.entity_id }
      });

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
