
import * as queries from './queries';
import * as mutations from './mutations';

// Re-export all query and mutation functions
export const getContractsBySupplier = queries.getContractsBySupplier;
export const getSuppliersByContract = queries.getSuppliersByContract;
export const assignSupplierToContract = mutations.assignSupplierToContract;
export const removeSupplierFromContract = mutations.removeSupplierFromContract;

// Re-export any utility functions
export * from '@/utils/api-utils';
