
# Database Schema Index

This document serves as a master reference for all database tables and their relationships in our application. It is regularly updated to prevent schema drift and ensure documentation stays in sync with the actual database structure.

## Table of Contents

1. [Core Entities](#core-entities)
2. [Client Management](#client-management)
3. [Site Management](#site-management)
4. [Contract Management](#contract-management)
5. [Supplier Management](#supplier-management)
6. [Work Order Management](#work-order-management)
7. [Financial Records](#financial-records)
8. [Unified Data Models](#unified-data-models)
9. [System Tables](#system-tables)

## Core Entities

These are the primary entities in our data model:

| Table Name | Description | Key Relationships |
|------------|-------------|-------------------|
| `clients` | Stores client business information | sites, contracts, client_addresses, client_contacts |
| `sites` | Physical locations where services are performed | clients, contracts (via contract_sites) |
| `contracts` | Service agreements with clients | clients, sites, suppliers (via supplier_contract) |
| `suppliers` | Service providers and contractors | contracts, work_orders |
| `work_orders` | Specific service tasks | contracts, sites, clients, suppliers |

## Client Management

| Table Name | Description | Primary Key | Foreign Keys |
|------------|-------------|-------------|-------------|
| `clients` | Main client records | id (uuid) | supplier_id, account_manager_id |
| `client_addresses` | Client location information | id (uuid) | client_id |
| `client_contacts` | Client contact persons | id (uuid) | client_id |

## Site Management

| Table Name | Description | Primary Key | Foreign Keys |
|------------|-------------|-------------|-------------|
| `sites` | Service locations | id (uuid) | client_id, supplier_id, area_manager_id, default_calendar_id |

## Contract Management

| Table Name | Description | Primary Key | Foreign Keys |
|------------|-------------|-------------|-------------|
| `contracts` | Service agreements | contract_id (uuid) | client_id, supplier_id, primary_manager_id |
| `contract_sites` | Links contracts to sites | id (uuid) | contract_id, site_id |
| `contract_budget` | Budget allocations | id (uuid) | contract_id, contractor_id |
| `billing_line` | Contract service line items | id (uuid) | client_id, contract_id, site_id |
| `supplier_contract` | Links suppliers to contracts | link_id (uuid) | supplier_id, contract_id |

## Supplier Management

| Table Name | Description | Primary Key | Foreign Keys |
|------------|-------------|-------------|-------------|
| `suppliers` | Contractor/vendor information | id (uuid) | - |
| `supplier_compliance_documents` | Compliance records | id (uuid) | supplier_id |
| `supplier_services` | Services offered by suppliers | id (uuid) | supplier_id |

## Work Order Management

| Table Name | Description | Primary Key | Foreign Keys |
|------------|-------------|-------------|-------------|
| `work_orders` | Service task records | id (uuid) | client_id, site_id, contract_id, supplier_id |
| `work_order_tasks` | Sub-tasks for work orders | id (uuid) | work_order_id, supplier_id, completed_by |
| `workbills` | Financial records for work | id (uuid) | work_order_id, supplier_id, site_id |

## Financial Records

| Table Name | Description | Primary Key | Foreign Keys |
|------------|-------------|-------------|-------------|
| `invoices` | Client invoicing | id (uuid) | client_id, site_id |
| `payments` | Payment records | id (uuid) | invoice_id |
| `contract_financial_entries` | Contract-related finances | id (uuid) | contract_id |

## Unified Data Models

| Table Name | Description | Primary Key | Foreign Keys |
|------------|-------------|-------------|-------------|
| `unified_addresses` | Centralized address storage | id (uuid) | entity_id |
| `unified_contacts` | Centralized contact storage | id (uuid) | entity_id |

## System Tables

| Table Name | Description | Primary Key |
|------------|-------------|-------------|
| `audit_logs` | System audit trail | id (uuid) |
| `error_logs` | Error tracking | id (uuid) |

## Database Functions

| Function Name | Purpose |
|---------------|---------|
| `validate_client_contact_info()` | Validates contact information format |
| `recalculate_contract_totals()` | Updates contract financial totals |
| `maintain_contact_name()` | Keeps contact names consistent |
| `log_audit()` | Records system audit events |

## Enum Types

| Type Name | Values |
|-----------|--------|
| `client_status` | Prospect, Active, Inactive, Archived, Lead |
| `site_status` | pending_activation, active, inactive, suspended, archived |
| `site_type` | commercial, residential, industrial, retail, healthcare, etc. |
| `entity_type` | client, contact, site, supplier, contract, work_order, etc. |
| `contact_type` | primary, billing, technical, operations, sales, etc. |
| `address_type` | billing, physical, postal, site, shipping, etc. |

## Recent Changes

| Date | Table | Change Type | Description |
|------|-------|-------------|-------------|
| 2025-04-08 | clients | Added | Added phone and address columns |
| 2025-04-08 | sites | Added | Added description column |
| 2025-04-06 | work_orders | Added | New table for tracking operational tasks |
| 2025-04-06 | workbills | Added | New table for financial tracking |
| 2025-04-06 | work_order_tasks | Added | New table for task breakdown |
| 2025-04-05 | sites | Modified | Added access_instructions and emergency_instructions |
| 2025-04-05 | contracts | Modified | Added new financial tracking fields |

## SQL Schema Validation

To ensure your local development environment matches the production schema, run:

```sql
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
```

This document is maintained as part of the development process. Always update it when making schema changes.

