
import { describe, expect, it, jest } from '@jest/globals';
import { contractService } from '../../services/contract';
import { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/types/api-response';
import { ErrorCategory } from '@/utils/logging/error-types';

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

// Define a proper ContractData type for tests
interface ContractData {
  contract_name: string;
  client_id?: string;
  client_name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  contract_value?: number;
  created_at?: string;
  updated_at?: string;
  id?: string;
  notes?: string;
  [key: string]: any; // Allow additional fields
}

jest.mock('../../services/contract/api', () => ({
  contractApi: {
    fetchAllContracts: jest.fn(),
    fetchContractById: jest.fn(),
    createContract: jest.fn(),
    updateContract: jest.fn(),
    deleteContract: jest.fn()
  }
}));

describe('Contract Service', () => {
  const mockContractData: ContractData = {
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z',
    id: 'test-contract-id',
    contract_name: 'Test Contract', // Required field
    client_id: 'test-client-id',
    client_name: 'Test Client',
    start_date: '2023-06-01',
    end_date: '2024-06-01',
    status: 'active',
    contract_value: 10000
  };
  
  const mockContractId = 'test-contract-id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get all contracts', async () => {
    const mockResponse = createSuccessResponse([mockContractData], 'Contracts retrieved successfully');
    jest.spyOn(contractService, 'getAllContracts').mockResolvedValue(mockResponse);
    
    const result = await contractService.getAllContracts();
    expect(contractService.getAllContracts).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should successfully get a contract by ID', async () => {
    const mockResponse = createSuccessResponse(mockContractData, 'Contract retrieved successfully');
    jest.spyOn(contractService, 'getContractById').mockResolvedValue(mockResponse);
    
    const result = await contractService.getContractById(mockContractId);
    expect(contractService.getContractById).toHaveBeenCalledWith(mockContractId);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully create a new contract', async () => {
    const mockResponse = createSuccessResponse(mockContractData, 'Contract created successfully');
    jest.spyOn(contractService, 'createContract').mockResolvedValue(mockResponse);
    
    const result = await contractService.createContract(mockContractData);
    expect(contractService.createContract).toHaveBeenCalledWith(mockContractData);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully update an existing contract', async () => {
    const mockResponse = createSuccessResponse(mockContractData, 'Contract updated successfully');
    jest.spyOn(contractService, 'updateContract').mockResolvedValue(mockResponse);
    
    const result = await contractService.updateContract(mockContractId, mockContractData);
    expect(contractService.updateContract).toHaveBeenCalledWith(mockContractId, mockContractData);
    expect(result).toEqual(mockResponse);
  });

  it('should successfully delete a contract', async () => {
    const mockResponse = createSuccessResponse({ success: true }, 'Contract deleted successfully');
    jest.spyOn(contractService, 'deleteContract').mockResolvedValue(mockResponse);
    
    const result = await contractService.deleteContract(mockContractId);
    expect(contractService.deleteContract).toHaveBeenCalledWith(mockContractId);
    expect(result).toEqual(mockResponse);
  });

  it('should handle validation errors', async () => {
    const mockError = { message: 'Validation failed' };
    const errorResponse = createErrorResponse(ErrorCategory.VALIDATION, mockError.message, mockError);
    jest.spyOn(contractService, 'createContract').mockResolvedValue(errorResponse);
    
    const result = await contractService.createContract(mockContractData);
    expect(result).toEqual(errorResponse);
  });
});
