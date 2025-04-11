
import { ClientFormData } from '@/services/client';
import { UnifiedAddressFormData } from '@/types/form-types';
import { AddressType, EntityType } from '@/types/database-schema';
import { SiteFormData } from '@/components/site/SiteFormTypes';

/**
 * Convert client form data to unified address format
 * @param clientData Client form data
 * @param clientId Client ID for the entity reference
 * @returns UnifiedAddressFormData object ready for submission
 */
export function convertClientFormToUnifiedAddress(
  clientData: ClientFormData,
  clientId: string
): UnifiedAddressFormData {
  return {
    address_line_1: clientData.address_line_1 || '',
    address_line_2: clientData.address_line_2 || '',
    suburb: clientData.suburb || '',
    state: clientData.state || '',
    postcode: clientData.postcode || '',
    country: clientData.country || 'Australia',
    address_type: AddressType.BILLING, // Default to billing address for clients
    is_primary: true, // Default the first address as primary
    entity_type: EntityType.CLIENT,
    entity_id: clientId,
  };
}

/**
 * Convert site form data to unified address format
 * @param siteData Site form data
 * @param siteId Site ID for the entity reference
 * @returns UnifiedAddressFormData object ready for submission
 */
export function convertSiteFormToUnifiedAddress(
  siteData: SiteFormData,
  siteId: string
): UnifiedAddressFormData {
  return {
    address_line_1: siteData.address_line_1 || '',
    address_line_2: siteData.address_line_2 || '',
    suburb: siteData.suburb || '',
    state: siteData.state || '',
    postcode: siteData.postcode || '',
    country: 'Australia', // Default to Australia for sites
    address_type: AddressType.SITE, // Use SITE address type for sites
    is_primary: true, // Default the address as primary
    entity_type: EntityType.SITE,
    entity_id: siteId,
    latitude: typeof siteData.latitude === 'number' ? siteData.latitude : undefined,
    longitude: typeof siteData.longitude === 'number' ? siteData.longitude : undefined,
    notes: siteData.notes,
  };
}

/**
 * Convert unified address to client form data fields
 * @param address Unified address record
 * @param clientData Existing client data to merge with
 * @returns Updated client form data with address fields populated
 */
export function extractAddressFieldsToClientForm(
  address: UnifiedAddressFormData | null, 
  clientData: Partial<ClientFormData> = {}
): Partial<ClientFormData> {
  if (!address) {
    return clientData;
  }
  
  return {
    ...clientData,
    address_line_1: address.address_line_1 || '',
    address_line_2: address.address_line_2 || '',
    suburb: address.suburb || '',
    state: address.state || '',
    postcode: address.postcode || '',
    country: address.country || 'Australia'
  };
}

/**
 * Convert unified address to site form data fields
 * @param address Unified address record
 * @param siteData Existing site data to merge with
 * @returns Updated site form data with address fields populated
 */
export function extractAddressFieldsToSiteForm(
  address: UnifiedAddressFormData | null, 
  siteData: Partial<SiteFormData> = {}
): Partial<SiteFormData> {
  if (!address) {
    return siteData;
  }
  
  return {
    ...siteData,
    address_line_1: address.address_line_1 || '',
    address_line_2: address.address_line_2 || '',
    suburb: address.suburb || '',
    state: address.state || '',
    postcode: address.postcode || '',
    latitude: address.latitude,
    longitude: address.longitude,
    notes: address.notes || siteData.notes,
  };
}

/**
 * Check if an address is valid (has all required fields)
 * @param address Address data to validate
 * @returns Boolean indicating if address is valid
 */
export function isValidAddress(address: Partial<UnifiedAddressFormData>): boolean {
  return !!(
    address.address_line_1 &&
    address.suburb &&
    address.state &&
    address.postcode
  );
}
