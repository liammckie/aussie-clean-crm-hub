
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { ClientStatus } from '@/types/database-schema';
import { ErrorCategory } from '@/utils/logging/error-types';
import { ClientFormData } from '@/services/client/types';
import { 
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  isApiError,
  isApiSuccess,
  createSuccessResponse,
  createErrorResponse 
} from '@/types/api-response';

// Create mock client service with properly typed mock functions
const mockClientService = {
  getAllClients: jest.fn<() => Promise<ApiResponse<any>>>(),
  getClientById: jest.fn<(id: string) => Promise<ApiResponse<any>>>(),
  createClient: jest.fn<(data: ClientFormData) => Promise<ApiResponse<any>>>(),
  updateClient: jest.fn<(id: string, data: Partial<ClientFormData>) => Promise<ApiResponse<any>>>(),
  deleteClient: jest.fn<(id: string) => Promise<ApiResponse<any>>>(),
};

// Mock the client service module
jest.mock('@/services/client/service', () => ({
  clientService: mockClientService
}));

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
    const mockResponse: ApiSuccessResponse<typeof mockClients> = createSuccessResponse(mockClients, 'Clients retrieved successfully');
    
    // Set up the mock implementation with correct typing
    mockClientService.getAllClients.mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getAllClients();

    // Type guard to check if it's a success response
    if (isApiSuccess(result)) {
      // Verify the results
      expect(result.data).toEqual(mockClients);
    } else {
      // This should not happen in this test case
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('handles error when getting all clients', async () => {
    const mockError: ApiErrorResponse = createErrorResponse(
      ErrorCategory.SERVER, 
      'Database error'
    );
    
    // Set up the mock implementation to return an error
    mockClientService.getAllClients.mockResolvedValue(mockError);

    // Call the service function
    const result = await clientService.getAllClients();

    // Verify error was returned
    expect(result).toEqual(mockError);
    expect(clientService.getAllClients).toHaveBeenCalled();
  });

  it('gets client by ID', async () => {
    const mockClient = { id: '123', business_name: 'Test Company' };
    
    // Create typed success response
    const mockResponse: ApiSuccessResponse<typeof mockClient> = createSuccessResponse(mockClient, 'Client retrieved successfully');
    
    // Set up the mock implementation
    mockClientService.getClientById.mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.getClientById('123');

    // Type guard for success response
    if (isApiSuccess(result)) {
      // Verify the results
      expect(result.data).toEqual(mockClient);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.getClientById).toHaveBeenCalledWith('123');
  });

  it('handles error when getting client by ID', async () => {
    const mockError: ApiErrorResponse = createErrorResponse(
      ErrorCategory.NOT_FOUND, 
      'Client not found'
    );
    
    // Set up the mock implementation to return an error
    mockClientService.getClientById.mockResolvedValue(mockError);

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
    const mockResponse: ApiSuccessResponse<typeof newClientData> = createSuccessResponse(newClientData, 'Client created successfully');
    
    // Set up the mock implementation
    mockClientService.createClient.mockResolvedValue(mockResponse);

    const newClient: ClientFormData = {
      business_name: 'New Company',
      status: ClientStatus.ACTIVE
    };

    // Call the service function
    const result = await clientService.createClient(newClient);

    // Type guard for success response
    if (isApiSuccess(result)) {
      // Verify the results
      expect(result.data).toEqual(newClientData);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.createClient).toHaveBeenCalledWith(newClient);
  });

  it('handles error when creating client', async () => {
    const mockError: ApiErrorResponse = createErrorResponse(
      ErrorCategory.VALIDATION, 
      'Failed to create client'
    );
    
    // Set up the mock implementation to return an error
    mockClientService.createClient.mockResolvedValue(mockError);

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
    const mockResponse: ApiSuccessResponse<typeof updatedClientData> = createSuccessResponse(updatedClientData, 'Client updated successfully');
    
    // Set up the mock implementation
    mockClientService.updateClient.mockResolvedValue(mockResponse);

    const updates = { business_name: 'Updated Company' };

    // Call the service function
    const result = await clientService.updateClient('123', updates);

    // Type guard for success response
    if (isApiSuccess(result)) {
      // Verify the results
      expect(result.data).toEqual(updatedClientData);
    } else {
      throw new Error('Expected success response but got error');
    }
    
    expect(clientService.updateClient).toHaveBeenCalledWith('123', updates);
  });

  it('deletes a client', async () => {
    // Create typed success response
    const mockResponse: ApiSuccessResponse<{success: boolean}> = createSuccessResponse({ success: true }, 'Client deleted successfully');
    
    // Set up the mock implementation
    mockClientService.deleteClient.mockResolvedValue(mockResponse);

    // Call the service function
    const result = await clientService.deleteClient('123');

    // Verify the results
    expect(result).toEqual(mockResponse);
    expect(clientService.deleteClient).toHaveBeenCalledWith('123');
  });
});
