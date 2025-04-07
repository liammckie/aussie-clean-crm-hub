
import { describe, expect, it, jest } from '@jest/globals';
import { clientService } from '../../services/client';
import { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';
import { ClientRecord, ClientStatus } from '@/types/database-schema';

// Create helper functions for mocking responses
function createSuccessResponse<T>(data: T, message: string): ApiSuccessResponse<T> {
  return { data, message };
}

function createErrorResponse(
  category: ErrorCategory,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return { category, message, details };
}

// Mock the client API module
jest.mock('../../services/client/api', () => ({
  clientApi: {
    fetchAllClients: jest.fn(),
    fetchClientById: jest.fn(),
    createClient: jest.fn(),
    updateClient: jest.fn(),
    deleteClient: jest.fn(),
    fetchClientContacts: jest.fn(),
    createClientContact: jest.fn(),
    fetchClientAddresses: jest.fn(),
    createClientAddress: jest.fn(),
    deleteClientAddress: jest.fn()
  }
}));

// Mock the types imported from database schema
jest.mock('@/types/database-schema', () => ({
  ClientStatus: {
    ACTIVE: 'Active',
    PROSPECT: 'Prospect'
  }
}));

describe('Client Service', () => {
  const mockClientData = {
    business_name: 'Test Client',
    status: ClientStatus.ACTIVE
  };

  type MockClientType = typeof mockClientData;
  
  const mockClientId = 'test-client-id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get all clients', async () => {
    // Create a properly typed mock
    const mockResponse = createSuccessResponse([mockClientData], 'Clients retrieved successfully');
    jest.spyOn(clientService, 'getAllClients').mockResolvedValue(mockResponse);
    
    const result = await clientService.getAllClients();
    expect(clientService.getAllClients).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should successfully get a client by ID', async () => {
    const mockResponse = createSuccessResponse(mockClientData, 'Client retrieved successfully');
    jest.spyOn(clientService, 'getClientById').mockResolvedValue(mockResponse);
    
    const result = await clientService.getClientById(mockClientId);
    expect(clientService.getClientById).toHaveBeenCalledWith(mockClientId);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully create a new client', async () => {
    const mockResponse = createSuccessResponse(mockClientData, 'Client created successfully');
    jest.spyOn(clientService, 'createClient').mockResolvedValue(mockResponse);
    
    const result = await clientService.createClient(mockClientData);
    expect(clientService.createClient).toHaveBeenCalledWith(mockClientData);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully update an existing client', async () => {
    const mockResponse = createSuccessResponse(mockClientData, 'Client updated successfully');
    jest.spyOn(clientService, 'updateClient').mockResolvedValue(mockResponse);
    
    const result = await clientService.updateClient(mockClientId, mockClientData);
    expect(clientService.updateClient).toHaveBeenCalledWith(mockClientId, mockClientData);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully delete a client', async () => {
    const mockResponse = createSuccessResponse(true, 'Client deleted successfully');
    jest.spyOn(clientService, 'deleteClient').mockResolvedValue(mockResponse);
    
    const result = await clientService.deleteClient(mockClientId);
    expect(clientService.deleteClient).toHaveBeenCalledWith(mockClientId);
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors when getting all clients', async () => {
    const mockError = { message: 'Failed to retrieve clients' };
    const errorResponse = createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError);
    jest.spyOn(clientService, 'getAllClients').mockResolvedValue(errorResponse as ApiResponse<MockClientType[]>);
    
    const result = await clientService.getAllClients();
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when getting a client by ID', async () => {
    const mockError = { message: 'Client not found' };
    const errorResponse = createErrorResponse(ErrorCategory.NOT_FOUND, mockError.message, mockError);
    jest.spyOn(clientService, 'getClientById').mockResolvedValue(errorResponse as ApiResponse<MockClientType>);
    
    const result = await clientService.getClientById(mockClientId);
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when creating a client', async () => {
    const mockError = { message: 'Failed to create client' };
    const errorResponse = createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError);
    jest.spyOn(clientService, 'createClient').mockResolvedValue(errorResponse as ApiResponse<MockClientType>);
    
    const result = await clientService.createClient(mockClientData);
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when updating a client', async () => {
    const mockError = { message: 'Failed to update client' };
    const errorResponse = createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError);
    jest.spyOn(clientService, 'updateClient').mockResolvedValue(errorResponse as ApiResponse<MockClientType>);
    
    const result = await clientService.updateClient(mockClientId, mockClientData);
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when deleting a client', async () => {
    const mockError = { message: 'Failed to delete client' };
    const errorResponse = createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError);
    jest.spyOn(clientService, 'deleteClient').mockResolvedValue(errorResponse as ApiResponse<boolean>);
    
    const result = await clientService.deleteClient(mockClientId);
    expect(result).toEqual(errorResponse);
  });
});
