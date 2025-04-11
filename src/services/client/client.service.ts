
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, createErrorResponse, createSuccessResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ClientFormData } from './types';
import { ClientRecord, EntityType } from '@/types/database-schema';
import { convertClientFormToUnifiedAddress } from '@/utils/address-helpers';
import { unifiedAddressService } from '@/services/unified/address-service';
import { UnifiedAddressRecord } from '@/services/unified/types';

/**
 * Create a new client
 * @param data Client form data
 * @returns ApiResponse with client data or error
 */
export async function createClient(data: ClientFormData): Promise<ApiResponse<ClientRecord>> {
  try {
    AppLogger.info(LogCategory.CLIENT, 'Creating new client', { 
      businessName: data.business_name
    });

    // Extract address fields to handle separately
    const { 
      address_line_1, address_line_2, suburb, state, postcode, country,
      ...clientData 
    } = data;
    
    // Insert the client record
    const { data: client, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      AppLogger.error(LogCategory.CLIENT, `Error creating client: ${error.message}`, { error });
      return createErrorResponse(
        ErrorCategory.DATABASE,
        `Failed to create client: ${error.message}`,
        { error }
      );
    }

    // Now create the address if address data is provided
    if (address_line_1 && suburb && state && postcode) {
      const addressData = convertClientFormToUnifiedAddress(data, client.id);
      
      const addressResponse = await unifiedAddressService.createAddress(
        EntityType.CLIENT,
        client.id,
        addressData as Omit<UnifiedAddressRecord, 'id' | 'created_at' | 'updated_at'>
      );

      if ('category' in addressResponse) {
        AppLogger.error(LogCategory.CLIENT, `Error creating client address: ${addressResponse.message}`, { 
          clientId: client.id, 
          error: addressResponse
        });
        // Don't fail the entire operation if address creation fails
      }
    }
    
    AppLogger.info(LogCategory.CLIENT, 'Client created successfully', {
      clientId: client.id,
      businessName: client.business_name
    });

    return createSuccessResponse(client, 'Client created successfully');
  } catch (error: any) {
    AppLogger.error(LogCategory.CLIENT, `Error in createClient: ${error.message}`, { error });
    return createErrorResponse(
      ErrorCategory.SERVER,
      error.message || 'An error occurred while creating the client',
      { error }
    );
  }
}

// Import clientService from service file
import clientService from './service';

// Export the clientService for use in other modules
export { clientService };
