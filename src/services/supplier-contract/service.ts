
import * as api from './api';
import { AssignSupplierToContractData } from '@/types/supplier-contract-types';

/**
 * Service for managing the relationship between suppliers and contracts
 */
export const supplierContractService = {
  /**
   * Get contracts associated with a supplier
   */
  getContractsBySupplier: (supplierId: string) => {
    return api.getContractsBySupplier(supplierId);
  },
  
  /**
   * Get suppliers associated with a contract
   */
  getSuppliersByContract: (contractId: string) => {
    return api.getSuppliersByContract(contractId);
  },
  
  /**
   * Assign a supplier to a contract
   */
  assignSupplierToContract: (linkData: AssignSupplierToContractData) => {
    return api.assignSupplierToContract(linkData);
  },
  
  /**
   * Remove a supplier from a contract
   */
  removeSupplierFromContract: (supplierId: string, contractId: string) => {
    return api.removeSupplierFromContract(supplierId, contractId);
  }
};
