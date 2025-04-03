
# Schema Changelog

## Overview
This document tracks changes to the database schema of the Aussie Clean ERP system. It serves as a historical record of structural changes, helping developers understand when and why schema elements were modified.

## Change Log Format
Each change entry includes:
- **Date**: When the change was implemented
- **Change Type**: Addition, Modification, Deprecation, or Removal
- **Affected Tables/Columns**: Which database objects were affected
- **Description**: Details of what changed and why
- **Migration Scripts**: Reference to migration scripts (if applicable)
- **Backward Compatibility**: Notes on compatibility concerns
- **Developer**: Who implemented the change

## Recent Changes

### 2025-04-03: Client Contact Structure Enhancement

**Change Type**: Modification

**Affected Tables/Columns**: 
- `clients` table
- New `client_contacts` table

**Description**:  
Refactored client contact storage from a JSON field to a dedicated `client_contacts` table to improve querying and validation. This allows for better indexing, searching, and relationship management for client contacts.

**Migration Scripts**: `20250403_client_contacts_table.sql`

**Backward Compatibility**:  
API maintains backward compatibility through a data adapter that merges contact records into the previous format when returning client data. Legacy code using the JSON contact structure will continue to work until 2025-06-01.

**Developer**: Jane Smith

### 2025-04-01: Contract Financial Tracking Enhancement

**Change Type**: Addition

**Affected Tables/Columns**:
- `contracts` table (new columns)
- New `contract_financial_entries` table

**Description**:  
Added detailed financial tracking capabilities to the contract system:
1. Added `billing_cycle`, `payment_terms`, and `payment_method` columns to `contracts` table
2. Created new `contract_financial_entries` table to track individual financial transactions related to contracts
3. Added foreign key relationships to Xero invoice records

**Migration Scripts**: `20250401_contract_financials.sql`

**Backward Compatibility**:  
Fully backward compatible. Existing code will see null values for new columns until explicitly updated to use them.

**Developer**: Michael Johnson

### 2025-03-28: Site Geolocation Data

**Change Type**: Addition

**Affected Tables/Columns**:
- `sites` table (new columns)

**Description**:  
Added geolocation capabilities to site records:
1. Added `latitude` and `longitude` columns (DECIMAL type)
2. Added `geo_fence` column (POLYGON type) to define site boundaries
3. Added spatial index on location columns

**Migration Scripts**: `20250328_site_geolocation.sql`

**Backward Compatibility**:  
Fully backward compatible. New columns are nullable and have no constraints that would affect existing records.

**Developer**: Sarah Williams

### 2025-03-25: Supplier Entity Enhancement

**Change Type**: Modification and Addition

**Affected Tables/Columns**:
- Modified `suppliers` table
- New `supplier_services` table
- New `supplier_compliance_documents` table

**Description**:  
Enhanced the supplier data model to support better compliance tracking and service categorization:
1. Added compliance fields to `suppliers` table (`compliance_status`, `last_review_date`)
2. Created `supplier_services` junction table to track which services each supplier can provide
3. Created `supplier_compliance_documents` table to track insurance, certifications, etc.

**Migration Scripts**: `20250325_supplier_enhancements.sql`

**Backward Compatibility**:  
The changes maintain backward compatibility with existing code. Added columns are nullable with sensible defaults.

**Developer**: Robert Chen

### 2025-03-20: Audit Log Implementation

**Change Type**: Addition

**Affected Tables/Columns**:
- New `audit_logs` table
- Triggers on multiple tables

**Description**:  
Implemented comprehensive audit logging:
1. Created `audit_logs` table to track all data changes
2. Added database triggers on key tables (`clients`, `sites`, `contracts`, `users`)
3. Each trigger captures old and new values on update/delete operations
4. Log entries include timestamp, user ID, operation type, and changed data

**Migration Scripts**: `20250320_audit_logging.sql`

**Backward Compatibility**:  
This is an additive change with no impact on existing functionality. The triggers operate transparently to application code.

**Developer**: Lisa Patel

### 2025-03-15: Activity Feed Schema

**Change Type**: Addition

**Affected Tables/Columns**:
- New `activity_events` table
- New `user_activity_subscriptions` table

**Description**:  
Implemented schema for the activity feed system:
1. Created `activity_events` table for storing all system events
2. Created `user_activity_subscriptions` to manage user notification preferences
3. Added indexes for efficient filtering and retrieval
4. Established relationship model between events and entities

**Migration Scripts**: `20250315_activity_feed.sql`

**Backward Compatibility**:  
This is an additive change with no impact on existing schema elements.

**Developer**: David Wilson

## Planned Changes

### 2025-04-15: Contract Scheduling Enhancement (Planned)

**Change Type**: Addition

**Affected Tables/Columns**: 
- `contracts` table
- New `contract_schedule_patterns` table
- New `scheduled_services` table

**Description**:  
Planning to enhance the contract scheduling system to support more complex recurring patterns:
1. Create `contract_schedule_patterns` to define recurrence rules
2. Create `scheduled_services` to track individual service instances
3. Add integration with calendar systems

**Migration Plan**: Will require schema migration and data backfill for existing contracts

### 2025-05-01: Multi-Currency Support (Planned)

**Change Type**: Modification

**Affected Tables/Columns**:
- All tables with financial amounts
- New `currency_exchange_rates` table

**Description**:  
Planning to add multi-currency support throughout the system:
1. Update all money columns to include currency reference
2. Add currency conversion functionality
3. Implement exchange rate tracking

**Migration Plan**: Will require schema changes and data transformation

## Schema Version History

| Version | Date       | Major Changes                                 |
|---------|------------|----------------------------------------------|
| 3.0.0   | 2025-03-01 | Site management overhaul, contract enhancements |
| 2.5.0   | 2025-02-01 | Financial tracking system implementation      |
| 2.0.0   | 2025-01-15 | User permission system redesign               |
| 1.5.0   | 2024-12-01 | Client entity expansion                       |
| 1.0.0   | 2024-10-15 | Initial production schema                     |

## Schema Modification Guidelines

### Process for Schema Changes
1. Propose change with justification
2. Design review with database administrator
3. Create migration scripts with up/down methods
4. Test migration on staging environment
5. Apply change to production during maintenance window
6. Update this changelog
7. Update relevant documentation

### Naming Conventions
- Table names: Snake case, plural (e.g., `client_contacts`)
- Column names: Snake case, singular (e.g., `first_name`)
- Foreign keys: `<referenced_table_singular>_id` (e.g., `client_id`)
- Indexes: `idx_<table>_<column(s)>` (e.g., `idx_clients_abn`)
- Constraints: `<type>_<table>_<column(s)>` (e.g., `pk_clients_id`)

### Constraint Guidelines
- All tables must have a primary key
- Foreign keys should be indexed
- Use soft deletes (`deleted_at` timestamp) instead of row deletion
- Include audit columns (`created_at`, `updated_at`, `created_by`, `updated_by`)
