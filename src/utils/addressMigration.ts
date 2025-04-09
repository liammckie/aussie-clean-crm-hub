
import { EntityType } from '@/types/database-schema';
import { unifiedAddressService } from '@/services/address/unified-address-service';
import { toast } from 'sonner';
import { ClientRecord } from '@/types/clients';
import { ApiResponse, isApiSuccess } from '@/types/api-response';

/**
 * Migrate client address data to unified_addresses table
 * This function ensures a client's address data is migrated to the unified address system
 */
export const migrateClientAddress = async (client: ClientRecord): Promise<boolean> => {
  try {
    // Skip if client data is missing essential data
    if (!client || !client.id) {
      console.warn('Cannot migrate address: Invalid client data');
      return false;
    }

    // Extract legacy address data from client record
    const legacyAddress = {
      address_line_1: client.address_line_1 || client.address || '',
      address_line_2: client.address_line_2 || '',
      suburb: client.suburb || '',
      state: client.state || '',
      postcode: client.postcode || '',
      country: client.country || 'Australia'
    };

    // Skip if there's no meaningful address data to migrate
    if (!legacyAddress.address_line_1 && !legacyAddress.suburb) {
      console.log('No address data to migrate for client', client.id);
      return false;
    }

    // Attempt to migrate the address
    const result = await unifiedAddressService.migrateAddressData(
      EntityType.CLIENT,
      client.id,
      legacyAddress
    );

    if (!isApiSuccess(result)) {
      if (result.message === 'No address data to migrate' || result.message === 'Address already migrated') {
        console.log(result.message, client.id);
        return false;
      }
      console.error('Failed to migrate address:', result.message);
      return false;
    }

    console.log('Successfully migrated address for client', client.id);
    return true;
  } catch (error) {
    console.error('Error in address migration:', error);
    return false;
  }
};

/**
 * Migrate addresses in bulk
 * @param clients Array of client records to migrate addresses for
 * @param showToasts Whether to show toast notifications (default: true)
 * @returns Promise<number> Number of successfully migrated addresses
 */
export const bulkMigrateAddresses = async (
  clients: ClientRecord[], 
  showToasts: boolean = true
): Promise<number> => {
  if (showToasts) {
    toast.info(`Starting migration of ${clients.length} client addresses...`);
  }
  
  let successCount = 0;
  
  for (const client of clients) {
    const success = await migrateClientAddress(client);
    if (success) {
      successCount++;
    }
  }
  
  if (showToasts) {
    if (successCount > 0) {
      toast.success(`Successfully migrated ${successCount} client addresses`);
    } else {
      toast.info('No new addresses were migrated');
    }
  }
  
  return successCount;
};

/**
 * Check if a client has an address in the unified address system
 */
export const hasUnifiedAddress = async (clientId: string): Promise<boolean> => {
  const response = await unifiedAddressService.getAddresses(EntityType.CLIENT, clientId);
  return isApiSuccess(response) && response.data && response.data.length > 0;
};

export default {
  migrateClientAddress,
  bulkMigrateAddresses,
  hasUnifiedAddress
};
