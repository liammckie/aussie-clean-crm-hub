
import { ContractData } from '@/types/contract-types';
import type { ContractCreateData } from '@/types/contract-types';
import { ApiResponse } from '@/types/api-response';
import * as api from './api';

/**
 * Contract service implementation
 */
export const contractService = {
  /**
   * Get all contracts
   */
  getAllContracts: async (): Promise<ApiResponse<ContractData[]>> => {
    return api.getAllContracts();
  },

  /**
   * Get contracts for a specific client
   */
  getClientContracts: async (clientId: string): Promise<ApiResponse<ContractData[]>> => {
    return api.getClientContracts(clientId);
  },

  /**
   * Get a contract by ID
   */
  getContractById: async (contractId: string): Promise<ApiResponse<ContractData>> => {
    return api.getContractById(contractId);
  },

  /**
   * Create a new contract
   */
  createContract: async (contractData: ContractCreateData): Promise<ApiResponse<ContractData>> => {
    return api.createContract(contractData);
  },

  /**
   * Update an existing contract
   */
  updateContract: async (contractId: string, updateData: Partial<ContractData>): Promise<ApiResponse<ContractData>> => {
    return api.updateContract(contractId, updateData);
  },

  /**
   * Delete a contract
   */
  deleteContract: async (contractId: string): Promise<ApiResponse<boolean>> => {
    return api.deleteContract(contractId);
  },

  /**
   * Get billing lines for a contract
   */
  getContractBillingLines: async (contractId: string): Promise<ApiResponse<any[]>> => {
    return api.getContractBillingLines(contractId);
  },

  /**
   * Create billing line for a contract
   */
  createBillingLine: async (contractId: string, billingLineData: any): Promise<ApiResponse<any>> => {
    return api.createBillingLine(contractId, billingLineData);
  },

  /**
   * Update billing line
   */
  updateBillingLine: async (billingLineId: string, updateData: any): Promise<ApiResponse<any>> => {
    return api.updateBillingLine(billingLineId, updateData);
  },

  /**
   * Delete billing line
   */
  deleteBillingLine: async (billingLineId: string): Promise<ApiResponse<boolean>> => {
    return api.deleteBillingLine(billingLineId);
  },

  /**
   * Get budget items for a contract
   */
  getContractBudgets: async (contractId: string): Promise<ApiResponse<any[]>> => {
    return api.getContractBudgets(contractId);
  },

  /**
   * Create budget item for a contract
   */
  createContractBudget: async (contractId: string, budgetData: any): Promise<ApiResponse<any>> => {
    return api.createContractBudget(contractId, budgetData);
  },

  /**
   * Update budget item
   */
  updateContractBudget: async (budgetId: string, updateData: any): Promise<ApiResponse<any>> => {
    return api.updateContractBudget(budgetId, updateData);
  },

  /**
   * Delete budget item
   */
  deleteContractBudget: async (budgetId: string): Promise<ApiResponse<boolean>> => {
    return api.deleteContractBudget(budgetId);
  }
};

export default contractService;
