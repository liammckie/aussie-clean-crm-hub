
import { supabase } from '@/integrations/supabase/client';
import { createSuccessResponse, createErrorResponse, ApiResponse } from '@/types/api-response';
import { handleSupabaseError } from '@/utils/supabaseErrors';
import { ClientAddressRecord } from '@/services/client/types';
import { AddressApiResponse } from '@/services/client/types';

export const addressService = {
  fetchClientAddresses: async (clientId: string): Promise<ApiResponse<ClientAddressRecord[]>> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .select('*')
        .eq('client_id', clientId);

      if (error) return handleSupabaseError(error);

      return createSuccessResponse(data as ClientAddressRecord[], 'Client addresses retrieved successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  createClientAddress: async (addressData: Partial<ClientAddressRecord>): Promise<AddressApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .insert([addressData])
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      return createSuccessResponse(data as ClientAddressRecord, 'Client address created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  updateClientAddress: async (addressId: string, addressData: Partial<ClientAddressRecord>): Promise<AddressApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .update(addressData)
        .eq('id', addressId)
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      return createSuccessResponse(data as ClientAddressRecord, 'Client address updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  deleteClientAddress: async (addressId: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('client_addresses')
        .delete()
        .eq('id', addressId);

      if (error) return handleSupabaseError(error);

      return createSuccessResponse(true, 'Client address deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};
