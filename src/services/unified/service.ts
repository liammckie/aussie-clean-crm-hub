
import { ApiResponse } from '@/types/api-response';
import { UnifiedAddressService } from '../address/unified-address-service';
import { UnifiedContactService } from '../contact/unified-contact-service';
import { UnifiedAddressRecord, UnifiedContactRecord } from './types';
import { AddressType, EntityType } from '@/types/database-schema';

// Create instances of the services
const addressService = new UnifiedAddressService();
const contactService = new UnifiedContactService();

/**
 * Unified service for addresses and contacts
 */
export const unifiedService = {
  // Address methods
  getEntityAddresses: (entityType: EntityType, entityId: string): Promise<ApiResponse<UnifiedAddressRecord[]>> => {
    return addressService.getEntityAddresses(entityType, entityId);
  },
  
  getAddressById: (addressId: string): Promise<ApiResponse<UnifiedAddressRecord>> => {
    return addressService.getAddressById(addressId);
  },

  createAddress: (entityType: EntityType, entityId: string, addressData: any): Promise<ApiResponse<UnifiedAddressRecord>> => {
    return addressService.createAddress(entityType, entityId, addressData);
  },

  updateAddress: (addressId: string, addressData: any): Promise<ApiResponse<UnifiedAddressRecord>> => {
    return addressService.updateAddress(addressId, addressData);
  },

  deleteAddress: (addressId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return addressService.deleteAddress(addressId);
  },

  // Contact methods
  getEntityContacts: (entityType: EntityType, entityId: string): Promise<ApiResponse<UnifiedContactRecord[]>> => {
    return contactService.getEntityContacts(entityType, entityId);
  },
  
  getContactById: (contactId: string): Promise<ApiResponse<UnifiedContactRecord>> => {
    return contactService.getContactById(contactId);
  },

  createContact: (entityType: EntityType, entityId: string, contactData: any): Promise<ApiResponse<UnifiedContactRecord>> => {
    return contactService.createContact(entityType, entityId, contactData);
  },

  updateContact: (contactId: string, contactData: any): Promise<ApiResponse<UnifiedContactRecord>> => {
    return contactService.updateContact(contactId, contactData);
  },

  deleteContact: (contactId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return contactService.deleteContact(contactId);
  }
};
