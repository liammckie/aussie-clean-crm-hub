
import { clientApi } from '../api';
import { ClientFormData, ClientApiResponse, ClientsApiResponse } from '../types';
import { handleValidationError } from '../validation';
import { AppLogger } from '@/utils/logging';
import { LogCategory } from '@/utils/logging/LogCategory';

/**
 * Client CRUD service
 */
export const clientCrudService = {
  /**
   * Get all clients
   */
  getAllClients: async (): Promise<ClientsApiResponse> => {
    try {
      AppLogger.info(LogCategory.CLIENT, 'Fetching all clients');
      return await clientApi.fetchAllClients();
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, 'Error fetching all clients', { error });
      throw error;
    }
  },

  /**
   * Get client by ID
   */
  getClientById: async (clientId: string): Promise<ClientApiResponse> => {
    try {
      AppLogger.info(LogCategory.CLIENT, `Fetching client ${clientId}`);
      const response = await clientApi.fetchClientById(clientId);
      return response;
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, `Error fetching client ${clientId}`, { error });
      throw error;
    }
  },

  /**
   * Create a new client
   */
  createClient: async (clientData: ClientFormData): Promise<ClientApiResponse> => {
    try {
      // Log operation before validation
      AppLogger.info(LogCategory.CLIENT, 'Creating new client', { businessName: clientData.business_name });
      
      const response = await clientApi.createClient(clientData);
      return response;
    } catch (error) {
      // Log error with appropriate context
      AppLogger.error(LogCategory.CLIENT, 'Error creating client', {
        businessName: clientData.business_name,
        error
      });
      throw error;
    }
  },

  /**
   * Update an existing client
   */
  updateClient: async (clientId: string, clientData: Partial<ClientFormData>): Promise<ClientApiResponse> => {
    try {
      // Log operation before validation
      AppLogger.info(LogCategory.CLIENT, `Updating client ${clientId}`, {
        businessName: clientData.business_name
      });

      const response = await clientApi.updateClient(clientId, clientData);
      return response;
    } catch (error) {
      // Log error with appropriate context
      AppLogger.error(LogCategory.CLIENT, `Error updating client ${clientId}`, {
        businessName: clientData.business_name,
        error
      });
      throw error;
    }
  },

  /**
   * Delete a client
   */
  deleteClient: async (clientId: string): Promise<any> => {
    try {
      // Log operation
      AppLogger.info(LogCategory.CLIENT, `Deleting client ${clientId}`);
      
      const response = await clientApi.deleteClient(clientId);
      return response;
    } catch (error) {
      // Log error with appropriate context
      AppLogger.error(LogCategory.CLIENT, `Error deleting client ${clientId}`, { error });
      throw error;
    }
  }
};
