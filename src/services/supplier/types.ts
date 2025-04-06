
import { ComplianceDocument, SupplierData } from '@/types/supplier-types';

// Success response for a single supplier
export interface SupplierSuccessResponse {
  data: SupplierData;
  message: string;
}

// Success response for multiple suppliers
export interface SuppliersSuccessResponse {
  data: SupplierData[];
  message: string;
}

// Success response for compliance documents
export interface ComplianceDocumentsSuccessResponse {
  data: ComplianceDocument[];
  message: string;
}

// Success response for a single compliance document
export interface ComplianceDocumentSuccessResponse {
  data: ComplianceDocument;
  message: string;
}

// Error response
export interface SupplierErrorResponse {
  category: 'validation' | 'not_found' | 'permission' | 'server';
  message: string;
  details?: any;
}

// Union type for all supplier API responses
export type SupplierApiResponse = SupplierSuccessResponse | SupplierErrorResponse;
export type SuppliersApiResponse = SuppliersSuccessResponse | SupplierErrorResponse;
export type ComplianceDocumentsApiResponse = ComplianceDocumentsSuccessResponse | SupplierErrorResponse;
export type ComplianceDocumentApiResponse = ComplianceDocumentSuccessResponse | SupplierErrorResponse;
