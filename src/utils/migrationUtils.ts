
import { supabase } from '@/integrations/supabase/client';
import { unifiedAddressService } from '@/services/unified/address-service';
import { AddressType, EntityType } from '@/types/database-schema';
import { AppLogger, LogCategory } from '@/utils/logging';
import { toast } from 'sonner';

/**
 * Utility for migrating legacy data to unified schema
 */
export class DataMigrationService {
  /**
   * Check if client has addresses in the unified table
   * @param clientId Client ID to check
   * @returns Promise resolving to boolean indicating if addresses exist
   */
  static async hasUnifiedAddresses(clientId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('id')
        .eq('entity_type', EntityType.CLIENT)
        .eq('entity_id', clientId)
        .limit(1);
        
      if (error) {
        AppLogger.error(LogCategory.SYSTEM, `Error checking unified addresses: ${error.message}`, { clientId, error });
        return false;
      }
      
      return data && data.length > 0;
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Error in hasUnifiedAddresses: ${error.message}`, { clientId, error });
      return false;
    }
  }

  /**
   * Migrate a client's legacy addresses to the unified address table
   * @param clientId Client ID to migrate
   * @returns Promise resolving to boolean indicating success
   */
  static async migrateClientAddresses(clientId: string): Promise<boolean> {
    // Check if already migrated
    const hasAddresses = await this.hasUnifiedAddresses(clientId);
    if (hasAddresses) {
      AppLogger.info(LogCategory.SYSTEM, `Client ${clientId} already has unified addresses`);
      return true;
    }
    
    try {
      // Fetch the client to get address data
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (clientError || !client) {
        AppLogger.error(LogCategory.SYSTEM, `Error fetching client: ${clientError?.message || 'Client not found'}`, { clientId });
        return false;
      }

      // Check for legacy client_addresses
      const { data: legacyAddresses, error: legacyError } = await supabase
        .from('client_addresses')
        .select('*')
        .eq('client_id', clientId);
        
      if (legacyError) {
        AppLogger.error(LogCategory.SYSTEM, `Error fetching legacy addresses: ${legacyError.message}`, { clientId });
      }
      
      // Create unified addresses from legacy addresses if they exist
      if (legacyAddresses && legacyAddresses.length > 0) {
        for (const [index, address] of legacyAddresses.entries()) {
          await unifiedAddressService.createAddress(
            EntityType.CLIENT,
            clientId,
            {
              entity_id: clientId,
              entity_type: EntityType.CLIENT,
              address_line_1: address.street || '',
              address_line_2: '',
              suburb: address.suburb || '',
              state: address.state || '',
              postcode: address.postcode || '',
              country: address.country || 'Australia',
              address_type: address.address_type.toLowerCase() as AddressType || AddressType.BILLING,
              is_primary: index === 0, // First address is primary
            }
          );
        }
        AppLogger.info(LogCategory.SYSTEM, `Migrated ${legacyAddresses.length} legacy addresses for client ${clientId}`);
        return true;
      }
      
      // If no legacy addresses, check if client has embedded address fields
      if (client.address_line_1 || client.suburb || client.state || client.postcode) {
        const response = await unifiedAddressService.createAddress(
          EntityType.CLIENT,
          clientId,
          {
            entity_id: clientId,
            entity_type: EntityType.CLIENT,
            address_line_1: client.address_line_1 || '',
            address_line_2: client.address_line_2 || '',
            suburb: client.suburb || '',
            state: client.state || '',
            postcode: client.postcode || '',
            country: client.country || 'Australia',
            address_type: AddressType.BILLING,
            is_primary: true
          }
        );
        
        if ('category' in response) {
          AppLogger.error(LogCategory.SYSTEM, `Failed to create unified address: ${response.message}`);
          return false;
        }
        
        AppLogger.info(LogCategory.SYSTEM, `Created unified address from client fields for ${clientId}`);
        return true;
      }
      
      // No addresses to migrate
      AppLogger.info(LogCategory.SYSTEM, `No addresses to migrate for client ${clientId}`);
      return true;
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Error in migrateClientAddresses: ${error.message}`, { clientId, error });
      return false;
    }
  }
  
  /**
   * Migrate all clients' addresses to the unified system
   * @returns Promise resolving to number of clients migrated
   */
  static async migrateAllClientAddresses(): Promise<number> {
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('id')
        .order('created_at', { ascending: false });
        
      if (error) {
        AppLogger.error(LogCategory.SYSTEM, `Error fetching clients for migration: ${error.message}`);
        toast.error("Failed to fetch clients for address migration");
        return 0;
      }
      
      let migratedCount = 0;
      const totalClients = clients.length;
      
      for (const client of clients) {
        const success = await this.migrateClientAddresses(client.id);
        if (success) migratedCount++;
        
        // Update progress every 5 clients
        if (migratedCount % 5 === 0) {
          toast.info(`Migrating addresses: ${migratedCount}/${totalClients}`);
        }
      }
      
      toast.success(`Address migration completed: ${migratedCount}/${totalClients} clients processed`);
      return migratedCount;
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Error in migrateAllClientAddresses: ${error.message}`, { error });
      toast.error("Address migration failed");
      return 0;
    }
  }
}
