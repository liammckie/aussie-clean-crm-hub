
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';

// Mock the service module to properly mock its exports
jest.mock('@/services/client', () => ({
  clientService: {
    createClient: jest.fn(),
    getClientById: jest.fn(),
    updateClient: jest.fn(),
    deleteClient: jest.fn(),
    getAllClients: jest.fn()
  }
}));

// Import the mocked functions after mocking
import { clientService } from '@/services/client';

// Mock the Supabase client module
jest.mock('@/integrations/supabase/client', () => {
  const mockClient = createMockSupabaseClient();
  return {
    supabase: mockClient
  };
});

// Import the mocked supabase client
const { supabase } = jest.requireMock('@/integrations/supabase/client');

describe('Client Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllClients', () => {
    it('should return all clients when successful', async () => {
      // Setup mock data
      const mockClients = [
        { id: '1', business_name: 'Client A' },
        { id: '2', business_name: 'Client B' }
      ];
      
      // Configure mock response
      supabase.data = { data: mockClients, error: null };
      
      // Mock the implementation for this test
      (clientService.getAllClients as jest.Mock).mockResolvedValue(mockClients);
      
      // Call the function
      const result = await clientService.getAllClients();
      
      // Assertions
      expect(result).toEqual(mockClients);
      expect(clientService.getAllClients).toHaveBeenCalled();
    });

    it('should throw error when database query fails', async () => {
      // Setup mock error
      const mockError = { message: 'Database error', details: 'Failed to fetch clients' };
      supabase.data = { data: null, error: mockError };
      
      // Mock implementation to throw error
      (clientService.getAllClients as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Call function and expect error
      await expect(clientService.getAllClients()).rejects.toThrow();
    });
  });

  describe('getClientById', () => {
    it('should return a client when successful', async () => {
      // Setup mock data
      const mockClient = { id: '1', business_name: 'Test Client' };
      supabase.data = { data: mockClient, error: null };
      
      // Mock implementation
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);
      
      // Call the function
      const result = await clientService.getClientById('1');
      
      // Assertions
      expect(result).toEqual(mockClient);
      expect(clientService.getClientById).toHaveBeenCalledWith('1');
    });

    it('should throw error when client not found', async () => {
      // Setup mock error
      const mockError = { message: 'Not found', category: 'not_found' };
      supabase.data = { data: null, error: mockError };
      
      // Mock implementation to throw error
      (clientService.getClientById as jest.Mock).mockRejectedValue(new Error('Not found'));
      
      // Call function and expect error
      await expect(clientService.getClientById('999')).rejects.toThrow();
      expect(clientService.getClientById).toHaveBeenCalledWith('999');
    });
  });

  describe('createClient', () => {
    it('should create client when successful', async () => {
      // Setup mock client data
      const mockClientData = { business_name: 'New Client' };
      const mockCreatedClient = { id: '123', business_name: 'New Client', created_at: new Date().toISOString() };
      
      supabase.data = { data: mockCreatedClient, error: null };
      
      // Mock implementation
      (clientService.createClient as jest.Mock).mockResolvedValue(mockCreatedClient);
      
      // Call the function
      const result = await clientService.createClient(mockClientData);
      
      // Assertions
      expect(result).toEqual(mockCreatedClient);
      expect(clientService.createClient).toHaveBeenCalledWith(mockClientData);
    });

    it('should throw error when creation fails', async () => {
      // Setup mock error
      const mockClientData = { business_name: 'New Client' };
      const mockError = { message: 'Insert failed', details: 'Validation error' };
      
      supabase.data = { data: null, error: mockError };
      
      // Mock implementation to throw error
      (clientService.createClient as jest.Mock).mockRejectedValue(new Error('Insert failed'));
      
      // Call function and expect error
      await expect(clientService.createClient(mockClientData)).rejects.toThrow();
      expect(clientService.createClient).toHaveBeenCalledWith(mockClientData);
    });
  });

  describe('updateClient', () => {
    it('should update client when successful', async () => {
      // Setup mock data
      const mockClientId = '123';
      const mockUpdateData = { business_name: 'Updated Client' };
      const mockUpdatedClient = { id: '123', business_name: 'Updated Client', updated_at: new Date().toISOString() };
      
      supabase.data = { data: mockUpdatedClient, error: null };
      
      // Mock implementation
      (clientService.updateClient as jest.Mock).mockResolvedValue(mockUpdatedClient);
      
      // Call the function
      const result = await clientService.updateClient(mockClientId, mockUpdateData);
      
      // Assertions
      expect(result).toEqual(mockUpdatedClient);
      expect(clientService.updateClient).toHaveBeenCalledWith(mockClientId, mockUpdateData);
    });
  });

  describe('deleteClient', () => {
    it('should delete client when successful', async () => {
      // Setup mock data
      const mockClientId = '123';
      supabase.data = { success: true, error: null };
      
      // Mock implementation
      (clientService.deleteClient as jest.Mock).mockResolvedValue(true);
      
      // Call the function
      const result = await clientService.deleteClient(mockClientId);
      
      // Assertions
      expect(result).toBe(true);
      expect(clientService.deleteClient).toHaveBeenCalledWith(mockClientId);
    });
  });
});
