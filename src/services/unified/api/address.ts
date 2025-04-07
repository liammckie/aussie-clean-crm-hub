import { supabase } from '@/lib/supabase';
import { ApiResponse, ApiSuccessResponse, ApiErrorResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { UnifiedAddressRecord, ValidationErrorResponse } from '../types';
import { UnifiedAddressFormData, EntityType } from '@/types/form-types';
import { ErrorCategory } from '@/utils/logging/error-types';

export const addressApi = {
  /**
   * Create a new address for an entity
   */
  createAddress: async (
    entityType: EntityType,
    entityId: string,
    addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'>
  ) => {
    try {
      // Validate required fields
      if (!addressData.address_line1) {
        return createErrorResponse(
          ErrorCategory.VALIDATION, 
          'Address line 1 is required',
          { field: 'address_line1' }
        );
      }

      // Create the address record
      const { data, error } = await supabase
        .from('unified_addresses')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          name: addressData.name,
          address_line_1: addressData.address_line1,
          address_line_2: addressData.address_line2,
          suburb: addressData.suburb,
          state: addressData.state,
          postcode: addressData.postcode,
          country: addressData.country || 'Australia',
          address_type: addressData.address_type,
          is_primary: Boolean(addressData.is_primary),
          latitude: addressData.latitude,
          longitude: addressData.longitude
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating address:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        data,
        'Address created successfully'
      );
    } catch (err) {
      console.error('Unexpected error creating address:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while creating the address'
      );
    }
  },

  /**
   * Get all addresses for an entity
   */
  getEntityAddresses: async (entityType: EntityType, entityId: string) => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);

      if (error) {
        console.error('Error fetching addresses:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        data,
        'Addresses fetched successfully'
      );
    } catch (err) {
      console.error('Unexpected error fetching addresses:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while fetching addresses'
      );
    }
  },

  /**
   * Update an existing address
   */
  updateAddress: async (addressId: string, addressData: Partial<UnifiedAddressFormData>) => {
    try {
      // Convert form field names to database field names
      const dbData = {
        ...(addressData.address_line1 !== undefined && { address_line_1: addressData.address_line1 }),
        ...(addressData.address_line2 !== undefined && { address_line_2: addressData.address_line2 }),
        ...(addressData.suburb !== undefined && { suburb: addressData.suburb }),
        ...(addressData.state !== undefined && { state: addressData.state }),
        ...(addressData.postcode !== undefined && { postcode: addressData.postcode }),
        ...(addressData.country !== undefined && { country: addressData.country }),
        ...(addressData.address_type !== undefined && { address_type: addressData.address_type }),
        ...(addressData.is_primary !== undefined && { is_primary: addressData.is_primary }),
        ...(addressData.latitude !== undefined && { latitude: addressData.latitude }),
        ...(addressData.longitude !== undefined && { longitude: addressData.longitude }),
      };

      const { data, error } = await supabase
        .from('unified_addresses')
        .update(dbData)
        .eq('id', addressId)
        .select()
        .single();

      if (error) {
        console.error('Error updating address:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        data,
        'Address updated successfully'
      );
    } catch (err) {
      console.error('Unexpected error updating address:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while updating the address'
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
        console.error('Error deleting address:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        { success: true },
        'Address deleted successfully'
      );
    } catch (err) {
      console.error('Unexpected error deleting address:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while deleting the address'
      );
    }
  }
};
