
import { z } from 'zod';

/**
 * Schema for linking suppliers to contracts
 */
export const supplierContractLinkSchema = z.object({
  link_id: z.string(),
  supplier_id: z.string(),
  contract_id: z.string(),
  assigned_at: z.string().optional(),
  assigned_by: z.string().optional(),
  role: z.enum(['primary', 'secondary', 'subcontractor']),
  status: z.enum(['active', 'inactive', 'pending', 'terminated']),
  services: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional()
});

/**
 * Type definition for the supplier-contract link directly mapped from database schema
 */
export type SupplierContractLink = z.infer<typeof supplierContractLinkSchema> & {
  created_at?: string;
  updated_at?: string;
};

/**
 * Type for contract information returned with supplier
 */
export interface ContractWithSupplier {
  link_id: string;
  role: string;
  status: string;
  services?: string;
  percentage?: number;
  assigned_at?: string;
  contracts: {
    id: string;
    contract_name: string;
    contract_code: string;
    status: string;
    total_annual_value: number;
    client_id?: string;
  };
}

/**
 * Type for supplier information returned with contract
 * 
 * Note: The `suppliers` field is an array because the Supabase join query 
 * returns supplier data as an array of objects, even when there's just one supplier
 */
export interface SupplierWithContract {
  link_id: string;
  role: string;
  status: string;
  services?: string;
  percentage?: number;
  assigned_at?: string;
  suppliers: Array<{
    supplier_id: string;
    supplier_name: string;
    supplier_type: string;
    status: string;
    abn?: string;
  }>;
}

/**
 * Schema for assigning a supplier to a contract
 */
export const assignSupplierToContractSchema = z.object({
  supplier_id: z.string(),
  contract_id: z.string(),
  role: z.enum(['primary', 'secondary', 'subcontractor']),
  status: z.enum(['active', 'inactive', 'pending', 'terminated']),
  services: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional()
});

export type AssignSupplierToContractData = z.infer<typeof assignSupplierToContractSchema>;

/**
 * Database schema for supplier_contract table
 * Maps directly to the database structure
 */
export interface SupplierContract {
  link_id: string;         // uuid PRIMARY KEY
  supplier_id: string;     // uuid REFERENCES suppliers(id)
  contract_id: string;     // uuid REFERENCES contracts(id)
  role: string;            // text
  status: string;          // text
  services?: string;       // text
  percentage?: number;     // integer
  assigned_at?: string;    // timestamp with time zone
  assigned_by?: string;    // uuid
  notes?: string;          // text
  created_at?: string;     // timestamp with time zone 
  updated_at?: string;     // timestamp with time zone
}
