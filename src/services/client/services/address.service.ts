
import { clientApi } from '../api';
import { AddressFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';
import { clientAddressSchema, validateWithZod } from '../validation';
import { ApiResponse, createSuccessResponse } from '@/types/api-response';

/**
 * Client address management service
 */
export const clientAddressService = {
  // Get client addresses by client ID
  getClientAddresses: async (clientId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.fetchClientAddresses(clientId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('fetch', 'client_addresses', response.data);
    return createSuccessResponse(response.data);
  },

  // Create a new client address
  createClientAddress: async (clientId: string, addressData: Omit<AddressFormData, 'client_id'>): Promise<ApiResponse<any>> => {
    // Add client ID to address data
    const address: AddressFormData = {
      ...addressData,
      client_id: clientId
    };

    // Validate the address data using Zod schema
    const validationResult = validateWithZod(clientAddressSchema, address);
    if ('category' in validationResult) {
      return validationResult;
    }

    const response = await clientApi.createClientAddress(validationResult.data);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('create', 'client_address', response.data);
    return createSuccessResponse(response.data);
  },

  // Delete a client address
  deleteClientAddress: async (addressId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.deleteClientAddress(addressId);
    
    if ('category' in response) {
      return response;
    }

    logSuccess('delete', 'client_address', { addressId });
    return createSuccessResponse({ success: true });
  }
};
