
import { supabase, isAuthenticated } from '@/integrations/supabase/client';
import { handleSupabaseError, logSuccess } from '@/utils/supabaseErrors';
import { 
  ClientFormData, 
  ContactFormData, 
  AddressFormData 
} from './types';
import { ApiErrorResponse, ApiResponse, createSuccessResponse } from '@/types/api-response';

/**
 * Client API service - handles raw Supabase calls for client data
 */
export const clientApi = {
  /**
   * Fetch all clients from the database
   */
  fetchAllClients: async (): Promise<ApiResponse<any[]>> => {
    try {
      // First check if the user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Clients fetched successfully');
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to fetch clients',
        { operation: 'fetchAllClients' }
      );
    }
  },

  /**
   * Fetch a single client by ID, including contacts and addresses
   */
  fetchClientById: async (clientId: string): Promise<ApiResponse<any>> => {
    try {
      // First check if the user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_contacts(*),
          client_addresses(*)
        `)
        .eq('id', clientId)
        .single();

      if (error) {
        throw error;
      }
      
      return createSuccessResponse(data, `Client with ID ${clientId} fetched successfully`);
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch client with ID ${clientId}`,
        { operation: 'fetchClientById', clientId }
      );
    }
  },

  /**
   * Create a new client
   */
  createClient: async (clientData: ClientFormData): Promise<ApiResponse<any>> => {
    try {
      // First check if the user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }
      
      // Log authentication status and session for debugging
      console.log('Authentication status:', authenticated);
      const session = await supabase.auth.getSession();
      console.log('Current session:', session);

      // Handle the date conversion safely if it's a string
      const processedData = { ...clientData };
      
      // Ensure date is in proper format for database
      if (clientData.onboarding_date && typeof clientData.onboarding_date === 'string') {
        // Already in YYYY-MM-DD format, no conversion needed
        // The database expects a date string in ISO format
      }
      
      const { data, error } = await supabase
        .from('clients')
        .insert(processedData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error during insert:', error);
        throw error;
      }

      return createSuccessResponse(data, 'Client created successfully');
    } catch (error) {
      console.error('Error in createClient:', error);
      return handleSupabaseError(
        error,
        'Failed to create client',
        { operation: 'createClient', clientData }
      );
    }
  },

  /**
   * Update an existing client
   */
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>): Promise<ApiResponse<any>> => {
    try {
      const processedData = { ...clientData };

      // Ensure date is in proper format for database
      if (clientData.onboarding_date && typeof clientData.onboarding_date === 'string') {
        // Already in YYYY-MM-DD format, no conversion needed
      }

      const { data, error } = await supabase
        .from('clients')
        .update(processedData)
        .eq('id', clientId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, `Client with ID ${clientId} updated successfully`);
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to update client with ID ${clientId}`,
        { operation: 'updateClient', clientId, clientData }
      );
    }
  },

  /**
   * Delete a client by ID
   */
  deleteClient: async (clientId: string): Promise<ApiResponse<{success: boolean}>> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      return createSuccessResponse({ success: true }, `Client with ID ${clientId} deleted successfully`);
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to delete client with ID ${clientId}`,
        { operation: 'deleteClient', clientId }
      );
    }
  },

  /**
   * Fetch client contacts
   */
  fetchClientContacts: async (clientId: string): Promise<ApiResponse<any[]>> => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, `Contacts for client ID ${clientId} fetched successfully`);
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch contacts for client with ID ${clientId}`,
        { operation: 'fetchClientContacts', clientId }
      );
    }
  },

  /**
   * Create a client contact
   */
  createClientContact: async (contactData: ContactFormData): Promise<ApiResponse<any>> => {
    try {
      const { data, error } = await supabase
        .from('client_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Contact created successfully');
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create client contact',
        { operation: 'createClientContact', contactData }
      );
    }
  },

  /**
   * Fetch client addresses
   */
  fetchClientAddresses: async (clientId: string): Promise<ApiResponse<any[]>> => {
    try {
      const { data, error } = await supabase
        .from('client_addresses')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, `Addresses for client ID ${clientId} fetched successfully`);
    } catch (error) {
      return handleSupabaseError(
        error,
        `Failed to fetch addresses for client with ID ${clientId}`,
        { operation: 'fetchClientAddresses', clientId }
      );
    }
  },

  /**
   * Create a client address
   */
  createClientAddress: async (addressData: AddressFormData): Promise<ApiResponse<any>> => {
    try {
      // Transform to match database schema
      const dbAddressData = {
        client_id: addressData.client_id,
        street: addressData.address_line_1,
        suburb: addressData.suburb,
        state: addressData.state,
        postcode: addressData.postcode,
        country: addressData.country,
        address_type: addressData.address_type
      };

      const { data, error } = await supabase
        .from('client_addresses')
        .insert(dbAddressData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return createSuccessResponse(data, 'Client address created successfully');
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to create client address',
        { operation: 'createClientAddress', addressData }
      );
    }
  },

  /**
   * Delete a client address
   */
  deleteClientAddress: async (addressId: string): Promise<ApiResponse<{success: boolean}>> => {
    try {
      const { error } = await supabase
        .from('client_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        throw error;
      }

      return createSuccessResponse({ success: true }, `Address with ID ${addressId} deleted successfully`);
    } catch (error) {
      return handleSupabaseError(
        error,
        'Failed to delete client address',
        { operation: 'deleteClientAddress', addressId }
      );
    }
  }
};
