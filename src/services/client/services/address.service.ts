
import { clientApi } from '../api';
import { AddressFormData } from '../types';
import { logSuccess } from '@/utils/supabaseErrors';
import { clientAddressSchema, validateWithZod } from '../validation';
import { ApiResponse, createSuccessResponse, isApiError, formatError, ErrorCategory } from '@/types/api-response';

/**
 * Client address management service
 */
export const clientAddressService = {
  // Get client addresses by client ID
  getClientAddresses: async (clientId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.fetchClientAddresses(clientId);
    
    if (isApiError(response)) {
      return response;
    }

    logSuccess('fetch', 'client_addresses', response.data);
    return createSuccessResponse(response.data, 'Client addresses retrieved successfully');
  },

  // Create a new client address
  createClientAddress: async (clientId: string, addressData: Omit<AddressFormData, 'client_id'>): Promise<ApiResponse<any>> => {
    // Add client ID to address data
    const address: AddressFormData = {
      client_id: clientId,
      street: addressData.street || '', // Ensure required field has non-empty string value
      suburb: addressData.suburb || '', // Ensure required field has non-empty string value
      state: addressData.state || '',   // Ensure required field has non-empty string value
      postcode: addressData.postcode || '', // Ensure required field has non-empty string value
      address_type: addressData.address_type || 'physical', // Ensure required field has default value
      street_2: addressData.street_2,
      country: addressData.country || 'Australia'
    };

    // Validate the address data using Zod schema
    const validationResult = validateWithZod(clientAddressSchema, address);
    if ('category' in validationResult) {
      return formatError(
        ErrorCategory.VALIDATION, 
        validationResult.message, 
        validationResult.details
      );
    }

    const response = await clientApi.createClientAddress(validationResult.data);
    
    if (isApiError(response)) {
      return response;
    }

    logSuccess('create', 'client_address', response.data);
    return createSuccessResponse(response.data, 'Address created successfully');
  },

  // Delete a client address
  deleteClientAddress: async (addressId: string): Promise<ApiResponse<any>> => {
    const response = await clientApi.deleteClientAddress(addressId);
    
    if (isApiError(response)) {
      return response;
    }

    logSuccess('delete', 'client_address', { addressId });
    return createSuccessResponse({ success: true }, 'Address deleted successfully');
  }
};
