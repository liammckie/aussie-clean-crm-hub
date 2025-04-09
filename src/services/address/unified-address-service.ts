import { AddressType, ContactType, EntityType } from '@/types/database-schema';
import { supabase } from '@/integrations/supabase/client';
import {
  UnifiedAddressFormData,
  UnifiedAddressRecord,
  UnifiedContactFormData,
  UnifiedContactRecord,
  AddressesApiResponse,
  AddressApiResponse,
  ContactsApiResponse,
  ContactApiResponse
} from './types';
import { ApiResponse, createSuccessResponse, createErrorResponse, isApiSuccess } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

/**
 * Unified Address Service
 *
 * This service provides methods for managing unified addresses and contacts,
 * abstracting the data layer and providing a consistent API for the application.
 */
export const unifiedAddressService = {
  /**
   * Get all addresses for a given entity (e.g., client, site, etc.)
   * @param entityType The type of entity (e.g., 'client', 'site')
   * @param entityId The ID of the entity
   * @returns Promise<AddressesApiResponse>
   */
  getAddresses: async (entityType: EntityType, entityId: string): Promise<AddressesApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to get addresses for ${entityType} ${entityId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord[]);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to get addresses for ${entityType} ${entityId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Get a single address by ID
   * @param addressId The ID of the address to retrieve
   * @returns Promise<AddressApiResponse>
   */
  getAddress: async (addressId: string): Promise<AddressApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('id', addressId)
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to get address ${addressId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to get address ${addressId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Get the primary address for a given entity
   * @param entityType The type of entity (e.g., 'client', 'site')
   * @param entityId The ID of the entity
   */
  getPrimaryAddress: async (entityType: EntityType, entityId: string): Promise<AddressApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('is_primary', true)
        .single();

      if (error) {
        // If no primary address is found, return a success with null data
        if (error.message.includes('No rows found')) {
          return createSuccessResponse(null);
        }

        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to get primary address for ${entityType} ${entityId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to get primary address for ${entityType} ${entityId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Create a new address for a given entity
   * @param entityType The type of entity (e.g., 'client', 'site')
   * @param entityId The ID of the entity
   * @param addressData The address data to create
   * @returns Promise<AddressApiResponse>
   */
  createAddress: async (
    entityType: EntityType,
    entityId: string,
    addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'>
  ): Promise<AddressApiResponse> => {
    try {
      // Consolidate entity information into the address data
      const newAddress: UnifiedAddressFormData = {
        ...addressData,
        entity_type: entityType,
        entity_id: entityId
      } as UnifiedAddressFormData;

      const { data, error } = await supabase
        .from('unified_addresses')
        .insert([newAddress])
        .select('*')
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to create address for ${entityType} ${entityId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to create address for ${entityType} ${entityId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Update an existing address
   * @param addressId The ID of the address to update
   * @param addressData The address data to update
   * @returns Promise<AddressApiResponse>
   */
  updateAddress: async (
    addressId: string,
    addressData: Partial<UnifiedAddressFormData>
  ): Promise<AddressApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .update(addressData)
        .eq('id', addressId)
        .select('*')
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to update address ${addressId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to update address ${addressId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Delete an address
   * @param addressId The ID of the address to delete
   * @returns Promise<ApiResponse<UnifiedAddressRecord>>
   */
  deleteAddress: async (addressId: string): Promise<ApiResponse<UnifiedAddressRecord>> => {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .delete()
        .eq('id', addressId)
        .select()
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to delete address ${addressId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to delete address ${addressId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Migrate address data from legacy tables to the unified_addresses table
   * @param entityType The type of entity (e.g., 'client', 'site')
   * @param entityId The ID of the entity
   * @param legacyAddressData The legacy address data to migrate
   */
  migrateAddressData: async (
    entityType: EntityType,
    entityId: string,
    legacyAddressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id' | 'address_type' | 'is_primary'>
  ): Promise<ApiResponse<UnifiedAddressRecord>> => {
    try {
      // Check if address already exists
      const existingAddresses = await unifiedAddressService.getAddresses(entityType, entityId);

      if (isApiSuccess(existingAddresses) && existingAddresses.data && existingAddresses.data.length > 0) {
        return createErrorResponse(
          ErrorCategory.BUSINESS_LOGIC,
          'Address already migrated',
          { entityType, entityId }
        );
      }

      // Check if there's any address data to migrate
      if (
        !legacyAddressData.address_line_1 &&
        !legacyAddressData.address_line_2 &&
        !legacyAddressData.suburb &&
        !legacyAddressData.state &&
        !legacyAddressData.postcode &&
        !legacyAddressData.country
      ) {
        return createErrorResponse(
          ErrorCategory.BUSINESS_LOGIC,
          'No address data to migrate',
          { entityType, entityId }
        );
      }

      // Create the new address
      const newAddress: UnifiedAddressFormData = {
        ...legacyAddressData,
        entity_type: entityType,
        entity_id: entityId,
        address_type: AddressType.BILLING, // Default to billing address
        is_primary: true // Set as primary by default
      } as UnifiedAddressFormData;

      const { data, error } = await supabase
        .from('unified_addresses')
        .insert([newAddress])
        .select('*')
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to migrate address for ${entityType} ${entityId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedAddressRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to migrate address for ${entityType} ${entityId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Get all contacts for a given entity
   * @param entityType The type of entity (e.g., 'client', 'site')
   * @param entityId The ID of the entity
   * @returns Promise<ContactsApiResponse>
   */
  getContacts: async (entityType: EntityType, entityId: string): Promise<ContactsApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to get contacts for ${entityType} ${entityId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedContactRecord[]);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to get contacts for ${entityType} ${entityId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Get a single contact by ID
   * @param contactId The ID of the contact to retrieve
   * @returns Promise<ContactApiResponse>
   */
  getContact: async (contactId: string): Promise<ContactApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to get contact ${contactId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedContactRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to get contact ${contactId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Get the primary contact for a given entity
   * @param entityType The type of entity (e.g., 'client', 'site')
   * @param entityId The ID of the entity
   */
  getPrimaryContact: async (entityType: EntityType, entityId: string): Promise<ContactApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('is_primary', true)
        .single();

      if (error) {
        // If no primary contact is found, return a success with null data
        if (error.message.includes('No rows found')) {
          return createSuccessResponse(null);
        }

        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to get primary contact for ${entityType} ${entityId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedContactRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to get primary contact for ${entityType} ${entityId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Create a new contact for a given entity
   * @param entityType The type of entity (e.g., 'client', 'site')
   * @param entityId The ID of the entity
   * @param contactData The contact data to create
   * @returns Promise<ContactApiResponse>
   */
  createContact: async (
    entityType: EntityType,
    entityId: string,
    contactData: Omit<UnifiedContactFormData, 'entity_type' | 'entity_id'>
  ): Promise<ContactApiResponse> => {
    try {
      // Consolidate entity information into the contact data
      const newContact: UnifiedContactFormData = {
        ...contactData,
        entity_type: entityType,
        entity_id: entityId
      } as UnifiedContactFormData;

      // Derive the contact name from first and last name
      const contactName = `${contactData.first_name} ${contactData.last_name || ''}`.trim();

      const { data, error } = await supabase
        .from('unified_contacts')
        .insert([{ ...newContact, name: contactName }])
        .select('*')
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to create contact for ${entityType} ${entityId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedContactRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to create contact for ${entityType} ${entityId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Update an existing contact
   * @param contactId The ID of the contact to update
   * @param contactData The contact data to update
   * @returns Promise<ContactApiResponse>
   */
  updateContact: async (
    contactId: string,
    contactData: Partial<UnifiedContactFormData>
  ): Promise<ContactApiResponse> => {
    try {
      // Derive the contact name from first and last name
      const contactName = `${contactData.first_name} ${contactData.last_name || ''}`.trim();

      const { data, error } = await supabase
        .from('unified_contacts')
        .update({ ...contactData, name: contactName })
        .eq('id', contactId)
        .select('*')
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to update contact ${contactId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedContactRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to update contact ${contactId}: ${error.message}`,
        { error: error.message }
      );
    }
  },

  /**
   * Delete a contact
   * @param contactId The ID of the contact to delete
   * @returns Promise<ApiResponse<UnifiedContactRecord>>
   */
  deleteContact: async (contactId: string): Promise<ApiResponse<UnifiedContactRecord>> => {
    try {
      const { data, error } = await supabase
        .from('unified_contacts')
        .delete()
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        return createErrorResponse(
          ErrorCategory.DATABASE,
          `Failed to delete contact ${contactId}: ${error.message}`,
          { error }
        );
      }

      return createSuccessResponse(data as UnifiedContactRecord);
    } catch (error: any) {
      return createErrorResponse(
        ErrorCategory.SERVER,
        `Failed to delete contact ${contactId}: ${error.message}`,
        { error: error.message }
      );
    }
  }
};
