
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/utils/supabaseErrors';
import { ApiResponse, createSuccessResponse, createErrorResponse, isApiError } from '@/types/api-response';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { ErrorCategory } from '@/utils/logging/error-types';
import { AppLogger, LogCategory } from '@/utils/logging';
import { UnifiedAddressFormData } from '@/types/form-types';

/**
 * Service for managing unified addresses
 */
export class UnifiedAddressService {
  /**
   * Get addresses for an entity
   * @param entityType Type of entity (client, site, etc.)
   * @param entityId Entity ID
   * @returns Promise with the addresses
   */
  async getEntityAddresses(entityType: string, entityId: string): Promise<ApiResponse<UnifiedAddressRecord[]>> {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Addresses fetched successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to fetch addresses', {
        entity_type: entityType,
        entity_id: entityId,
        operation: 'getEntityAddresses'
      });
    }
  }

  /**
   * Get address by ID
   * @param addressId Address ID
   * @returns Promise with the address
   */
  async getAddressById(addressId: string): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('id', addressId)
        .single();

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Address fetched successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to fetch address', {
        address_id: addressId,
        operation: 'getAddressById'
      });
    }
  }

  /**
   * Create address
   * @param entityType Type of entity
   * @param entityId ID of the entity
   * @param addressData Address data
   * @returns Promise with the created address
   */
  async createAddress(
    entityType: string,
    entityId: string,
    addressData: any
  ): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      const preparedData = {
        entity_type: entityType,
        entity_id: entityId,
        ...addressData
      };

      const { data, error } = await supabase
        .from('unified_addresses')
        .insert(preparedData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Address created successfully');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to create address', {
        entity_type: entityType,
        entity_id: entityId,
        operation: 'createAddress'
      });
    }
  }

  /**
   * Update an address
   */
  async updateAddress(
    addressId: string,
    addressData: UnifiedAddressFormData
  ): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      // If setting as primary, first get the address details to clear other primary flags
      if (addressData.is_primary) {
        const addressResponse = await this.getAddressById(addressId);
        
        if (isApiError(addressResponse)) {
          return addressResponse;
        }
        
        const { entity_type, entity_id, address_type } = addressResponse.data;
        await this.clearPrimaryFlagForEntity(entity_type, entity_id, address_type);
      }

      // Update the address
      const { data, error } = await supabase
        .from('unified_addresses')
        .update({
          address_line_1: addressData.address_line_1,
          address_line_2: addressData.address_line_2 || null,
          suburb: addressData.suburb,
          state: addressData.state,
          postcode: addressData.postcode,
          country: addressData.country,
          address_type: addressData.address_type,
          is_primary: addressData.is_primary,
          updated_at: new Date().toISOString()
        })
        .eq('id', addressId)
        .select('*')
        .single();

      if (error) {
        AppLogger.error(LogCategory.ADDRESS, `Failed to update address: ${error.message}`, {
          addressId,
          error
        });
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to update address: ${error.message}`,
          { supabase_error: error }
        );
      }

      AppLogger.info(LogCategory.ADDRESS, 'Address updated successfully', { addressId });
      return createSuccessResponse(data as UnifiedAddressRecord, 'Address updated successfully');
    } catch (error) {
      AppLogger.error(LogCategory.ADDRESS, `Error in updateAddress: ${error instanceof Error ? error.message : String(error)}`, {
        addressId,
        error
      });
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while updating the address',
        { error }
      );
    }
  }

  /**
   * Get a single address by ID
   */
  async getAddress(addressId: string): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('id', addressId)
        .single();

      if (error) {
        AppLogger.error(LogCategory.ADDRESS, `Failed to fetch address: ${error.message}`, {
          addressId,
          error
        });
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to fetch address: ${error.message}`,
          { supabase_error: error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord, 'Address fetched successfully');
    } catch (error) {
      AppLogger.error(LogCategory.ADDRESS, `Error in getAddress: ${error instanceof Error ? error.message : String(error)}`, {
        addressId,
        error
      });
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while fetching the address',
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
        AppLogger.error(LogCategory.ADDRESS, `Failed to delete address: ${error.message}`, {
          addressId,
          error
        });
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to delete address: ${error.message}`,
          { supabase_error: error }
        );
      }

      AppLogger.info(LogCategory.ADDRESS, 'Address deleted successfully', { addressId });
      return createSuccessResponse({ success: true, id: addressId }, 'Address deleted successfully');
    } catch (error) {
      AppLogger.error(LogCategory.ADDRESS, `Error in deleteAddress: ${error instanceof Error ? error.message : String(error)}`, {
        addressId,
        error
      });
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while deleting the address',
        { error }
      );
    }
  }

  /**
   * Clear primary flag for all addresses of the same type for an entity
   * This ensures only one address can be primary per address type
   */
  private async clearPrimaryFlagForEntity(
    entityType: string,
    entityId: string,
    addressType: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('unified_addresses')
        .update({ is_primary: false })
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('address_type', addressType)
        .eq('is_primary', true);

      if (error) {
        AppLogger.error(LogCategory.ADDRESS, `Failed to clear primary flags: ${error.message}`, {
          entityType,
          entityId,
          addressType,
          error
        });
        throw error;
      }
    } catch (error) {
      AppLogger.error(LogCategory.ADDRESS, `Error in clearPrimaryFlagForEntity: ${error instanceof Error ? error.message : String(error)}`, {
        entityType,
        entityId,
        addressType,
        error
      });
      throw new Error('Failed to prepare address for primary status update');
    }
  }

  /**
   * Migrate address data from old format to unified format
   */
  async migrateAddressData(entityType: string, entityId: string, oldData: any): Promise<ApiResponse<UnifiedAddressRecord[]>> {
    try {
      // Implementation of migration logic would go here
      return createSuccessResponse([], 'Address migration not implemented yet');
    } catch (error) {
      return handleSupabaseError(error, 'Failed to migrate address data', {
        entity_type: entityType,
        entity_id: entityId,
        operation: 'migrateAddressData'
      });
    }
  }

  /**
   * Get all addresses for entity - alias for getEntityAddresses
   */
  async getAddresses(entityType: string, entityId: string): Promise<ApiResponse<UnifiedAddressRecord[]>> {
    return this.getEntityAddresses(entityType, entityId);
  }
}

// Export singleton instance
export const unifiedAddressService = new UnifiedAddressService();
