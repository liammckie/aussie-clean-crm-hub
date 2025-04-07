
import { clientApi } from './api';
import { addressService } from './services/address.service';
import { contactService } from './services/contact.service';
import { ApiResponse } from '@/types/api-response';
import { ClientRecord, ClientFormData } from '@/types/clients';
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
  createClient: async (clientData: ClientFormData): Promise<ApiResponse<ClientRecord>> => {
    // Ensure onboarding_date is a string if it's a Date object
    const preparedData = {
      ...clientData,
      onboarding_date: clientData.onboarding_date instanceof Date 
        ? clientData.onboarding_date.toISOString().split('T')[0] 
        : clientData.onboarding_date
    };
    
    return clientApi.createClient(preparedData as ClientRecord);
  },

  /**
   * Update an existing client
   * @param clientId Client ID
   * @param updateData Client data to update
   * @returns Promise<ApiResponse<ClientRecord>>
   */
  updateClient: async (clientId: string, updateData: Partial<ClientFormData>): Promise<ApiResponse<ClientRecord>> => {
    // Ensure onboarding_date is a string if it's a Date object
    const preparedData = {
      ...updateData,
      onboarding_date: updateData.onboarding_date instanceof Date 
        ? updateData.onboarding_date.toISOString().split('T')[0] 
        : updateData.onboarding_date
    };
    
    return clientApi.updateClient(clientId, preparedData as Partial<ClientRecord>);
  },

  /**
   * Delete a client
   * @param clientId Client ID
   * @returns Promise<ApiResponse<boolean>>
   */
  deleteClient: async (clientId: string): Promise<ApiResponse<boolean>> => {
    return clientApi.deleteClient(clientId);
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
