
import * as contractApi from './api';
import { ContractData, BillingLineData, ContractBudgetData, ContractCreateData } from '@/types/contract-types';

/**
 * Service wrapper for contract-related operations
 */
export const contractService = {
  /**
   * Get all contracts
   */
  getAllContracts: async () => {
    return contractApi.getAllContracts();
  },

  /**
   * Get contracts for a specific client
   */
  getClientContracts: async (clientId: string) => {
    return contractApi.getClientContracts(clientId);
  },

  /**
   * Get a contract by ID
   */
  getContractById: async (contractId: string) => {
    return contractApi.getContractById(contractId);
  },

  /**
   * Create a new contract
   */
  createContract: async (contractData: ContractCreateData) => {
    return contractApi.createContract(contractData);
  },

  /**
   * Update an existing contract
   */
  updateContract: async (contractId: string, contractData: Partial<ContractData>) => {
    return contractApi.updateContract(contractId, contractData);
  },

  /**
   * Delete a contract
   */
  deleteContract: async (contractId: string) => {
    return contractApi.deleteContract(contractId);
  },

  /**
   * Get billing lines for a contract
   */
  getContractBillingLines: async (contractId: string) => {
    return contractApi.getContractBillingLines(contractId);
  },

  /**
   * Create a new billing line
   */
  createBillingLine: async (billingData: Omit<BillingLineData, 'id' | 'created_at' | 'updated_at'>) => {
    return contractApi.createBillingLine(billingData);
  },

  /**
   * Update an existing billing line
   */
  updateBillingLine: async (lineId: string, billingData: Partial<BillingLineData>) => {
    return contractApi.updateBillingLine(lineId, billingData);
  },

  /**
   * Delete a billing line
   */
  deleteBillingLine: async (lineId: string) => {
    return contractApi.deleteBillingLine(lineId);
  },

  /**
   * Get contract budget entries
   */
  getContractBudgets: async (contractId: string) => {
    return contractApi.getContractBudgets(contractId);
  },

  /**
   * Create a new contract budget entry
   */
  createContractBudget: async (budgetData: Omit<ContractBudgetData, 'id' | 'created_at' | 'updated_at'>) => {
    return contractApi.createContractBudget(budgetData);
  },

  /**
   * Update an existing contract budget entry
   */
  updateContractBudget: async (budgetId: string, budgetData: Partial<ContractBudgetData>) => {
    return contractApi.updateContractBudget(budgetId, budgetData);
  },

  /**
   * Delete a contract budget entry
   */
  deleteContractBudget: async (budgetId: string) => {
    return contractApi.deleteContractBudget(budgetId);
  }
};
