
import * as api from './api';
import type { 
  SupplierApiResponse, 
  SuppliersApiResponse,
  ComplianceDocumentsApiResponse,
  ComplianceDocumentApiResponse
} from './types';
import type { SupplierCreateData, SupplierData } from '@/types/supplier-types';

/**
 * Supplier service for interacting with the supplier API
 */
export const supplierService = {
  /**
   * Create a new supplier
   */
  createSupplier: (supplierData: SupplierCreateData): Promise<SupplierApiResponse> => {
    return api.createSupplier(supplierData);
  },
  
  /**
   * Get all suppliers
   */
  getAllSuppliers: (): Promise<SuppliersApiResponse> => {
    return api.getAllSuppliers();
  },
  
  /**
   * Get supplier by ID
   */
  getSupplierById: (supplierId: string): Promise<SupplierApiResponse> => {
    return api.getSupplierById(supplierId);
  },
  
  /**
   * Update supplier
   */
  updateSupplier: (supplierId: string, supplierData: Partial<SupplierData>): Promise<SupplierApiResponse> => {
    return api.updateSupplier(supplierId, supplierData);
  },
  
  /**
   * Delete supplier
   */
  deleteSupplier: (supplierId: string): Promise<SupplierApiResponse> => {
    return api.deleteSupplier(supplierId);
  },
  
  /**
   * Get compliance documents for supplier
   */
  getComplianceDocuments: (supplierId: string): Promise<ComplianceDocumentsApiResponse> => {
    return api.getComplianceDocuments(supplierId);
  }
};
