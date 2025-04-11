
import { supabase } from '@/integrations/supabase/client';
import { unifiedAddressService } from '@/services/unified/address-service';
import { AddressType, EntityType } from '@/types/database-schema';
import { AppLogger, LogCategory } from '@/utils/logging';
import { toast } from 'sonner';
import { isApiError } from '@/types/api-response';

/**
 * Utility for migrating legacy data to unified schema
 */
export class DataMigrationService {
  /**
   * Check if entity has addresses in the unified table
   * @param entityType Type of entity (client, site, supplier, etc.)
   * @param entityId Entity ID to check
   * @returns Promise resolving to boolean indicating if addresses exist
   */
  static async hasUnifiedAddresses(entityType: EntityType, entityId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('unified_addresses')
        .select('id')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .limit(1);
        
      if (error) {
        AppLogger.error(LogCategory.SYSTEM, `Error checking unified addresses: ${error.message}`, { entityType, entityId, error });
        return false;
      }
      
      return data && data.length > 0;
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Error in hasUnifiedAddresses: ${error.message}`, { entityType, entityId, error });
      return false;
    }
  }

  /**
   * Check if client has addresses in the unified table
   * @param clientId Client ID to check
   * @returns Promise resolving to boolean indicating if addresses exist
   */
  static async hasUnifiedClientAddresses(clientId: string): Promise<boolean> {
    return this.hasUnifiedAddresses(EntityType.CLIENT, clientId);
  }

  /**
   * Migrate a client's legacy addresses to the unified address table
   * @param clientId Client ID to migrate
   * @returns Promise resolving to boolean indicating success
   */
  static async migrateClientAddresses(clientId: string): Promise<boolean> {
    // Check if already migrated
    const hasAddresses = await this.hasUnifiedClientAddresses(clientId);
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
        
        if (isApiError(response)) {
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
   * Migrate a site's address to the unified address table
   * @param siteId Site ID to migrate
   * @returns Promise resolving to boolean indicating success
   */
  static async migrateSiteAddress(siteId: string): Promise<boolean> {
    // Check if already migrated
    const hasAddresses = await this.hasUnifiedAddresses(EntityType.SITE, siteId);
    if (hasAddresses) {
      AppLogger.info(LogCategory.SYSTEM, `Site ${siteId} already has unified address`);
      return true;
    }
    
    try {
      // Fetch the site to get address data
      const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();
        
      if (error || !site) {
        AppLogger.error(LogCategory.SYSTEM, `Error fetching site: ${error?.message || 'Site not found'}`, { siteId });
        return false;
      }

      // Create a unified address if the site has address fields
      if (site.address_line_1 || site.suburb || site.state || site.postcode) {
        const response = await unifiedAddressService.createAddress(
          EntityType.SITE,
          siteId,
          {
            entity_id: siteId,
            entity_type: EntityType.SITE,
            address_line_1: site.address_line_1 || '',
            address_line_2: site.address_line_2 || '',
            suburb: site.suburb || '',
            state: site.state || '',
            postcode: site.postcode || '',
            country: 'Australia',
            address_type: AddressType.SITE,
            is_primary: true,
            latitude: site.latitude,
            longitude: site.longitude,
            notes: site.access_instructions || site.notes
          }
        );
        
        if (isApiError(response)) {
          AppLogger.error(LogCategory.SYSTEM, `Failed to create unified address for site: ${response.message}`);
          return false;
        }
        
        AppLogger.info(LogCategory.SYSTEM, `Created unified address for site ${siteId}`);
        return true;
      }
      
      // No address to migrate
      AppLogger.info(LogCategory.SYSTEM, `No address to migrate for site ${siteId}`);
      return true;
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Error in migrateSiteAddress: ${error.message}`, { siteId, error });
      return false;
    }
  }

  /**
   * Migrate a supplier's address to the unified address table
   * @param supplierId Supplier ID to migrate
   * @returns Promise resolving to boolean indicating success
   */
  static async migrateSupplierAddress(supplierId: string): Promise<boolean> {
    // Check if already migrated
    const hasAddresses = await this.hasUnifiedAddresses(EntityType.SUPPLIER, supplierId);
    if (hasAddresses) {
      AppLogger.info(LogCategory.SYSTEM, `Supplier ${supplierId} already has unified address`);
      return true;
    }
    
    try {
      // For suppliers, we would need to implement based on how supplier addresses are stored
      // This is a placeholder for future implementation
      
      AppLogger.info(LogCategory.SYSTEM, `No address migration implemented for supplier ${supplierId} yet`);
      return true;
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Error in migrateSupplierAddress: ${error.message}`, { supplierId, error });
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

  /**
   * Migrate all sites' addresses to the unified system
   * @returns Promise resolving to number of sites migrated
   */
  static async migrateAllSiteAddresses(): Promise<number> {
    try {
      const { data: sites, error } = await supabase
        .from('sites')
        .select('id')
        .order('created_at', { ascending: false });
        
      if (error) {
        AppLogger.error(LogCategory.SYSTEM, `Error fetching sites for migration: ${error.message}`);
        toast.error("Failed to fetch sites for address migration");
        return 0;
      }
      
      let migratedCount = 0;
      const totalSites = sites.length;
      
      for (const site of sites) {
        const success = await this.migrateSiteAddress(site.id);
        if (success) migratedCount++;
        
        // Update progress every 5 sites
        if (migratedCount % 5 === 0 && totalSites > 5) {
          toast.info(`Migrating site addresses: ${migratedCount}/${totalSites}`);
        }
      }
      
      toast.success(`Site address migration completed: ${migratedCount}/${totalSites} sites processed`);
      return migratedCount;
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Error in migrateAllSiteAddresses: ${error.message}`, { error });
      toast.error("Site address migration failed");
      return 0;
    }
  }

  /**
   * Migrate addresses for all entity types
   * @returns Promise resolving when completed
   */
  static async migrateAllAddresses(): Promise<void> {
    toast.info("Starting comprehensive address migration...");
    
    // Migrate client addresses
    const clientsMigrated = await this.migrateAllClientAddresses();
    AppLogger.info(LogCategory.SYSTEM, `Migrated addresses for ${clientsMigrated} clients`);
    
    // Migrate site addresses
    const sitesMigrated = await this.migrateAllSiteAddresses();
    AppLogger.info(LogCategory.SYSTEM, `Migrated addresses for ${sitesMigrated} sites`);
    
    // Supplier address migration would go here
    // const suppliersMigrated = await this.migrateAllSupplierAddresses();
    
    toast.success("Address migration completed for all entity types");
  }
}
