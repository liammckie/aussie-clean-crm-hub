
import * as supplierApi from './api';
import { 
  SupplierData, 
  SupplierDocumentData, 
  SupplierServiceData, 
  SupplierCreateData 
} from './types';

/**
 * Service wrapper for supplier-related operations
 */
export const supplierService = {
  /**
   * Get all suppliers
   */
  getAllSuppliers: async () => {
    return supplierApi.getAllSuppliers();
  },

  /**
   * Get a supplier by ID
   */
  getSupplierById: async (supplierId: string) => {
    return supplierApi.getSupplierById(supplierId);
  },

  /**
   * Create a new supplier
   */
  createSupplier: async (supplierData: SupplierCreateData) => {
    return supplierApi.createSupplier(supplierData);
  },

  /**
   * Update an existing supplier
   */
  updateSupplier: async (supplierId: string, supplierData: Partial<SupplierData>) => {
    return supplierApi.updateSupplier(supplierId, supplierData);
  },

  /**
   * Delete a supplier
   */
  deleteSupplier: async (supplierId: string) => {
    return supplierApi.deleteSupplier(supplierId);
  },

  /**
   * Get compliance documents for a supplier
   */
  getSupplierDocuments: async (supplierId: string) => {
    return supplierApi.getSupplierDocuments(supplierId);
  },

  /**
   * Create a new supplier document
   */
  createSupplierDocument: async (documentData: Omit<SupplierDocumentData, 'id' | 'created_at' | 'updated_at'>) => {
    return supplierApi.createSupplierDocument(documentData);
  },

  /**
   * Update an existing supplier document
   */
  updateSupplierDocument: async (documentId: string, documentData: Partial<SupplierDocumentData>) => {
    return supplierApi.updateSupplierDocument(documentId, documentData);
  },

  /**
   * Delete a supplier document
   */
  deleteSupplierDocument: async (documentId: string) => {
    return supplierApi.deleteSupplierDocument(documentId);
  },

  /**
   * Get services provided by a supplier
   */
  getSupplierServices: async (supplierId: string) => {
    return supplierApi.getSupplierServices(supplierId);
  },

  /**
   * Create a new supplier service
   */
  createSupplierService: async (serviceData: Omit<SupplierServiceData, 'id' | 'created_at'>) => {
    return supplierApi.createSupplierService(serviceData);
  },

  /**
   * Delete a supplier service
   */
  deleteSupplierService: async (serviceId: string) => {
    return supplierApi.deleteSupplierService(serviceId);
  },

  /**
   * Get all contracts associated with a supplier
   */
  getSupplierContracts: async (supplierId: string) => {
    return supplierApi.getSupplierContracts(supplierId);
  }
};
