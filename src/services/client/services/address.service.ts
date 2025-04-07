
import { clientApi } from '../api';
import { AddressFormData, AddressApiResponse } from '../types';
import { AppLogger } from '@/utils/logging';
import { LogCategory } from '@/utils/logging/LogCategory';

/**
 * Address-related service functions
 */
export const clientAddressService = {
  /**
   * Get addresses for a client
   */
  getClientAddresses: async (clientId: string): Promise<AddressApiResponse> => {
    try {
      AppLogger.info(LogCategory.CLIENT, `Fetching addresses for client ${clientId}`);
      return await clientApi.fetchClientAddresses(clientId);
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, `Error fetching addresses for client ${clientId}`, { error });
      throw error;
    }
  },

  /**
   * Create a new client address
   */
  createClientAddress: async (addressData: AddressFormData): Promise<AddressApiResponse> => {
    try {
      AppLogger.info(LogCategory.CLIENT, `Creating address for client ${addressData.client_id}`);
      return await clientApi.createClientAddress(addressData);
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, `Error creating address for client ${addressData.client_id}`, { error });
      throw error;
    }
  },

  /**
   * Delete a client address
   */
  deleteClientAddress: async (addressId: string): Promise<any> => {
    try {
      AppLogger.info(LogCategory.CLIENT, `Deleting address ${addressId}`);
      return await clientApi.deleteClientAddress(addressId);
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, `Error deleting address ${addressId}`, { error });
      throw error;
    }
  }
};
