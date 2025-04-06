
import { clientApi } from '../api';
import { AddressFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';

/**
 * Client address management service
 */
export const clientAddressService = {
  // Get client addresses by client ID
  getClientAddresses: async (clientId: string) => {
    const response = await clientApi.fetchClientAddresses(clientId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('fetch', 'client_addresses', response.data);
    return { data: response.data, error: null };
  },

  // Create a new client address
  createClientAddress: async (clientId: string, addressData: Omit<AddressFormData, 'client_id'>) => {
    // Add client ID to address data
    const address: AddressFormData = {
      ...addressData,
      client_id: clientId
    };

    // Validate required fields
    if (!address.street?.trim()) {
      return {
        category: 'validation' as const,
        message: 'Street address is required',
        details: { field: 'street' }
      };
    }

    if (!address.suburb?.trim()) {
      return {
        category: 'validation' as const,
        message: 'Suburb is required',
        details: { field: 'suburb' }
      };
    }

    if (!address.state?.trim()) {
      return {
        category: 'validation' as const,
        message: 'State is required',
        details: { field: 'state' }
      };
    }

    if (!address.postcode?.trim()) {
      return {
        category: 'validation' as const,
        message: 'Postcode is required',
        details: { field: 'postcode' }
      };
    }

    const response = await clientApi.createClientAddress(address);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('create', 'client_address', response.data);
    return { data: response.data, error: null };
  },

  // Delete a client address
  deleteClientAddress: async (addressId: string) => {
    const response = await clientApi.deleteClientAddress(addressId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('delete', 'client_address', { addressId });
    return { success: true, error: null };
  }
};
