
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Service for client address operations
 */
export const addressService = {
  /**
   * Fetch addresses for a client
   */
  fetchClientAddresses: async (clientId: string): Promise<ApiResponse<any[]>> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .select('*')
        .eq('client_id', clientId);

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(data || [], `Addresses for client ID ${clientId} fetched successfully`);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to fetch addresses for client with ID ${clientId}`,
        { error: error.message }
      );
    }
  },

  /**
   * Create a client address
   */
  createClientAddress: async (addressData: any): Promise<ApiResponse<any>> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .insert(addressData)
        .select()
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(data, 'Client address created successfully');
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        'Failed to create client address',
        { error: error.message }
      );
    }
  },

  /**
   * Update client address
   */
  updateClientAddress: async (addressId: string, addressData: any): Promise<ApiResponse<any>> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .update(addressData)
        .eq('id', addressId)
        .select()
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(data, `Address with ID ${addressId} updated successfully`);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to update address with ID ${addressId}`,
        { error: error.message }
      );
    }
  },

  /**
   * Delete a client address
   */
  deleteClientAddress: async (addressId: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('client_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          error.message,
          { error }
        );
      }

      return createSuccessResponse(true, `Address with ID ${addressId} deleted successfully`);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to delete client address`,
        { error: error.message }
      );
    }
  }
};
