
import { supabase } from '@/lib/supabase';
import { ClientAddressRecord, AddressFormData } from '../types';
import { AddressType } from '@/types/form-types';
import { handleApiError } from '@/utils/api-utils';

/**
 * Client address service for managing client addresses
 */
export const clientAddressService = {
  /**
   * Get all addresses for a client
   */
  getClientAddresses: async (clientId: string): Promise<{ data: ClientAddressRecord[] } | { error: any }> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        return { error: handleApiError(error, 'Failed to fetch client addresses', { clientId }) };
      }

      return { data: data as ClientAddressRecord[] };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error fetching client addresses', { clientId }) };
    }
  },

  /**
   * Create a new address for a client
   */
  createClientAddress: async (clientId: string, addressData: Omit<AddressFormData, 'client_id'>): Promise<{ data: ClientAddressRecord } | { error: any }> => {
    try {
      // Ensure all required fields are present
      if (!clientId || !addressData.street || !addressData.suburb || !addressData.state || !addressData.postcode) {
        return { 
          error: handleApiError(
            new Error('Missing required address fields'), 
            'Validation error for client address',
            { clientId }
          ) 
        };
      }

      // Merge data with clientId
      const dbAddressData = {
        client_id: clientId,
        street: addressData.street,
        suburb: addressData.suburb,
        state: addressData.state,
        postcode: addressData.postcode,
        country: addressData.country || 'Australia',
        address_type: addressData.address_type || 'billing'
      };

      const { data: createdAddress, error } = await supabase
        .from('client_addresses')
        .insert([dbAddressData])
        .select()
        .single();

      if (error) {
        return { error: handleApiError(error, 'Failed to create client address', { clientId, addressData }) };
      }

      return { data: createdAddress as ClientAddressRecord };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error creating client address', { clientId, addressData }) };
    }
  },

  /**
   * Delete a client address
   */
  deleteClientAddress: async (addressId: string): Promise<{ data: boolean } | { error: any }> => {
    try {
      const { error } = await supabase
        .from('client_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        return { error: handleApiError(error, 'Failed to delete client address', { addressId }) };
      }

      return { data: true };
    } catch (error: any) {
      return { error: handleApiError(error, 'Unexpected error deleting client address', { addressId }) };
    }
  }
};
