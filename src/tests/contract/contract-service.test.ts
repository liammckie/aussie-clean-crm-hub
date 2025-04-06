
import { contractService } from '@/services/contract/service';
import * as contractApi from '@/services/contract/api';
import { ContractCreateData } from '@/types/contract-types';

// Mock the contract API
jest.mock('@/services/contract/api');

describe('Contract Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockContract: ContractCreateData = {
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
    // Mock successful response
    (contractApi.getAllContracts as jest.Mock).mockResolvedValueOnce({ 
      data: [mockContractResponse.data]
    });

    const result = await contractService.getAllContracts();

    expect(contractApi.getAllContracts).toHaveBeenCalled();
    expect(result).toEqual({ data: [mockContractResponse.data] });
  });

  test('getClientContracts - success case', async () => {
    // Mock successful response
    (contractApi.getClientContracts as jest.Mock).mockResolvedValueOnce({ 
      data: [mockContractResponse.data]
    });

    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    const result = await contractService.getClientContracts(clientId);

    expect(contractApi.getClientContracts).toHaveBeenCalledWith(clientId);
    expect(result).toEqual({ data: [mockContractResponse.data] });
  });

  test('getContractById - success case', async () => {
    // Mock successful response
    (contractApi.getContractById as jest.Mock).mockResolvedValueOnce(mockContractResponse);

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    const result = await contractService.getContractById(contractId);

    expect(contractApi.getContractById).toHaveBeenCalledWith(contractId);
    expect(result).toEqual(mockContractResponse);
  });

  test('createContract - success case', async () => {
    // Mock successful response
    (contractApi.createContract as jest.Mock).mockResolvedValueOnce(mockContractResponse);
    
    const result = await contractService.createContract(mockContract);

    expect(contractApi.createContract).toHaveBeenCalledWith(mockContract);
    expect(result).toEqual(mockContractResponse);
  });

  test('updateContract - success case', async () => {
    // Mock successful response
    (contractApi.updateContract as jest.Mock).mockResolvedValueOnce(mockContractResponse);

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    const updateData = { contract_name: 'Updated Contract Name' };
    
    const result = await contractService.updateContract(contractId, updateData);

    expect(contractApi.updateContract).toHaveBeenCalledWith(contractId, updateData);
    expect(result).toEqual(mockContractResponse);
  });

  test('deleteContract - success case', async () => {
    // Mock successful response
    (contractApi.deleteContract as jest.Mock).mockResolvedValueOnce({ data: true });

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    
    const result = await contractService.deleteContract(contractId);

    expect(contractApi.deleteContract).toHaveBeenCalledWith(contractId);
    expect(result).toEqual({ data: true });
  });

  test('getContractBillingLines - success case', async () => {
    // Mock successful response
    const mockBillingLines = [
      { id: 'line1', description: 'Regular Cleaning', client_charge: 1000 }
    ];
    
    (contractApi.getContractBillingLines as jest.Mock).mockResolvedValueOnce({ 
      data: mockBillingLines
    });

    const contractId = '123e4567-e89b-12d3-a456-426614174002';
    const result = await contractService.getContractBillingLines(contractId);

    expect(contractApi.getContractBillingLines).toHaveBeenCalledWith(contractId);
    expect(result).toEqual({ data: mockBillingLines });
  });

  test('createContract - error case with validation failure', async () => {
    // Mock error response for validation failure
    const errorResponse = {
      category: 'validation',
      message: 'Contract code must be unique',
      details: { field: 'contract_code' }
    };
    
    (contractApi.createContract as jest.Mock).mockResolvedValueOnce(errorResponse);

    const result = await contractService.createContract(mockContract);

    expect(contractApi.createContract).toHaveBeenCalledWith(mockContract);
    expect(result).toEqual(errorResponse);
  });
});
