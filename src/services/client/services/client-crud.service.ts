
import { clientApi } from '../api';
import { ClientFormData, ClientRecord } from '../types';
import { ApiResponse, ApiErrorResponse } from '@/types/api-response';
import { handleValidation } from '../validation';
import { AppLogger } from '@/utils/logging/AppLogger';

/**
 * Client CRUD service with business logic for client operations
 */
export const clientCrudService = {
  /**
   * Get all clients
   */
  getAllClients: async (): Promise<ApiResponse<ClientRecord[]>> => {
    try {
      const response = await clientApi.fetchAllClients();
      return response;
    } catch (error) {
      console.error('Error in getAllClients:', error);
      return {
        category: 'server',
        message: 'Failed to get clients',
        details: { error }
      };
    }
  },

  /**
   * Get a client by ID
   */
  getClientById: async (clientId: string): Promise<ApiResponse<ClientRecord>> => {
    try {
      if (!clientId) {
        return {
          category: 'validation',
          message: 'Client ID is required',
          details: { field: 'id' }
        };
      }
      
      return await clientApi.fetchClientById(clientId);
    } catch (error) {
      console.error(`Error in getClientById for ${clientId}:`, error);
      return {
        category: 'server',
        message: `Failed to get client with ID ${clientId}`,
        details: { error, clientId }
      };
    }
  },

  /**
   * Create a new client
   */
  createClient: async (clientData: ClientFormData): Promise<ApiResponse<ClientRecord>> => {
    try {
      // Validate required fields
      const validationResult = handleValidation({
        business_name: clientData.business_name
      });
      
      if (!validationResult.success) {
        return {
          category: 'validation',
          message: validationResult.message || 'Validation error',
          details: { errors: validationResult.errors }
        };
      }
      
      // Log client creation attempt
      AppLogger.info('api', 'Creating new client', { 
        business_name: clientData.business_name
      });
      
      return await clientApi.createClient(clientData);
    } catch (error) {
      console.error('Error in createClient:', error);
      AppLogger.error('api', 'Failed to create client', {
        error,
        clientData
      });
      
      return {
        category: 'server',
        message: 'Failed to create client',
        details: { error }
      };
    }
  },

  /**
   * Update an existing client
   */
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>): Promise<ApiResponse<ClientRecord>> => {
    try {
      if (!clientId) {
        return {
          category: 'validation',
          message: 'Client ID is required',
          details: { field: 'id' }
        };
      }
      
      // Validate business_name if provided
      if (clientData.business_name !== undefined) {
        const validationResult = handleValidation({
          business_name: clientData.business_name
        });
        
        if (!validationResult.success) {
          return {
            category: 'validation',
            message: validationResult.message || 'Validation error',
            details: { errors: validationResult.errors }
          };
        }
      }
      
      // Log client update attempt
      AppLogger.info('api', `Updating client ${clientId}`, { 
        clientId,
        fields: Object.keys(clientData)
      });
      
      return await clientApi.updateClient(clientId, clientData);
    } catch (error) {
      console.error(`Error in updateClient for ${clientId}:`, error);
      AppLogger.error('api', `Failed to update client ${clientId}`, {
        error,
        clientId,
        clientData
      });
      
      return {
        category: 'server',
        message: `Failed to update client with ID ${clientId}`,
        details: { error, clientId }
      };
    }
  },

  /**
   * Delete a client
   */
  deleteClient: async (clientId: string): Promise<ApiResponse<{success: boolean}>> => {
    try {
      if (!clientId) {
        return {
          category: 'validation',
          message: 'Client ID is required',
          details: { field: 'id' }
        };
      }
      
      // Log client deletion attempt
      AppLogger.info('api', `Deleting client ${clientId}`, { clientId });
      
      return await clientApi.deleteClient(clientId);
    } catch (error) {
      console.error(`Error in deleteClient for ${clientId}:`, error);
      AppLogger.error('api', `Failed to delete client ${clientId}`, {
        error,
        clientId
      });
      
      return {
        category: 'server',
        message: `Failed to delete client with ID ${clientId}`,
        details: { error, clientId }
      };
    }
  }
};
