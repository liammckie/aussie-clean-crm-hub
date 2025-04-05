
import { addressApi } from './address';
import { contactApi } from './contact';

/**
 * Unified Addresses & Contacts API service - handles raw Supabase calls
 */
export const unifiedApi = {
  // Address API methods
  fetchAddresses: addressApi.fetchAddresses,
  createAddress: addressApi.createAddress,
  updateAddress: addressApi.updateAddress,
  deleteAddress: addressApi.deleteAddress,

  // Contact API methods  
  fetchContacts: contactApi.fetchContacts,
  createContact: contactApi.createContact,
  updateContact: contactApi.updateContact,
  deleteContact: contactApi.deleteContact
};
