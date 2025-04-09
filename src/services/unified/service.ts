import { ApiResponse } from '@/types/api-response';
import { 
  UnifiedAddressFormData,
  UnifiedContactFormData,
  EntityType
} from '@/types/form-types';
import { 
  UnifiedAddressRecord, 
  UnifiedContactRecord
} from '@/services/address/types';
import { addressApi, contactApi } from './api';
import { MutationOptions } from '@/hooks/use-unified-entities';
import { AddressType } from '@/types/database-schema';

/**
 * Create a new address for an entity
 */
export const createUnifiedAddress = async (
  entityType: EntityType,
  entityId: string,
  addressData: UnifiedAddressFormData,
  options?: MutationOptions<UnifiedAddressRecord>
): Promise<ApiResponse<UnifiedAddressRecord>> => {
  try {
    // Convert from form field names to database column names
    const processedData: Omit<UnifiedAddressRecord, 'entity_type' | 'entity_id' | 'id'> = {
      address_line_1: addressData.address_line_1,
      address_line_2: addressData.address_line_2,
      suburb: addressData.suburb,
      state: addressData.state,
      postcode: addressData.postcode,
      country: addressData.country,
      address_type: addressData.address_type, // Using enum directly
      is_primary: addressData.is_primary || false,
      name: addressData.name,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      notes: addressData.notes
    };
    
    return await addressApi.createAddress(entityType, entityId, processedData);
  } catch (error: any) {
    throw new Error(`Failed to create address: ${error.message}`);
  }
};

/**
 * Update an existing address
 */
export const updateUnifiedAddress = async (
  addressId: string,
  addressData: Partial<UnifiedAddressFormData>
): Promise<ApiResponse<UnifiedAddressRecord>> => {
  try {
    // Convert from form field names to database column names
    const processedData: Partial<UnifiedAddressRecord> = {};
    
    if ('address_line_1' in addressData) {
      processedData.address_line_1 = addressData.address_line_1;
    }
    
    if ('address_line_2' in addressData) {
      processedData.address_line_2 = addressData.address_line_2;
    }
    
    if ('suburb' in addressData) {
      processedData.suburb = addressData.suburb;
    }
    
    if ('state' in addressData) {
      processedData.state = addressData.state;
    }
    
    if ('postcode' in addressData) {
      processedData.postcode = addressData.postcode;
    }
    
    if ('country' in addressData) {
      processedData.country = addressData.country;
    }
    
    if ('address_type' in addressData) {
      processedData.address_type = addressData.address_type as AddressType; // Explicitly cast to database enum type
    }
    
    if ('is_primary' in addressData) {
      processedData.is_primary = addressData.is_primary;
    }
    
    if ('name' in addressData) {
      processedData.name = addressData.name;
    }
    
    if ('latitude' in addressData) {
      processedData.latitude = addressData.latitude;
    }
    
    if ('longitude' in addressData) {
      processedData.longitude = addressData.longitude;
    }
    
    if ('notes' in addressData) {
      processedData.notes = addressData.notes;
    }
    
    return await addressApi.updateAddress(addressId, processedData);
  } catch (error: any) {
    throw new Error(`Failed to update address: ${error.message}`);
  }
};

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
    // Convert form data to database record format
    const dbAddressData: Omit<UnifiedAddressRecord, 'entity_type' | 'entity_id' | 'id'> = {
      address_line_1: addressData.address_line_1,
      address_line_2: addressData.address_line_2,
      suburb: addressData.suburb,
      state: addressData.state,
      postcode: addressData.postcode,
      country: addressData.country,
      address_type: addressData.address_type, // Using enum directly
      is_primary: addressData.is_primary || false,
      name: addressData.name,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      notes: addressData.notes
    };
    
    return addressApi.createAddress(entityType, entityId, dbAddressData);
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
    // Convert form data to database record format
    const dbAddressData: Partial<UnifiedAddressRecord> = {};
    
    if ('address_line_1' in addressData) {
      dbAddressData.address_line_1 = addressData.address_line_1;
    }
    
    if ('address_line_2' in addressData) {
      dbAddressData.address_line_2 = addressData.address_line_2;
    }
    
    if ('suburb' in addressData) {
      dbAddressData.suburb = addressData.suburb;
    }
    
    if ('state' in addressData) {
      dbAddressData.state = addressData.state;
    }
    
    if ('postcode' in addressData) {
      dbAddressData.postcode = addressData.postcode;
    }
    
    if ('country' in addressData) {
      dbAddressData.country = addressData.country;
    }
    
    if ('address_type' in addressData) {
      dbAddressData.address_type = addressData.address_type as AddressType; // Explicitly cast to database enum type
    }
    
    if ('is_primary' in addressData) {
      dbAddressData.is_primary = addressData.is_primary;
    }
    
    if ('name' in addressData) {
      dbAddressData.name = addressData.name;
    }
    
    if ('latitude' in addressData) {
      dbAddressData.latitude = addressData.latitude;
    }
    
    if ('longitude' in addressData) {
      dbAddressData.longitude = addressData.longitude;
    }
    
    if ('notes' in addressData) {
      dbAddressData.notes = addressData.notes;
    }
    
    return addressApi.updateAddress(addressId, dbAddressData);
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
