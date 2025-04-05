
import { supabase, isAuthenticated, checkAuthentication } from '@/integrations/supabase/client';
import { ErrorResponse, handleSupabaseError, ErrorCategory } from '@/utils/supabaseErrors';
import { UnifiedAddressFormData } from '../types';
import { validateEntityAccess, validateAddressData } from '@/services/validation';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * API service for unified addresses management with enhanced security
 */
export const addressApi = {
  /**
   * Fetch addresses for an entity with security validations
   */
  fetchAddresses: async (entityType: string, entityId: string) => {
    try {
      // First check if the user is authenticated
      await checkAuthentication();

      // Validate entity access
      const accessValidation = validateEntityAccess(entityType, entityId);
      if (!accessValidation.isValid) {
        return { data: null, error: accessValidation.error };
      }

      // Log security-relevant operation for audit trail
      ErrorReporting.addBreadcrumb({
        category: 'security',
        message: `Fetch addresses requested for ${entityType} ${entityId}`,
        level: 'info'
      });

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
   * Create a new address with enhanced security validation
   */
  createAddress: async (addressData: UnifiedAddressFormData) => {
    try {
      // Ensure user is authenticated
      await checkAuthentication();
      
      // Validate and sanitize address data
      const validation = validateAddressData<UnifiedAddressFormData>(addressData);
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
        .from('unified_addresses')
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
        'Failed to create address',
        { operation: 'createAddress', addressData }
      );
    }
  },

  /**
   * Update an existing address with security checks
   */
  updateAddress: async (addressId: string, addressData: Partial<UnifiedAddressFormData>) => {
    try {
      // Ensure user is authenticated
      await checkAuthentication();
      
      // Validate address ID format
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(addressId)) {
        return {
          data: null,
          error: {
            message: 'Invalid address ID format',
            category: ErrorCategory.VALIDATION
          }
        };
      }
      
      // Validate input data to prevent injection
      const validation = validateAddressData<Partial<UnifiedAddressFormData>>(addressData);
      if (!validation.isValid) {
        return { data: null, error: validation.error };
      }
      
      // Prevent tampering with entity relationships
      const secureData = { ...validation.data };
      delete secureData.entity_id;
      delete secureData.entity_type;

      const { data, error } = await supabase
        .from('unified_addresses')
        .update(secureData)
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
   * Delete an address with security validation
   */
  deleteAddress: async (addressId: string) => {
    try {
      // Ensure user is authenticated
      await checkAuthentication();
      
      // Validate address ID format
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(addressId)) {
        return {
          success: false,
          error: {
            message: 'Invalid address ID format',
            category: ErrorCategory.VALIDATION
          }
        };
      }
      
      // First fetch the address to verify ownership - security best practice
      const { data: addressData, error: fetchError } = await supabase
        .from('unified_addresses')
        .select('entity_type, entity_id')
        .eq('id', addressId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Log security-sensitive operation
      ErrorReporting.addBreadcrumb({
        category: 'security',
        message: `Address deletion requested: ${addressId}`,
        level: 'warning',
        data: { addressId, entityType: addressData.entity_type, entityId: addressData.entity_id }
      });

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
  }
};
