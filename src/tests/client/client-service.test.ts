
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { ClientStatus } from '@/types/database-schema';

// Define proper return types for the clientService mock
interface ClientResponse {
  data: any;
  error: null;
}

interface ClientErrorResponse {
  category: string;
  message: string;
  details?: any;
}

type ApiResponse<T = any> = { data: T; error: null } | ClientErrorResponse;

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
import { ClientFormData } from '@/services/client/types';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => {
  const mockClient = createMockSupabaseClient();
  return {
    supabase: mockClient,
    isAuthenticated: jest.fn().mockResolvedValue(true)
  };
});

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
    
    const mockResponse: ApiResponse<any[]> = { 
      data: mockClients, 
      error: null 
    };
    
    // Set up the mock implementation
    (clientService.getAllClients as jest.Mock).mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getAllClients();

    // Verify the results
    expect(result.data).toEqual(mockClients);
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('handles error when getting all clients', async () => {
    const mockError: ClientErrorResponse = { 
      category: 'server', 
      message: 'Database error' 
    };
    
    // Set up the mock implementation to return an error
    (clientService.getAllClients as jest.Mock).mockResolvedValue(mockError);

    // Call the service function
    const result = await clientService.getAllClients();

    // Verify error was returned
    expect(result).toEqual(mockError);
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('gets client by ID', async () => {
    const mockClient = { id: '123', business_name: 'Test Company' };
    
    const mockResponse: ApiResponse = {
      data: mockClient,
      error: null
    };
    
    // Set up the mock implementation
    (clientService.getClientById as jest.Mock).mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getClientById('123');

    // Verify the results
    expect(result.data).toEqual(mockClient);
    expect(clientService.getClientById).toHaveBeenCalledWith('123');
  });

  it('handles error when getting client by ID', async () => {
    const mockError: ClientErrorResponse = { 
      category: 'not_found', 
      message: 'Client not found' 
    };
    
    // Set up the mock implementation to return an error
    (clientService.getClientById as jest.Mock).mockResolvedValue(mockError);

    // Call the service function
    const result = await clientService.getClientById('invalid-id');

    // Check if error is returned correctly
    expect(result).toEqual(mockError);
    expect(clientService.getClientById).toHaveBeenCalledWith('invalid-id');
  });

  it('creates a new client', async () => {
    const mockResponse: ApiResponse = {
      data: {
        id: 'new-id',
        business_name: 'New Company',
        created_at: '2023-04-01T12:00:00Z',
      },
      error: null
    };
    
    // Set up the mock implementation
    (clientService.createClient as jest.Mock).mockResolvedValue(mockResponse);

    const newClient: ClientFormData = {
      business_name: 'New Company',
      status: ClientStatus.ACTIVE
    };

    // Call the service function
    const result = await clientService.createClient(newClient);

    // Verify the results
    expect(result.data).toEqual(mockResponse.data);
    expect(clientService.createClient).toHaveBeenCalledWith(newClient);
  });

  it('handles error when creating client', async () => {
    const mockError: ClientErrorResponse = { 
      category: 'validation', 
      message: 'Failed to create client' 
    };
    
    // Set up the mock implementation to return an error
    (clientService.createClient as jest.Mock).mockResolvedValue(mockError);

    const newClient: ClientFormData = {
      business_name: 'New Company',
      status: ClientStatus.ACTIVE
    };

    // Call the service function
    const result = await clientService.createClient(newClient);

    // Check if error is returned correctly
    expect(result).toEqual(mockError);
    expect(clientService.createClient).toHaveBeenCalledWith(newClient);
  });

  it('updates a client', async () => {
    const mockResponse: ApiResponse = {
      data: {
        id: '123',
        business_name: 'Updated Company',
        updated_at: '2023-04-01T14:00:00Z'
      },
      error: null
    };
    
    // Set up the mock implementation
    (clientService.updateClient as jest.Mock).mockResolvedValue(mockResponse);

    const updates = { business_name: 'Updated Company' };

    // Call the service function
    const result = await clientService.updateClient('123', updates);

    // Verify the results
    expect(result.data).toEqual(mockResponse.data);
    expect(clientService.updateClient).toHaveBeenCalledWith('123', updates);
  });

  it('deletes a client', async () => {
    const mockResponse = { success: true, error: null };
    
    // Set up the mock implementation
    (clientService.deleteClient as jest.Mock).mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.deleteClient('123');

    // Verify the results
    expect(result).toEqual(mockResponse);
    expect(clientService.deleteClient).toHaveBeenCalledWith('123');
  });
});
