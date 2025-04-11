
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { AppLogger, LogCategory } from '@/utils/logging';
import { EntityType, AddressType } from '@/types/database-schema';
import { UnifiedAddressRecord } from './types';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Unified address service for all entity types
 */
export class UnifiedAddressService {
  
  /**
   * Get addresses by entity type and ID
   */
  async getEntityAddresses(
    entityType: EntityType, 
    entityId: string
  ): Promise<ApiResponse<UnifiedAddressRecord[]>> {
    try {
      AppLogger.debug(LogCategory.ADDRESS, `Fetching addresses for ${entityType} with ID ${entityId}`);
      
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('is_primary', { ascending: false });

      if (error) {
        AppLogger.error(LogCategory.ADDRESS, `Error fetching addresses: ${error.message}`, { error });
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to fetch addresses: ${error.message}`,
          { details: error }
        );
      }

      return createSuccessResponse(
        data,
        `Addresses for ${entityType} fetched successfully`
      );
    } catch (error: any) {
      AppLogger.error(LogCategory.ERROR, `Unexpected error fetching addresses: ${error.message}`, { error });
      return createErrorResponse(
        ErrorCategory.SERVER,
        `An unexpected error occurred: ${error.message}`,
        { error }
      );
    }
  }

  /**
   * Get a specific address by ID
   */
  async getAddressById(addressId: string): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('id', addressId)
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to fetch address: ${error.message}`,
          { details: error }
        );
      }

      return createSuccessResponse(
        data,
        'Address fetched successfully'
      );
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `An unexpected error occurred: ${error.message}`,
        { error }
      );
    }
  }

  /**
   * Create a new address
   */
  async createAddress(
    entityType: EntityType,
    entityId: string,
    addressData: Omit<UnifiedAddressRecord, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      AppLogger.debug(LogCategory.ADDRESS, `Creating address for ${entityType} with ID ${entityId}`, { addressData });

      // Handle is_primary flag - if this address is primary, set all others to non-primary
      if (addressData.is_primary) {
        const { error: updateError } = await supabase
          .from('unified_addresses')
          .update({ is_primary: false })
          .eq('entity_type', entityType)
          .eq('entity_id', entityId);

        if (updateError) {
          AppLogger.error(LogCategory.ADDRESS, `Error updating primary status: ${updateError.message}`, { error: updateError });
        }
      }

      // Ensure entity_type and entity_id are set
      const newAddress = {
        ...addressData,
        entity_type: entityType,
        entity_id: entityId
      };

      const { data, error } = await supabase
        .from('unified_addresses')
        .insert(newAddress)
        .select()
        .single();

      if (error) {
        AppLogger.error(LogCategory.ADDRESS, `Error creating address: ${error.message}`, { 
          error, 
          addressData: newAddress
        });
        
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to create address: ${error.message}`,
          { details: error }
        );
      }

      AppLogger.info(LogCategory.ADDRESS, `Address created for ${entityType} ID ${entityId}`, {
        addressId: data.id,
        addressType: data.address_type
      });

      return createSuccessResponse(
        data,
        'Address created successfully'
      );
    } catch (error: any) {
      AppLogger.error(LogCategory.ERROR, `Unexpected error creating address: ${error.message}`, { error });
      
      return createErrorResponse(
        ErrorCategory.SERVER,
        `An unexpected error occurred: ${error.message}`,
        { error }
      );
    }
  }

  /**
   * Update an existing address
   */
  async updateAddress(
    addressId: string,
    addressData: Partial<UnifiedAddressRecord>
  ): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      // If setting this address as primary, handle other addresses
      if (addressData.is_primary) {
        // Get the entity type and ID for this address
        const { data: addressInfo, error: fetchError } = await supabase
          .from('unified_addresses')
          .select('entity_type, entity_id')
          .eq('id', addressId)
          .single();

        if (fetchError) {
          return createErrorResponse(
            ErrorCategory.DATABASE,
            `Failed to fetch address information: ${fetchError.message}`,
            { details: fetchError }
          );
        }

        // Update other addresses for this entity to not be primary
        const { error: updateError } = await supabase
          .from('unified_addresses')
          .update({ is_primary: false })
          .eq('entity_type', addressInfo.entity_type)
          .eq('entity_id', addressInfo.entity_id)
          .neq('id', addressId);

        if (updateError) {
          AppLogger.error(LogCategory.ADDRESS, `Error updating primary status: ${updateError.message}`, { error: updateError });
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
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to update address: ${error.message}`,
          { details: error }
        );
      }

      return createSuccessResponse(
        data,
        'Address updated successfully'
      );
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `An unexpected error occurred: ${error.message}`,
        { error }
      );
    }
  }

  /**
   * Delete an address
   */
  async deleteAddress(addressId: string): Promise<ApiResponse<{ success: boolean; id: string }>> {
    try {
      const { error } = await supabase
        .from('unified_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to delete address: ${error.message}`,
          { details: error }
        );
      }

      return createSuccessResponse(
        { success: true, id: addressId },
        'Address deleted successfully'
      );
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `An unexpected error occurred: ${error.message}`,
        { error }
      );
    }
  }

  /**
   * Get primary address for an entity
   */
  async getPrimaryAddress(
    entityType: EntityType,
    entityId: string,
    addressType?: AddressType
  ): Promise<ApiResponse<UnifiedAddressRecord | null>> {
    try {
      let query = supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('is_primary', true);
      
      if (addressType) {
        query = query.eq('address_type', addressType);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to fetch primary address: ${error.message}`,
          { details: error }
        );
      }

      return createSuccessResponse(
        data,
        data ? 'Primary address fetched successfully' : 'No primary address found'
      );
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `An unexpected error occurred: ${error.message}`,
        { error }
      );
    }
  }
}

// Create and export a singleton instance
export const unifiedAddressService = new UnifiedAddressService();
