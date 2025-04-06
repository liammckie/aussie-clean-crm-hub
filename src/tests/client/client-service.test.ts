
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createClient, getClient, updateClient, deleteClient, getAllClients } from '@/services/client';
import { createMockSupabaseClient } from '../mocks/supabaseMock';

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
      
      // Call the function
      const result = await getAllClients();
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockClients);
    });

    it('should throw error when database query fails', async () => {
      // Setup mock error
      const mockError = { message: 'Database error', details: 'Failed to fetch clients' };
      supabase.data = { data: null, error: mockError };
      
      // Call function and expect error
      await expect(getAllClients()).rejects.toThrow();
      
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.select).toHaveBeenCalledWith('*');
    });
  });

  describe('getClient', () => {
    it('should return a client when successful', async () => {
      // Setup mock data
      const mockClient = { id: '1', business_name: 'Test Client' };
      supabase.data = { data: mockClient, error: null };
      
      // Call the function
      const result = await getClient('1');
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.select).toHaveBeenCalledWith('*');
      expect(supabase.eq).toHaveBeenCalledWith('id', '1');
      expect(supabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockClient);
    });

    it('should throw error when client not found', async () => {
      // Setup mock error
      const mockError = { message: 'Not found', category: 'not_found' };
      supabase.data = { data: null, error: mockError };
      
      // Call function and expect error
      await expect(getClient('999')).rejects.toThrow();
      
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.select).toHaveBeenCalledWith('*');
      expect(supabase.eq).toHaveBeenCalledWith('id', '999');
      expect(supabase.single).toHaveBeenCalled();
    });
  });

  describe('createClient', () => {
    it('should create client when successful', async () => {
      // Setup mock client data
      const mockClientData = { business_name: 'New Client' };
      const mockCreatedClient = { id: '123', business_name: 'New Client', created_at: new Date().toISOString() };
      
      supabase.data = { data: mockCreatedClient, error: null };
      
      // Call the function
      const result = await createClient(mockClientData);
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.insert).toHaveBeenCalledWith(mockClientData);
      expect(supabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedClient);
    });

    it('should throw error when creation fails', async () => {
      // Setup mock error
      const mockClientData = { business_name: 'New Client' };
      const mockError = { message: 'Insert failed', details: 'Validation error' };
      
      supabase.data = { data: null, error: mockError };
      
      // Call function and expect error
      await expect(createClient(mockClientData)).rejects.toThrow();
      
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.insert).toHaveBeenCalledWith(mockClientData);
      expect(supabase.single).toHaveBeenCalled();
    });
  });

  describe('updateClient', () => {
    it('should update client when successful', async () => {
      // Setup mock data
      const mockClientId = '123';
      const mockUpdateData = { business_name: 'Updated Client' };
      const mockUpdatedClient = { id: '123', business_name: 'Updated Client', updated_at: new Date().toISOString() };
      
      supabase.data = { data: mockUpdatedClient, error: null };
      
      // Call the function
      const result = await updateClient(mockClientId, mockUpdateData);
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.update).toHaveBeenCalledWith(mockUpdateData);
      expect(supabase.eq).toHaveBeenCalledWith('id', mockClientId);
      expect(supabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedClient);
    });
  });

  describe('deleteClient', () => {
    it('should delete client when successful', async () => {
      // Setup mock data
      const mockClientId = '123';
      supabase.data = { success: true, error: null };
      
      // Call the function
      const result = await deleteClient(mockClientId);
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('clients');
      expect(supabase.delete).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('id', mockClientId);
      expect(result).toBe(true);
    });
  });
});
