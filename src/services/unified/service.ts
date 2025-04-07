
import {
  UnifiedAddressRecord,
  UnifiedContactRecord,
  ValidationErrorResponse
} from './types';
import { UnifiedAddressFormData, UnifiedContactFormData, EntityType } from '@/types/form-types';
import { addressApi } from './api/address';
import { contactApi } from './api/contact';

/**
 * Unified service layer for managing addresses and contacts across different entity types
 */
export const unifiedService = {
  /**
   * Create a new address for an entity
   */
  createAddress: async (
    entityType: EntityType,
    entityId: string,
    addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'>
  ) => {
    return addressApi.createAddress(entityType, entityId, addressData);
  },

  /**
   * Get all addresses for an entity
   */
  getEntityAddresses: async (entityType: EntityType, entityId: string) => {
    return addressApi.getEntityAddresses(entityType, entityId);
  },

  /**
   * Update an existing address
   */
  updateAddress: async (addressId: string, addressData: Partial<UnifiedAddressFormData>) => {
    return addressApi.updateAddress(addressId, addressData);
  },

  /**
   * Delete an address
   */
  deleteAddress: async (addressId: string) => {
    return addressApi.deleteAddress(addressId);
  },

  /**
   * Create a new contact for an entity
   */
  createContact: async (
    entityType: EntityType,
    entityId: string,
    contactData: Omit<UnifiedContactFormData, 'entity_type' | 'entity_id'>
  ) => {
    return contactApi.createContact(entityType, entityId, contactData);
  },

  /**
   * Get all contacts for an entity
   */
  getEntityContacts: async (entityType: EntityType, entityId: string) => {
    return contactApi.getEntityContacts(entityType, entityId);
  },

  /**
   * Update an existing contact
   */
  updateContact: async (contactId: string, contactData: Partial<UnifiedContactFormData>) => {
    return contactApi.updateContact(contactId, contactData);
  },

  /**
   * Delete a contact
   */
  deleteContact: async (contactId: string) => {
    return contactApi.deleteContact(contactId);
  }
};
