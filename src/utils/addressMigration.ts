
import { UnifiedAddressService } from '@/services/address/unified-address-service';
import { EntityType } from '@/types/database-schema';
import { ApiResponse, isApiError } from '@/types/api-response';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';

/**
 * Service for migrating addresses from old format to unified format
 */
export class AddressMigrationService {
  private addressService: UnifiedAddressService;

  constructor(addressService: UnifiedAddressService) {
    this.addressService = addressService;
  }

  /**
   * Migrate client addresses to the unified address format
   * @param clientId Client ID
   * @param clientData Client data with address fields
   * @returns Promise with success status
   */
  async migrateClientAddresses(clientId: string, clientData: any): Promise<boolean> {
    try {
      // Check if address fields exist
      if (!clientData.address_line_1 || !clientData.suburb || !clientData.state || !clientData.postcode) {
        AppLogger.info(LogCategory.ADDRESS, `No address data to migrate for client ${clientId}`);
        return false;
      }

      // Check if unified addresses already exist for this client
      const existingAddresses = await this.addressService.getEntityAddresses(EntityType.CLIENT, clientId);
      
      if (!isApiError(existingAddresses) && Array.isArray(existingAddresses.data) && existingAddresses.data.length > 0) {
        AppLogger.info(LogCategory.ADDRESS, `Addresses already migrated for client ${clientId}`, {
          addressCount: existingAddresses.data.length
        });
        return true;
      }

      // Create unified address from client address fields
      const newAddress = {
        entity_type: EntityType.CLIENT,
        entity_id: clientId,
        address_line_1: clientData.address_line_1,
        address_line_2: clientData.address_line_2 || "",
        suburb: clientData.suburb,
        state: clientData.state,
        postcode: clientData.postcode,
        country: clientData.country || "Australia",
        address_type: "billing", // Default to billing address
        is_primary: true
      };

      // Add the address to the unified addresses table
      const response = await this.addressService.createAddress(
        EntityType.CLIENT,
        clientId,
        newAddress
      );

      if (isApiError(response)) {
        AppLogger.error(LogCategory.ADDRESS, `Failed to migrate address: ${response.message}`, {
          clientId,
          error: response
        });
        return false;
      }

      AppLogger.info(LogCategory.ADDRESS, `Address migrated successfully for client ${clientId}`, {
        addressId: response.data.id
      });
      return true;
    } catch (error) {
      AppLogger.error(LogCategory.ERROR, `Error migrating addresses: ${error instanceof Error ? error.message : String(error)}`, {
        clientId,
        error
      });
      return false;
    }
  }

  /**
   * Verify migration status for an entity
   * @param entityType Entity type
   * @param entityId Entity ID
   * @returns Promise with migration status
   */
  async verifyMigrationStatus(entityType: EntityType, entityId: string): Promise<boolean> {
    try {
      const addresses = await this.addressService.getEntityAddresses(entityType, entityId);
      
      if (isApiError(addresses)) {
        return false;
      }
      
      return addresses.data && addresses.data.length > 0;
    } catch (error) {
      AppLogger.error(LogCategory.ADDRESS, `Error verifying migration status: ${error instanceof Error ? error.message : String(error)}`, {
        entityType,
        entityId,
        error
      });
      return false;
    }
  }
}
