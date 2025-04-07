
import { clientApi } from './api';
import { addressService } from './services/address.service';
import { contactService } from './services/contact.service';
import { ApiResponse } from '@/types/api-response';
import { ClientRecord } from '@/types/clients';
import { ClientAddressRecord, ClientContactRecord } from './types';

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
  createClient: async (clientData: Partial<ClientRecord>): Promise<ApiResponse<ClientRecord>> => {
    return clientApi.createClient(clientData);
  },

  /**
   * Update an existing client
   * @param clientId Client ID
   * @param updateData Client data to update
   * @returns Promise<ApiResponse<ClientRecord>>
   */
  updateClient: async (clientId: string, updateData: Partial<ClientRecord>): Promise<ApiResponse<ClientRecord>> => {
    return clientApi.updateClient(clientId, updateData);
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
  getClientAddresses: async (clientId: string): Promise<ApiResponse<ClientAddressRecord[]>> => {
    return addressService.fetchClientAddresses(clientId);
  },

  /**
   * Create address for a client
   * @param addressData Address data
   * @returns Promise<ApiResponse<ClientAddressRecord>>
   */
  createClientAddress: async (addressData: Partial<ClientAddressRecord>): Promise<ApiResponse<ClientAddressRecord>> => {
    return addressService.createClientAddress(addressData);
  },

  /**
   * Update client address
   * @param addressId Address ID
   * @param addressData Address data to update
   * @returns Promise<ApiResponse<ClientAddressRecord>>
   */
  updateClientAddress: async (addressId: string, addressData: Partial<ClientAddressRecord>): Promise<ApiResponse<ClientAddressRecord>> => {
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
   * @returns Promise<ApiResponse<ClientContactRecord[]>>
   */
  getClientContacts: async (clientId: string): Promise<ApiResponse<ClientContactRecord[]>> => {
    return contactService.fetchClientContacts(clientId);
  },

  /**
   * Create contact for a client
   * @param contactData Contact data
   * @returns Promise<ApiResponse<ClientContactRecord>>
   */
  createClientContact: async (contactData: Partial<ClientContactRecord>): Promise<ApiResponse<ClientContactRecord>> => {
    return contactService.createClientContact(contactData);
  },

  /**
   * Update client contact
   * @param contactId Contact ID
   * @param contactData Contact data to update
   * @returns Promise<ApiResponse<ClientContactRecord>>
   */
  updateClientContact: async (contactId: string, contactData: Partial<ClientContactRecord>): Promise<ApiResponse<ClientContactRecord>> => {
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
