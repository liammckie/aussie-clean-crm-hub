
import { unifiedApi } from './api';
import { 
  UnifiedAddressFormData, 
  UnifiedContactFormData 
} from './types';

/**
 * Service layer for unified address and contact management
 */
export const unifiedService = {
  /**
   * Get addresses for an entity
   */
  getAddresses: async (entityType: string, entityId: string) => {
    return await unifiedApi.fetchAddresses(entityType, entityId);
  },

  /**
   * Create a new address for an entity
   */
  createAddress: async (entityType: string, entityId: string, addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'>) => {
    const fullAddressData: UnifiedAddressFormData = {
      entity_type: entityType,
      entity_id: entityId,
      ...addressData
    };
    
    return await unifiedApi.createAddress(fullAddressData);
  },

  /**
   * Update an existing address
   */
  updateAddress: async (addressId: string, addressData: Partial<UnifiedAddressFormData>) => {
    return await unifiedApi.updateAddress(addressId, addressData);
  },

  /**
   * Delete an address by ID
   */
  deleteAddress: async (addressId: string) => {
    return await unifiedApi.deleteAddress(addressId);
  },

  /**
   * Get contacts for an entity
   */
  getContacts: async (entityType: string, entityId: string) => {
    return await unifiedApi.fetchContacts(entityType, entityId);
  },

  /**
   * Create a new contact for an entity
   */
  createContact: async (entityType: string, entityId: string, contactData: Omit<UnifiedContactFormData, 'entity_type' | 'entity_id'>) => {
    const fullContactData: UnifiedContactFormData = {
      entity_type: entityType,
      entity_id: entityId,
      ...contactData
    };
    
    return await unifiedApi.createContact(fullContactData);
  },

  /**
   * Update an existing contact
   */
  updateContact: async (contactId: string, contactData: Partial<UnifiedContactFormData>) => {
    return await unifiedApi.updateContact(contactId, contactData);
  },

  /**
   * Delete a contact by ID
   */
  deleteContact: async (contactId: string) => {
    return await unifiedApi.deleteContact(contactId);
  }
};
