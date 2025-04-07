
import { contractService } from '@/services/contract/service';
import * as contractApi from '@/services/contract/api';
import { ContractData } from '@/types/contract-types';
import { ApiResponse } from '@/types/api-response';

// Mock the contract API
jest.mock('@/services/contract/api');

describe('Contract Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockContract: Partial<ContractData> = {
    contract_name: 'Test Contract',
    contract_code: 'TEST-001',
    client_id: '123e4567-e89b-12d3-a456-426614174000',
    service_type: 'commercial_cleaning',
    status: 'draft',
    start_date: '2025-01-01',
    is_ongoing: false
  };

  const mockContractResponse = {
    data: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      ...mockContract,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  test('getAllContracts - success case', async () => {
    // Type the mock response
    const apiResponse: ApiResponse<ContractData[]> = { 
      data: [mockContractResponse.data], 
      message: 'Contracts retrieved successfully' 
    };
    
    // Use typed mock function
    (contractApi as any).getAllContracts = jest.fn().mockResolvedValueOnce(apiResponse);

    const result = await contractService.getAllContracts();

    expect((contractApi as any).getAllContracts).toHaveBeenCalled();
    expect(result).toEqual(apiResponse);
  });

  test('getClientContracts - success case', async () => {
    // Type the mock response
    const apiResponse: ApiResponse<ContractData[]> = { 
      data: [mockContractResponse.data],
      message: 'Client contracts retrieved successfully'
    };
    
    // Use typed mock function
    (contractApi as any).getClientContracts = jest.fn().mockResolvedValueOnce(apiResponse);

    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    const result = await contractService.getClientContracts(clientId);

    expect((contractApi as any).getClientContracts).toHaveBeenCalledWith(clientId);
    expect(result).toEqual(apiResponse);
  });

  test('getContractById - success case', async () => {
    // Type the mock response
    const apiResponse: ApiResponse<ContractData> = { 
      data: mockContractResponse.data,
      message: 'Contract retrieved successfully'
    };
    
    // Use typed mock function
    (contractApi as any).getContractById = jest.fn().mockResolvedValueOnce(apiResponse);

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    const result = await contractService.getContractById(contractId);

    expect((contractApi as any).getContractById).toHaveBeenCalledWith(contractId);
    expect(result).toEqual(apiResponse);
  });

  test('createContract - success case', async () => {
    // Type the mock response
    const apiResponse: ApiResponse<ContractData> = { 
      data: mockContractResponse.data,
      message: 'Contract created successfully'
    };
    
    // Use typed mock function
    (contractApi as any).createContract = jest.fn().mockResolvedValueOnce(apiResponse);
    
    const result = await contractService.createContract(mockContract);

    expect((contractApi as any).createContract).toHaveBeenCalledWith(mockContract);
    expect(result).toEqual(apiResponse);
  });

  test('updateContract - success case', async () => {
    // Type the mock response
    const apiResponse: ApiResponse<ContractData> = { 
      data: mockContractResponse.data,
      message: 'Contract updated successfully'
    };
    
    // Use typed mock function
    (contractApi as any).updateContract = jest.fn().mockResolvedValueOnce(apiResponse);

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    const updateData = { contract_name: 'Updated Contract Name' };
    
    const result = await contractService.updateContract(contractId, updateData);

    expect((contractApi as any).updateContract).toHaveBeenCalledWith(contractId, updateData);
    expect(result).toEqual(apiResponse);
  });

  test('deleteContract - success case', async () => {
    // Type the mock response
    const apiResponse: ApiResponse<boolean> = { 
      data: true,
      message: 'Contract deleted successfully'
    };
    
    // Use typed mock function
    (contractApi as any).deleteContract = jest.fn().mockResolvedValueOnce(apiResponse);

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    
    const result = await contractService.deleteContract(contractId);

    expect((contractApi as any).deleteContract).toHaveBeenCalledWith(contractId);
    expect(result).toEqual(apiResponse);
  });

  test('getContractBillingLines - success case', async () => {
    // Type the mock response with billing lines
    const mockBillingLines = [
      { id: 'line1', description: 'Regular Cleaning', client_charge: 1000 }
    ];
    
    const apiResponse: ApiResponse<any[]> = {
      data: mockBillingLines,
      message: 'Contract billing lines retrieved successfully'
    };
    
    // Use typed mock function
    (contractApi as any).getContractBillingLines = jest.fn().mockResolvedValueOnce(apiResponse);

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    const result = await contractService.getContractBillingLines(contractId);

    expect((contractApi as any).getContractBillingLines).toHaveBeenCalledWith(contractId);
    expect(result).toEqual(apiResponse);
  });

  test('createContract - error case with validation failure', async () => {
    // Type the mock error response
    const errorResponse: ApiResponse<never> = {
      category: 'validation',
      message: 'Contract code must be unique',
      details: { field: 'contract_code' }
    };
    
    // Use typed mock function
    (contractApi as any).createContract = jest.fn().mockResolvedValueOnce(errorResponse);

    const result = await contractService.createContract(mockContract);

    expect((contractApi as any).createContract).toHaveBeenCalledWith(mockContract);
    expect(result).toEqual(errorResponse);
  });
});
