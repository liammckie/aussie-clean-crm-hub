
import { addressApi } from './address';
import { contactApi } from './contact';
import { EntityType } from '@/services/client/types';
import { UnifiedAddressFormData, UnifiedContactFormData } from '@/services/unified/types';
import { UnifiedAddressRecord, UnifiedContactRecord } from '@/services/unified/types';

// Export the API modules
export { addressApi, contactApi };

// Export types
export type { UnifiedAddressRecord, UnifiedContactRecord };

// Unified API service for consistent data access
export const unifiedApi = {
  // Address API methods
  createAddress: addressApi.createAddress,
  getEntityAddresses: addressApi.getEntityAddresses, 
  updateAddress: addressApi.updateAddress,
  deleteAddress: addressApi.deleteAddress,
  
  // Make these functions available with consistent naming
  getAddresses: addressApi.getEntityAddresses,
  
  // Contact API methods
  createContact: contactApi.createContact,
  getEntityContacts: contactApi.getEntityContacts,
  updateContact: contactApi.updateContact,
  deleteContact: contactApi.deleteContact,
  
  // Make these functions available with consistent naming
  getContacts: contactApi.getEntityContacts
};
