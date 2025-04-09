
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createErrorResponse, createSuccessResponse, isApiError } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';
import { AppLogger, LogCategory } from '@/utils/logging';
import { UnifiedAddressFormData } from '@/types/form-types';

// Type definition for unified_addresses table record
export interface UnifiedAddressRecord {
  id: string;
  entity_type: string;
  entity_id: string;
  address_line_1: string;
  address_line_2: string | null;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Unified service for address management across different entity types
 */
class UnifiedAddressService {
  /**
   * Create a new address for an entity
   */
  async createAddress(
    entityType: string,
    entityId: string,
    addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'>
  ): Promise<ApiResponse<UnifiedAddressRecord>> {
    try {
      // Ensure we don't have multiple primary addresses if this is set as primary
      if (addressData.is_primary) {
        await this.clearPrimaryFlagForEntity(entityType, entityId, addressData.address_type);
      }

      // Insert the new address
      const { data, error } = await supabase
        .from('unified_addresses')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          ...addressData
        })
        .select('*')
        .single();

      if (error) {
        AppLogger.error(LogCategory.ADDRESS, `Failed to create address: ${error.message}`, {
          entityType,
          entityId,
          error
        });
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to create address: ${error.message}`,
          { supabase_error: error }
        );
      }

      AppLogger.info(LogCategory.ADDRESS, 'Address created successfully', {
        entityType,
        entityId,
        addressId: data.id
      });
      
      return createSuccessResponse(data as UnifiedAddressRecord, 'Address created successfully');
    } catch (error) {
      AppLogger.error(LogCategory.ADDRESS, `Error in createAddress: ${error instanceof Error ? error.message : String(error)}`, {
        entityType,
        entityId,
        error
      });
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while creating the address',
        { error }
      );
    }
  }

  /**
   * Get all addresses for an entity
   */
  async getAddresses(
    entityType: string,
    entityId: string
  ): Promise<ApiResponse<UnifiedAddressRecord[]>> {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('is_primary', { ascending: false });

      if (error) {
        AppLogger.error(LogCategory.ADDRESS, `Failed to fetch addresses: ${error.message}`, {
          entityType,
          entityId,
          error
        });
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to fetch addresses: ${error.message}`,
          { supabase_error: error }
        );
      }

      return createSuccessResponse(
        data as UnifiedAddressRecord[],
        'Addresses fetched successfully',
        data.length
      );
    } catch (error) {
      AppLogger.error(LogCategory.ADDRESS, `Error in getAddresses: ${error instanceof Error ? error.message : String(error)}`, {
        entityType,
        entityId,
        error
      });
      return createErrorResponse(
        ErrorCategory.SERVER,
        'An unexpected error occurred while fetching addresses',
        { error }
      );
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
        const addressResponse = await this.getAddress(addressId);
        
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
}

// Export singleton instance
export const unifiedAddressService = new UnifiedAddressService();
