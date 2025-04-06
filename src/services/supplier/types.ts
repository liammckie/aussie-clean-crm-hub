
import { SupplierData, ComplianceDocument } from '@/types/supplier-types';

// Error response type
export type SupplierErrorResponse = {
  category: 'validation' | 'permission' | 'not_found' | 'server';
  message: string;
  details?: any;
};

// Success response type for a single supplier
export type SupplierSuccessResponse = {
  data: SupplierData;
  message: string;
};

// Success response type for multiple suppliers
export type SuppliersSuccessResponse = {
  data: SupplierData[];
  message: string;
};

// Combined response type for a single supplier
export type SupplierApiResponse = SupplierSuccessResponse | SupplierErrorResponse;

// Combined response type for multiple suppliers
export type SuppliersApiResponse = SuppliersSuccessResponse | SupplierErrorResponse;

// Success response type for compliance documents
export type ComplianceDocumentsSuccessResponse = {
  data: ComplianceDocument[];
  message: string;
};

// Success response type for a single compliance document
export type ComplianceDocumentSuccessResponse = {
  data: ComplianceDocument;
  message: string;
};

// Combined response type for compliance documents
export type ComplianceDocumentsApiResponse = ComplianceDocumentsSuccessResponse | SupplierErrorResponse;

// Combined response type for a single compliance document
export type ComplianceDocumentApiResponse = ComplianceDocumentSuccessResponse | SupplierErrorResponse;
