
import { describe, expect, it, jest } from '@jest/globals';
import { clientService } from '../../services/client';
import { createSuccessResponse, createErrorResponse, ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';
import { ClientRecord, ClientStatus } from '@/types/database-schema';

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
    const mockResponse: ApiResponse<MockClientType[]> = createSuccessResponse([mockClientData], 'Clients retrieved successfully');
    (clientService.getAllClients as jest.Mock<Promise<ApiResponse<MockClientType[]>>>).mockResolvedValue(mockResponse);
    
    const result = await clientService.getAllClients();
    expect(clientService.getAllClients).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should successfully get a client by ID', async () => {
    const mockResponse: ApiResponse<MockClientType> = createSuccessResponse(mockClientData, 'Client retrieved successfully');
    (clientService.getClientById as jest.Mock<Promise<ApiResponse<MockClientType>>>).mockResolvedValue(mockResponse);
    
    const result = await clientService.getClientById(mockClientId);
    expect(clientService.getClientById).toHaveBeenCalledWith(mockClientId);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully create a new client', async () => {
    const mockResponse: ApiResponse<MockClientType> = createSuccessResponse(mockClientData, 'Client created successfully');
    (clientService.createClient as jest.Mock<Promise<ApiResponse<MockClientType>>>).mockResolvedValue(mockResponse);
    
    const result = await clientService.createClient(mockClientData);
    expect(clientService.createClient).toHaveBeenCalledWith(mockClientData);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully update an existing client', async () => {
    const mockResponse: ApiResponse<MockClientType> = createSuccessResponse(mockClientData, 'Client updated successfully');
    (clientService.updateClient as jest.Mock<Promise<ApiResponse<MockClientType>>>).mockResolvedValue(mockResponse);
    
    const result = await clientService.updateClient(mockClientId, mockClientData);
    expect(clientService.updateClient).toHaveBeenCalledWith(mockClientId, mockClientData);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully delete a client', async () => {
    const mockResponse: ApiResponse<boolean> = createSuccessResponse(true, 'Client deleted successfully');
    (clientService.deleteClient as jest.Mock<Promise<ApiResponse<boolean>>>).mockResolvedValue(mockResponse);
    
    const result = await clientService.deleteClient(mockClientId);
    expect(clientService.deleteClient).toHaveBeenCalledWith(mockClientId);
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors when getting all clients', async () => {
    const mockError = { message: 'Failed to retrieve clients' };
    const errorResponse: ApiResponse<never> = createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError);
    (clientService.getAllClients as jest.Mock<Promise<ApiResponse<MockClientType[]>>>).mockResolvedValue(errorResponse as ApiResponse<MockClientType[]>);
    
    const result = await clientService.getAllClients();
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when getting a client by ID', async () => {
    const mockError = { message: 'Client not found' };
    const errorResponse: ApiResponse<never> = createErrorResponse(ErrorCategory.NOT_FOUND, mockError.message, mockError);
    (clientService.getClientById as jest.Mock<Promise<ApiResponse<MockClientType>>>).mockResolvedValue(errorResponse as ApiResponse<MockClientType>);
    
    const result = await clientService.getClientById(mockClientId);
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when creating a client', async () => {
    const mockError = { message: 'Failed to create client' };
    const errorResponse: ApiResponse<never> = createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError);
    (clientService.createClient as jest.Mock<Promise<ApiResponse<MockClientType>>>).mockResolvedValue(errorResponse as ApiResponse<MockClientType>);
    
    const result = await clientService.createClient(mockClientData);
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when updating a client', async () => {
    const mockError = { message: 'Failed to update client' };
    const errorResponse: ApiResponse<never> = createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError);
    (clientService.updateClient as jest.Mock<Promise<ApiResponse<MockClientType>>>).mockResolvedValue(errorResponse as ApiResponse<MockClientType>);
    
    const result = await clientService.updateClient(mockClientId, mockClientData);
    expect(result).toEqual(errorResponse);
  });

  it('should handle errors when deleting a client', async () => {
    const mockError = { message: 'Failed to delete client' };
    const errorResponse: ApiResponse<never> = createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError);
    (clientService.deleteClient as jest.Mock<Promise<ApiResponse<boolean>>>).mockResolvedValue(errorResponse as ApiResponse<boolean>);
    
    const result = await clientService.deleteClient(mockClientId);
    expect(result).toEqual(errorResponse);
  });
});
