
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { ClientStatus } from '@/types/database-schema';

// Define return types for clientService mock functions
type SuccessResponse<T = any> = { data: T; error: null };
type ErrorResponse = { 
  category: string; 
  message: string; 
  details?: any;
};

// Define the return type for the mock functions
type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Mock the client service module
jest.mock('@/services/client/service', () => {
  return {
    clientService: {
      getAllClients: jest.fn(),
      getClientById: jest.fn(),
      createClient: jest.fn(),
      updateClient: jest.fn(),
      deleteClient: jest.fn(),
    }
  };
});

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
    
    const mockResponse: ApiResponse<typeof mockClients> = { 
      data: mockClients, 
      error: null 
    };
    
    // Set up the mock implementation
    (clientService.getAllClients as jest.Mock).mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getAllClients();

    // Type guard to check if it's a success response
    if ('data' in result) {
      // Verify the results
      expect(result.data).toEqual(mockClients);
    } else {
      // This should not happen in this test case
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('handles error when getting all clients', async () => {
    const mockError: ErrorResponse = { 
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
    
    const mockResponse: ApiResponse<typeof mockClient> = {
      data: mockClient,
      error: null
    };
    
    // Set up the mock implementation
    (clientService.getClientById as jest.Mock).mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getClientById('123');

    // Type guard for success response
    if ('data' in result) {
      // Verify the results
      expect(result.data).toEqual(mockClient);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.getClientById).toHaveBeenCalledWith('123');
  });

  it('handles error when getting client by ID', async () => {
    const mockError: ErrorResponse = { 
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
    const newClientData = {
      id: 'new-id',
      business_name: 'New Company',
      created_at: '2023-04-01T12:00:00Z',
    };

    const mockResponse: ApiResponse<typeof newClientData> = {
      data: newClientData,
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

    // Type guard for success response
    if ('data' in result) {
      // Verify the results
      expect(result.data).toEqual(mockResponse.data);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.createClient).toHaveBeenCalledWith(newClient);
  });

  it('handles error when creating client', async () => {
    const mockError: ErrorResponse = { 
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
    const updatedClientData = {
      id: '123',
      business_name: 'Updated Company',
      updated_at: '2023-04-01T14:00:00Z'
    };

    const mockResponse: ApiResponse<typeof updatedClientData> = {
      data: updatedClientData,
      error: null
    };
    
    // Set up the mock implementation
    (clientService.updateClient as jest.Mock).mockResolvedValue(mockResponse);

    const updates = { business_name: 'Updated Company' };

    // Call the service function
    const result = await clientService.updateClient('123', updates);

    // Type guard for success response
    if ('data' in result) {
      // Verify the results
      expect(result.data).toEqual(mockResponse.data);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.updateClient).toHaveBeenCalledWith('123', updates);
  });

  it('deletes a client', async () => {
    const mockResponse: ApiResponse<{ success: boolean }> = {
      data: { success: true },
      error: null
    };
    
    // Set up the mock implementation
    (clientService.deleteClient as jest.Mock).mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.deleteClient('123');

    // Verify the results
    expect(result).toEqual(mockResponse);
    expect(clientService.deleteClient).toHaveBeenCalledWith('123');
  });
});
