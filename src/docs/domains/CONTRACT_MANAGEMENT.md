
# Contract Management

## Overview
The Contract Management module is the central component of the Aussie Clean ERP system that governs all service agreements between the company and its clients. It manages the entire contract lifecycle from creation and activation through renewals, modifications, and eventual termination or expiry. The module integrates with quoting, billing, operations, and reporting to ensure seamless service delivery and financial management.

## Core Components
- Contract Creation and Management
- Contract Lifecycle Workflow
- Site-Specific Service Configuration
- Billing and Financial Integration
- CPI Escalation Management
- Contract Amendment and Versioning
- Document Attachments and Signatures

## Quick Links
- [Data Model](./contract/CONTRACT_DATA_MODEL.md)
- [Business Rules](./contract/BUSINESS_RULES.md)
- [UI Components](./contract/UI_COMPONENTS.md)
- [Integration Points](./contract/INTEGRATION_POINTS.md)
- [Reports & Analytics](./contract/REPORTS_ANALYTICS.md)

## Permission Model

| Role | Create | View | Edit | Approve | Terminate | Cancel |
|------|--------|------|------|---------|-----------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sales | ✅ | ✅ | ✅ (draft only) | ❌ | ❌ | ❌ |
| Operations | ❌ | ✅ | ✅ (scope, sites) | ✅ (renewals) | ❌ | ❌ |
| Finance | ❌ | ✅ | ✅ (billing only) | ✅ (pricing) | ✅ | ✅ |

## Future Enhancements
- Bulk renewals + global CPI re-index tool
- SLA threshold linkage for QA compliance monitoring
- Contract health scoring dashboard (profitability + status + audit compliance)
- Multi-year cap + accrual waterfall tracking
- Auto-categorisation of contracts by risk/volume/complexity
