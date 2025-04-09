
import { supabase } from '@/lib/supabase';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { UnifiedAddressFormData } from '@/types/form-types';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { EntityType, AddressType } from '@/types/database-schema';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Unified Address Service
 * This is the central service for all address operations,
 * providing a consistent interface for working with addresses across the application.
 */
export const unifiedAddressService = {
  /**
   * Get all addresses for an entity
   * @param entityType Type of entity (client, supplier, etc.)
   * @param entityId ID of the entity
   * @returns Promise<ApiResponse<UnifiedAddressRecord[]>>
   */
  getAddresses: async (
    entityType: EntityType,
    entityId: string
  ): Promise<ApiResponse<UnifiedAddressRecord[]>> => {
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
   * Get primary address for an entity
   * @param entityType Type of entity (client, supplier, etc.)
   * @param entityId ID of the entity
   * @returns Promise<ApiResponse<UnifiedAddressRecord>>
   */
  getPrimaryAddress: async (
    entityType: EntityType,
    entityId: string
  ): Promise<ApiResponse<UnifiedAddressRecord>> => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('is_primary', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found, get any address as fallback
          const { data: anyAddress, error: anyError } = await supabase
            .from('unified_addresses')
            .select('*')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (anyError) {
            return createErrorResponse(
              ErrorCategory.NOT_FOUND,
              'No address found for this entity'
            );
          }

          return createSuccessResponse(
            anyAddress,
            'Address fetched successfully (fallback)'
          );
        }

        console.error('Error fetching primary address:', error);
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message
        );
      }

      return createSuccessResponse(
        data,
        'Primary address fetched successfully'
      );
    } catch (err) {
      console.error('Unexpected error fetching primary address:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while fetching primary address'
      );
    }
  },

  /**
   * Create a new address for an entity
   * @param entityType Type of entity (client, supplier, etc.)
   * @param entityId ID of the entity
   * @param addressData Address data
   * @returns Promise<ApiResponse<UnifiedAddressRecord>>
   */
  createAddress: async (
    entityType: EntityType,
    entityId: string,
    addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'>
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
          address_line_1: addressData.address_line_1,
          address_line_2: addressData.address_line_2,
          suburb: addressData.suburb,
          state: addressData.state,
          postcode: addressData.postcode,
          country: addressData.country,
          address_type: addressData.address_type,
          is_primary: addressData.is_primary || false,
          name: addressData.name,
          latitude: addressData.latitude,
          longitude: addressData.longitude,
          notes: addressData.notes
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
   * Update an existing address
   * @param addressId Address ID
   * @param addressData Address data to update
   * @returns Promise<ApiResponse<UnifiedAddressRecord>>
   */
  updateAddress: async (
    addressId: string,
    addressData: Partial<UnifiedAddressFormData>
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

      // Prepare update data
      const updateData: Record<string, any> = {};
      
      // Only include properties that were provided
      if (addressData.address_line_1 !== undefined) updateData.address_line_1 = addressData.address_line_1;
      if (addressData.address_line_2 !== undefined) updateData.address_line_2 = addressData.address_line_2;
      if (addressData.suburb !== undefined) updateData.suburb = addressData.suburb;
      if (addressData.state !== undefined) updateData.state = addressData.state;
      if (addressData.postcode !== undefined) updateData.postcode = addressData.postcode;
      if (addressData.country !== undefined) updateData.country = addressData.country;
      if (addressData.address_type !== undefined) updateData.address_type = addressData.address_type;
      if (addressData.is_primary !== undefined) updateData.is_primary = addressData.is_primary;
      if (addressData.name !== undefined) updateData.name = addressData.name;
      if (addressData.latitude !== undefined) updateData.latitude = addressData.latitude;
      if (addressData.longitude !== undefined) updateData.longitude = addressData.longitude;
      if (addressData.notes !== undefined) updateData.notes = addressData.notes;

      // Update the address
      const { data, error } = await supabase
        .from('unified_addresses')
        .update(updateData)
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
   * @param addressId Address ID
   * @returns Promise<ApiResponse<{ success: boolean }>>
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
  },

  /**
   * Migrate legacy address data to unified_addresses table
   * @param entityType Type of entity (client, supplier, etc.)
   * @param entityId ID of the entity
   * @param legacyAddress Legacy address data
   * @returns Promise<ApiResponse<UnifiedAddressRecord>>
   */
  migrateAddressData: async (
    entityType: EntityType,
    entityId: string,
    legacyAddress: {
      address_line_1?: string,
      address_line_2?: string,
      suburb?: string,
      state?: string,
      postcode?: string,
      country?: string
    }
  ): Promise<ApiResponse<UnifiedAddressRecord>> => {
    // Skip if no address data
    if (!legacyAddress.address_line_1 && !legacyAddress.suburb) {
      return createErrorResponse(
        ErrorCategory.VALIDATION,
        'No address data to migrate'
      );
    }

    // Check if address already exists in unified_addresses
    const { data: existingAddress } = await supabase
      .from('unified_addresses')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .limit(1);

    // If address already exists, skip migration
    if (existingAddress && existingAddress.length > 0) {
      return createSuccessResponse(
        existingAddress[0],
        'Address already migrated'
      );
    }

    // Create new unified address
    return this.createAddress(entityType, entityId, {
      address_line_1: legacyAddress.address_line_1 || '',
      address_line_2: legacyAddress.address_line_2,
      suburb: legacyAddress.suburb || '',
      state: legacyAddress.state || '',
      postcode: legacyAddress.postcode || '',
      country: legacyAddress.country || 'Australia',
      address_type: AddressType.BILLING,
      is_primary: true
    });
  }
};

export default unifiedAddressService;
