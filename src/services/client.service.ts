
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { ErrorReporting } from '@/utils/errorReporting';
import { handleSupabaseError, logSuccess } from '@/utils/supabaseErrors';
import { validationService } from './validation.service';
import { toast } from '@/components/ui/use-toast';

// Type definitions for Client data
export type Client = Database['public']['Tables']['clients']['Row'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];

// Type definition for ClientWithContacts
export type ClientWithContacts = Client & {
  contacts: Database['public']['Tables']['client_contacts']['Row'][];
};

/**
 * Client Service - Handles all client-related operations with Supabase
 */
export const clientService = {
  /**
   * Get all clients
   * @returns Promise resolving to array of clients or null on error
   */
  async getClients(): Promise<Client[] | null> {
    const transaction = ErrorReporting.startTransaction(
      'getClients', 
      'db.query'
    );
    
    try {
      transaction?.setData({ operation: 'getClients' });
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name');
      
      if (error) throw error;
      
      logSuccess('fetch', 'clients', { count: data.length });
      transaction?.setStatus('ok');
      
      return data;
    } catch (error) {
      transaction?.setStatus('failed');
      return handleSupabaseError(error, 'Failed to fetch clients', { operation: 'getClients' }).details as null;
    } finally {
      transaction?.finish();
    }
  },

  /**
   * Get client by ID with contacts
   * @param id The client ID
   * @returns Promise resolving to client with contacts or null if not found/error
   */
  async getClientById(id: string): Promise<ClientWithContacts | null> {
    const transaction = ErrorReporting.startTransaction(
      'getClientById', 
      'db.query'
    );
    
    try {
      transaction?.setData({ operation: 'getClientById', clientId: id });
      
      // Get the client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (clientError) throw clientError;

      // Get the client contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', id);
      
      if (contactsError) throw contactsError;
      
      const clientWithContacts: ClientWithContacts = { 
        ...client, 
        contacts: contacts || [] 
      };
      
      logSuccess('fetch', 'client', { 
        clientId: id, 
        businessName: client.business_name,
        contactCount: contacts?.length 
      });
      
      transaction?.setStatus('ok');
      return clientWithContacts;
    } catch (error) {
      transaction?.setStatus('failed');
      return handleSupabaseError(error, 'Failed to fetch client details', { 
        operation: 'getClientById', 
        clientId: id 
      }).details as null;
    } finally {
      transaction?.finish();
    }
  },

  /**
   * Create a new client with validation
   * @param client The client data to insert
   * @returns Promise resolving to created client or null on error
   */
  async createClient(client: ClientInsert): Promise<Client | null> {
    const transaction = ErrorReporting.startTransaction(
      'createClient', 
      'db.mutation'
    );
    
    try {
      transaction?.setData({ 
        operation: 'createClient', 
        businessName: client.business_name 
      });
      
      // Validate ABN/ACN
      const abnValidation = validationService.validateABN(client.abn);
      if (!abnValidation.valid) {
        toast({
          title: 'Validation Error',
          description: abnValidation.error,
          variant: 'destructive',
        });
        return null;
      }
      
      const acnValidation = validationService.validateACN(client.acn);
      if (!acnValidation.valid) {
        toast({
          title: 'Validation Error',
          description: acnValidation.error,
          variant: 'destructive',
        });
        return null;
      }
      
      // Format business identifiers
      const formattedClient = {
        ...client,
        ...validationService.formatBusinessIdentifiers(client)
      };
      
      // Insert the client
      const { data, error } = await supabase
        .from('clients')
        .insert(formattedClient)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Client created successfully',
      });
      
      logSuccess('create', 'client', { 
        clientId: data.id, 
        businessName: data.business_name 
      });
      
      transaction?.setStatus('ok');
      return data;
    } catch (error) {
      transaction?.setStatus('failed');
      return handleSupabaseError(error, 'Failed to create client', { 
        operation: 'createClient',
        clientData: client
      }).details as null;
    } finally {
      transaction?.finish();
    }
  },

  /**
   * Update an existing client with validation
   * @param id The client ID
   * @param updates The client data to update
   * @returns Promise resolving to updated client or null on error
   */
  async updateClient(id: string, updates: ClientUpdate): Promise<Client | null> {
    const transaction = ErrorReporting.startTransaction(
      'updateClient', 
      'db.mutation'
    );
    
    try {
      transaction?.setData({ 
        operation: 'updateClient', 
        clientId: id,
        updateFields: Object.keys(updates)
      });
      
      // Validate ABN/ACN if provided
      if ('abn' in updates) {
        const abnValidation = validationService.validateABN(updates.abn);
        if (!abnValidation.valid) {
          toast({
            title: 'Validation Error',
            description: abnValidation.error,
            variant: 'destructive',
          });
          return null;
        }
      }
      
      if ('acn' in updates) {
        const acnValidation = validationService.validateACN(updates.acn);
        if (!acnValidation.valid) {
          toast({
            title: 'Validation Error',
            description: acnValidation.error,
            variant: 'destructive',
          });
          return null;
        }
      }
      
      // Format business identifiers
      const formattedUpdates = {
        ...updates,
        ...validationService.formatBusinessIdentifiers(updates)
      };
      
      // Update the client
      const { data, error } = await supabase
        .from('clients')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });
      
      logSuccess('update', 'client', { 
        clientId: id, 
        businessName: data.business_name,
        updatedFields: Object.keys(updates)
      });
      
      transaction?.setStatus('ok');
      return data;
    } catch (error) {
      transaction?.setStatus('failed');
      return handleSupabaseError(error, 'Failed to update client', { 
        operation: 'updateClient',
        clientId: id,
        updateData: updates
      }).details as null;
    } finally {
      transaction?.finish();
    }
  },

  /**
   * Delete a client
   * @param id The client ID to delete
   * @returns Promise resolving to true if successful, false on error
   */
  async deleteClient(id: string): Promise<boolean> {
    const transaction = ErrorReporting.startTransaction(
      'deleteClient', 
      'db.mutation'
    );
    
    try {
      transaction?.setData({ operation: 'deleteClient', clientId: id });
      
      // Check if client has associated records
      const { data: sites } = await supabase
        .from('sites')
        .select('id')
        .eq('client_id', id)
        .limit(1);
        
      if (sites && sites.length > 0) {
        toast({
          title: 'Cannot delete client',
          description: 'This client has associated sites. Please delete them first.',
          variant: 'destructive',
        });
        return false;
      }
      
      const { data: contracts } = await supabase
        .from('contracts')
        .select('id')
        .eq('client_id', id)
        .limit(1);
        
      if (contracts && contracts.length > 0) {
        toast({
          title: 'Cannot delete client',
          description: 'This client has associated contracts. Please delete them first.',
          variant: 'destructive',
        });
        return false;
      }
      
      // Delete client contacts first (cascade doesn't work with RLS)
      const { error: contactsError } = await supabase
        .from('client_contacts')
        .delete()
        .eq('client_id', id);
      
      if (contactsError) throw contactsError;
      
      // Delete the client
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });
      
      logSuccess('delete', 'client', { clientId: id });
      
      transaction?.setStatus('ok');
      return true;
    } catch (error) {
      transaction?.setStatus('failed');
      return handleSupabaseError(error, 'Failed to delete client', { 
        operation: 'deleteClient',
        clientId: id
      }).details === null;
    } finally {
      transaction?.finish();
    }
  },

  /**
   * Get client sites
   * @param clientId The client ID
   * @returns Promise resolving to array of sites or null on error
   */
  async getClientSites(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      logSuccess('fetch', 'client sites', { 
        clientId, 
        siteCount: data.length 
      });
      
      return data;
    } catch (error) {
      return handleSupabaseError(error, 'Failed to fetch client sites', { 
        operation: 'getClientSites',
        clientId
      }).details as null;
    }
  },

  /**
   * Get client contracts
   * @param clientId The client ID
   * @returns Promise resolving to array of contracts or null on error
   */
  async getClientContracts(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      logSuccess('fetch', 'client contracts', { 
        clientId, 
        contractCount: data.length 
      });
      
      return data;
    } catch (error) {
      return handleSupabaseError(error, 'Failed to fetch client contracts', { 
        operation: 'getClientContracts',
        clientId
      }).details as null;
    }
  },
};
