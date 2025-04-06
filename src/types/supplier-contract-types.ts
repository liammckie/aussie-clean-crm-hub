
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
 * Type definition for the supplier-contract link
 */
export type SupplierContractLink = z.infer<typeof supplierContractLinkSchema> & {
  created_at?: string;
  updated_at?: string;
};

/**
 * Type for contract with supplier information
 */
export interface ContractWithSupplier {
  contract_id: string;
  contract_number: string;
  client_name: string;
  status: string;
  contract_value?: number;
  supplier_role: 'primary' | 'secondary' | 'subcontractor';
}

/**
 * Type for supplier with contract information
 */
export interface SupplierWithContracts {
  supplier_id: string;
  supplier_name: string;
  contracts: ContractWithSupplier[];
}

/**
 * Schema for assigning a supplier to a contract
 */
export const assignSupplierToContractSchema = z.object({
  supplier_id: z.string(),
  contract_id: z.string(),
  role: z.enum(['primary', 'secondary', 'subcontractor']),
  services: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional()
});

export type AssignSupplierToContractData = z.infer<typeof assignSupplierToContractSchema>;
