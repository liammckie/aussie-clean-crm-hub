
import { ContractData } from '@/types/contract-types';
import type { ContractCreateData } from '@/types/contract-types';
import { ApiResponse } from '@/types/api-response';
import * as contractApi from './api';

/**
 * Contract service implementation
 */
export const contractService = {
  /**
   * Get all contracts
   */
  getAllContracts: async (): Promise<ApiResponse<ContractData[]>> => {
    return (contractApi as any).getAllContracts();
  },

  /**
   * Get contracts for a specific client
   */
  getClientContracts: async (clientId: string): Promise<ApiResponse<ContractData[]>> => {
    return (contractApi as any).getClientContracts(clientId);
  },

  /**
   * Get a contract by ID
   */
  getContractById: async (contractId: string): Promise<ApiResponse<ContractData>> => {
    return (contractApi as any).getContractById(contractId);
  },

  /**
   * Create a new contract
   */
  createContract: async (contractData: ContractCreateData): Promise<ApiResponse<ContractData>> => {
    return (contractApi as any).createContract(contractData);
  },

  /**
   * Update an existing contract
   */
  updateContract: async (contractId: string, updateData: Partial<ContractData>): Promise<ApiResponse<ContractData>> => {
    return (contractApi as any).updateContract(contractId, updateData);
  },

  /**
   * Delete a contract
   */
  deleteContract: async (contractId: string): Promise<ApiResponse<boolean>> => {
    return (contractApi as any).deleteContract(contractId);
  },

  /**
   * Get billing lines for a contract
   */
  getContractBillingLines: async (contractId: string): Promise<ApiResponse<any[]>> => {
    return (contractApi as any).getContractBillingLines(contractId);
  },

  /**
   * Create billing line for a contract
   */
  createBillingLine: async (contractId: string, billingLineData: any): Promise<ApiResponse<any>> => {
    return (contractApi as any).createBillingLine(contractId, billingLineData);
  },

  /**
   * Update billing line
   */
  updateBillingLine: async (billingLineId: string, updateData: any): Promise<ApiResponse<any>> => {
    return (contractApi as any).updateBillingLine(billingLineId, updateData);
  },

  /**
   * Delete billing line
   */
  deleteBillingLine: async (billingLineId: string): Promise<ApiResponse<boolean>> => {
    return (contractApi as any).deleteBillingLine(billingLineId);
  },

  /**
   * Get budget items for a contract
   */
  getContractBudgets: async (contractId: string): Promise<ApiResponse<any[]>> => {
    return (contractApi as any).getContractBudgets(contractId);
  },

  /**
   * Create budget item for a contract
   */
  createContractBudget: async (contractId: string, budgetData: any): Promise<ApiResponse<any>> => {
    return (contractApi as any).createContractBudget(contractId, budgetData);
  },

  /**
   * Update budget item
   */
  updateContractBudget: async (budgetId: string, updateData: any): Promise<ApiResponse<any>> => {
    return (contractApi as any).updateContractBudget(budgetId, updateData);
  },

  /**
   * Delete budget item
   */
  deleteContractBudget: async (budgetId: string): Promise<ApiResponse<boolean>> => {
    return (contractApi as any).deleteContractBudget(budgetId);
  }
};

export default contractService;
