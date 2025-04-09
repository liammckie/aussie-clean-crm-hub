
// Import necessary modules and types
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { AddressFormData, UnifiedAddressRecord } from '@/types/form-types';
import { AddressType, EntityType } from '@/types/database-schema'; 
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Unified address service for managing addresses across different entity types
 */
export const unifiedAddressService = {
  /**
   * Create a new address for an entity
   */
  createAddress: async (
    entityType: EntityType, 
    entityId: string, 
    addressData: Omit<AddressFormData, 'entity_type' | 'entity_id'>
  ): Promise<ApiResponse<UnifiedAddressRecord>> => {
    try {
      // Validate required fields
      if (!addressData.address_line_1) {
        return createErrorResponse(
          ErrorCategory.VALIDATION,
          'Address line 1 is required',
          { field: 'address_line_1' }
        );
      }
      
      if (!addressData.suburb) {
        return createErrorResponse(
          ErrorCategory.VALIDATION,
          'Suburb is required',
          { field: 'suburb' }
        );
      }
      
      if (!addressData.state) {
        return createErrorResponse(
          ErrorCategory.VALIDATION,
          'State is required',
          { field: 'state' }
        );
      }
      
      if (!addressData.postcode) {
        return createErrorResponse(
          ErrorCategory.VALIDATION,
          'Postcode is required',
          { field: 'postcode' }
        );
      }
      
      // Check if this is set as primary address and handle accordingly
      if (addressData.is_primary) {
        // If setting as primary, update other addresses to not be primary
        if (entityId) {
          const { error: updateError } = await supabase
            .from('unified_addresses')
            .update({ is_primary: false })
            .match({ entity_type: entityType, entity_id: entityId });
            
          if (updateError) {
            console.warn('Error updating existing primary addresses:', updateError);
          }
        }
      }
      
      // Create address record
      const { data, error } = await supabase
        .from('unified_addresses')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          address_type: addressData.address_type,
          address_line_1: addressData.address_line_1,
          address_line_2: addressData.address_line_2 || null,
          suburb: addressData.suburb,
          state: addressData.state,
          postcode: addressData.postcode,
          country: addressData.country || 'Australia',
          is_primary: Boolean(addressData.is_primary),
          name: addressData.name || null,
          latitude: addressData.latitude || null,
          longitude: addressData.longitude || null,
          notes: addressData.notes || null
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
   */
  updateAddress: async (addressId: string, addressData: Partial<AddressFormData>): Promise<ApiResponse<UnifiedAddressRecord>> => {
    try {
      // If setting as primary, first get entity info to update other addresses
      if (addressData.is_primary) {
        const { data: addressInfo } = await supabase
          .from('unified_addresses')
          .select('entity_type, entity_id')
          .eq('id', addressId)
          .single();
          
        if (addressInfo) {
          const { error: updateError } = await supabase
            .from('unified_addresses')
            .update({ is_primary: false })
            .match({ 
              entity_type: addressInfo.entity_type, 
              entity_id: addressInfo.entity_id 
            })
            .neq('id', addressId);
            
          if (updateError) {
            console.warn('Error updating existing primary addresses:', updateError);
          }
        }
      }
      
      // Update address record
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
  deleteAddress: async (addressId: string): Promise<ApiResponse<{ success: boolean, id: string }>> => {
    try {
      // Delete address record
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
        { success: true, id: addressId },
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
   * Get all addresses for an entity
   */
  getAddresses: async (entityType: EntityType, entityId: string): Promise<ApiResponse<UnifiedAddressRecord[]>> => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select()
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
        data || [],
        'Addresses retrieved successfully'
      );
    } catch (err) {
      console.error('Unexpected error fetching addresses:', err);
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while fetching addresses'
      );
    }
  }
};
