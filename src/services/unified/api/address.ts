
import { supabase } from '@/integrations/supabase/client';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '@/types/api-response';
import { EntityType } from '@/types/form-types';
import { UnifiedAddressRecord } from '../types';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Create a new address for an entity
 */
export const createAddress = async (
  entityType: EntityType,
  entityId: string,
  addressData: Omit<UnifiedAddressRecord, 'entity_type' | 'entity_id'>
): Promise<ApiResponse<UnifiedAddressRecord>> => {
  try {
    // Map the form field names to database column names if needed
    const processedData = {
      ...addressData,
      address_line_1: addressData.address_line_1,
      address_line_2: addressData.address_line_2,
      entity_type: entityType,
      entity_id: entityId
    };
    
    AppLogger.info(LogCategory.ADDRESS, `Creating ${entityType} address for ID: ${entityId}`);
    
    const { data, error } = await supabase
      .from('unified_addresses')
      .insert({
        name: addressData.name,
        address_line_1: addressData.address_line_1,
        address_line_2: addressData.address_line_2,
        suburb: addressData.suburb,
        state: addressData.state,
        postcode: addressData.postcode,
        country: addressData.country || 'Australia',
        entity_id: entityId,
        entity_type: entityType,
        address_type: addressData.address_type,
        is_primary: addressData.is_primary
      })
      .select('*')
      .single();

    if (error) {
      AppLogger.error(LogCategory.DATABASE, `Error creating address: ${error.message}`, { 
        error, 
        entityType, 
        entityId 
      });
      
      return createErrorResponse(
        ErrorCategory.DATABASE,
        `Failed to create address: ${error.message}`,
        { details: error.details }
      );
    }

    return createSuccessResponse(data, 'Address created successfully');
  } catch (error: any) {
    AppLogger.error(LogCategory.SERVER, `Exception creating address: ${error.message}`, { 
      error,
      entityType,
      entityId
    });
    
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Failed to create address: ${error.message}`
    );
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (
  addressId: string,
  addressData: Partial<UnifiedAddressRecord>
): Promise<ApiResponse<UnifiedAddressRecord>> => {
  try {
    // Map the form field names to database column names if needed
    const processedData: any = { ...addressData };
    
    if (addressData.address_line_1) {
      processedData.address_line_1 = addressData.address_line_1;
    }
    
    if (addressData.address_line_2) {
      processedData.address_line_2 = addressData.address_line_2;
    }
    
    AppLogger.info(LogCategory.ADDRESS, `Updating address ID: ${addressId}`);
    
    const { data, error } = await supabase
      .from('unified_addresses')
      .update(processedData)
      .eq('id', addressId)
      .select('*')
      .single();

    if (error) {
      AppLogger.error(LogCategory.DATABASE, `Error updating address: ${error.message}`, {
        error,
        addressId
      });
      
      return createErrorResponse(
        ErrorCategory.DATABASE,
        `Failed to update address: ${error.message}`,
        { details: error.details }
      );
    }

    return createSuccessResponse(data, 'Address updated successfully');
  } catch (error: any) {
    AppLogger.error(LogCategory.SERVER, `Exception updating address: ${error.message}`, {
      error,
      addressId
    });
    
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Failed to update address: ${error.message}`
    );
  }
};

/**
 * Get addresses for an entity
 */
export const getEntityAddresses = async (
  entityType: EntityType,
  entityId: string
): Promise<ApiResponse<UnifiedAddressRecord[]>> => {
  try {
    AppLogger.info(LogCategory.ADDRESS, `Getting addresses for ${entityType} ID: ${entityId}`);
    
    const { data, error } = await supabase
      .from('unified_addresses')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('is_primary', { ascending: false });

    if (error) {
      AppLogger.error(LogCategory.DATABASE, `Error getting addresses: ${error.message}`, {
        error,
        entityType,
        entityId
      });
      
      return createErrorResponse(
        ErrorCategory.DATABASE,
        `Failed to get addresses: ${error.message}`,
        { details: error.details }
      );
    }

    return createSuccessResponse(data, 'Addresses retrieved successfully');
  } catch (error: any) {
    AppLogger.error(LogCategory.SERVER, `Exception getting addresses: ${error.message}`, {
      error,
      entityType,
      entityId
    });
    
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Failed to get addresses: ${error.message}`
    );
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (addressId: string): Promise<ApiResponse<boolean>> => {
  try {
    AppLogger.info(LogCategory.ADDRESS, `Deleting address ID: ${addressId}`);
    
    const { error } = await supabase
      .from('unified_addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      AppLogger.error(LogCategory.DATABASE, `Error deleting address: ${error.message}`, {
        error,
        addressId
      });
      
      return createErrorResponse(
        ErrorCategory.DATABASE,
        `Failed to delete address: ${error.message}`,
        { details: error.details }
      );
    }

    return createSuccessResponse(true, 'Address deleted successfully');
  } catch (error: any) {
    AppLogger.error(LogCategory.SERVER, `Exception deleting address: ${error.message}`, {
      error,
      addressId
    });
    
    return createErrorResponse(
      ErrorCategory.SERVER,
      `Failed to delete address: ${error.message}`
    );
  }
};

// Export all the address API methods
export const addressApi = {
  createAddress,
  updateAddress,
  getEntityAddresses,
  deleteAddress
};
