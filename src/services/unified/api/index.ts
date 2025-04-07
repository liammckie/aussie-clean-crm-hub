
import { addressApi } from './address';
import { contactApi } from './contact';
import { EntityType, UnifiedAddressFormData, UnifiedContactFormData } from '@/types/form-types';

// Unified API service for consistent data access
export const unifiedApi = {
  // Address API methods
  createAddress: addressApi.createAddress,
  getEntityAddresses: addressApi.getEntityAddresses, 
  updateAddress: addressApi.updateAddress,
  deleteAddress: addressApi.deleteAddress,
  
  // Make these functions available too (renamed from 'fetchAddresses' to match usage)
  getAddresses: addressApi.getEntityAddresses,
  
  // Contact API methods
  createContact: contactApi.createContact,
  getEntityContacts: contactApi.getEntityContacts,
  updateContact: contactApi.updateContact,
  deleteContact: contactApi.deleteContact,
  
  // Make these functions available too (renamed from 'fetchContacts' to match usage)
  getContacts: contactApi.getEntityContacts
};
