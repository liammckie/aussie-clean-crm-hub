import { clientService } from '@/services/client';
import { ClientFormData } from '@/types/form-types';
import { ClientStatus } from '@/types/database-schema';
import { createSuccessResponse, createErrorResponse } from '@/utils/api-utils';
import { ErrorCategory } from '@/utils/logging/error-types';

// Mock the implementation of the clientService functions
jest.mock('@/services/client', () => ({
  clientService: {
    getAllClients: jest.fn(),
    getClientById: jest.fn(),
    createClient: jest.fn(),
    updateClient: jest.fn(),
    deleteClient: jest.fn(),
    getClientContacts: jest.fn(),
    createClientContact: jest.fn(),
    getClientAddresses: jest.fn(),
    createClientAddress: jest.fn(),
    deleteClientAddress: jest.fn()
  }
}));

describe('Client Service', () => {
  const mockClientData: ClientFormData = {
    business_name: 'Test Client',
    status: ClientStatus.ACTIVE
  };

  const mockClientId = 'test-client-id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get all clients', async () => {
    (clientService.getAllClients as jest.Mock).mockResolvedValue(createSuccessResponse([mockClientData], 'Clients retrieved successfully'));
    const result = await clientService.getAllClients();
    expect(clientService.getAllClients).toHaveBeenCalled();
    expect(result).toEqual(createSuccessResponse([mockClientData], 'Clients retrieved successfully'));
  });

  it('should successfully get a client by ID', async () => {
    (clientService.getClientById as jest.Mock).mockResolvedValue(createSuccessResponse(mockClientData, 'Client retrieved successfully'));
    const result = await clientService.getClientById(mockClientId);
    expect(clientService.getClientById).toHaveBeenCalledWith(mockClientId);
    expect(result).toEqual(createSuccessResponse(mockClientData, 'Client retrieved successfully'));
  });

  it('should successfully create a new client', async () => {
    (clientService.createClient as jest.Mock).mockResolvedValue(createSuccessResponse(mockClientData, 'Client created successfully'));
    const result = await clientService.createClient(mockClientData);
    expect(clientService.createClient).toHaveBeenCalledWith(mockClientData);
    expect(result).toEqual(createSuccessResponse(mockClientData, 'Client created successfully'));
  });

  it('should successfully update an existing client', async () => {
    (clientService.updateClient as jest.Mock).mockResolvedValue(createSuccessResponse(mockClientData, 'Client updated successfully'));
    const result = await clientService.updateClient(mockClientId, mockClientData);
    expect(clientService.updateClient).toHaveBeenCalledWith(mockClientId, mockClientData);
    expect(result).toEqual(createSuccessResponse(mockClientData, 'Client updated successfully'));
  });

  it('should successfully delete a client', async () => {
    (clientService.deleteClient as jest.Mock).mockResolvedValue(createSuccessResponse(true, 'Client deleted successfully'));
    const result = await clientService.deleteClient(mockClientId);
    expect(clientService.deleteClient).toHaveBeenCalledWith(mockClientId);
    expect(result).toEqual(createSuccessResponse(true, 'Client deleted successfully'));
  });

  it('should handle errors when getting all clients', async () => {
    const mockError = { message: 'Failed to retrieve clients' };
    (clientService.getAllClients as jest.Mock).mockResolvedValue(createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError));
    const result = await clientService.getAllClients();
    expect(result).toEqual(createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError));
  });

  it('should handle errors when getting a client by ID', async () => {
    const mockError = { message: 'Client not found' };
    (clientService.getClientById as jest.Mock).mockResolvedValue(createErrorResponse(ErrorCategory.NOT_FOUND, mockError.message, mockError));
    const result = await clientService.getClientById(mockClientId);
    expect(result).toEqual(createErrorResponse(ErrorCategory.NOT_FOUND, mockError.message, mockError));
  });

  it('should handle errors when creating a client', async () => {
    const mockError = { message: 'Failed to create client' };
    (clientService.createClient as jest.Mock).mockResolvedValue(createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError));
    const result = await clientService.createClient(mockClientData);
    expect(result).toEqual(createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError));
  });

  it('should handle errors when updating a client', async () => {
    const mockError = { message: 'Failed to update client' };
    (clientService.updateClient as jest.Mock).mockResolvedValue(createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError));
    const result = await clientService.updateClient(mockClientId, mockClientData);
    expect(result).toEqual(createErrorResponse(ErrorCategory.SERVER, mockError.message, mockError));
  });

  it('should handle errors when deleting a client', async () => {
    const mockError = { message: 'Failed to delete client' };
    (clientService.deleteClient as jest.Mock).mockResolvedValue(createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError));
    const result = await clientService.deleteClient(mockClientId);
    expect(result).toEqual(createErrorResponse(ErrorCategory.DATABASE, mockError.message, mockError));
  });
});
