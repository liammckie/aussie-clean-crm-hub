
import { ApiResponse } from '@/types/api-response';
import { ComplianceDocument, SupplierData } from '@/types/supplier-types';

// Define specialized response types
export type SupplierApiResponse = ApiResponse<SupplierData>;
export type SuppliersApiResponse = ApiResponse<SupplierData[]>;
export type ComplianceDocumentApiResponse = ApiResponse<ComplianceDocument>;
export type ComplianceDocumentsApiResponse = ApiResponse<ComplianceDocument[]>;
