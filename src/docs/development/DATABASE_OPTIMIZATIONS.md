
# Database Optimizations

This document outlines database optimization strategies and identified issues that need to be addressed for improved performance.

## Current Issues

### 1. Unindexed Foreign Keys

Several foreign keys in our database don't have covering indexes, which can lead to performance issues, especially as the database grows:

| Table | Foreign Key | Column |
|-------|-------------|--------|
| public.client_addresses | client_addresses_client_id_fkey | client_id |
| public.contract_financial_entries | contract_financial_entries_contract_id_fkey | contract_id |
| public.supplier_compliance_documents | supplier_compliance_documents_supplier_id_fkey | supplier_id |

**Impact**: Queries that join these tables or filter by these foreign key columns will perform slower without proper indexing.

### 2. Unused Indexes

The following indexes have been created but are currently not being used:

| Table | Index | 
|-------|-------|
| public.clients | idx_clients_status |
| public.sites | idx_sites_client_id |
| public.contracts | idx_contracts_client_id |
| public.contract_sites | idx_contract_sites_contract_id |
| public.contract_sites | idx_contract_sites_site_id |
| public.unified_addresses | idx_unified_addresses_entity_id |

**Impact**: Unused indexes consume disk space and can slow down write operations without providing any read performance benefits.

## Recommended Actions

### 1. Add Missing Indexes for Foreign Keys

```sql
-- Add missing index for client_addresses.client_id
CREATE INDEX IF NOT EXISTS idx_client_addresses_client_id ON public.client_addresses(client_id);

-- Add missing index for contract_financial_entries.contract_id
CREATE INDEX IF NOT EXISTS idx_contract_financial_entries_contract_id ON public.contract_financial_entries(contract_id);

-- Add missing index for supplier_compliance_documents.supplier_id
CREATE INDEX IF NOT EXISTS idx_supplier_compliance_documents_supplier_id ON public.supplier_compliance_documents(supplier_id);
```

### 2. Review Unused Indexes

Before dropping unused indexes, we should:

1. Monitor the application under typical loads to see if these indexes become utilized
2. Analyze query patterns to understand why they're not being used
3. Consider dropping them if they remain unused after sufficient observation

```sql
-- If confirmed unnecessary, these indexes can be dropped with:
-- DROP INDEX IF EXISTS public.idx_clients_status;
-- DROP INDEX IF EXISTS public.idx_sites_client_id;
-- DROP INDEX IF EXISTS public.idx_contracts_client_id;
-- DROP INDEX IF EXISTS public.idx_contract_sites_contract_id;
-- DROP INDEX IF EXISTS public.idx_contract_sites_site_id;
-- DROP INDEX IF EXISTS public.idx_unified_addresses_entity_id;
```

**Note**: Only drop these indexes after confirming they aren't needed by any application functionality, especially for operations performed less frequently.

## Implementation Plan

1. Add the missing indexes first to ensure all foreign keys are properly indexed
2. Monitor database performance after adding these indexes
3. Review the application usage patterns and query performance to determine if the unused indexes should be kept or dropped

## Regular Maintenance

Schedule regular database maintenance tasks:

- Review index usage statistics quarterly
- Analyze query performance and add new indexes as needed
- Run database VACUUM operations to reclaim disk space
- Update statistics to help the query planner choose optimal execution plans

This database optimization strategy should be part of our regular maintenance process to ensure continued performance as the application grows.
