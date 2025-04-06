
import type { SupplierData, SupplierCreateData, ComplianceDocument, QAScore } from '@/types/supplier-types';

// Response types
export type SupplierResponse = {
  data: SupplierData;
  message: string;
};

export type SuppliersResponse = {
  data: SupplierData[];
  message: string;
};

// Error response type
export type SupplierErrorResponse = {
  category: 'validation' | 'permission' | 'not_found' | 'server';
  message: string;
  details?: any;
};

// Combined response types
export type SupplierApiResponse = SupplierResponse | SupplierErrorResponse;
export type SuppliersApiResponse = SuppliersResponse | SupplierErrorResponse;

// Document response types
export type ComplianceDocumentResponse = {
  data: ComplianceDocument;
  message: string;
};

export type ComplianceDocumentsResponse = {
  data: ComplianceDocument[];
  message: string;
};

// Combined document response types
export type ComplianceDocumentApiResponse = ComplianceDocumentResponse | SupplierErrorResponse;
export type ComplianceDocumentsApiResponse = ComplianceDocumentsResponse | SupplierErrorResponse;
