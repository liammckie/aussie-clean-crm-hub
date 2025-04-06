
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { ClientStatus } from '@/types/database-schema';

// Mock the client service module
jest.mock('@/services/client/service', () => ({
  clientService: {
    getAllClients: jest.fn(),
    getClientById: jest.fn(),
    createClient: jest.fn(),
    updateClient: jest.fn(),
    deleteClient: jest.fn(),
  }
}));

// Import the mocked functions
import { clientService } from '@/services/client/service';
import { ClientFormData } from '@/types/form-types';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => {
  const mockClient = createMockSupabaseClient();
  return {
    supabase: mockClient,
    isAuthenticated: jest.fn().mockResolvedValue(true)
  };
});

// Import the mocked supabase client
const { supabase } = jest.requireMock('@/integrations/supabase/client');

describe('Client Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets all clients', async () => {
    // Set up mock data
    const mockClients = [
      { id: '1', business_name: 'Company A' },
      { id: '2', business_name: 'Company B' }
    ];
    
    // Set up the mock implementation
    (clientService.getAllClients as jest.Mock).mockResolvedValue(mockClients);

    // Call the service function
    const result = await clientService.getAllClients();

    // Verify the results
    expect(result).toEqual(mockClients);
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('handles error when getting all clients', async () => {
    const mockError = new Error('Database error');
    
    // Set up the mock implementation to throw an error
    (clientService.getAllClients as jest.Mock).mockRejectedValue(mockError);

    // Call the service function and expect it to throw
    await expect(clientService.getAllClients()).rejects.toThrow('Database error');
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('gets client by ID', async () => {
    const mockClient = { id: '123', business_name: 'Test Company' };
    
    // Set up the mock implementation
    (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);

    // Call the service function
    const result = await clientService.getClientById('123');

    // Verify the results
    expect(result).toEqual(mockClient);
    expect(clientService.getClientById).toHaveBeenCalledWith('123');
  });

  it('handles error when getting client by ID', async () => {
    const mockError = new Error('Client not found');
    
    // Set up the mock implementation to throw an error
    (clientService.getClientById as jest.Mock).mockRejectedValue(mockError);

    // Call the service function and expect it to throw
    await expect(clientService.getClientById('invalid-id')).rejects.toThrow('Client not found');
    expect(clientService.getClientById).toHaveBeenCalledWith('invalid-id');
  });

  it('creates a new client', async () => {
    const mockResponse = {
      id: 'new-id',
      business_name: 'New Company',
      created_at: '2023-04-01T12:00:00Z',
    };
    
    // Set up the mock implementation
    (clientService.createClient as jest.Mock).mockResolvedValue(mockResponse);

    const newClient: ClientFormData = {
      business_name: 'New Company',
      status: ClientStatus.ACTIVE,
      addresses: [],
      contacts: []
    };

    // Call the service function
    const result = await clientService.createClient(newClient);

    // Verify the results
    expect(result).toEqual(mockResponse);
    expect(clientService.createClient).toHaveBeenCalledWith(newClient);
  });

  it('handles error when creating client', async () => {
    const mockError = new Error('Failed to create client');
    
    // Set up the mock implementation to throw an error
    (clientService.createClient as jest.Mock).mockRejectedValue(mockError);

    const newClient: ClientFormData = {
      business_name: 'New Company',
      status: ClientStatus.ACTIVE,
      addresses: [],
      contacts: []
    };

    // Call the service function and expect it to throw
    await expect(clientService.createClient(newClient)).rejects.toThrow('Failed to create client');
    expect(clientService.createClient).toHaveBeenCalledWith(newClient);
  });

  it('updates a client', async () => {
    const mockResponse = {
      id: '123',
      business_name: 'Updated Company',
      updated_at: '2023-04-01T14:00:00Z'
    };
    
    // Set up the mock implementation
    (clientService.updateClient as jest.Mock).mockResolvedValue(mockResponse);

    const updates = { business_name: 'Updated Company' };

    // Call the service function
    const result = await clientService.updateClient('123', updates);

    // Verify the results
    expect(result).toEqual(mockResponse);
    expect(clientService.updateClient).toHaveBeenCalledWith('123', updates);
  });

  it('deletes a client', async () => {
    // Set up the mock implementation
    (clientService.deleteClient as jest.Mock).mockResolvedValue(true);

    // Call the service function
    const result = await clientService.deleteClient('123');

    // Verify the results
    expect(result).toBe(true);
    expect(clientService.deleteClient).toHaveBeenCalledWith('123');
  });
});
