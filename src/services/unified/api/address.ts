
import { supabase } from '@/lib/supabase';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { UnifiedAddressRecord } from '../types';
import { AddressType, EntityType } from '@/types/form-types';
import { ErrorCategory } from '@/utils/logging/error-types';

export const addressApi = {
  /**
   * Create a new address for an entity
   */
  createAddress: async (
    entityType: EntityType,
    entityId: string,
    addressData: Omit<UnifiedAddressRecord, 'entity_type' | 'entity_id' | 'id'>
  ): Promise<ApiResponse<UnifiedAddressRecord>> => {
    try {
      // Check if this is set as primary and handle accordingly
      if (addressData.is_primary) {
        // If this is set as primary, update other addresses to not be primary
        const { error: updateError } = await supabase
          .from('unified_addresses')
          .update({ is_primary: false })
          .eq('entity_type', entityType)
          .eq('entity_id', entityId);

        if (updateError) {
          console.error('Error updating existing primary addresses:', updateError);
          return createErrorResponse(
            ErrorCategory.DATABASE,
            'Failed to update existing primary addresses'
          );
        }
      }

      // Create the address record
      const { data, error } = await supabase
        .from('unified_addresses')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          ...addressData
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
  getEntityAddresses: async (entityType: EntityType, entityId: string): Promise<ApiResponse<UnifiedAddressRecord[]>> => {
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
  updateAddress: async (
    addressId: string,
    addressData: Partial<UnifiedAddressRecord>
  ): Promise<ApiResponse<UnifiedAddressRecord>> => {
    try {
      // Check if this is set as primary and handle accordingly
      if (addressData.is_primary) {
        // Get the entity type and id for this address
        const { data: addressInfo, error: fetchError } = await supabase
          .from('unified_addresses')
          .select('entity_type, entity_id')
          .eq('id', addressId)
          .single();

        if (fetchError) {
          console.error('Error fetching address info:', fetchError);
          return createErrorResponse(
            ErrorCategory.DATABASE,
            'Failed to fetch address information'
          );
        }

        // Update other addresses to not be primary
        const { error: updateError } = await supabase
          .from('unified_addresses')
          .update({ is_primary: false })
          .eq('entity_type', addressInfo.entity_type)
          .eq('entity_id', addressInfo.entity_id)
          .neq('id', addressId);

        if (updateError) {
          console.error('Error updating existing primary addresses:', updateError);
        }
      }

      // Update the address
      const { data, error } = await supabase
        .from('unified_addresses')
        .update(addressData)
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
  deleteAddress: async (addressId: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const { error } = await supabase
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
