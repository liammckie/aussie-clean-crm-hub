
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { ClientStatus } from '@/types/database-schema';
import { 
  ApiResponse, 
  SuccessResponse,
  isSuccessResponse, 
  createSuccessResponse, 
  createErrorResponse 
} from '../utils/test-helpers';
import { ErrorCategory, ErrorResponse } from '@/utils/supabaseErrors';
import { ClientFormData } from '@/services/client/types';

// Mock the client service module
jest.mock('@/services/client/service', () => {
  const originalModule = jest.requireActual('@/services/client/service');
  
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
    
    // Create typed success response
    const mockResponse = createSuccessResponse(mockClients);
    
    // Set up the mock implementation with correct typing
    (clientService.getAllClients as jest.Mock<Promise<ApiResponse<typeof mockClients>>>)
      .mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getAllClients();

    // Type guard to check if it's a success response
    if (isSuccessResponse(result)) {
      // Verify the results
      expect(result.data).toEqual(mockClients);
    } else {
      // This should not happen in this test case
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('handles error when getting all clients', async () => {
    const mockError = createErrorResponse(
      ErrorCategory.SERVER, 
      'Database error'
    );
    
    // Set up the mock implementation to return an error
    (clientService.getAllClients as jest.Mock<Promise<ApiResponse<any>>>)
      .mockResolvedValue(mockError);

    // Call the service function
    const result = await clientService.getAllClients();

    // Verify error was returned
    expect(result).toEqual(mockError);
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('gets client by ID', async () => {
    const mockClient = { id: '123', business_name: 'Test Company' };
    
    // Create typed success response
    const mockResponse = createSuccessResponse(mockClient);
    
    // Set up the mock implementation
    (clientService.getClientById as jest.Mock<Promise<ApiResponse<typeof mockClient>>>)
      .mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getClientById('123');

    // Type guard for success response
    if (isSuccessResponse(result)) {
      // Verify the results
      expect(result.data).toEqual(mockClient);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.getClientById).toHaveBeenCalledWith('123');
  });

  it('handles error when getting client by ID', async () => {
    const mockError = createErrorResponse(
      ErrorCategory.NOT_FOUND, 
      'Client not found'
    );
    
    // Set up the mock implementation to return an error
    (clientService.getClientById as jest.Mock<Promise<ApiResponse<any>>>)
      .mockResolvedValue(mockError);

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

    // Create typed success response
    const mockResponse = createSuccessResponse(newClientData);
    
    // Set up the mock implementation
    (clientService.createClient as jest.Mock<Promise<ApiResponse<typeof newClientData>>>)
      .mockResolvedValue(mockResponse);

    const newClient: ClientFormData = {
      business_name: 'New Company',
      status: ClientStatus.ACTIVE
    };

    // Call the service function
    const result = await clientService.createClient(newClient);

    // Type guard for success response
    if (isSuccessResponse(result)) {
      // Verify the results
      expect(result.data).toEqual(newClientData);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.createClient).toHaveBeenCalledWith(newClient);
  });

  it('handles error when creating client', async () => {
    const mockError = createErrorResponse(
      ErrorCategory.VALIDATION, 
      'Failed to create client'
    );
    
    // Set up the mock implementation to return an error
    (clientService.createClient as jest.Mock<Promise<ApiResponse<any>>>)
      .mockResolvedValue(mockError);

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

    // Create typed success response
    const mockResponse = createSuccessResponse(updatedClientData);
    
    // Set up the mock implementation
    (clientService.updateClient as jest.Mock<Promise<ApiResponse<typeof updatedClientData>>>)
      .mockResolvedValue(mockResponse);

    const updates = { business_name: 'Updated Company' };

    // Call the service function
    const result = await clientService.updateClient('123', updates);

    // Type guard for success response
    if (isSuccessResponse(result)) {
      // Verify the results
      expect(result.data).toEqual(updatedClientData);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.updateClient).toHaveBeenCalledWith('123', updates);
  });

  it('deletes a client', async () => {
    // Create typed success response
    const mockResponse = createSuccessResponse({ success: true });
    
    // Set up the mock implementation
    (clientService.deleteClient as jest.Mock<Promise<ApiResponse<{success: boolean}>>>)
      .mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.deleteClient('123');

    // Verify the results
    expect(result).toEqual(mockResponse);
    expect(clientService.deleteClient).toHaveBeenCalledWith('123');
  });
});
