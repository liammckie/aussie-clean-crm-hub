import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ClientFormData } from './types';
import { ClientRecord } from '@/types/database-schema';
import { convertClientFormToUnifiedAddress } from '@/utils/address-helpers';
import { unifiedAddressService } from '@/services/unified/address-service';
import { EntityType } from '@/types/database-schema';

/**
 * Create a new client
 * @param data Client form data
 * @returns ApiResponse with client data or error
 */
export async function createClient(data: ClientFormData): Promise<ApiResponse<ClientRecord>> {
  try {
    AppLogger.info(LogCategory.CLIENT, 'Creating new client', { 
      businessName: data.business_name
    });

    // Extract address fields to handle separately
    const { 
      address_line_1, address_line_2, suburb, state, postcode, country,
      ...clientData 
    } = data;
    
    // Insert the client record
    const { data: client, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      AppLogger.error(LogCategory.CLIENT, `Error creating client: ${error.message}`, { error });
      return createErrorResponse(
        ErrorCategory.DATABASE,
        `Failed to create client: ${error.message}`,
        { error }
      );
    }

    // Now create the address if address data is provided
    if (address_line_1 && suburb && state && postcode) {
      const addressData = convertClientFormToUnifiedAddress(data, client.id);
      
      const addressResponse = await unifiedAddressService.createAddress(
        EntityType.CLIENT,
        client.id,
        addressData
      );

      if ('category' in addressResponse) {
        AppLogger.error(LogCategory.CLIENT, `Error creating client address: ${addressResponse.message}`, { 
          clientId: client.id, 
          error: addressResponse
        });
        // Don't fail the entire operation if address creation fails
      }
    }
    
    AppLogger.info(LogCategory.CLIENT, 'Client created successfully', {
      clientId: client.id,
      businessName: client.business_name
    });

    return createSuccessResponse(client, 'Client created successfully');
  } catch (error: any) {
    AppLogger.error(LogCategory.CLIENT, `Error in createClient: ${error.message}`, { error });
    return createErrorResponse(
      ErrorCategory.SERVER,
      error.message || 'An error occurred while creating the client',
      { error }
    );
  }
}

import { clientApi } from './api';
import { addressService, contactService } from './services';
import { ApiResponse, ApiSuccessResponse, ApiErrorResponse, createSuccessResponse, isApiSuccess } from '@/types/api-response';
import { ClientRecord } from '@/types/clients';
import { ContactRecord } from './types';

/**
 * Client service implementation that aggregates multiple client-related services
 */
export const clientService = {
  /**
   * Get all clients
   * @returns Promise<ApiResponse<ClientRecord[]>>
   */
  getAllClients: async (): Promise<ApiResponse<ClientRecord[]>> => {
    return clientApi.fetchAllClients();
  },

  /**
   * Get client by ID
   * @param clientId Client ID
   * @returns Promise<ApiResponse<ClientRecord>>
   */
  getClientById: async (clientId: string): Promise<ApiResponse<ClientRecord>> => {
    return clientApi.fetchClientById(clientId);
  },

  /**
   * Create a new client
   * @param clientData Client data
   * @returns Promise<ApiResponse<ClientRecord>>
   */
  createClient: async (clientData: any): Promise<ApiResponse<ClientRecord>> => {
    const preparedData = { ...clientData };
    return createClient(preparedData);
  },

  /**
   * Update an existing client
   * @param clientId Client ID
   * @param updateData Client data to update
   * @returns Promise<ApiResponse<ClientRecord>>
   */
  updateClient: async (clientId: string, updateData: any): Promise<ApiResponse<ClientRecord>> => {
    const preparedData = { ...updateData };
    return clientApi.updateClient(clientId, preparedData);
  },

  /**
   * Delete a client
   * @param clientId Client ID
   * @returns Promise<ApiResponse<boolean>>
   */
  deleteClient: async (clientId: string): Promise<ApiResponse<boolean>> => {
    const response = await clientApi.deleteClient(clientId);
    if (isApiSuccess(response) && response.data && 'success' in response.data) {
      return createSuccessResponse(Boolean(response.data.success), response.message);
    }
    return response as ApiResponse<boolean>;
  },

  /**
   * Get addresses for a client
   * @param clientId Client ID
   * @returns Promise<ApiResponse<ClientAddressRecord[]>>
   */
  getClientAddresses: async (clientId: string): Promise<ApiResponse<any[]>> => {
    return addressService.fetchClientAddresses(clientId);
  },

  /**
   * Create address for a client
   * @param addressData Address data
   * @returns Promise<ApiResponse<ClientAddressRecord>>
   */
  createClientAddress: async (addressData: any): Promise<ApiResponse<any>> => {
    return addressService.createClientAddress(addressData);
  },

  /**
   * Update client address
   * @param addressId Address ID
   * @param addressData Address data to update
   * @returns Promise<ApiResponse<ClientAddressRecord>>
   */
  updateClientAddress: async (addressId: string, addressData: any): Promise<ApiResponse<any>> => {
    return addressService.updateClientAddress(addressId, addressData);
  },

  /**
   * Delete a client address
   * @param addressId Address ID
   * @returns Promise<ApiResponse<boolean>>
   */
  deleteClientAddress: async (addressId: string): Promise<ApiResponse<boolean>> => {
    return addressService.deleteClientAddress(addressId);
  },

  /**
   * Get contacts for a client
   * @param clientId Client ID
   * @returns Promise<ApiResponse<ContactRecord[]>>
   */
  getClientContacts: async (clientId: string): Promise<ApiResponse<ContactRecord[]>> => {
    return contactService.fetchClientContacts(clientId);
  },

  /**
   * Create contact for a client
   * @param clientId Client ID
   * @param contactData Contact data
   * @returns Promise<ApiResponse<ContactRecord>>
   */
  createClientContact: async (clientId: string, contactData: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> => {
    return contactService.createClientContact(clientId, contactData);
  },

  /**
   * Update client contact
   * @param contactId Contact ID
   * @param contactData Contact data to update
   * @returns Promise<ApiResponse<ContactRecord>>
   */
  updateClientContact: async (contactId: string, contactData: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> => {
    return contactService.updateClientContact(contactId, contactData);
  },

  /**
   * Delete a client contact
   * @param contactId Contact ID
   * @returns Promise<ApiResponse<boolean>>
   */
  deleteClientContact: async (contactId: string): Promise<ApiResponse<boolean>> => {
    return contactService.deleteClientContact(contactId);
  }
};

export default clientService;
